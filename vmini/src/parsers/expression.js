/**
 * Created by kingwl on 16/12/27.
 */

const pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
const booleanLiteralRE = /^(?:true|false)$/

export function parseExpression (exp, needSet) {
  exp = exp.trim()

  const res = { exp: exp }

  res.get = isSimplePath(exp) && exp.indexOf('[') < 0
    ? makeGetterFn(`scope.${exp}`)
    : compileGetter(exp)
  if (needSet) {
    // TODO support setter
  }
  return res
}

export function makeGetterFn (body) {
  try {
    return new Function('scope', `return ${body}`)
  } catch (e) {
    throw new Error('make getter function error')
  }
}

export function compileGetter (exp) {
  return makeGetterFn(exp)
}

export function isSimplePath (exp) {
  return pathTestRE.test(exp) &&
    // don't treat true/false as paths
    !booleanLiteralRE.test(exp)
}
