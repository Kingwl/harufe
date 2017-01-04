import { compileRegExp } from './utils/reg'
import { resolveLocation } from './utils/location'
import { fillParams } from './utils/params'

export default class Router {
  constructor () {
    this.cache = {}
  }

  init (history) {
    this.history = history
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
        cached.callbacks.forEach(x => x.call(null, Object.assign({}, location, {params})))
        return
      }
    }
  }

  listen () {
    this.history.listen(path => {
      this.notify(path)
    })
  }

  push (location) {

  }

  pop () {

  }

  replace (location) {

  }

  go (n) {

  }

  back (n = 1) {
    go(n)
  }

  forward (n = 1) {
    go(n)
  }

}