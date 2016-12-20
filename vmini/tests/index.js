import VMini from '../src/index'

const vm = new VMini({
  data: function () {
    return {
      a: 1
      , b: 2
    }
  }
})

window.$vm = vm