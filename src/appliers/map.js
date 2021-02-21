module.exports = {
  name: 'map',
  desc: 'Applies function f to each AST element and replaces it with f\'s result.',
  opts: [
    {key: 'f', types: ['function'], defaultValues: ['json => json'], desc: 'A function.'}
  ],
  func
}

function func ({f = json => json, verbose}) {
  return (jsons, lines) => {
    let jsons2 = []
    let err    = []

    for (let index = 0; index < jsons.length; index++) {
      let obj = jsons[index]
      try {
        if (typeof obj !== 'undefined') obj = f(obj)
        jsons2.push(obj)
      } catch (e) {
        const msg  =               {msg: e.message}
        const line = verbose > 0 ? {line: lines[index]}                 : {}
        const info = verbose > 1 ? {info: JSON.stringify(obj, null, 0)} : {}
        err.push(Object.assign(msg, line, info))
      }
    }

    return {err, jsons: jsons2}
  }
}