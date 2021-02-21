module.exports = {
  name: 'string',
  desc: 'Applies toString and joins with newlines.',
  opts: [],
  func
}

function func () {
  return values => {
    let str   = ''
    const err = []

    for (let index = 0; index < values.length; index++) {
      const value = values[index]
      if (typeof value !== 'undefined' && value !== null) str += value.toString() + '\n'
    }

    return {err, str}
  }
}