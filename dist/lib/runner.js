'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utility = require('./utility');

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _async = require('./async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Runner = function () {
  function Runner(pluginManager) {
    _classCallCheck(this, Runner);

    this.pluginManager = pluginManager;
    this.harness = null;
  }

  _createClass(Runner, [{
    key: 'createTestHarness',
    value: function createTestHarness(assertionCount, log, cb) {
      var _this = this;

      _get__('tape')(log ? log : 'Planning the operations..', function (t) {
        _this.harness = t;
        _this.harness.plan(assertionCount);
        cb(t);
      });
    }
  }, {
    key: 'plan',
    value: function plan(ops) {
      return ops.map(function (op) {
        return _get__('countAssertions')(op.$payload.$expect);
      }).reduce(function (prev, current) {
        return prev + current;
      }, ops.length);
    }
  }, {
    key: 'prepare',
    value: function prepare(ops) {
      var _this2 = this;

      this.harness.comment('Running the operations');
      return ops.map(function (op) {
        return _this2.runOperation.bind(_this2, op);
      });
    }
  }, {
    key: 'runOperation',
    value: function runOperation(op) {
      var _this3 = this;

      this.harness.comment(op.$log);
      op = _get__('applyReferences')(op);
      var _op = op;
      var $args = _op.$args;
      var $op = _op.$op;
      var $plugin = _op.$plugin;
      var $timeout = _op.$timeout;

      return new Promise(function (resolve, reject) {
        var result = _this3.pluginManager.execute($plugin, $op, $args).catch(_this3.checkForHTTPError).then(function (response) {
          _this3.harness.pass($plugin + '.' + $op + ' successfully completed');
          return response;
        }).then(_this3.runAssertions.bind(_this3, op)).then(_this3.saveRefs.bind(_this3, op)).then(resolve).catch(reject);

        setTimeout(reject.bind(null, new Error('Async Operation timed out')), $timeout);
      });
    }
  }, {
    key: 'checkForHTTPError',
    value: function checkForHTTPError(err) {
      var status = err.status;
      var response = err.response;

      if (status && status >= 300) {
        return response;
      } else {
        throw err;
      }
    }
  }, {
    key: 'runAssertions',
    value: function runAssertions(op, payload) {
      var _this4 = this;

      var $expect = op.$payload.$expect;

      var tests = _get__('getAllAssertions')(payload, $expect);
      tests.forEach(function (test) {
        return _this4.harness[test.assertion].call(_this4.harness, test.actual, test.expectation, test.log);
      });
      return payload;
    }
  }, {
    key: 'saveRefs',
    value: function saveRefs(op, payload) {
      var $save = op.$payload.$save;

      if ($save) {
        var refs = _get__('getReferences')(payload, $save);
        this.pluginManager.saveRefs(refs);
      }
      return payload;
    }
  }]);

  return Runner;
}();

exports.default = Runner;
;
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
    case 'tape':
      return _tape2.default;

    case 'countAssertions':
      return _utility.countAssertions;

    case 'applyReferences':
      return _utility.applyReferences;

    case 'getAllAssertions':
      return _utility.getAllAssertions;

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

var _typeOfOriginalExport = typeof Runner === 'undefined' ? 'undefined' : _typeof(Runner);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(Runner, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(Runner)) {
  addNonEnumerableProperty('__get__', _get__);
  addNonEnumerableProperty('__GetDependency__', _get__);
  addNonEnumerableProperty('__Rewire__', _set__);
  addNonEnumerableProperty('__set__', _set__);
  addNonEnumerableProperty('__reset__', _reset__);
  addNonEnumerableProperty('__ResetDependency__', _reset__);
  addNonEnumerableProperty('__with__', _with__);
  addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;
//# sourceMappingURL=runner.js.map