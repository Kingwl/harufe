/**
 * Created by kingwl on 17/1/4.
 */

export function parsePath (path) {
  let hash = ''
  let query = ''

  const hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    path
    , query
    , hash
  }
}

export function resolvePath (path, base) {
  if (path.charAt(0) === '/') {
    return path
  }

  if(path.charAt(0) === '?' || path.charAt(0) === '#') {
    return base + path
  }

  const stack = base.split('/')

  const separatorRE = /^\//
  const segments = path.replace(separatorRE, '').split('/')
  for(let i = 0, l = segments.length; i < l; ++i) {
    const segment = segments[i]
    if (segment === '.') {
      continue
    } else if (segment === '..') {
      stack.pop()
    } else {
      stack.push(segment)
    }
  }

  return stack.join('/')

}

export function resolveHash (hash) {
  return hash && hash.charAt(0) !== '#' ? `#${hash}` : hash
}