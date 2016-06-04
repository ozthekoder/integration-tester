'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tapXunit = require('tap-xunit');

var _tapXunit2 = _interopRequireDefault(_tapXunit);

var _pluginManager = require('./plugin-manager');

var _pluginManager2 = _interopRequireDefault(_pluginManager);

var _runner = require('./runner');

var _runner2 = _interopRequireDefault(_runner);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _async = require('./async');

var _async2 = _interopRequireDefault(_async);

var _config = require('./config/config.json');

var _config2 = _interopRequireDefault(_config);

var _constants = require('./config/constants.json');

var _utility = require('./utility');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tester = function () {
  function Tester() {
    var tests = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var config = arguments.length <= 1 || arguments[1] === undefined ? _get__('defaults') : arguments[1];

    _classCallCheck(this, Tester);

    this.config = Object.assign(_get__('defaults'), config);
    this.pluginManager = new (_get__('PluginManager'))();
    this.tests = tests;
    this.runner = new (_get__('Runner'))(this.pluginManager);
    this.parser = new (_get__('Parser'))(_get__('validation'));
    this.consoleStream = null;
    this.reportStream = null;
    this.tapToXUnitConverter = _get__('converter')();
  }

  _createClass(Tester, [{
    key: 'startStreams',
    value: function startStreams() {
      var _this = this;

      var streams = Object.keys(this.config.output);
      streams.forEach(function (outputType) {
        return _this.config.output[outputType] ? _this[outputType].call(_this) : false;
      });
    }
  }, {
    key: 'console',
    value: function console() {
      this.consoleStream = _get__('tape').createStream();
      this.consoleStream.pipe(process.stdout);
    }
  }, {
    key: 'report',
    value: function report() {
      var writeStream = _get__('fs').createWriteStream(this.config.output.report);
      this.reportStream = _get__('tape').createStream();
      this.reportStream.pipe(this.tapToXUnitConverter).pipe(writeStream);
    }
  }, {
    key: 'registerNativePlugins',
    value: function registerNativePlugins(ops) {
      var plugins = this.config.plugins;

      var pluginsForOps = ops.reduce(function (prev, current) {
        prev[current.$plugin] = true;
        return prev;
      }, {});
      Object.keys(plugins).filter(function (plugin) {
        return pluginsForOps[plugin];
      }).map(function (key) {
        return require(plugins[key].file);
      }).map(function (Plugin) {
        return new Plugin(plugins[Plugin.type]);
      }).map(this.registerPlugin.bind(this));
    }
  }, {
    key: 'registerPlugin',
    value: function registerPlugin(plugin) {
      this.pluginManager.registerPlugin(plugin);
    }
  }, {
    key: 'prepare',
    value: function prepare() {
      var _this2 = this;

      return new (_get__('Promise'))(function (resolve, reject) {
        _this2.tests = Array.isArray(_this2.tests) ? _this2.tests : [_this2.tests];
        var ops = _this2.tests.map(_this2.parser.parse.bind(_this2.parser)).reduce(function (prev, current) {
          return [].concat(_toConsumableArray(prev), _toConsumableArray(current));
        }, []);
        var assertionCount = _this2.runner.plan(ops);

        _this2.registerNativePlugins(ops);
        _this2.pluginManager.initializePlugins().then(function () {
          _this2.startStreams();
          _this2.runner.createTestHarness(assertionCount, null, function (t) {
            resolve(_this2.runner.prepare(ops));
          });
        });
      });
    }
  }, {
    key: 'test',
    value: function test(tests) {
      return _get__('chain')(tests);
    }
  }]);

  return Tester;
}();

exports.default = Tester;
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
    case 'defaults':
      return _config2.default;

    case 'PluginManager':
      return _pluginManager2.default;

    case 'Runner':
      return _runner2.default;

    case 'Parser':
      return _parser2.default;

    case 'validation':
      return _constants.validation;

    case 'converter':
      return _tapXunit2.default;

    case 'tape':
      return _tape2.default;

    case 'fs':
      return _fs2.default;

    case 'Promise':
      return _bluebird2.default;

    case 'chain':
      return _async2.default;
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

var _typeOfOriginalExport = typeof Tester === 'undefined' ? 'undefined' : _typeof(Tester);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(Tester, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(Tester)) {
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
//# sourceMappingURL=tester.js.map