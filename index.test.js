const {
  difference,
  eq,
  get,
  groupBy,
  has,
  identity,
  includes,
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
} = require('.');

describe('index.js', () => {
  test('eq()', () => {
    expect(eq(-0, +0)).toBe(true);
    expect(eq(0, -0)).toBe(true);
    expect(eq(0, +0)).toBe(true);
    expect(eq(NaN, NaN)).toBe(true);
    expect(eq('foo', 'foo')).toBe(true);

    const object = { foo: 'bar' };
    expect(eq(object, object)).toBe(true);

    expect(eq({ foo: 'bar' }, { foo: 'bar' })).toBe(false);
  });

  test('identity()', () => {
    expect(identity()).toEqual(undefined);
    expect(identity(null)).toEqual(null);
    expect(identity(false)).toEqual(false);
    expect(identity(2019)).toEqual(2019);
  });

  test('has()', () => {
    expect(has({}, 'toString')).toBe(false);
    expect(has(null, 'toString')).toBe(false);
    expect(has({ foo: 'bar' }, 'foo')).toBe(true);
  });

  test('pick()', () => {
    expect(pick(null, ['foo'])).toBeInstanceOf(Object);
    expect(pick({ foo: true }, ['foo'])).toHaveProperty('foo', true);
    expect(pick({ foo: true, bar: false }, ['foo'])).not.toHaveProperty('bar');
    expect(pick({ foo: true, bar: false }, 'bar')).toHaveProperty('bar');
  });

  test('omit()', () => {
    expect(omit(null, ['foo'])).toBeInstanceOf(Object);
    expect(omit({ foo: true }, ['foo'])).not.toHaveProperty('foo', true);
    expect(omit({ foo: true, bar: false }, ['foo'])).toHaveProperty('bar');
    expect(omit({ foo: true, bar: false }, 'bar')).not.toHaveProperty('bar');
  });

  test('mapValues()', () => {
    expect(mapValues(null, value => value)).toBeInstanceOf(Object);
    expect(mapValues({}, value => value)).toBeInstanceOf(Object);
    expect(mapValues({ foo: 'Foo!', bar: 'Bar!' }, value => value.toUpperCase())).toEqual({
      foo: 'FOO!',
      bar: 'BAR!',
    });
  });

  test('groupBy()', () => {
    expect(groupBy([], 'status')).toBeInstanceOf(Object);
    expect(
      groupBy([{ status: 'pending', type: 'economics' }, { status: 'failed', type: 'economics' }], 'status')
    ).toHaveProperty('pending', [{ status: 'pending', type: 'economics' }]);
    expect(
      groupBy(
        [{ status: 'pending', type: 'economics' }, { status: 'failed', type: 'economics' }],
        element => element.status
      )
    ).toHaveProperty('pending', [{ status: 'pending', type: 'economics' }]);
  });

  test('includes()', () => {
    expect(includes([], 1)).toBe(false);
    expect(includes(['foo'], 'bar')).toBe(false);
    expect(includes(['foo', 'bar'], 'bar')).toBe(true);
    expect(includes(['foo', 'bar'], 'foo', 1)).toBe(false);
  });

  test('sortBy()', () => {
    expect(sortBy([])).toEqual([]);
    expect(sortBy([4, 1, 2])).toEqual([1, 2, 4]);

    const users = [
      { name: 'Sansa', age: 27 },
      { name: 'Bran', age: 22 },
      { name: 'Jon', age: 27 },
      { name: 'Arya', age: 18 },
    ];
    expect(sortBy(users, user => user.age)).toEqual([
      { name: 'Arya', age: 18 },
      { name: 'Bran', age: 22 },
      { name: 'Sansa', age: 27 },
      { name: 'Jon', age: 27 },
    ]);
    expect(sortBy(users, ['age', 'name'])).toEqual([
      { name: 'Arya', age: 18 },
      { name: 'Bran', age: 22 },
      { name: 'Jon', age: 27 },
      { name: 'Sansa', age: 27 },
    ]);
  });

  test('without()', () => {
    expect(without([])).toEqual([]);
    expect(without([], 'water')).toEqual([]);
    expect(without(['oil', 'gas', 'water'])).toEqual(['oil', 'gas', 'water']);
    expect(without(['oil', 'gas', 'water'], 'water')).toEqual(['oil', 'gas']);
    expect(without(['oil', 'gas', 'water'], 'water', 'gas')).toEqual(['oil']);
  });

  test('difference()', () => {
    expect(difference([], ['foo'])).toEqual([]);
    expect(difference(['foo', 'bar', 'bar', 'baz'], ['bar'])).toEqual(['foo', 'baz']);
    expect(difference(['foo', 'bar', 'bar', 'baz'], ['foo', 'baz'])).toEqual(['bar', 'bar']);
  });

  test('union()', () => {
    expect(union()).toEqual([]);
    expect(union([1])).toEqual([1]);
    expect(union([], [])).toEqual([]);
    expect(union(['Summer', 'Spring'], ['Winter'])).toEqual(['Summer', 'Spring', 'Winter']);
    expect(union([true, false], [false, true])).toEqual([true, false]);
    expect(union(['Monday'], ['Monday', 'Wednesday'], ['Wednesday', 'Monday', 'Friday'])).toEqual([
      'Monday',
      'Wednesday',
      'Friday',
    ]);
  });

  test('uniq()', () => {
    expect(uniq([])).toEqual([]);
    expect(uniq(['Monday', 'Wednesday', 'Friday'])).toEqual(['Monday', 'Wednesday', 'Friday']);
    expect(uniq(['January', 'January', 'February', 'January'])).toEqual(['January', 'February']);
  });

  test('range()', () => {
    expect(range(0)).toEqual([]);
    expect(range(1)).toEqual([0]);
    expect(range(3)).toEqual([0, 1, 2]);
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(2, 10, 2)).toEqual([2, 4, 6, 8]);
  });

  test('get()', () => {
    expect(get(null, 'status')).toBe(undefined);
    expect(get(undefined, 'status')).toBe(undefined);
    expect(get(null, 'status', 'pending')).toBe('pending');
    expect(get({ status: null }, 'status', 'pending')).toBe(null);
    expect(get({ status: undefined }, 'status', 'pending')).toBe('pending');
    expect(get({ status: 'active' }, 'status')).toBe('active');
    expect(get({ createdBy: { email: 'john@inpt.com' } }, 'createdBy.email')).toBe('john@inpt.com');
    expect(get({ createdBy: { email: 'john@inpt.com' } }, 'updatedBy.email')).toBe(undefined);
    expect(get({ createdBy: { email: 'john@inpt.com' } }, 'updatedBy.email', '')).toBe('');
  });

  test('sumBy()', () => {
    expect(sumBy([])).toBe(0);
    expect(sumBy([0])).toBe(0);
    expect(sumBy([1])).toBe(1);
    expect(sumBy([1, 2, 3])).toBe(6);
    expect(sumBy([{ count: 1 }, { count: 2 }, { count: 3 }], 'count')).toBe(6);
    expect(sumBy([{ data: { count: 1 } }, { data: { count: 2 } }, { data: { count: 3 } }], 'data.count')).toBe(6);
  });

  test('minBy()', () => {
    expect(minBy([])).toEqual(undefined);
    expect(minBy([0])).toEqual(0);
    expect(minBy([Number.MAX_SAFE_INTEGER])).toEqual(Number.MAX_SAFE_INTEGER);
    expect(minBy([5, 1, 3])).toEqual(1);
    expect(minBy([[5, 10], [1, 0], [3, 20]], point => point[0])).toEqual([1, 0]);
    expect(minBy([{ x: 5, y: 10 }, { x: 1, y: 0 }, { x: 3, y: 20 }], point => point.x)).toEqual({ x: 1, y: 0 });
    expect(minBy([{ x: 5, y: 10 }, { x: 1, y: 9999 }, { x: 3, y: 20 }], 'x')).toEqual({ x: 1, y: 9999 });
  });

  test('maxBy()', () => {
    expect(maxBy([])).toEqual(undefined);
    expect(maxBy([0])).toEqual(0);
    expect(maxBy([Number.MAX_SAFE_INTEGER])).toEqual(Number.MAX_SAFE_INTEGER);
    expect(maxBy([5, 1, 3])).toEqual(5);
    expect(maxBy([[5, 10], [1, 0], [3, 20]], point => point[1])).toEqual([3, 20]);
    expect(maxBy([{ x: 5, y: 10 }, { x: 1, y: 0 }, { x: 3, y: 20 }], point => point.y)).toEqual({ x: 3, y: 20 });
    expect(maxBy([{ x: 999999, y: 10 }, { x: 1, y: 9999 }, { x: 3, y: 20 }], 'y')).toEqual({ x: 1, y: 9999 });
  });
});
