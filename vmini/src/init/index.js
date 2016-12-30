/**
 * Created by kingwl on 16/12/20.
 */

import { initData } from './initData'
import { initTemplate } from './initTemplate'
import { initOptions } from './initOptions'

export default function initVm (vm) {
  initOptions(vm)
  initData(vm)
  initTemplate(vm)
}