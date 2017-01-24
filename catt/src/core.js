export const nullType = Symbol('null_t')
export const exprType = Symbol('expr_t')
export const varType = Symbol('var_t')
export const numberType = Symbol('number_t')
export const stringType = Symbol('str_t')
export const booleanType = Symbol('bool_t')

const nullRE = /^null$/
const numberRE = /^\-?(\d+|\d+\.\d*|\d*\.\d+)$/
const boolRE = /^(true|false)$/
const varRE = /^[a-zA-Z_\+\-\*/<>=\[\]]+[0-9a-zA-Z_\+\-\*/<>=\[\]/?/!]*$/
const strRE = /^"(\\"|[^"])*"$/
const exprRE = /^\(.+\)$/

const whiteSpaces = {
  '\t': '\t',
  '\n': '\n',
  ' ': ' '
}

export class Token {
  constructor (raw) {
    const str = raw.replace(/\n/g, ' ').trim()
    const args = []
    let type = null

    if (!str) {
      type = nullType
    } else if (nullRE.test(str)) {
      type = nullType
    } else if (numberRE.test(str)) {
      type = numberType
    } else if (boolRE.test(str)) {
      type = booleanType
    } else if (varRE.test(str)) {
      type = varType
    } else if (strRE.test(str)) {
      type = stringType
    } else if (exprRE.test(str)) {
      type = exprType
      let flag = 0
      let escape = false
      let remain = ''
      for (let i = 1, l = str.length - 1; i < l; ++i) {
        if (escape) {
          escape = false
        } else {
          const c = str.charAt(i)
          if (c === '\\') {
            escape = true
            remain += c
          } else if (c === '(') {
            flag += 2
            remain += c
          } else if (c === ')') {
            flag -= 2
            remain += c
          } else if (c === '\"') {
            flag ^= 1
            remain += c
          } else if (c in whiteSpaces) {
            if (!flag) {
              if (remain) {
                args.push(remain)
              }

              remain = ''
            } else {
              remain += c
            }
          } else {
            remain += c
          }
        }
      }
      if (remain) {
        args.push(remain)
      }
    } else {
      throw new Error ('unknow token')
    }

    this.str = str
    this.type = type
    this.args = args
  }
}

export class Scope {
  constructor (scope = null, parent = null) {
    this.scope = Object.assign({}, parent && parent.scope, scope)
    this.parent = parent
  }

  eval (token) {
    if (token.constructor !== Token) {
      token = new Token(token)
    }

    const { str, type, args } = token
    switch (type) {
      case nullType:
        return null
      case numberType:
        return Number(str)
      case booleanType:
        return str === 'true'
      case stringType:
        return str.slice(1, -1)
      case varType:
        if (str in this.scope) {
          const v = this.scope[str]
          if (typeof v === 'string') {
            return this.eval(v)
          }
          return v
        }
        throw new Error ('unexpected token')
      case exprType:
        let [fn, ...argument] = args
        return this.eval(fn).apply(this, argument)
    }
  }
}
