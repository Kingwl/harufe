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

const rootScope = new Scope(defaults)

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
