/**
 * Created by kingwl on 16/12/20.
 */

export function def (obj, key, value, enumerable) {
  Object.defineProperty(obj, key, {
    value: value
    , enumerable: !!enumerable
    , writable: true
    , configurable: true
  })
}

const bailRE = /[^\w.$]/
export function parsePath (path) {
  if (bailRE.test(path)) {
    return
  } else {
    const seg = path.split('.')
    return function (obj) {
      for (let i = 0; i < seg.length; ++i) {
        if (!obj) {
          return
        } else {
          obj = obj[seg[i]]
        }
      }
      return obj
    }
  }
}

export function extend (desc, src) {
  const keys = Object.keys(src)
  for (let i = 0, l = keys.length; i < l; ++i) {
    desc[keys[i]] = src[keys[i]]
  }
  return desc
}

export function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

var camelizeRE = /-(\w)/g
export function camelize (str) {
  return str.replace(camelizeRE, toUpper)
}
