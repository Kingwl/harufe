/**
 * Created by kingwl on 17/1/4.
 */

export default class History {
  constructor(router) {
    this.router = router
  }

  pushState () {

  }

  replaceState () {

  }

  listen () {

  }

  go (n) {
    window.history.go(n)
  }

  push (location) {
    this.transitionTo(location.raw, () => {
      this.pushState(location.raw)
    })
  }

  replace (location) {
    this.transitionTo(location.raw, () => {
      this.replaceState(location.raw)
    })
  }

  transitionTo (location, after) {
    const route = this.router.match(location)
    if (route) {
      const {info, cb} = route
      after()
      cb(info)
    }
  }
}