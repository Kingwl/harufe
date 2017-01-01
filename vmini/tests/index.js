import VMini from '../src/index'
import Directives from '../src/directives'

const vm = new VMini({
  data: function () {
    return {
      a: 'a'
      , b: 2
      , c: {
        d: 3
      }
      , d: [1, 2, 3]
      , pred: true
    }
  },
  template: '<div id="fuck" :class-name="a"><div v-if="pred" :class-name="b"><ul><li v-for="item in d">123</li></ul></div></div>'
}).$mount('#app')

window.$vm = vm