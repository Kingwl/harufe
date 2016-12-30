/**
 * Created by kingwl on 16/12/25.
 */

import { compile } from '../compiler'
import { Factory } from '../fragment'
import { replace } from '../utils'

export function initTemplate (vm) {
  const template = vm.$options.template
  // vm.$factory = new Factory(vm, vm.$el)
  const templateFrag = document.createDocumentFragment()

  let root = document.createElement('div')
  root.innerHTML = template
  templateFrag.appendChild(root)

  const link = compile(root, vm.$options)
  const unlink = link(vm, root, vm, null)

  replace(vm.$el, root)

  vm.$frag = templateFrag
}