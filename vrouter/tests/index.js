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

// normal
router.match('/abc')
router.match('/hehe/123')
router.match('/wtf')

// relative
router.match('abc/..')
router.match('abc/../.')

// hash
router.match('/abc#123')
router.match('/hehe/123#123')
router.match('/wtf#123')

// query
router.match('/abc?a=1&b=2')
router.match('/hehe/123?a=1&b=2')
router.match('/wtf?a=1&b=2')

// all
router.match('/hehe/123?a=1&b=2#1234567')