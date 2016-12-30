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
      , d: [{
        e: 233
      }]
      , pred: false
    }
  },
  template: '<div id="fuck" :class-name="a"><div v-if="pred" :class-name="b">123</div></div>'
}).$mount('#app')

window.$vm = vm