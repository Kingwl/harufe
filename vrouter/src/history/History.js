/**
 * Created by kingwl on 17/1/4.
 */

export default class History {
  constructor(router) {
    this.router = router
  }

  listen () {

  }

  go (n) {
    window.history.go(n)
  }

  push (location) {

  }

  replace (location) {

  }

  transitionTo (location, after) {
    const route = this.router.match(location)
    if (route) {
      const {info, cb} = route
      after && after(info)
      cb && cb(info)
    }
  }
}
