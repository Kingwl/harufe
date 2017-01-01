/**
 * Created by kingwl on 16/12/29.
 */

import bind from '../directives/bind'
import vIf from '../directives/if'
import vFor from '../directives/for'

export function initOptions (vm) {
  const directives = {
    bind: bind
    , 'if': vIf
    , 'for': vFor
  }
  vm.$options = Object.assign({}, vm.$options, {
    directives
  })
}