'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllAssertions = exports.applyReferences = exports.getReferences = exports.createURL = exports.isJsonSafePrimitive = exports.xor = exports.forEachKey = exports.is = undefined;

var _config = require('../config/config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var is = function toType(global) {
  return function (obj) {
    if (obj === global) {
      return "global";
    }
    return {}.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  };
}(global);

var forEachKey = function forEachKey(obj, cb) {
  if (obj && is(obj) === 'object') {
    var keys = Object.keys(obj);
    var i = void 0;
    for (i = 0; i < keys.length; i++) {
      cb(keys[i], i, keys);
    }
  }
};

var xor = function xor(predicates) {
  return predicates.reduce(function (prev, predicate) {
    return prev && !predicate || !prev && predicate;
  }, false);
};

var isJsonSafePrimitive = function isJsonSafePrimitive(value) {
  return typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
};

var getAllAssertions = function getAllAssertions(payload, assertions) {
  return assertions.map(function (assertion) {
    return {
      expectation: assertion.$value,
      assertion: assertion.$assert,
      log: assertion.$path.join('.') + ' should be ' + assertion.$assert + ' to ' + assertion.$value,
      actual: assertion.$path.reduce(function (prev, next) {
        return prev[next];
      }, payload)
    };
  });
};

var getReferences = function getReferences(actual, toSave) {
  var refs = {};

  if (toSave && is(toSave) === 'string' && toSave.indexOf('___#') === 0 && toSave.indexOf('#___') === toSave.length - 4) {
    toSave = toSave.slice(4, -4);
    refs[toSave] = actual;
  } else if (toSave && actual && (is(toSave) === 'object' || is(toSave) === 'array')) {
    var keys = Object.keys(toSave);
    var length = keys.length;

    for (var i = 0; i < length; i++) {
      refs = Object.assign(refs, getReferences(actual ? actual[keys[i]] : null, toSave[keys[i]]));
    }
  }
  return refs;
};

var applyReferences = function applyReferences(saved, op) {

  var tpl = JSON.stringify(op);
  var pieces = tpl.split(/(\"\$\{[\s]*.*?[\s]*\}\")/g);
  var inflated = pieces.map(function (p) {
    if (/(\"\$\{[\s]*.*?[\s]*\}\")/g.test(p)) {
      var fromSaved = saved[p.slice(3, -2)];

      if (is(fromSaved) === 'array' || is(fromSaved) === 'object') {
        fromSaved = JSON.stringify(fromSaved);
      } else if (is(fromSaved) === 'string') {
        fromSaved = '"' + fromSaved + '"';
      }
      p = fromSaved;
    }

    return p;
  }).reduce(function (prev, current) {
    return '' + prev + current;
  }, '');

  pieces = inflated.split(/(\$\{[\s]*.*?[\s]*\})/g);
  inflated = pieces.map(function (p) {
    if (/(\$\{[\s]*.*?[\s]*\})/g.test(p)) {
      var fromSaved = saved[p.slice(2, -1)];

      if (is(fromSaved) === 'array' || is(fromSaved) === 'object') {
        fromSaved = JSON.stringify(fromSaved);
      }
      p = fromSaved;
    }

    return p;
  }).reduce(function (prev, current) {
    return '' + prev + current;
  }, '');
  return JSON.parse(inflated);
};

var createURL = function createURL(endpoint) {
  var config = arguments.length <= 1 || arguments[1] === undefined ? _config2.default.plugins.http : arguments[1];
  var host = config.host;
  var port = config.port;
  var path = config.path;

  return 'http://' + host + ':' + port + path + endpoint;
};

exports.is = is;
exports.forEachKey = forEachKey;
exports.xor = xor;
exports.isJsonSafePrimitive = isJsonSafePrimitive;
exports.createURL = createURL;
exports.getReferences = getReferences;
exports.applyReferences = applyReferences;
exports.getAllAssertions = getAllAssertions;
//# sourceMappingURL=index.js.map