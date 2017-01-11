<template>
  <div id="app">
    <v-list-view :height="300" :width="300" :items="items" :item-size="getItemSize" :estimated-item-size="40" ></v-list-view>
  </div>
</template>
<script>
import VListView from './components/VListView'
const DYNAMIC_HEIGHT = true

const itemsHeight = []

function makeItems () {
  let ret = []
  for (let i = 0; i < 100000; ++i) {
    const height = Math.floor(Math.random() * 100)
    const color = (Math.floor(Math.random() * 0xFFFFFF)).toString(16)
    itemsHeight.push(height)
    ret.push({text: i, color})
  }
  return ret
}

export default {
  name: 'app',
  components: {
    VListView
  },
  methods: {
    getItemSize ({index}) {
      if (DYNAMIC_HEIGHT) {
        return itemsHeight[index]
      }
      return 40
    }
  },
  data: function () {
    return {
      items: makeItems()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
