'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _customErrors = require('../utility/custom-errors');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function () {
  function Plugin() {
    var required = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, Plugin);

    this.required = required;
  }

  _createClass(Plugin, [{
    key: 'register',
    value: function register(context) {
      var _this = this;

      this.required.forEach(function (req) {
        if (!context.plugins[req]) {
          throw new _customErrors.PluginOrderError('Plugin ' + req + ' is required for ' + _this.type + ' plugin.');
        }
      });
      this.context = context;
    }
  }, {
    key: 'type',
    get: function get() {
      return this.constructor.type;
    }
  }]);

  return Plugin;
}();

;

Plugin.type = 'generic';
module.exports = Plugin;
//# sourceMappingURL=plugin.js.map