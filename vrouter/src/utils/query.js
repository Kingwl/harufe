/**
 * Created by kingwl on 17/1/4.
 */

const encode = encodeURIComponent
const decode = decodeURIComponent

export function parseQuery (query) {
  const res = {}

  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach(param => {
    const [rawKey, rawValue] = param.split('=')
    const [key, val] = [decode(rawKey), rawValue ? decode(rawValue) : null]
    res[key] = val
  })

  return res
}

export function resolveQuery (query) {
  return parseQuery(query)
}