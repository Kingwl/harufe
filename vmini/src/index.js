/**
 * Created by kingwl on 16/12/19.
 */

import InitVM from './init'
import Watcher from './observer/watcher'
import Directive from './directives/directive'

export default class VMini {
  constructor (options = {}) {
    const {el, data, methods, template, computed, watch} = options

    this.$options = options
    this.$el = document.querySelector(el)

    this._directives = []

    if (el) {
      this.$mount(el)
    }
  }

  $watch (expOrFn, cb, options) {
    const vm = this
    options = options || {
        deep: true
    }
    const watcher = new Watcher(vm, expOrFn, cb, options)

    return function () {
      watcher.teardown()
    }
  }

  $mount (el) {
    if (this.$el) {
      throw new Error('vm is already mounted')
    }

    this.$el = document.querySelector(el)

    if (this.$el && this.$frag) {
      this.$el.appendChild(this.$frag)
    }

    InitVM(this)

    return this
  }

  _bindDir (descriptor, node, host, scope, frag) {
    this._directives.push(
      new Directive(descriptor, this, node, host, scope, frag)
    )
  }
}