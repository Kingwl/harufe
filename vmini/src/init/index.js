/**
 * Created by kingwl on 16/12/20.
 */

import { initData } from './initData'
import { initTemplate } from './initTemplate'
import { initOptions } from './initOptions'
import { initMethods } from './initMethods'

export default function initVm (vm) {
  initOptions(vm)
  initData(vm)
  initMethods(vm)
  initTemplate(vm)
}
