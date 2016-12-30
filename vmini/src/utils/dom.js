/**
 * Created by kingwl on 16/12/29.
 */

export function createAnchor(content) {
  const anchor = document.createComment(content)
  anchor.__v_anchor = true
  return anchor
}

export function replace (target, el) {
  const parent = target.parentNode
  if (parent) {
    parent.replaceChild(el, target)
  }
}

export function cloneNode (node) {
  return node.cloneNode(true)
}

export function before (el, target) {
  target.parentNode.insertBefore(el, target)
}

export function inDoc (node) {
  const doc = document.documentElement
  const parent = node && node.parentNode
  return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
}

export function removeNode (el) {
  el.parentNode.removeChild(el)
}

export function prepend (el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

export function mapNodeRange (node, end, op) {
  let next = null
  while (node !== end) {
    next = node.nextSibling
    op(node)
    node = next
  }
  op(end)
}

export function removeNodeRange (start, end, vm, frag, cb) {
  let done = false
  let removed = 0
  const nodes = []
  mapNodeRange(start, end, function (node) {
    if (node === end) done = true
    nodes.push(node)
    removed++

    if (done && removed >= nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        frag.appendChild(nodes[i])
      }
      cb && cb()
    }
  })
}