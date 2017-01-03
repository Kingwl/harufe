/**
 * Created by kingwl on 16/12/26.
 */

import { extend } from '../utils'
import Watcher from '../observer/watcher'

const none = () => {}

export default class {
  constructor (descriptor, vm, el, host, scope, frag) {
    this.vm = vm
    this.el = el
    this.descriptor = descriptor
    this.name = descriptor.name
    this.expression = descriptor.expression
    this.arg = descriptor.arg

    this._host = host
    this._scope = scope
    this._frag = frag

    this._bound = false

    this.el._store_directives = this.el._store_directives || []
    this.el._store_directives.push(this)
  }

  _bind () {
    const name = this.name
    const descriptor = this.descriptor

    if (this.el && this.el.removeAttribute) {
      const attr = descriptor.attr || (`v-${name}`)
      this.el.removeAttribute(attr)
    }

    const def = descriptor.def
    if (typeof def === 'function') {
      this.update = def
    } else {
      extend(this, def)
    }

    if (this.bind) {
      this.bind()
    }
    this._bound = true

    if (this.expression && this.update) {
      const dir = this
      if (this.update) {
        this._update = function (val, oldVal) {
          dir.update(val, oldVal)
        }
      }
    } else {
      this.update = none
    }

    const watcher = this._watcher = new Watcher(
      this.vm
      , this.expression
      , this._update
      , {
        scope: this._scope
        , deep: this.deep
      }
    )

    if (this.update) {
      this.update(watcher.value)
    }
  }

  _teardown () {
    if (this._bound) {
      this._bound = true

      if (this.unbind) {
        this.unbind()
      }

      if (this._watcher) {
        this._watcher.teardown()
      }

      this.vm = this.el = this._watcher = null
    }
  }
}