/**
 * Created by kingwl on 16/12/25.
 */

import { compile } from '../compiler'
import bind from '../directives/bind'

export function initTemplate (vm) {
  const template = vm.$template
  const templateFrag = document.createDocumentFragment()

  let root = document.createElement('div')
  root.innerHTML = template
  templateFrag.appendChild(root)

  const options = {
    directives: {
      bind: bind
    }
  }
  const link = compile(root, options)
  const unlink = link(vm, root, vm, null, templateFrag)

  vm.$frag = templateFrag
}