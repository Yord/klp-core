const {anything, array, assert, constant, integer, property} = require('fast-check')

const appliers = require('.')
const map      = appliers.find(({name}) => name === 'map')
const applier  = map.func

test('applies the identity function to each element', () => {
  const err   = []
  const argv  = anything().chain(verbose => constant({
    verbose,
    f: json => json
  }))
  const jsons = array(anything())
  const lines = anything()

  assert(
    property(argv, jsons, lines, (argv, jsons, lines) =>
      expect(
        applier(argv)(jsons, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('applies a function selecting the time attribute from each element', () => {
  const err    = []
  const argv   = anything().chain(verbose => constant({
    verbose,
    f: json => json.time
  }))
  const jsons  = array(anything().chain(any => constant({time: any})))
  const others = array(integer())
  const lines  = anything()

  assert(
    property(argv, jsons, others, lines, (argv, jsons, others, lines) => {
      const input   = jsons.concat(others)
      const results = jsons.map(argv.f).concat(others.map(() => undefined))

      expect(
        applier(argv)(input, lines)
      ).toStrictEqual(
        {err, jsons: results}
      )
    })
  )
})

test('applies a function selecting non-present attributes which leads to an error, not using lines since verbose is 0', () => {
  const msg   = "Cannot read property 'b' of undefined"
  const argv  = {
    verbose: 0,
    f: int => int.a.b
  }
  const jsons = array(integer())
  const lines = anything()

  assert(
    property(jsons, lines, (jsons, lines) => {
      const err = jsons.map(() => ({msg}))

      expect(
        applier(argv)(jsons, lines)
      ).toStrictEqual(
        {err, jsons: []}
      )
    })
  )
})

test('applies a function selecting non-present attributes which leads to an error, using lines since verbose is 1', () => {
  const msg        = "Cannot read property 'b' of undefined"
  const argv       = {
    verbose: 1,
    f: int => int.a.b
  }
  const jsonsLines = integer(0, 10).chain(len =>
    array(integer(), len, len).chain(jsons =>
      array(integer(), len, len).chain(lines =>
        constant({jsons, lines})
      )
    )
  )

  assert(
    property(jsonsLines, ({jsons, lines}) => {
      const err = lines.map(line => ({msg, line}))

      expect(
        applier(argv)(jsons, lines)
      ).toStrictEqual(
        {err, jsons: []}
      )
    })
  )
})

test('applies a function selecting non-present attributes which leads to an error, using lines and additional info since verbose is 2 or bigger', () => {
  const msg        = "Cannot read property 'b' of undefined"
  const argv       = integer(2, 50).chain(verbose => constant({
    verbose,
    f: int => int.a.b
  }))
  const jsonsLines = integer(0, 10).chain(len =>
    array(integer(), len, len).chain(jsons =>
      array(integer(), len, len).chain(lines =>
        constant({jsons, lines})
      )
    )
  )

  assert(
    property(argv, jsonsLines, (argv, {jsons, lines}) => {
      const err = lines.map((line, index) => {
        const info = JSON.stringify(jsons[index], null, 0)
        return {msg, line, info}
      })

      expect(
        applier(argv)(jsons, lines)
      ).toStrictEqual(
        {err, jsons: []}
      )
    })
  )
})