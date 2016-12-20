/**
 * Created by kingwl on 16/12/20.
 */

import { remove } from '../utils'

let uid = 0
let target = null

export default class Dep {
  static get target () {
    return target
  }

  static set target (val) {
    target = val
  }

  constructor () {
    this.id = ++uid
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice()
    subs.forEach(x => {
      x.update()
    })
  }
}

Dep.target = null
const targetStack = []

export function pushTarget (target) {
  if (Dep.target) {
    targetStack.push(Dep.target)
  }
  Dep.target = target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}