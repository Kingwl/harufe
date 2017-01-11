<script>
  /* eslint-disable */
  import ItemSizeAndPositionManager from './ItemSizeAndPositionManager.js'
  import defaultItemRangeRender from './defaultItemRangeRender.js'
  import { makeItemSizeWrapper} from './utils'

  const USE_V_LIST = true

  export default {
    name: 'VListView',
    props: {
      height: {
        type: Number,
        required: true
      },
      width: {
        type: Number,
        required: true
      },
      items: {
        type: Array,
        required: true
      },
      itemSize: {
        type: Function,
        required: true
      },
      estimatedItemSize: {
        type: Number,
        required: true
      },
      style: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    render (h) {
      const { height, _data, width, style, scrollTop, itemRender } = this

      const boxStyles = {
        position: 'relative',
        height: height + 'px',
        width: width + 'px'
      }

      const totalItemsHeight = this._itemSizeAndPositionManager.getTotalSize()
      const scrollbarSize = totalItemsHeight > height ? 24 : 0

      const visibleItemIndices = this._itemSizeAndPositionManager.getVisibleItemRange({
        containerSize: height,
        offset: scrollTop
      })

      boxStyles.overflowY = totalItemsHeight + scrollbarSize <= height ? 'hidden' : 'auto'

      return (
        <div ref="container" onScroll={this.handleOnScroll} style={{
          ...boxStyles,
          ...style
        }}>
          {
              <div style={{
                width,
                height: totalItemsHeight + 'px',
                maxHeight: totalItemsHeight + 'px',
                overflow: 'hidden'
              }}>
                {
                  USE_V_LIST && defaultItemRangeRender(h, {
                    itemCache: this._itemCache,
                    itemRender: itemRender,
                    itemSizeAndPositionManager: this._itemSizeAndPositionManager,
                    itemStartIndex: visibleItemIndices.start,
                    itemStopIndex: visibleItemIndices.stop,
                    scrollTop,
                    styleCache: this._styleCache,
                    visibleItemIndices
                  })
                }
                {
                  !USE_V_LIST && _data.map(x => <li key={x} style={{
                    position: 'absolute',
                    left: '0px',
                    top: `${x * 40}px`
                  }}>{x}</li>)
                }
              </div>
          }
        </div>
      )
    },
    created () {
      const { items = [], itemSize, estimatedItemSize } = this
      this._data = this.items.map(x => Object.assign({}, x))
      this.scrollTop = 0
      this._itemCache = {}
      this._styleCache = {}
      this._itemSizeAndPositionManager = new ItemSizeAndPositionManager({
        itemCount: this._data.length,
        itemSizeGetter: makeItemSizeWrapper(itemSize),
        estimatedItemSize: estimatedItemSize
      })
    },
    methods: {
      handleOnScroll (event) {
        this.scrollTop = event.target.scrollTop
        this.$forceUpdate()
      },
      itemRender (h, p) {
        const { _data } = this
        const { index, style } = p
        const { color, text } = _data[index]
        return <div key={index} style={{...style, background: `#${color}`}}>{text}</div>
      }
    }
  }
</script>
