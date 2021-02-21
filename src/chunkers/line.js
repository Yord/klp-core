module.exports = {
  name: 'line',
  desc: 'Treats all lines (separated by line breaks) as tokens.',
  opts: [],
  func
}

function func ({verbose}) {
  return (data, linesOffset, noMoreData) => {
    const chunks = []
    const lines  = []
    const err    = []

    const recordSeparator = '\n'

    let lastLine = linesOffset
    let prev     = -1
    let last     = data.indexOf(recordSeparator, prev + 1)

    while (last > -1) {
      const chunk = data.slice(prev + 1, last)
      chunks.push(chunk)
      if (verbose > 0) {
        lastLine++
        lines.push(lastLine)
      }
      prev = last
      last = data.indexOf(recordSeparator, prev + 1)
    }

    let rest = data.slice(prev + 1)

    if (noMoreData && rest !== '') {
      chunks.push(rest)
      if (verbose > 0) {
        lastLine++
        lines.push(lastLine)
      }
      rest = ''
    }

    return {err, chunks, lines, lastLine, rest}
  }
}