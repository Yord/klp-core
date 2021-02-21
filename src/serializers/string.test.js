const {anything, array, assert, constant, property} = require('fast-check')

const serializers = require('.')
const string      = serializers.find(({name}) => name === 'string')
const serializer  = string.func

test('returns input as toString with newlines', () => {
  const err    = []
  const argv   = anything().chain(verbose => constant({verbose}))
  const values = array(anything()).map(values => values.filter(value => value !== null && typeof value !== 'undefined'))

  assert(
    property(argv, values, (argv, values) => {
      const str = values.map(value => value.toString() + '\n').join('')

      expect(
        serializer(argv)(values)
      ).toStrictEqual(
        {err, str}
      )
    })
  )
})