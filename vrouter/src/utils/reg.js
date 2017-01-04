/**
 * Created by kingwl on 17/1/3.
 */

import Reg from 'path-to-regexp'

const cache = {}

export function compileRegExp(path) {
  let regex = cache[path]
  if (!regex){
    const keys = []
    const reg = Reg(path, keys)
    cache[path] = regex = {
      reg
      , keys
    }
  }
  return regex
}