const objKey = Symbol('key_t')
const objVal = Symbol('val_t')

export const ext = {
  jspair: function (key, value) {
    return { [objKey]: this.eval(key), [objVal]: this.eval(value) }
  },
  jsobject: function (list) {
    let ret = {}
    this.eval(list).forEach(x => {
      ret[x[objKey]] = x[objVal]
    })
    return ret
  },
  jsget: function (obj, key) {
    return this.eval(obj)[this.eval(key)]
  },
  jsset: function (obj, key, val) {
    const old = this.eval(obj)
    old[this.eval(key)] = this.eval(val)
    return old
  }
}
