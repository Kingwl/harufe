import { on, off } from '../utils'

const keyCodes = {
  esc: 27
  , tab: 9
  , center: 13
  , space: 32
  , 'delete': [8, 46]
  , up: 38
  , left: 37
  , right: 39
  , down: 40
}

function keyFilter (handler, keys) {
  let codes = keys.map(key => {
    let charCode = key.charCodeAt(0)
    if (charCode > 47 && charCode < 58) {
      return window.parseInt(key, 10)
    }
    if (key.length === 1) {
      charCode = key.toUpperCase().charCodeAt(0)
      if (charCodeAt > 64 && charCode < 91) {
        return charCode
      }
    }
    return keyCodes[key]
  })
  codes = Array.prototype.concat.apply([], codes)
  return function keyHandler (e) {
    if (codes.indexOf(e.keyCode) > -1) {
      return handler.call(this, e)
    }
  }
}

function preventFilter (handler) {
  return function preventHandler (e) {
    e.preventDefault()
    return handler.call(this, e)
  }
}

function stopFilter (handler) {
  return function stopHandler (e) {
    e.stopPropagation()
    return handler.call(this, e)
  }
}

function selfFilter (handle) {
  return function selfHandler (e) {
    if (e.target === e.currentTarget) {
      return handler.call(this, e)
    }
  }
}

export default {
  priority: 700
  , update (handler) {
    if (!this.descriptor.raw || typeof handler !== 'function') {
      handler = () => {}
    }
    if (this.modifiers.stop) {
      handler = stopFilter(handler)
    }
    if (this.modifiers.prevent) {
      handler = preventFilter(handler)
    }
    if (this.modifiers.self) {
      handler = selfFilter(handler)
    }
    const keys = Object.keys(this.modifiers).filter(key => key !== 'stop' && key !== 'prevent' && key !== 'self' && key !== 'capture')
    if (keys.length) {
      handler = keyFilter(handler, keys)
    }

    this.reset()
    this.handler = handler

    on(this.el, this.arg, this.handler, this.modifiers.capture)
  }
  , reset () {
    if (this.handler) {
      off(this.el, this.arg, this.handler)
    }
  }
  , unbind () {
    this.reset()
  }
}
