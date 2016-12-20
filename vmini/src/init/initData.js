/**
 * Created by kingwl on 16/12/20.
 */

import { observe } from '../observer'
import { isReserved } from '../utils'

export function initData (vm) {
  let data = vm.$options.data

  data = vm._data = (typeof data === 'function') ? data.call(vm) : data

  const keys = Object.keys(data)
  const l = keys.length

  for (let i = 0; i < l; ++i) {
    proxy(vm, keys[i])
  }

  observe(data, true)
}

export function proxy (vm, key) {
  if (!isReserved(key)) {
    Object.defineProperty(vm, key, {
      configurable: true
      , enumerable: true
      , get: function () {
        return vm._data[key]
      }
      , set: function (newVal) {
        vm._data[key] = newVal
      }
    })
  }
}