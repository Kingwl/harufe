/**
 * Created by kingwl on 16/12/20.
 */

import { pushTarget, popTarget } from './deps'
import { isObject, extend } from '../utils'
import { parseExpression } from '../parsers'

let uid = 0
const none = () => {}

export default class Watcher {
  constructor (vm, expOrFn, cb, options) {
    if (options) {
      extend(this, options)
    }

    this.id = ++uid
    this.vm = vm
    this.cb = cb
    this.active = true
    this.dirty = this.lazy
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      const res = parseExpression(expOrFn)
      this.getter = res.get || none
    }

    this.value = this.lazy ? undefined : this.get()
  }

  beforeGet () {
    pushTarget(this)
  }

  get () {
    this.beforeGet()

    const scope = this.scope || this.vm
    const value = this.getter.call(scope, scope)

    if (this.deep) {
      traverse(value)
    }

    this.afterGet()
    return value
  }

  afterGet () {
    this.clearDeeps()
    popTarget()
  }

  addDep (dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  clearDeeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  update () {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      // TODO patch update
      this.run()
    }
  }

  run () {
    const value = this.get()
    if (value !== this.value) {
      const oldValue = this.value
      this.value = value

      if (this.cb) {
        this.cb.call(this.vm, value, oldValue)
      }
    }
  }

  teardown () {
    if (this.active) {
      this.deps.forEach(x => {
        x.removeSub(this)
      })
      this.active = false
    }
  }

  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  depend () {
    this.deps.forEach(x => {
      x.depend()
    })
  }
}

const seenObjects = new Set()
function traverse (value) {
  seenObjects.clear()
  _traverse(value, seenObjects)
}

function _traverse(value, seens) {
  const isArr = Array.isArray(value)
  if (!isArr && !isObject(value)) {
    return
  }

  if (value.__bind__) {
    const depId = value.__bind__.id
    if (seens.has(depId)) {
      return
    }
    seens.add(depId)
  }

  if (isArr) {
    let l = value.length
    while(l--) _traverse(value[l], seens)
  } else {
    const keys = Object.keys(value)
    let l = keys.length
    while(l--) _traverse(value[keys[l]], seens)
  }
}