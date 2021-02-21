TODO: klp-core teaser

:horse:`klp-core` is a plugin with basic operations for `klp` (Kelpie), the small, fast, and magical command-line data processor.

See the [`klp` github repository][klp] for more details!

[![node version][shield-node]][node]
[![npm version][shield-npm]][npm-package]
[![license][shield-license]][license]
[![PRs Welcome][shield-prs]][contribute]
[![linux unit tests status][shield-unit-tests-linux]][actions]
[![macos unit tests status][shield-unit-tests-macos]][actions]
[![windows unit tests status][shield-unit-tests-windows]][actions]

## Installation

> :ok_hand: `klp-core` comes preinstalled in `klp`.
> No installation necessary.
> If you still want to install it, proceed as described below.

`klp-core` is installed in `~/.klp/` as follows:

```bash
npm install klp-core
```

The plugin is included in `~/.klp/index.js` as follows:

```js
const core = require('klp-core')

module.exports = {
  plugins:  [core],
  context:  {},
  defaults: {}
}
```

For a much more detailed description, see the [`.klp` module documentation][klp-module].

## Extensions

This plugin comes with the following `klp` extensions:

|                     | Description                                                                                                                                                                                      |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `line` chunker      | Divides data on line breaks. A lot of data formats like CSV, TSV, and JSON line build on this separation.                                                                                        |
| `map` applier       | Applies `klp`'s functions to each individual line. Always returns a single result, unless an error is thrown during function application.                                                        |
| `flatMap` applier   | Applies `klp`'s functions to each individual line. May return any number of results, including none, thus being able to change the length of a file.                                             |
| `filter` applier    | Treats `klp`'s functions as a conjunction of predicates and applies it to each individual line. If any predicate is false, the line is dropped, if all predicates return true, the line is kept. |
| `string` serializer | Serializes each transformed JSON into a string separated by newlines.                                                                                                                            |

## Reporting Issues

Please report issues [in the tracker][issues]!

## License

`klp-core` is [MIT licensed][license].

[actions]: https://github.com/Yord/klp-core/actions
[contribute]: https://github.com/Yord/klp
[issues]: https://github.com/Yord/klp/issues
[klp]: https://github.com/Yord/klp
[klp-module]: https://github.com/Yord/klp#klp-module
[license]: https://github.com/Yord/klp-core/blob/master/LICENSE
[node]: https://nodejs.org/
[npm-package]: https://www.npmjs.com/package/klp-core
[shield-license]: https://img.shields.io/npm/l/klp-core?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/klp-core?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/klp-core.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/klp-core/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/klp-core/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/klp-core/workflows/windows/badge.svg?branch=master