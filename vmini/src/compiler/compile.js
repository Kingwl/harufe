/**
 * Created by kingwl on 16/12/22.
 */

import { publicDirectives }  from '../directives'
import { parseDirective, parseText } from '../parsers'
import { resolveAsset, removeNode, replace } from '../utils'

const ElementNodeType = 1
const TextNodeType = 3

const bindRE = /^v-bind:|^:/
const onRE = /^v-on:|^@/
const dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/
const modifierRE = /\.[^\.]+/g

const DEFAULT_PRIORITY = 1000
const DEFAULT_TERMINAL_PRIORITY = 2000

export function linkAndCapture(linker, vm) {
  vm._directives = []

  const origiDirectiveLength = vm._directives.length
  linker()
  const dirs = vm._directives.slice(origiDirectiveLength)
  dirs.sort()

  for(let i =0, l = dirs.length; i < l; ++i) {
    dirs[i]._bind()
  }
  return dirs
}

export function makeUnlinkFn (vm, dirs) {
  function unlink () {
    teardownDirs(vm, dirs)
  }
  unlink.dirs = dirs
  return unlink
}

function makeNodeLinkFn (dirs) {
  return function (vm, el, host, scope, frag) {
    for(let i = 0, l = dirs.length; i < l; ++i) {
      vm._bindDir(dirs[i], el, host, scope, frag)
    }
  }
}

function makeTerminalNodeLinkFn(el, dirName, value, options, def, rawName, arg, modifiers) {
  const parsed = parseDirective(value)
  const descriptor = {
    name: dirName
    , arg
    , expression: parsed.expression
    , raw: value
    , attr: rawName
    , modifiers
    , def
  }

  const fn = function (vm, el, host, scope, frag) {
    vm._bindDir(descriptor, el, host, scope, frag)
  }
  fn.terminal = true
  return fn
}

function makeChildLinkFn(linkFns) {
  return function (vm, nodes, host, scope, frag) {
    for (let i = 0, n = 0, l = linkFns.length; i < l; ++n) {
      const node = nodes[n]
      const nodeLinkFn = linkFns[i++]
      const childrenLinkFn = linkFns[i++]

      const childNodes = Array.from(node.childNodes)

      if (nodeLinkFn) {
        nodeLinkFn(vm, node, host, scope, frag)
      }

      if (childrenLinkFn) {
        childrenLinkFn(vm, childNodes, host, scope, frag)
      }
    }
  }
}

export function compile(el, options) {
  const dire = compileNode(el)
  const childDire = (!(dire && dire.terminal) && el.tagName !== 'SCRIPT' && el.hasChildNodes())
    ? compileNodeList(el.childNodes, options)
    : null

  return function (vm, el, host,  scope, frag) {
    const dirs = linkAndCapture(function () {
      const children = el.childNodes
      if (dire) dire(vm, host, el, scope, frag)
      if (childDire) childDire(vm, children, host, scope, frag)
    }, vm)

    return makeUnlinkFn(vm, dirs)
  }
}

export function compileNodeList(nodeList, options) {
  const linkFns = []
  for (let i = 0, l = nodeList.length;  i < l; ++i) {
    const node = nodeList[i]
    const nodeLinkFn = compileNode(node, options)
    const childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes()
    ? compileNodeList(node.childNodes, options)
      : null
    linkFns.push(nodeLinkFn, childLinkFn)
  }
  return linkFns.length ? makeChildLinkFn(linkFns) : null
}

export function compileNode(node, options) {
  const type = node.nodeType
  if (type === ElementNodeType && node.tagName !== 'SCRIPT') {
    return compileElement(node, options)
  } else if (type === TextNodeType) {
    return compileTextElement(node, options)
  } else {
    return null
  }
}

export function compileElement(el, options) {
  let directives = null
  let hasAttrs = el.hasAttributes()
  const attrs = Array.from(el.attributes)

  if (hasAttrs) {
    directives = checkTerminalDirectives(el, attrs, options)
  }

  if (!directives && hasAttrs) {
    directives = compileDirectives(attrs, options)
  }

  return directives
}

export function checkTerminalDirectives(el, attrs, options) {
  let tempDef = null
  let rawName = null
  let value = null
  let dirName = null
  let arg = null
  let modifiers = null

  for (let i = 0, l = attrs.length; i < l; ++i) {
    const attr = attrs[i]
    modifiers = parseModifiers(attr.name)
    const name = attr.name.replace(modifierRE, '')
    const matched = name.match(dirAttrRE)
    if (matched) {
      const def = resolveAsset(options, 'directives', matched[1])
      if (def && def.terminal) {
        if (!tempDef || (def.priority || DEFAULT_TERMINAL_PRIORITY) > tempDef.priority) {
          tempDef = def
          rawName = attr.name
          value = attr.value
          dirName = matched[1]
          arg = matched[2]
        }
      }
    }
  }

  if (tempDef) {
    return makeTerminalNodeLinkFn(el, dirName, value, options, tempDef, rawName, arg, modifiers)
  }
}

export function compileDirectives(attrs, options) {
  const dirs = []
  let name = null
  let rawName = null
  let value = null
  let rawValue = null
  let arg = null
  let dirName = null
  let matched = null
  let modifiers = null

  for (let i = 0, l = attrs.length; i < l; ++i) {
    const attr = attrs[i]
    name = rawName = attr.name
    arg = value = rawValue = attr.value

    modifiers = parseModifiers(name)
    name = name.replace(modifierRE, '')

    if (bindRE.test(name)) {
      dirName = name.replace(bindRE, '')
      arg = dirName
      pushDir('bind', publicDirectives.bind)
    } else if (onRE.test(name)) {
      arg = name.replace(onRE, '')
      pushDir('on', publicDirectives.on)
    } else if (matched = name.match(dirAttrRE)) {
      dirName = matched[1]
      arg = matched[2]

      const dirDef = resolveAsset(options, 'directives', dirName)

      if (dirDef) {
        pushDir(dirName, dirDef)
      }
    }
  }

  function pushDir(dirName, def) {
    const parsed = parseDirective(value)
    dirs.push({
      name: dirName
      , attr: rawName
      , raw: rawValue
      , def
      , arg
      , modifiers
      , expression: parsed.expression
    })
  }

  if (dirs.length) {
    return makeNodeLinkFn(dirs)
  }
}

function parseModifiers (name) {
  const res = Object.create(null)
  const match = name.match(modifierRE)
  if (match) {
    let i = match.length
    while (i--) {
      res[match[i].slice(1)] = true
    }
  }
  return res
}

function removeText (vm, node) {
  removeNode(node)
}

function processTextToken (token, options) {
  const el = document.createTextNode(' ')

  if (token.descriptor) {
    return
  }
  const parsed = parseDirective(token.value)
  const type = 'text'
  token.descriptor = {
    name: type
    , def: publicDirectives[type]
    , expression: parsed.expression
  }
  return el
}

function makeTextNodeLinkFn(tokens, frag) {
  return function (vm, el, host, scope) {
    const fragClone = frag.cloneNode(true)
    const childNodes = Array.from(fragClone.childNodes)
    for (let i = 0, l = tokens.length; i < l; ++i) {
      const token = tokens[i]
      if (token.tag) {
        const node = childNodes[i]
        vm._bindDir(token.descriptor, node, host, scope)
      }
    }
    replace(el, fragClone)
  }
}

export function compileTextElement(node, options) {
  if (node._skip) {
    return removeText
  }

  const tokens = parseText (node.wholeText)
  if (!tokens) {
    return null
  }

  let next = node.nextSibling
  while (next && next.nodeType === TextNodeType) {
    next._skip = true
    next = next.nextSibling
  }

  const frag = document.createDocumentFragment()
  for (let i = 0, l = tokens.length; i < l; ++i) {
    const token = tokens[i]
    const el = token.tag
      ? processTextToken(token, options)
      : document.createTextNode(token.value)
    frag.appendChild(el)
  }
  return makeTextNodeLinkFn(tokens, frag)
}

function teardownDirs (dirs) {
  for(let i = 0, l = dirs.length; i < l; ++i) {
    dirs[i].teardown()
  }
}
