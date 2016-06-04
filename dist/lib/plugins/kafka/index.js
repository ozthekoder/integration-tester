'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Promise = require('bluebird');
var Reactor = require('./reactor');
var Plugin = require('../plugin');
var i = require('./interface.json');

var KafkaPlugin = function (_get__2) {
  _inherits(KafkaPlugin, _get__2);

  function KafkaPlugin(config) {
    _classCallCheck(this, KafkaPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KafkaPlugin).call(this));

    _this.config = config;
    _this.interface = _get__('i');
    return _this;
  }

  _createClass(KafkaPlugin, [{
    key: 'initialize',
    value: function initialize() {
      this.reactor = new (_get__('Reactor'))();
      return this.reactor.initialize();
    }
  }, {
    key: 'subscribe',
    value: function subscribe(topic, waitFor) {
      var _this2 = this;

      var parse = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var addTopics = this.addTopicsToConsumer.bind(this, [topic]);
      return new (_get__('Promise'))(function (resolve, reject) {
        _this2.createTopics([topic]).then(addTopics).then(function (added) {
          _this2.reactor.subscribe(topic, waitFor, function (message) {
            _this2.removeTopicsFromConsumer([message.topic]);
            message.value = parse ? JSON.parse(message.value) : message.value;
            resolve(message);
          });
          _this2.reactor.consumer.on('error', reject);
        }).catch(reject);
      });
    }
  }, {
    key: 'publish',
    value: function publish(payload) {
      var _this3 = this;

      return new (_get__('Promise'))(function (resolve, reject) {
        _this3.createTopics([payload.topic]).then(function () {
          _this3.reactor.producer.send([payload], function (err, data) {
            if (err) {
              reject(err);
            }
            resolve(data);
          });
        });
      });
    }
  }, {
    key: 'createTopics',
    value: function createTopics(topics) {
      return this.reactor.createTopics(topics);
    }
  }, {
    key: 'addTopicsToConsumer',
    value: function addTopicsToConsumer(topics) {
      return this.reactor.addTopicsToConsumer(topics);
    }
  }, {
    key: 'removeTopicsFromConsumer',
    value: function removeTopicsFromConsumer(topics) {
      return this.reactor.removeTopicsFromConsumer(topics);
    }
  }]);

  return KafkaPlugin;
}(_get__('Plugin'));

_get__('KafkaPlugin').type = 'kafka';
module.exports = _get__('KafkaPlugin');
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
    case 'i':
      return i;

    case 'Reactor':
      return Reactor;

    case 'Promise':
      return Promise;

    case 'Plugin':
      return Plugin;

    case 'KafkaPlugin':
      return KafkaPlugin;
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