/**
 * Created by kingwl on 17/1/4.
 */

import Router from '../src'

const app = document.getElementById('app')
const router = new Router()

router.route('/', param => {
  app.innerText = 'index'
})

router.route('/abc', param => {
  app.innerText = 'abc'
})

router.route('/hehe/:id', param => {
  app.innerText = `hehe: ${param.params.id}`
})

router.route('*', param => {
  app.innerText = '404 not found'
})

router.init('history')

window.router = router
