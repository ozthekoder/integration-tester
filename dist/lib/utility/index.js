'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.countAssertions = exports.getAllAssertions = exports.applyReferences = exports.getReferences = exports.generateAssertions = exports.createURL = exports.isJsonSafePrimitive = exports.xor = exports.forEachKey = exports.is = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
  if (obj && _get__('is')(obj) === 'object') {
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

var generateAssertions = function generateAssertions(json) {
  var path = arguments.length <= 1 || arguments[1] === undefined ? 'payload' : arguments[1];

  var keys = Object.keys(json);
  var length = keys.length;
  var assert = 'equal';
  var expect = {};
  var log = void 0;
  for (var i = 0; i < length; i++) {
    var key = keys[i];
    var value = json[key];
    if (undefined.isJsonSafePrimitive(value)) {
      log = path + '.' + key + ' should be ' + value;
      expect[key] = {
        value: value,
        assert: assert,
        log: log
      };
    } else {
      expect[key] = _get__('generateAssertions')(value, path + '.' + key);
    }
  }

  return expect;
};

var getAllAssertions = function getAllAssertions(actual, expectation) {
  var tests = [];

  if (expectation.$assert && expectation.$value) {
    tests.push({
      expectation: expectation.$value,
      actual: actual,
      assertion: expectation.$assert,
      log: expectation.$log
    });
  } else {
    var keys = Object.keys(expectation);
    var length = keys.length;

    for (var i = 0; i < length; i++) {
      tests = tests.concat(_get__('getAllAssertions')(actual ? actual[keys[i]] : null, expectation[keys[i]]));
    }
  }
  return tests;
};

var countAssertions = function countAssertions(obj) {
  var count = 0;

  if (obj.$assert && obj.$value) {
    ++count;
  } else {
    var keys = Object.keys(obj);
    var length = keys.length;

    for (var i = 0; i < length; i++) {
      count += _get__('countAssertions')(obj[keys[i]]);
    }
  }
  return count;
};

var getReferences = function getReferences(actual, toSave) {
  var refs = {};

  if (toSave && _get__('is')(toSave) === 'string' && toSave.indexOf('___#') === 0 && toSave.indexOf('#___') === toSave.length - 4) {
    toSave = toSave.slice(4, -4);
    refs[toSave] = actual;
  } else if (toSave && actual && (_get__('is')(toSave) === 'object' || _get__('is')(toSave) === 'array')) {
    var keys = Object.keys(toSave);
    var length = keys.length;

    for (var i = 0; i < length; i++) {
      refs = Object.assign(refs, _get__('getReferences')(actual ? actual[keys[i]] : null, toSave[keys[i]]));
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

      if (_get__('is')(fromSaved) === 'array' || _get__('is')(fromSaved) === 'object') {
        fromSaved = JSON.stringify(fromSaved);
      } else if (_get__('is')(fromSaved) === 'string') {
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

      if (_get__('is')(fromSaved) === 'array' || _get__('is')(fromSaved) === 'object') {
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
  var config = arguments.length <= 1 || arguments[1] === undefined ? _get__('defaults').plugins.http : arguments[1];
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
exports.generateAssertions = generateAssertions;
exports.getReferences = getReferences;
exports.applyReferences = applyReferences;
exports.getAllAssertions = getAllAssertions;
exports.countAssertions = countAssertions;
var _RewiredData__ = {};
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    Object.defineProperty(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  return _RewiredData__ === undefined || _RewiredData__[variableName] === undefined ? _get_original__(variableName) : _RewiredData__[variableName];
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'is':
      return is;

    case 'generateAssertions':
      return generateAssertions;

    case 'getAllAssertions':
      return getAllAssertions;

    case 'countAssertions':
      return countAssertions;

    case 'getReferences':
      return getReferences;

    case 'defaults':
      return _config2.default;
  }

  return undefined;
}

function _assign__(variableName, value) {
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
    Object.keys(variableName).forEach(function (name) {
      _RewiredData__[name] = variableName[name];
    });
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _reset__(variableName) {
  delete _RewiredData__[variableName];
}

function _with__(object) {
  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      _RewiredData__[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = _RewiredData__[variableName];
      _RewiredData__[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;
exports.default = _RewireAPI__;
//# sourceMappingURL=index.js.map