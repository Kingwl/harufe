import History from './History'

export default class extends History {
    constructor (router) {
      super(router)
    }

    listen () {
      window.addEventListener('hashchange', e => this.onHashChange(e))

      this.transitionTo(getHash())
    }

    push (location) {
      pushHash(location.raw)
    }

    replace (location) {
      replaceHash(location.raw)
    }

    onHashChange () {
      this.transitionTo(getHash(), route => {
          replaceHash(route.path)
      })
    }
}

export function getHash () {
  const href = window.location.href
  const index = href.indexOf('#')
  return index === -1 ? '' : href.slice(index + 1)
}

export function pushHash (path) {
  window.location.hash = path
}

export function replaceHash (path) {
  const href = window.location.href
  const index = href.indexOf('#')
  window.location.replace(href.slice(0, index > 0 ? index : 0) + '#' + path)
}
