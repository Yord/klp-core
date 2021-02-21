module.exports = {
  name: 'flatMap',
  desc: "Applies function f to each AST and replaces it with f's results. f is expected to return an array and may change the overall number of ASTs.",
  opts: [
    {key: 'f', types: ['function'], defaultValues: ['json => [json]'], desc: 'A function.'}
  ],
  examples: [
    "flatMap 'json => json.age < 18 ? [] : [json]'"
  ],
  func
}

function func ({f = json => [json], verbose}) {
  return (jsons, lines) => {
    const jsons2 = []
    const err    = []
  
    for (let index = 0; index < jsons.length; index++) {
      const obj = jsons[index]
      let objs  = undefined
      try {
        let acc = obj
        if (typeof acc !== 'undefined') acc = f(acc)
        objs = acc
      } catch (e) {
        const msg  =               {msg: e.message}
        const line = verbose > 0 ? {line: lines[index]}                 : {}
        const info = verbose > 1 ? {info: JSON.stringify(obj, null, 0)} : {}
        err.push(Object.assign(msg, line, info))
      }
      if (typeof objs !== 'undefined') {
        if (Array.isArray(objs)) {
          for (const obj of objs) jsons2.push(obj)
        } else {
          jsons2.push(objs)
        }
      }
    }
  
    return {err, jsons: jsons2}
  }
}