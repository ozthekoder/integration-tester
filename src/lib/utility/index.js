const is =  (function toType(global) {
  return function(obj) {
    if (obj === global) {
      return "global";
    }
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  }
})(global);

const forEachKey = function(obj, cb) {
  if(obj && is(obj) === 'object') {
    const keys = Object.keys(obj);
    let i;
    for(i=0; i<keys.length; i++) {
      cb(keys[i], i, keys);
    }
  }
}

const xor = function(predicates) {
  return predicates
  .reduce((prev, predicate) => ( ( prev && !predicate ) || ( !prev && predicate ) ), false);
}

export { is, forEachKey, xor };
