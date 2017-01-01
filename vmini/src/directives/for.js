/**
 * Created by kingwl on 16/12/30.
 */

import { createAnchor, replace, before, def, isObject, hasOwn, inDoc, after, removeNode } from '../utils'
import { Factory } from '../fragment'
import { withoutConversion, defineReactive }from '../observer'

let uid = 0

export default  {
  priority: 2200
  , terminal: true
  , bind () {
    const inMatch = this.expression.match(/(.*) (?:in|of) (.*)/)
    if (inMatch) {
      const itMatch = inMatch[1].match(/\((.*),(.*)\)/)
      if (itMatch) {
        this.iterator = itMatch[1].trim()
        this.alias = itMatch[2].trim()
      } else {
        this.alias = inMatch[1].trim()
      }
      this.expression = inMatch[2]
    }

    this.id = '__v-for__' + (++uid)

    this.start = createAnchor('v-for-start')
    this.end = createAnchor('v-for-end')
    replace(this.el, this.end)
    before(this.start, this.end)

    this.factory = new Factory(this.vm, this.el)
  }
  , update (value) {
    this.diff(value)
  }
  , diff (data) {

    const item = data[0]
    const convertedFromObject = this.fromObject = isObject(item) && hasOwn(item, '$key') && hasOwn(item, '$value')

    const oldFrags = this.frags
    const frags = this.frags = new Array(data.length)
    const alias = this.alias
    const iterator = this.iterator
    const start = this.start
    const end = this.end
    const init = !oldFrags
    const inDocument = inDoc(start)

    for (let i = 0, l = data.length; i < l; ++i) {
      const item = data[i]
      const key = convertedFromObject ? item.$key : null
      const value = convertedFromObject ? item.$value : item
      const frag = this.create(value, alias, i, key)
      frags[i] = frag

      if (init) {
        frag.before(end)
      }
    }

    if (init) {
      return
    }

    for (let i = 0, l = oldFrags.length; i < l; i++) {
      const frag = oldFrags[i]
      this.remove(frag, i, i, inDocument)
    }

    for (let i = 0, l = frags.length; i < l; i++) {
      const frag = frags[i]
      const targetPrev = frags[i - 1]
      const prev = targetPrev
        ? targetPrev.end || targetPrev.node
        : start
      this.insert(frag, i, prev, inDocument)
    }
  }
  , insert (frag, index, prev, inDocument) {
    if (inDocument) {
      let anchor = frag.staggerAnchor
      if (!anchor) {
        anchor = frag.staggerAnchor = createAnchor('stagger-anchor')
        anchor.__v_frag = frag
      }
      after(anchor, prev)
      frag.before(anchor)
      removeNode(anchor)
    } else {
      frag.before(prev.nextSibling)
    }
  }
  , remove (frag, index, total, inDocument) {
    frag.remove()
  }
  , move (frag, prev) {
    if (!prev.nextSibling) {
      this.end.parentNode.appendChild(this.end)
    }

    frag.before(prev.nextSibling)
  }
  , create (value, alias, index, key) {
    const host = this._host
    const parentScope = this._scope || this.vm
    const scope = Object.create(parentScope)

    scope.$parent = parentScope
    scope.$forContext = this

    withoutConversion(() => {
      defineReactive(scope, alias, value)
    })

    defineReactive(scope, '$index', index)

    if (key) {
      defineReactive(scope, '$key', key)
    } else if (scope.$key) {
      def(scope, '$key', null)
    }

    if (this.iterator) {
      defineReactive(scope, this.iterator, key !== null ? key : index)
    }

    const frag = this.factory.create(host, scope, this._frag)
    frag.forId = this.id
    return frag
  }
}