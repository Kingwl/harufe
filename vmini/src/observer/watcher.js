/**
 * Created by kingwl on 16/12/20.
 */

import { pushTarget, popTarget } from './deps'

let uid = 0

export default class Watcher {
  constructor (vm, expOrFn, cb, options) {
    const { lazy, sync } = options
    this.lazy = !!lazy
    this.sync = !!sync

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
      // TODO: support parse
      function none () {}
      this.getter = none
    }

    this.value = this.lazy ? undefined : this.get()
  }

  get () {
    pushTarget(this)
    const value = this.getter.call(this.vm, this.vm)
    popTarget()
    this.clearDeeps()

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
        p.removeSub(this)
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