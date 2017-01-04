import { compileRegExp } from './utils/reg'

function zip (a, b) {
  const ret = []
  for (let i = 0, l =  Math.max(a.length, b.length); i < l; ++i) {
    ret.push([a[i], b[i]])
  }
  return ret
}

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

  notify (path) {
    const keys = Object.keys(this.cache)
    let matched = null
    for (let i = 0, l = keys.length; i < l; ++i) {
      const cached = this.cache[keys[i]]
      if (matched = cached.reg.exec(path)) {
        const params = {}
        zip(cached.keys, matched.slice(1)).forEach(([k, v]) => params[k.name] = v)
        cached.callbacks.forEach(x => x.call(null, {params}))
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