'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

      (0, _tape2.default)(log ? log : 'Planning the operations..', function (t) {
        _this.harness = t;
        _this.harness.plan(assertionCount);
        cb(t);
      });
    }
  }, {
    key: 'plan',
    value: function plan(ops) {
      return ops.map(function (op) {
        return op.$payload.$expect ? op.$payload.$expect.length : 0;
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
      //op = applyReferences(op);
      var $args = op.$args;
      var $op = op.$op;
      var $plugin = op.$plugin;
      var $timeout = op.$timeout;

      return new Promise(function (resolve, reject) {
        var result = _this3.pluginManager.execute($plugin, $op, $args).catch(_this3.checkForHTTPError).then(function (response) {
          _this3.harness.pass($plugin + '.' + $op + ' successfully completed');
          return response;
        }).then(_this3.runAssertions.bind(_this3, op))
        //.then(this.saveRefs.bind(this, op))
        .then(resolve).catch(reject);

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

      if (op.$payload && op.$payload.$expect) {
        var $expect = op.$payload.$expect;

        var tests = (0, _utility.getAllAssertions)(payload, $expect);
        tests.forEach(function (test) {
          return _this4.harness[test.assertion].call(_this4.harness, test.actual, test.expectation, test.log);
        });
      }
      return payload;
    }
  }, {
    key: 'saveRefs',
    value: function saveRefs(op, payload) {
      var $save = op.$payload.$save;

      if ($save) {
        var refs = (0, _utility.getReferences)(payload, $save);
        this.pluginManager.saveRefs(refs);
      }
      return payload;
    }
  }]);

  return Runner;
}();

exports.default = Runner;
;
//# sourceMappingURL=runner.js.map