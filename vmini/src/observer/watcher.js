/**
 * Created by kingwl on 16/12/20.
 */

import { pushTarget, popTarget } from './deps'
import { isObject, parsePath } from '../utils'

let uid = 0

export default class Watcher {
  constructor (vm, expOrFn, cb, options) {
    const { lazy, sync, deep } = options
    this.lazy = !!lazy
    this.sync = !!sync
    this.deep = !!deep

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
      const none = () => {}
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = none
      }
    }

    this.value = this.lazy ? undefined : this.get()
  }

  get () {
    pushTarget(this)
    const value = this.getter.call(this.vm, this.vm)
    popTarget()
    this.clearDeeps()

    if (this.deep) {
      traverse(value)
    }

    return value
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