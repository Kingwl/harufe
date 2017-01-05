/**
 * Created by kingwl on 17/1/4.
 */

import History from './History'

export default class Html5History extends History {
  constructor (router) {
    super(router)
  }

  listen () {
    window.addEventListener('popstate', e => {
      this.transitionTo(this.getLocation(), () => {
      })
    })

    window.addEventListener('load', e => {
      this.transitionTo(this.getLocation(), () => {
      })
    })
  }

  pushState (url) {
    window.history.pushState({ foo: "bar" }, '', url)
  }

  replaceState (url) {
    window.history.replaceState({ foo: "bar" }, '', url)
  }

  getLocation (base) {
    let path = window.location.pathname
    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length)
    }

    return (path || '/') + window.location.search + window.location.hash
  }
}