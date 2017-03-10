const PendingState = "pending"
const FulfilledState = "fulfilled"
const RejectedState = "rejected"

const asyncExecute = x => setTimeout(x, 0)

function PPromise (resolver) {
  this.state = PendingState
  this.value = null
  this.onResolvedCallbacks = []
  this.onRejectCallbacks = []

  const resolve = value => {
    asyncExecute(() => {
      if (this.state === PendingState) {
        this.state = FulfilledState
        this.value = value
        this.onResolvedCallbacks.forEach(x => x && x(value))
      }
    })
  }

  const reject = reason => {
    asyncExecute(() => {
      if (this.state === PendingState) {
        this.state = RejectedState
        this.value = reason
        this.onRejectCallbacks.forEach(x => x && x(reason))
      }
    })
  }

  try {
    resolver(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

PPromise.prototype.then = function (onResolve, onReject) {
  onResolve = typeof onResolve === 'function' ? onResolve : value => { return value }
  onReject = typeof onReject === 'function' ? onReject : reason => { throw reason }

  function resolvePromise(newPromise, x, resolve, reject) {
    if (newPromise === x) {
      return reject(new TypeError('Chaining cycle detected for promise!'))
    }

    if (x instanceof PPromise) {
      if (x.state === PendingState) {
        x.then(v => {
          resolvePromise(newPromise, v, resolve, reject)
        }, reject)
      } else {
        x.then(resolve, reject)
      }
      return
    }

    let thenCalledOrThrow = null
    if (x && (typeof x === 'object' || typeof x === 'function')) {
      try {
        const then = x.then
        if (typeof then === 'function') {
          then.call(x, y => {
            if (thenCalledOrThrow) return
            thenCalledOrThrow = true
            resolvePromise(newPromise, y, resolve, reject)
          }, r => {
            if (thenCalledOrThrow) return
            thenCalledOrThrow = true
            reject(r)
          })
        } else {
          resolve(x)
        }
      } catch (e) {
        if (thenCalledOrThrow) return
        thenCalledOrThrow = true
        reject(e)
      }
    } else {
      resolve(x)
    }
  }

  const makeResolve = (resolve, reject, getPromise) => {
    return value => {
      try {
        const x = onResolve(value)
        resolvePromise(getPromise(), x, resolve, reject)
      } catch (e) {
        reject(e)
      }
    }
  }

  const makeReject = (resolve, reject, getPromise) => {
    return reason => {
      try {
        const x = onReject(reason)
        resolvePromise(getPromise(), x, resolve, reject)
      } catch (e) {
        reject(e)
      }
    }
  }

  let newPromise = null
  if (this.state === PendingState) {
    return newPromise = new PPromise((resolve, reject) => {
      this.onResolvedCallbacks.push(makeResolve(resolve, reject, () => newPromise))
      this.onRejectCallbacks.push(makeReject(resolve, reject, () => newPromise))
    })
  } else if (this.state === FulfilledState) {
    return newPromise = new PPromise((resolve, reject) => {
      asyncExecute(() => {
        makeResolve(resolve, reject, () => newPromise)(this.value)
      })
    })
  } else if (this.state === RejectedState) {
    return newPromise = new PPromise((resolve, reject) => {
      asyncExecute(() => {
        makeReject(resolve, reject, () => newPromise)(this.value)
      })
    })
  }
}

PPromise.prototype.catch = function (onReject) {
  return this.then(undefined, onReject)
}

PPromise.prototype.deferred = PPromise.prototype.defer = function () {
  const defer = {}
  defer.promise = new PPromise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

module.exports = PPromise
