import {
  Token,
  Scope,
  nullType,
  exprType,
  varType,
  numberType,
  stringType,
  booleanType
} from './core'

import { defaults } from './env'
import { ext } from './ext'

const rootScope = new Scope(Object.assign({}, defaults, ext))

let t = new Scope({}, rootScope)

function repl (str) {
  try {
    let res = t.eval(str)
    if (res instanceof Scope) {
      t = res
      res = 'define'
    }
    return res.toString()
  } catch (e) {
    return e.message
  }
}

window.repl = repl
