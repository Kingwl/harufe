/**
 * Created by kingwl on 17/1/4.
 */

import { parsePath, resolvePath, resolveHash} from './path'
import { resolveQuery } from './query'

export function resolveLocation (raw, current) {
  const parsedPath = parsePath(raw || '')
  const basePath = current && current.path || '/'
  const path = resolvePath(parsedPath.path, basePath)
  const query = resolveQuery(parsedPath.query)
  const hash = resolveHash(parsedPath.hash)

  return {
    path
    , query
    , hash
    , raw
  }
}