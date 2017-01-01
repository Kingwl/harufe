/**
 * Created by kingwl on 16/12/29.
 */

import { createAnchor, replace } from '../utils'
import { Factory } from '../fragment'

export default  {
  priority: 2100
  , terminal: true
  , bind () {
    const el = this.el
    this.anchor = createAnchor('v-if')
    replace(el, this.anchor)
  }
  , update (value) {
    if (value) {
      this.insert()
    } else {
      this.remove()
    }
  }
  , insert () {
    if (!this.factory) {
      this.factory = new Factory(this.vm, this.el)
    }

    this.frag = this.factory.create(this._host, this._scope, this._frag)
    this.frag.before(this.anchor)
  }
  , remove () {
    if (this.frag) {
      this.frag.remove()
      this.frag = null
    }
  }
  , unbind () {
    if (this.frag) {
      this.frag.destroy()
    }
  }
}