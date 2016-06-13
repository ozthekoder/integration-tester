'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createURL = require('../../utility').createURL;
var superagent = require('superagent');
var saaspromised = require('superagent-as-promised');
var Plugin = require('../plugin');
var Promise = require('bluebird');
var i = require('./interface.json');

saaspromised(superagent);

var HttpPlugin = function (_Plugin) {
  _inherits(HttpPlugin, _Plugin);

  function HttpPlugin(config) {
    _classCallCheck(this, HttpPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HttpPlugin).call(this));

    _this.config = config;
    _this.interface = i;
    return _this;
  }

  _createClass(HttpPlugin, [{
    key: 'initialize',
    value: function initialize() {
      return Promise.resolve(this);
    }
  }, {
    key: 'get',
    value: function get(endpoint) {
      var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var session = this.context.session;


      Object.keys(session).forEach(function (k) {
        return headers[k] = session[k];
      });

      return superagent.get('' + createURL(endpoint, this.config)).set(headers);
    }
  }, {
    key: 'post',
    value: function post(endpoint) {
      var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var body = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      var session = this.context.session;


      Object.keys(session).forEach(function (k) {
        return headers[k] = session[k];
      });

      return superagent.post('' + createURL(endpoint, this.config)).set(headers).send(body);
    }
  }, {
    key: 'put',
    value: function put(endpoint) {
      var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var body = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      var session = this.context.session;


      Object.keys(session).forEach(function (k) {
        return headers[k] = session[k];
      });

      return superagent.put('' + createURL(endpoint, this.config)).set(headers).send(body);
    }
  }, {
    key: 'delete',
    value: function _delete(endpoint) {
      var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var session = this.context.session;


      Object.keys(session).forEach(function (k) {
        return headers[k] = session[k];
      });

      return superagent.del('' + createURL(endpoint, this.config)).set(headers);
    }
  }]);

  return HttpPlugin;
}(Plugin);

;

HttpPlugin.type = 'http';
module.exports = HttpPlugin;