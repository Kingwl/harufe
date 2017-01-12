/**
 * Created by kingwl on 17/1/4.
 */

import History from './History'

export default class Html5History extends History {
  constructor (router) {
    super(router)
  }

  listen () {
    window.addEventListener('popstate', e => this.onHistoryChange(e))
    window.addEventListener('load', e => this.onHistoryChange(e))
  }

  push (location) {
    this.transitionTo(location.raw, () => {
      pushState(location.raw)
    })
  }

  replace (location) {
    this.transitionTo(location.raw, () => {
      replaceState(location.raw)
    })
  }

  getLocation (base) {
    let path = window.location.pathname
    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length)
    }

    return (path || '/') + window.location.search + window.location.hash
  }

  onHistoryChange (e) {
    this.transitionTo(this.getLocation(), route => {
    })
  }
}

export function pushState (url) {
  window.history.pushState({ foo: "bar" }, '', url)
}

export function replaceState (url) {
  window.history.replaceState({ foo: "bar" }, '', url)
}
