/**
 * Created by kingwl on 16/12/29.
 */

import { before, removeNode, createAnchor, prepend, mapNodeRange, removeNodeRange } from '../utils'

export default class Fragment {
  constructor (linker, vm, frag, host, scope, parentFrag) {
    this.children = []
    this.childFrags = []
    this.vm = vm
    this.scope = scope
    this.inserted = false
    this.parentFrag = parentFrag

    if (parentFrag) {
      parentFrag.childFrags.push(this)
    }

    this.unlink = linker(vm, frag, host, scope, this)
    const single = this.single = frag.childNodes.length === 1 && !(frag.childNodes[0].__v_anchor)
    if (single) {
      this.node = frag.childNodes[0]
      this.before = this.signalBefore
      this.remove = this.signalRemove
    } else {
      this.node = createAnchor('fragment-start')
      this.end = createAnchor('fragment-end')
      this.frag = frag
      prepend(this.node, frag)
      frag.appendChild(this.end)
      this.before = this.multiBefore
      this.remove = this.multiRemove
    }

    this.node.__v_frag = this
  }

  beforeRemove () {
    for (let i = 0, l = this.childFrags.length; i < l; ++i) {
      this.childFrags[i].beforeRemove(false)
    }
    for (let i = 0, l = this.children.length; i < l; ++i) {
      // destroy this.childFrags[i].destroy(false)
    }

    const dirs = this.unlink.dirs
    for (let i = 0, l = dirs.length; i < l; i++) {
      dirs[i]._watcher && dirs[i]._watcher.teardown()
    }
  }

  destroy () {
    // if (this.parentFrag) {
    //   this.parentFrag.childFrags.remove(this)
    // }

    this.node.__v_frag = null
    this.unlink()
  }

  signalBefore (target) {
    this.inserted = true
    before(this.node, target)
  }

  signalRemove () {
    this.inserted = false
    this.beforeRemove()
    removeNode(this.node)
    this.destroy()
  }

  multiBefore (target) {
    this.inserted = true
    mapNodeRange(this.node, this.end, () => {
      before(this.node, target)
    })
  }

  multiRemove () {
    this.inserted = false
    this.beforeRemove()
    removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
      this.destroy()
    })
  }
}