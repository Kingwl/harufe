/**
 * Created by kingwl on 16/12/29.
 */

import { compile } from '../compiler'
import { cloneNode } from '../utils'
import Fragment from './fragment'

export default class FragmentFactory {
  constructor (vm, el) {
    this.vm = vm

    this.template = document.createDocumentFragment()
    this.template.appendChild(el)

    this.linker = compile(this.template, vm.$options)
  }

  create (host, scope, parentFrag) {
    const frag = cloneNode(this.template)
    return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag)
  }
}