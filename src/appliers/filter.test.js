const {anything, array, assert, constant, integer, property} = require('fast-check')

const appliers = require('.')
const filter   = appliers.find(({name}) => name === 'filter')
const applier  = filter.func

test('applies a predicate that is always true to each element', () => {
  const err   = []
  const argv  = anything().chain(verbose => constant({
    verbose,
    p: () => true
  }))
  const jsons = array(anything().map(any => typeof any === 'undefined' ? 42 : any))
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

test('applies a predicate that is always false to each element', () => {
  const err   = []
  const argv  = anything().chain(verbose => constant({
    verbose,
    p: () => false
  }))
  const jsons = array(anything())
  const lines = anything()

  assert(
    property(argv, jsons, lines, (argv, jsons, lines) =>
      expect(
        applier(argv)(jsons, lines)
      ).toStrictEqual(
        {err, jsons: []}
      )
    )
  )
})

test('applies a predicate that is true for some input and false for other', () => {
  const err     = []
  const argv    = anything().chain(verbose => constant({
    verbose,
    p: n => n > 4
  }))
  const falsy   = array(integer(0, 4))
  const truthy  = array(integer(5, 9))
  const lines   = anything()

  assert(
    property(argv, falsy, truthy, lines, (argv, falsy, truthy, lines) => {
      const numbers = falsy.concat(truthy)

      expect(
        applier(argv)(numbers, lines)
      ).toStrictEqual(
        {err, jsons: truthy}
      )
    })
  )
})

test('applies a function selecting non-present attributes which leads to an error, not using lines since verbose is 0', () => {
  const msg   = "Cannot read property 'b' of undefined"
  const argv  = {
    verbose: 0,
    p: i => i.a.b
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
    p: int => int.a.b
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
    p: int => int.a.b
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