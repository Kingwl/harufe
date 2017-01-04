/**
 * Created by kingwl on 17/1/4.
 */

import Router from '../src'

const router = new Router()
router.route('/abc', param => {
  console.log('abc', param)
})

router.route('/hehe/:id', param => {
  console.log('hehe', param)
})

router.route('*', param => {
  console.log(404, param)
})

router.init(null)

window.router = router

router.notify('/abc')
router.notify('/hehe/123')
router.notify('/wtf')