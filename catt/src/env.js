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


function define (s_a, s_b) {
  const scope = Object.assign({}, this.scope)
  const a = new Token(s_a)

  if (a.type === varType) {
    const newScope = Object.assign({}, scope, {[a.str]: s_b})
    return new Scope(newScope, this)
  } else if (a.type === exprType) {
    const newScope = Object.assign({}, scope)
    const [fn, ...argument] = a.args

    newScope[fn] = function (...args) {
      const innerScope = Object.assign({}, scope)
      for (let i = 0, l = argument.length; i < l; ++i) {
        innerScope[argument[i]] = args[i]
      }
      return new Scope(innerScope, this).eval(s_b)
    }
    return new Scope(newScope, this)
  }
}

function lambda (s_a, s_b) {
  const scope = Object.assign({}, this.scope)
  const a = new Token(s_a)

  return function (...args) {
   const innerScope = Object.assign({}, scope)

   if (a.type === exprType) {
     const [fn, ...argument] = a.args
     for (let i = 0, l = argument.length; i < l; ++i) {
       innerScope[argument[i]] = args[i]
     }
   } else if (a.type === varType) {
     innerScope[a.str] = args[0]
   }
   return (new Scope(innerScope, this)).eval(s_b)
 }
}

export const defaults = {
  define,
  lambda,
  '+': function (a, b) {
    return this.eval(a) + this.eval(b)
  },
  '-': function (a, b) {
    return this.eval(a) - this.eval(b)
  },
  '*': function (a, b) {
    return this.eval(a) * this.eval(b)
  },
  '/': function (a, b) {
    return this.eval(a) / this.eval(b)
  },
  '>': function (a, b) {
    return this.eval(a) > this.eval(b)
  },
  '<': function (a, b) {
    return this.eval(a) < this.eval(b)
  },
  '=': function (a, b) {
    return this.eval(a) === this.eval(b)
  },
  cond: function (...args) {
    for (let i = 0, l = args.length; i < l; ++i) {
      const [condition, value] = new Token(args[i]).args
      if (this.eval(condition)) {
        return this.eval(value)
      }
    }
    return null
  },
  list: function (...args) {
    return [...args.map(arg => this.eval(arg)), null]
  },
  car: function (list) {
    return this.eval(list)[0]
  },
  cdr: function (list) {
    return this.eval(list).slice(1)
  },
  prepend: function (value, list) {
    return [this.eval(value), ...this.eval(list)]
  }
}
