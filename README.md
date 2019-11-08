# lidash [![CircleCI](https://circleci.com/gh/maikelrobier/lidash.svg?style=svg)](https://circleci.com/gh/maikelrobier/lidash)

Lidash (**li**ght-weight lo**dash**) is a tiny package containing utilities to manipulate arrays and objects **without mutating them**.
Exported functions keep the same signature as their lodash equivalents.

## Installation

```
npm install lidash
```

## Usage

```javascript
const {
  difference,
  eq,
  get,
  groupBy,
  has,
  identity,
  includes,
  intersection,
  mapValues,
  maxBy,
  minBy,
  omit,
  pick,
  range,
  sortBy,
  sumBy,
  union,
  uniq,
  without,
} = require('lidash');

...
```

## Tests

```
npm run test
```

## License

MIT
