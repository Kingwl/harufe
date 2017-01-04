/**
 * Created by kingwl on 17/1/4.
 */

function zip (a, b) {
  const ret = []
  for (let i = 0, l =  Math.max(a.length, b.length); i < l; ++i) {
    ret.push([a[i], b[i]])
  }
  return ret
}

export function fillParams (keys, values) {
  const params = {}
  zip(keys, values).forEach(([k, v]) => params[k.name] = v)
  return params
}