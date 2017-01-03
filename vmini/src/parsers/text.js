/**
 * Created by kingwl on 17/1/3.
 */

const delimiters = ['{{', '}}']
const open = delimiters[0]
const close = delimiters[1]

const tagRE = new RegExp(open + '((?:.|\\n)+?)' + close, 'g')

export function parseText (text) {
  if (!tagRE.test(text)) {
    return null
  }

  const tokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match = null
  let index = 0
  while (match = tagRE.exec(text)) {
    index = match.index

    if (index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, index)
      })
    }

    const value = match[1]
    tokens.push({
      tag: true
      , value: value.trim()
    })

    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    tokens.push({
      value: text.slice(lastIndex)
    })
  }
  return tokens
}