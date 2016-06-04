'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utility = require('../../utility');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var superagent = require('superagent');
var saaspromised = require('superagent-as-promised');
var Plugin = require('../plugin');
var Promise = require('bluebird');
var i = require('./interface.json');

_get__('saaspromised')(_get__('superagent'));

var HttpPlugin = function (_get__2) {
  _inherits(HttpPlugin, _get__2);

  function HttpPlugin(config) {
    _classCallCheck(this, HttpPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HttpPlugin).call(this));

    _this.config = config;
    _this.interface = _get__('i');
    return _this;
  }

  _createClass(HttpPlugin, [{
    key: 'initialize',
    value: function initialize() {
      return _get__('Promise').resolve(this);
    }
  }, {
    key: 'get',
    value: function get(endpoint) {
      var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var session = this.context.session;


      Object.keys(session).forEach(function (k) {
        return headers[k] = session[k];
      });

      return _get__('superagent').get('' + _get__('createURL')(endpoint, this.config)).set(headers);
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

      return _get__('superagent').post('' + _get__('createURL')(endpoint, this.config)).set(headers).send(body);
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

      return _get__('superagent').put('' + _get__('createURL')(endpoint, this.config)).set(headers).send(body);
    }
  }, {
    key: 'delete',
    value: function _delete(endpoint) {
      var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var session = this.context.session;


      Object.keys(session).forEach(function (k) {
        return headers[k] = session[k];
      });

      return _get__('superagent').del('' + _get__('createURL')(endpoint, this.config)).set(headers);
    }
  }]);

  return HttpPlugin;
}(_get__('Plugin'));

;

_get__('HttpPlugin').type = 'http';
module.exports = _get__('HttpPlugin');
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
    case 'saaspromised':
      return saaspromised;

    case 'superagent':
      return superagent;

    case 'i':
      return i;

    case 'Promise':
      return Promise;

    case 'createURL':
      return _utility.createURL;

    case 'Plugin':
      return Plugin;

    case 'HttpPlugin':
      return HttpPlugin;
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

var _typeOfOriginalExport = _typeof(module.exports);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(module.exports, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(module.exports)) {
  addNonEnumerableProperty('__get__', _get__);
  addNonEnumerableProperty('__GetDependency__', _get__);
  addNonEnumerableProperty('__Rewire__', _set__);
  addNonEnumerableProperty('__set__', _set__);
  addNonEnumerableProperty('__reset__', _reset__);
  addNonEnumerableProperty('__ResetDependency__', _reset__);
  addNonEnumerableProperty('__with__', _with__);
  addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}
//# sourceMappingURL=index.js.map