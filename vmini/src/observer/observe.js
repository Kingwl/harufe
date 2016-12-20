/**
 * Created by kingwl on 16/12/20.
 */

import Dep from "./deps"
import { def, isObject, hasOwn } from '../utils'

export const obIdentity = '__bind__'

export default class Observe {
  constructor (value) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0

    def(value, obIdentity, this)

    if (Array.isArray(value)) {
      this.visitArray(value)
    } else {
      this.visit(value)
    }
  }

  visit (obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }

  visitArray (items) {
    items.forEach(value => {
      observe(value)
    })
  }
}

export function observe (value, isRoot) {
  if(!isObject(value)) {
    return
  }

  let ob = null
  if (hasOwn(value, obIdentity) && value[obIdentity] instanceof Observe) {
    ob = value[obIdentity]
  } else {
    ob = new Observe(value)
  }

  if (ob && isRoot) {
    ob.vmCount++
  }

  return ob
}

export function defineReactive (obj, key, val) {
  const dep = new Dep()

  const props = Object.getOwnPropertyDescriptor(obj, key)
  if (props && props.configurable === false) {
    return
  }

  const getter = props && props.get
  const setter = props && props.set

  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true
    , configurable: true
    , get: function () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }

        if (Array.isArray(value)) {
          dependArray(value)
        }
      }
      return value
    }
    , set: function (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      childOb = observe(newVal)
      dep.notify()
    }
  })
}

function dependArray (value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e[obIdentity] && e[obIdentity].dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}