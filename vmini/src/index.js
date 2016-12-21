/**
 * Created by kingwl on 16/12/19.
 */

import InitVM from './init'
import Watcher from './observer/watcher'

export default class VMini {
  constructor (options = {}) {
    const {el, data, methods, computed, watch} = options

    // vm.$el = document.getElementById(el)
    this.$options = options

    InitVM(this)
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
}