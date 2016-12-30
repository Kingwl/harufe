/**
 * Created by kingwl on 16/12/29.
 */

import bind from '../directives/bind'
import vIf from '../directives/if'

export function initOptions (vm) {
  const directives = {
    bind: bind
    , 'if': vIf
  }
  vm.$options = Object.assign({}, vm.$options, {
    directives
  })
}