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

const getAllAssertions = (payload, assertions) => {
  return assertions.map((assertion) => {
    return {
      expectation: assertion.$value,
      assertion: assertion.$assert,
      log : `${assertion.$path.join('.')} should be ${assertion.$assert} to ${assertion.$value}`,
      actual: assertion.$path.reduce((prev, next) => prev[next], payload)
    }
  });
};

const getReferences = (actual, toSave) => {
  let refs = {};

  if (toSave &&
      is(toSave) === 'string' &&
        toSave.indexOf('___#') === 0 &&
          toSave.indexOf('#___') === (toSave.length - 4)) {
    toSave = toSave.slice(4, -4);
  refs[toSave] = actual;
  } else if (toSave && actual && ( is(toSave) === 'object' || is(toSave) === 'array' )){
    const keys = Object.keys(toSave);
    const length = keys.length;

    for(var i = 0; i < length; i++) {
      refs = Object.assign(refs, getReferences((actual ? actual[keys[i]] : null), toSave[keys[i]]));
    }
  }
  return refs;
};

const applyReferences = (saved, op) => {

  const tpl = JSON.stringify(op);
  let pieces = tpl.split(/(\"\$\{[\s]*.*?[\s]*\}\")/g);
  let inflated = pieces
  .map((p) => {
    if(/(\"\$\{[\s]*.*?[\s]*\}\")/g.test(p)) {
      let fromSaved = saved[(p.slice(3, -2))];

      if(is(fromSaved) === 'array' || is(fromSaved) === 'object') {
        fromSaved = JSON.stringify(fromSaved);
      } else if(is(fromSaved) === 'string') {
        fromSaved = `"${fromSaved}"`;
      }
      p = fromSaved;
    }

    return p;
  })
  .reduce((prev, current) => `${prev}${current}`, '');

  pieces = inflated.split(/(\$\{[\s]*.*?[\s]*\})/g);
  inflated = pieces
  .map((p) => {
    if(/(\$\{[\s]*.*?[\s]*\})/g.test(p)) {
      let fromSaved = saved[(p.slice(2, -1))];

      if(is(fromSaved) === 'array' || is(fromSaved) === 'object') {
        fromSaved = JSON.stringify(fromSaved);
      }
      p = fromSaved;
    }

    return p;
  })
  .reduce((prev, current) => `${prev}${current}`, '');
  return JSON.parse(inflated);
};

const createURL = (endpoint, config = defaults.plugins.http) => {
  const { host, port, path } = config;
  return `http://${host}:${port}${path}${endpoint}`;
}

  export {
    is,
    forEachKey,
    xor,
    isJsonSafePrimitive,
    createURL,
    getReferences,
    applyReferences,
    getAllAssertions,
  };
