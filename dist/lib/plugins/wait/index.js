'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Promise = require('bluebird');
var Plugin = require('../plugin');
var i = require('./interface.json');

var WaitPlugin = function (_Plugin) {
  _inherits(WaitPlugin, _Plugin);

  function WaitPlugin() {
    _classCallCheck(this, WaitPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WaitPlugin).call(this));

    _this.interface = i;
    return _this;
  }

  _createClass(WaitPlugin, [{
    key: 'initialize',
    value: function initialize() {
      return Promise.resolve(this);
    }
  }, {
    key: 'wait',
    value: function wait(seconds) {
      return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, seconds), seconds * 1000);
      });
    }
  }]);

  return WaitPlugin;
}(Plugin);

;

WaitPlugin.type = 'wait';
module.exports = WaitPlugin;