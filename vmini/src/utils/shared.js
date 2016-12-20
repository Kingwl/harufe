/**
 * Created by kingwl on 16/12/20.
 */

export function remove (arr, obj) {
  if (arr && arr.length) {
    const index = arr.indexOf(obj)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isObject (obj) {
  return obj instanceof Object
}

export function hasOwn (obj, prop) {
  return obj.hasOwnProperty(prop)
}

export function isReserved (str) {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}