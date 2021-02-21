module.exports = {
  name: 'filter',
  desc: 'Applies predicate p to the AST and keeps all that yield true.',
  opts: [
    {key: 'p', types: ['function'], defaultValues: ['() => true'], desc: 'A predicate.'}
  ],
  func
}

function func ({p = () => true, verbose}) {
  return (jsons, lines) => {
    let jsons2 = []
    const err  = []

    for (let index = 0; index < jsons.length; index++) {
      let obj = jsons[index]
      try {
        if (typeof obj === 'undefined' || p(obj) === false) {
          obj = undefined
        }
        if (typeof obj !== 'undefined') jsons2.push(obj)
      } catch (e) {
        const msg  =               {msg:  e.message}
        const line = verbose > 0 ? {line: lines[index]}                 : {}
        const info = verbose > 1 ? {info: JSON.stringify(obj, null, 0)} : {}
        err.push(Object.assign(msg, line, info))
      }
    }

    return {err, jsons: jsons2}
  }
}