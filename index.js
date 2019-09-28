/**
 * The functions exported from this module try keep the same signature as their lodash equivalents
 * See: https://lodash.com/docs
 */

function sameValueZero(a, b) {
  /**
   * Equality method used by lodash. This is the comparison method used by `Map`, `Set`, and `Array.includes`
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality
   * See: http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero
   */
  if (a === 0 && b === 0) {
    // consider -0 and +0 to be equal
    return true;
  }
  // same-value equality
  return Object.is(a, b);
}

function eq(a, b) {
  /**
   * Similar to _.eq
   * Performs a shallow value comparison using Same Value Zero algorithm
   */
  return sameValueZero(a, b);
}

function identity(value) {
  /**
   * Similar to _.identity
   */
  return value;
}

function has(object, property) {
  /**
   * Similar to _.has
   * Checks whether a property exists on the given object
   * Unlike _.has this implementation doesn't currently support checking nested paths
   */
  if (object === null) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(object, property);
}

const findChild = (root, path) => {
  const pathArray = path.split(".");
  let parent = root;
  for (let p = 0; p < pathArray.length - 1; p += 1) {
    if (parent) {
      parent = parent[pathArray[p]];
    } else {
      return { parent: null, key: null };
    }
  }
  return { parent: parent || null, key: pathArray[pathArray.length - 1] };
};

function get(object, path, defaultValue) {
  /**
   * Similar to _.get
   * Gets the value of a property and optionally use a default value is the property doesn't exist
   * Supports nested properties
   */
  const { parent, key } = findChild(object, path);
  let value;
  if (parent) {
    value = parent[key];
  }
  return value === undefined ? defaultValue : value;
}

function pick(object, propOrArray) {
  /**
   * Similar to _.pick, the opposite of `omit`
   * Returns a subset of props from an object without mutating the original object
   */
  if (object === null) {
    return {};
  }
  const included =
    typeof propOrArray === "string" ? [propOrArray] : propOrArray;

  return included.reduce(
    (accumulator, key) =>
      has(object, key) ? { ...accumulator, [key]: object[key] } : accumulator,
    {}
  );
}

function omit(object, propOrArray) {
  /**
   * Similar to _.omit
   * Returns a new object excluding some props from the original object
   */
  if (object === null) {
    return {};
  }
  const excluded =
    typeof propOrArray === "string" ? [propOrArray] : propOrArray;

  return Object.keys(object).reduce(
    (accumulator, key) =>
      excluded.indexOf(key) === -1
        ? { ...accumulator, [key]: object[key] }
        : accumulator,
    {}
  );
}

function mapValues(object, iteratee = identity) {
  /**
   * Similar to _.mapValues
   */
  if (object === null) {
    return {};
  }
  return Object.keys(object).reduce(
    (accumulator, key, index) => ({
      ...accumulator,
      [key]: iteratee(object[key], key, index)
    }),
    {}
  );
}

function groupBy(array, criteria) {
  /**
   * Similar to _.groupBy
   */
  const predicate =
    typeof criteria === "function" ? criteria : item => item[criteria];

  return (array || []).reduce((accumulator, item) => {
    const field = predicate(item);
    return {
      ...accumulator,
      [field]: [...(accumulator[field] || []), item]
    };
  }, {});
}

function includes(array, value, fromIndex = 0) {
  /**
   * Similar to _.includes
   */
  for (let i = fromIndex; i < array.length; i += 1) {
    if (eq(array[i], value)) {
      return true;
    }
  }
  return false;
}

function sortBy(array, iteratees = identity) {
  /**
   * Similar to _.sortBy
   */
  const iterateesArray = Array.isArray(iteratees) ? iteratees : [iteratees];

  const createSortFn = it => {
    const getSortValue =
      typeof it === "function" ? it : object => get(object, it);
    return (element1, element2) => {
      const sortValue1 = getSortValue(element1);
      const sortValue2 = getSortValue(element2);

      if (sortValue1 < sortValue2) {
        return -1;
      }
      if (sortValue1 > sortValue2) {
        return 1;
      }
      return 0;
    };
  };

  return iterateesArray.reduce(
    (partial, it) => partial.sort(createSortFn(it)),
    array
  );
}

function without(array, ...values) {
  /**
   * Similar to _.without
   */
  return array.filter(element => !includes(values, element));
}

function difference(array1, array2) {
  /**
   * Similar to _.difference
   */
  const remove = new Set(array2);

  return array1.filter(item => !remove.has(item));
}

function union(...arrays) {
  /**
   * Similar to _.union
   */
  const unionSet = new Set();

  arrays.forEach(array => {
    array.forEach(element => {
      unionSet.add(element);
    });
  });

  return [...unionSet];
}

function uniq(array) {
  /**
   * similar to _.uniq
   */
  return [...new Set(array)];
}

function range(...args) {
  /**
   * Similar to _.range
   * range([start=0], end, [step=1])
   */
  let start = 0;
  const end = args[args.length > 1 ? 1 : 0];
  let step = 1;

  if (args.length > 1) {
    // eslint-disable-next-line prefer-destructuring
    start = args[0];
  }
  if (args.length > 2) {
    // eslint-disable-next-line prefer-destructuring
    step = args[2];
  }
  const indexes = [];
  for (let i = start; i < end; i += step) {
    indexes.push(i);
  }

  return indexes;
}

function sumBy(array, iteratee = identity) {
  /**
   * Similar to _.sumBy
   */
  const iterateeFn =
    typeof iteratee === "string" ? value => get(value, iteratee) : iteratee;
  return array.reduce((sum, value) => sum + iterateeFn(value), 0);
}

function minBy(array, iteratee = identity) {
  /**
   * Similar to _.minBy
   */
  const iterateeFn =
    typeof iteratee === "string" ? element => get(element, iteratee) : iteratee;

  let minIndex = -1;
  let minValue = Infinity;
  for (let i = 0; i < array.length; i += 1) {
    const value = iterateeFn(array[i]);
    if (value < minValue) {
      minIndex = i;
      minValue = value;
    }
  }
  return array[minIndex];
}

function maxBy(array, iteratee = identity) {
  /**
   * Similar to _.maxBy
   */
  const iterateeFn =
    typeof iteratee === "string" ? element => get(element, iteratee) : iteratee;

  let maxIndex = -1;
  let maxValue = -Infinity;
  for (let i = 0; i < array.length; i += 1) {
    const value = iterateeFn(array[i]);
    if (value > maxValue) {
      maxIndex = i;
      maxValue = value;
    }
  }
  return array[maxIndex];
}

export {
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
  without
};
