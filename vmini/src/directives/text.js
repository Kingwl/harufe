/**
 * Created by kingwl on 17/1/3.
 */

export default {
  priority: 600
  , terminal: false

  , bind () {
    this.attr = (this.el.nodeType === 3 ? 'data' : 'textContent')
  }

  , update (value) {
    this.el[this.attr] = value || ''
  }
}