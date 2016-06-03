'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utility = require('../../lib/utility');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('Utility', function () {

  beforeEach(function () {});

  describe('is function', function () {
    it('should be defined', function () {
      expect(_get__('is')).to.be.a('function');
    });

    it('should return correct string for any type', function () {
      var Fuckery = function Fuckery() {
        _classCallCheck(this, Fuckery);
      };

      ;

      var fuckery = new Fuckery();
      var map = new Map();
      var set = new Set();

      expect(_get__('is')(123)).to.equal('number');
      expect(_get__('is')('foo')).to.equal('string');
      expect(_get__('is')({})).to.equal('object');
      expect(_get__('is')([])).to.equal('array');
      expect(_get__('is')(fuckery)).to.equal('object');
      expect(_get__('is')(map)).to.equal('map');
      expect(_get__('is')(set)).to.equal('set');
      expect(_get__('is')(new Error())).to.equal('error');
      expect(_get__('is')(null)).to.equal('null');
      expect(_get__('is')(undefined)).to.equal('undefined');
      expect(_get__('is')(new String('haha'))).to.equal('string');
      expect(_get__('is')(global)).to.equal('global');
    });
  });

  describe('forEachKey function', function () {
    it('should be defined', function () {
      expect(_get__('forEachKey')).to.be.a('function');
    });

    it('should execute given function for each key of the object', function () {
      var obj = {
        foo: "bar",
        goo: "baz"
      };

      _get__('forEachKey')(obj, function (key, index, keys) {
        obj[key] = index;
      });

      expect(obj.foo).to.equal(0);
      expect(obj.goo).to.equal(1);
    });
  });

  describe('xor function', function () {
    it('should be defined', function () {
      expect(_get__('xor')).to.be.a('function');
    });

    it('should only return true when there is only one true and all else is false', function () {
      expect(_get__('xor')([false])).to.equal(false);
      expect(_get__('xor')([false, false])).to.equal(false);
      expect(_get__('xor')([true])).to.equal(true);
      expect(_get__('xor')([true, true])).to.equal(false);
      expect(_get__('xor')([true, false])).to.equal(true);
      expect(_get__('xor')([false, true, false, false])).to.equal(true);
    });
  });

  describe('applyReferences function', function () {
    it('should be defined', function () {
      expect(_get__('applyReferences')).to.be.a('function');
    });

    it('should apply the references properly and return a JS object', function () {
      var goo = { "qqq": "www" },
          faa = ["a", "b", "c"];
      var toSave = {
        "foo": {
          "bar": "___#zzzz#___",
          "baz": {
            "goo": "___#xxxx#___",
            "faa": "___#yyyy#___",
            "eee": ["bbb", "hhh", "___#tttt#___"],
            "rrr": {
              "ggg": "___#uuuu#___"
            }
          }
        }
      };

      var payload = {
        "foo": {
          "bar": "minagorum",
          "baz": {
            "goo": goo,
            "faa": faa,
            "eee": ["bbb", "hhh", "hohoho"],
            "rrr": {
              "ggg": "nihoha"
            }
          }
        }
      };
      var saved = _get__('getReferences')(payload, toSave);

      var op = {
        "${zzzz}": {
          "qqq": "${xxxx}",
          "www": "${yyyy}",
          "eee": ["qqqqqqq  ${tttt}  qqqqqqqq"],
          "fff": {
            "ggg": "yoo   fasdas${uuuu} adadasda"
          }
        }
      };
      var _op = {
        "minagorum": {
          "qqq": {
            "qqq": "www"
          },
          "www": ["a", "b", "c"],
          "eee": ["qqqqqqq  hohoho  qqqqqqqq"],
          "fff": {
            "ggg": "yoo   fasdasnihoha adadasda"
          }
        }
      };
      op = _get__('applyReferences')(saved, op);
      expect(op).to.deep.equal(_op);
    });
  });

  describe('getReferences function', function () {
    it('should be defined', function () {
      expect(_get__('getReferences')).to.be.a('function');
    });

    it('should collect all references from the given payload and save clause', function () {
      var goo = { "qqq": "www" },
          faa = ["a", "b", "c"];
      var toSave = {
        "foo": {
          "bar": "___#11111#___",
          "baz": {
            "goo": "___#22222#___",
            "faa": "___#33333#___"
          }
        }
      };

      var payload = {
        "foo": {
          "bar": "minagorum",
          "baz": {
            "goo": goo,
            "faa": faa
          }
        }
      };

      expect(_get__('getReferences')(payload, toSave)).to.deep.equal({
        "11111": "minagorum",
        "22222": goo,
        "33333": faa
      });
    });
  });
});
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
      return _utility.is;

    case 'forEachKey':
      return _utility.forEachKey;

    case 'xor':
      return _utility.xor;

    case 'applyReferences':
      return _utility.applyReferences;

    case 'getReferences':
      return _utility.getReferences;
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
//# sourceMappingURL=utility.spec.js.map