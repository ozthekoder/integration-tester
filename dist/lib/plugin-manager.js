'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('bluebird');

module.exports = function () {
  function PluginManager() {
    _classCallCheck(this, PluginManager);

    this.session = {};
    this.plugins = {};
    this.saved = {};
  }

  _createClass(PluginManager, [{
    key: 'registerPlugin',
    value: function registerPlugin(plugin) {
      if (!this.plugins[plugin.type]) {
        plugin.register(this);
        this.plugins[plugin.type] = plugin;
      }
    }
  }, {
    key: 'initializePlugins',
    value: function initializePlugins() {
      var _this = this;

      var initCalls = Object.keys(this.plugins).map(function (plugin) {
        return _this.plugins[plugin].initialize();
      });
      return Promise.all(initCalls);
    }
  }, {
    key: 'execute',
    value: function execute(plugin, operation, args) {
      var _p$operation;

      var p = this.plugins[plugin];
      return (_p$operation = p[operation]).call.apply(_p$operation, [p].concat(_toConsumableArray(args)));
    }
  }, {
    key: 'saveRefs',
    value: function saveRefs(refs) {
      this.saved = Object.assign(this.saved, refs);
    }
  }]);

  return PluginManager;
}();
//# sourceMappingURL=plugin-manager.js.map