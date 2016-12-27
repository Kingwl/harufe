/**
 * Created by kingwl on 16/12/20.
 */

import { initData } from './initData'
import { initTemplate } from './initTemplate'

export default function MixinVm (vm) {
  initData(vm)
  initTemplate(vm)
}