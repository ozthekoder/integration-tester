'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  function Tester(file) {
    _classCallCheck(this, Tester);

    this.tests = [file.test];
    this.config = Object.assign({}, _config2.default, file.config);
    this.pluginManager = new _pluginManager2.default();
    this.runner = new _runner2.default(this.pluginManager);
    this.parser = new _parser2.default(_constants.validation);
    this.consoleStream = null;
    this.reportStream = null;
    this.tapToXUnitConverter = (0, _tapXunit2.default)();
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
      this.consoleStream = _tape2.default.createStream();
      this.consoleStream.pipe(process.stdout);
    }
  }, {
    key: 'report',
    value: function report() {
      var writeStream = _fs2.default.createWriteStream(this.config.output.report);
      this.reportStream = _tape2.default.createStream();
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
        return !plugin.file;
      }).filter(function (plugin) {
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

      return new _bluebird2.default(function (resolve, reject) {
        _this2.tests = Array.isArray(_this2.tests) ? _this2.tests : [_this2.tests];
        var ops = _this2.tests.map(_this2.parser.parse.bind(_this2.parser)).reduce(function (prev, current) {
          return [].concat(_toConsumableArray(prev), _toConsumableArray(current));
        }, []);
        var assertionCount = _this2.runner.plan(ops);

        _this2.registerNativePlugins(ops);
        console.log(_this2.pluginManager.plugins);
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
      return (0, _async2.default)(tests);
    }
  }]);

  return Tester;
}();

exports.default = Tester;
;
//# sourceMappingURL=tester.js.map