/**
 * Created by kingwl on 16/12/23.
 */

export function resolveAsset (options, type, id) {
  const assets = options[type]
  const res = assets[id]
  return res
}