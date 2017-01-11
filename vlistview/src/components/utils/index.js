export function makeItemSizeWrapper (itemSize) {
  return typeof itemSize === 'number'
  ? function () {
    return itemSize
  }
  : itemSize
}
