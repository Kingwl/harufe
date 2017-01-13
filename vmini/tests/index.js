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
      , d: ['a', 'b', 'c']
      , pred: true
    }
  },
  methods: {
    hehe () {
      console.log('hehe')
    }
  },
  template: '<div id="fuck" :class-name="a"><div v-if="pred" :class-name="b"><ul><li v-for="item in d" :class-name="item">1{{item}}2</li></ul></div></div>'
}).$mount('#app')

window.$vm = vm
