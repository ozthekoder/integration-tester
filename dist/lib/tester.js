'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('bluebird');
var glob = require('glob');
var tape = require('tape');
var fs = require('fs');
var converter = require('tap-xunit');
var PluginManager = require('./plugin-manager');
var Runner = require('./runner');
var Parser = require('./parser');
var chain = require('./async');
var defaults = require('./config/config.json');
var validation = require('./config/constants.json').validation;
var Utility = require('./utility');

var is = Utility.is;
var forEachKey = Utility.forEachKey;
var xor = Utility.xor;
var isJsonSafePrimitive = Utility.isJsonSafePrimitive;
var generateAssertions = Utility.generateAssertions;
var getAllAssertions = Utility.getAllAssertions;
var countAssertions = Utility.countAssertions;


module.exports = function () {
  function Tester() {
    var tests = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var config = arguments.length <= 1 || arguments[1] === undefined ? defaults : arguments[1];

    _classCallCheck(this, Tester);

    this.config = Object.assign(defaults, config);
    this.pluginManager = new PluginManager();
    this.tests = tests;
    this.runner = new Runner(this.pluginManager);
    this.parser = new Parser(validation);
    this.consoleStream = null;
    this.reportStream = null;
    this.tapToXUnitConverter = converter();
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
      this.consoleStream = tape.createStream();
      this.consoleStream.pipe(process.stdout);
    }
  }, {
    key: 'report',
    value: function report() {
      var writeStream = fs.createWriteStream(this.config.output.report);
      this.reportStream = tape.createStream();
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

      return new Promise(function (resolve, reject) {
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
      return chain(tests);
    }
  }]);

  return Tester;
}();