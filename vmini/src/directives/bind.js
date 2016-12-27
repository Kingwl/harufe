/**
 * Created by kingwl on 16/12/24.
 */

import { camelize } from '../utils'

export default  {
  priority: 800
  , terminal: false
  , bind () {
    this.arg = camelize(this.arg)
  }
  , update (value) {
    const attr = this.arg
    if (this.arg) {
      this.handleSignal(attr, value)
    } else {

    }
  }
  , handleSignal (attr, value) {
    const el = this.el
    el [attr] = value
  }
}