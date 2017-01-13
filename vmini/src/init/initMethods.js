export function initMethods (vm) {
  let methods = vm.$options.methods
  if (methods) {
    for (let key in methods) {
      vm[key] = methods[key].bind(vm)
    }
  }
}
