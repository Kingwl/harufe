export default function defaultItemRangeRender (h, {
  itemCache,
  itemRender,
  itemSizeAndPositionManager,
  itemStartIndex,
  itemStopIndex,
  scrollTop,
  styleCache,
  visibleItemIndices
}) {
  const renderedItems = []

  for (let index = itemStartIndex; index <= itemStopIndex; ++index) {
    let itemDatum = itemSizeAndPositionManager.getSizeAndPositionOfItem(index)
    const isVisible = (index >= visibleItemIndices.start && index <= visibleItemIndices.stop)
    const key = `${index}`

    let style = null
    if (styleCache[key]) {
      style = styleCache[key]
    } else {
      style = {
        position: 'absolute',
        height: itemDatum.size + 'px',
        left: 0,
        right: 0,
        top: itemDatum.offset + 'px'
      }

      styleCache[key] = style
    }

    let itemRenderParams = {
      index,
      isVisible,
      key,
      style
    }

    if (!itemCache[key]) {
      itemCache[key] = itemRender(h, itemRenderParams)
    }
    const renderedItem = itemCache[key]

    if (!renderedItem) {
      continue
    }

    renderedItems.push(renderedItem)
  }

  return renderedItems
}
