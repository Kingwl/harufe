import { compileRegExp } from './utils/reg'
import { resolveLocation } from './utils/location'
import { fillParams } from './utils/params'

import Html5History from './history/Html5History'
import HashHistory from './history/HashHistory'

export default class Router {
  constructor () {
    this.cache = {}
  }

  init (history) {
    if (history === 'history') {
      this.history = new Html5History(this)
    } if (history === 'hash') {
      this.history = new HashHistory(this)
    } else {
      throw new Error('unknow history')
    }

    this.history.listen()
  }

  route (path, cb) {
    if (this.cache[path]) {
      this.cache[path].callbacks.push(cb)
    } else {
      const regex = compileRegExp(path)
      this.cache[path] = {
        reg: regex.reg
        , keys: regex.keys
        , callbacks: [cb]
      }
    }
  }

  match (path) {
    const keys = Object.keys(this.cache)
    const location = resolveLocation(path)
    let matched = null
    for (let i = 0, l = keys.length; i < l; ++i) {
      const cached = this.cache[keys[i]]
      if (matched = cached.reg.exec(location.path)) {

        const params = fillParams(cached.keys, matched.slice(1))
        const info = Object.assign({}, location, {params})
        const cb = (p) => cached.callbacks.forEach(x => x && x (p))

        return {info, cb}
      }
    }
  }

  push (location) {
    this.history.push(location)
  }

  replace (location) {
    this.history.replace(location)
  }

  go (n) {
    this.history.go(n)
  }

  back (n = 1) {
    this.go(n)
  }

  forward (n = 1) {
    this.go(n)
  }
}
