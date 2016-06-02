import defaults from '../config/config.json';
const is =  (function toType(global) {
  return function(obj) {
    if (obj === global) {
      return "global";
    }
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  }
})(global);

const forEachKey = (obj, cb) => {
  if(obj && is(obj) === 'object') {
    const keys = Object.keys(obj);
    let i;
    for(i=0; i<keys.length; i++) {
      cb(keys[i], i, keys);
    }
  }
};

const xor = (predicates) => {
  return predicates
  .reduce((prev, predicate) => ( ( prev && !predicate ) || ( !prev && predicate ) ), false);
};

const isJsonSafePrimitive = (value) => {
  return (
    typeof value === 'number' ||
      typeof value === 'string' ||
      typeof value === 'boolean'
  );
};

const generateAssertions = (json, path='payload') => {
  const keys = Object.keys(json);
  const length = keys.length;
  const assert = 'equal';
  let expect = {};
  let log;
  for(let i = 0; i < length; i++) {
    const key = keys[i];
    const value = json[key];
    if (this.isJsonSafePrimitive(value)) {
      log = `${path}.${key} should be ${value}`;
      expect[key] = {
        value,
        assert,
        log
      };
    } else {
      expect[key] = generateAssertions(value, `${path}.${key}`);
    }
  }

  return expect;
};

const getAllAssertions = (actual, expectation) => {
  let tests = [];

  if (expectation.$assert && expectation.$value) {
    tests.push({
      expectation: expectation.$value,
      actual: actual,
      assertion: expectation.$assert,
      log: expectation.$log
    });
  } else {
    const keys = Object.keys(expectation);
    const length = keys.length;

    for(var i = 0; i < length; i++) {
      tests = tests.concat(getAllAssertions((actual ? actual[keys[i]] : null), expectation[keys[i]]));
    }
  }
  return tests;
};

const countAssertions = (obj) => {
  let count = 0;

  if (obj.$assert && obj.$value) {
    ++count;
  } else {
    const keys = Object.keys(obj);
    const length = keys.length;

    for(var i = 0; i < length; i++) {
      count += countAssertions(obj[keys[i]]);
    }
  }
  return count;
};

const createURL = (endpoint, config = defaults.plugins.http) => {
  const { host, port, path } = config;

  console.log(`http://${host}:${port}${path}`);
  return `http://${host}:${port}${path}${endpoint}`;
}

export {
  is,
  forEachKey,
  xor,
  isJsonSafePrimitive,
  createURL,
  generateAssertions,
  getAllAssertions,
  countAssertions
};
