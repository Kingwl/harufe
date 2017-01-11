export default class ItemSizeAndPositionManager {
  constructor ({
    itemCount,
    itemSizeGetter,
    estimatedItemSize
  }) {
    this._itemCount = itemCount
    this._itemSizeGetter = itemSizeGetter
    this._estimatedItemSize = estimatedItemSize

    this._itemSizeAndPositionCache = {}
    this._lastMeasuredIndex = -1
  }

  configure ({
    itemCount,
    estimatedItemSize
  }) {
    this._itemCount = itemCount
    this.__estimatedItemSize = estimatedItemSize
  }

  getItemCount () {
    return this._itemCount
  }

  getEstimatedItemSize () {
    return this._estimatedItemSize
  }

  getLastMeasuredIndex () {
    return this._lastMeasuredIndex
  }

  getSizeAndPositionOfLastMeasuredItem () {
    return this._lastMeasuredIndex >= 0
    ? this._itemSizeAndPositionCache[this._lastMeasuredIndex]
    : {
      offset: 0,
      size: 0
    }
  }

  getSizeAndPositionOfItem (index) {
    if (index < 0 && index >= this._itemCount) {
      throw new Error('index out of range')
    }

    if (index > this._lastMeasuredIndex) {
      const lastMeasuredItemSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem()
      let offset = lastMeasuredItemSizeAndPosition.offset + lastMeasuredItemSizeAndPosition.size

      for (let i = this._lastMeasuredIndex + 1; i <= index; ++i) {
        const size = this._itemSizeGetter({ index: i })

        if (size === null || window.isNaN(size)) {
          throw new Error('invalid size')
        }

        this._itemSizeAndPositionCache[i] = {
          offset,
          size
        }

        offset += size
      }
      this._lastMeasuredIndex = index
    }

    return this._itemSizeAndPositionCache[index]
  }

  getTotalSize () {
    const lastMeasuredItemSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem()
    const estimatedItemSize = (this._itemCount - this._lastMeasuredIndex - 1) * this._estimatedItemSize
    return lastMeasuredItemSizeAndPosition.offset + lastMeasuredItemSizeAndPosition.size + estimatedItemSize
  }

  getUpdatedOffsetForIndex ({
    align = 'auto',
    containerSize,
    currentOffset,
    targetIndex
  }) {
    if (containerSize <= 0) {
      return 0
    }

    const {offset, size} = this.getSizeAndPositionOfItem(targetIndex)
    const maxOffset = offset
    const minOffset = maxOffset - containerSize + size

    let idealOffset

    switch (align) {
      case 'start':
        idealOffset = maxOffset
        break
      case 'end':
        idealOffset = minOffset
        break
      case 'center':
        idealOffset = maxOffset - ((containerSize - size) / 2)
        break
      default:
        idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset))
        break
    }

    const totalSize = this.getTotalSize()

    return Math.max(0, Math.min(totalSize - containerSize, idealOffset))
  }

  getVisibleItemRange ({
    containerSize,
    offset
  }) {
    const totalSize = this.getTotalSize()

    if (totalSize === 0) {
      return {}
    }

    const maxOffset = offset + containerSize
    const start = this._findNearestItem(offset)

    const datum = this.getSizeAndPositionOfItem(start)
    offset = datum.offset + datum.size

    let stop = start

    while (offset < maxOffset && stop < this._itemCount - 1) {
      ++stop

      offset += this.getSizeAndPositionOfItem(stop).size
    }

    return {
      start,
      stop
    }
  }

  resetItem (index) {
    this._lastMeasuredIndex = Math.min(this._lastMeasuredIndex, index - 1)
  }

  _binarySearch ({
    high,
    low,
    offset
  }) {
    let currentOffset = 0

    while (low <= high) {
      const middle = low + Math.floor((high - low) / 2)
      currentOffset = this.getSizeAndPositionOfItem(middle).offset

      if (currentOffset === offset) {
        return middle
      } else if (currentOffset < offset) {
        low = middle + 1
      } else {
        high = middle - 1
      }
    }

    if (low > 0) {
      return low - 1
    }
  }

  _exponentialSearch ({
    index,
    offset
  }) {
    let interval = 1

    while (index < this._itemCount && this.getSizeAndPositionOfItem(index).offset < offset) {
      index += interval
      interval *= 2
    }

    return this._binarySearch({
      low: Math.floor(index / 2),
      high: Math.min(index, this._itemCount - 1),
      offset
    })
  }

  _findNearestItem (offset) {
    offset = Math.max(0, offset)

    this.getSizeAndPositionOfItem(0)
    const lastMeasuredItemSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem()
    const lastMeasuredIndex = Math.max(0, this._lastMeasuredIndex)

    if (lastMeasuredItemSizeAndPosition.offset >= offset) {
      return this._binarySearch({
        low: 0,
        high: lastMeasuredIndex,
        offset
      })
    } else {
      return this._exponentialSearch({
        index: lastMeasuredIndex,
        offset
      })
    }
  }
}
