'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var kafka = require('kafka-node');
var Promise = require('bluebird');
var onDeath = require('death');
var cfg = require('../../config/constants.json').kafka;
var _topics = {};

module.exports = function () {
  _createClass(Reactor, null, [{
    key: 'topics',
    get: function get() {
      return _get__('_topics');
    },
    set: function set(topics) {
      _assign__('_topics', topics);
    }
  }]);

  function Reactor() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? _get__('cfg').empty : arguments[0];

    _classCallCheck(this, Reactor);

    try {
      this.config = config;
      this.client = new (_get__('kafka').Client)(config.host + ':' + config.port);
      this.offset = new (_get__('kafka').Offset)(this.client);
      this.consumer = this.getConsumer();
      this.producer = this.getProducer();
      this.waitingFor = {};
      this.producer.on('error', function (err) {
        console.log(err);
      });
    } catch (err) {
      throw err;
    }
  }

  _createClass(Reactor, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      this.consumer.on('message', this.onMessage.bind(this));
      return new (_get__('Promise'))(function (resolve, reject) {
        _this.producer.on('ready', function () {
          resolve(true);
        });
      });
    }
  }, {
    key: 'closeConnection',
    value: function closeConnection() {
      var _this2 = this;

      return new (_get__('Promise'))(function (resolve, reject) {
        _this2.client.close(resolve);
      });
    }
  }, {
    key: 'getConsumer',
    value: function getConsumer() {
      var topics = arguments.length <= 0 || arguments[0] === undefined ? this.config.topics : arguments[0];
      var groupId = arguments.length <= 1 || arguments[1] === undefined ? this.config.groupId : arguments[1];

      var autoCommit = false,
          encoding = 'utf8';

      topics.forEach(function (t) {
        t = { topic: t };
      });
      var consumer = new (_get__('kafka').Consumer)(this.client, topics, { groupId: groupId, encoding: encoding, autoCommit: autoCommit });
      _get__('onDeath')(this.onExit.bind(this, consumer, this.closeConnection.bind(this)));

      return consumer;
    }
  }, {
    key: 'onExit',
    value: function onExit(consumer, close) {
      consumer.close(true, function () {
        close().then(process.exit);
      });
    }
  }, {
    key: 'getProducer',
    value: function getProducer() {
      try {
        return new (_get__('kafka').Producer)(this.client);
      } catch (err) {
        throw err;
      }
    }
  }, {
    key: 'consumeMessage',
    value: function consumeMessage(message) {
      this.commitMessage(message);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(topic, waitFor, cb) {
      this.waitingFor[topic] = {
        value: waitFor.value,
        cb: cb
      };
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(topic) {
      this.waitingFor[topic] = null;
    }
  }, {
    key: 'onMessage',
    value: function onMessage(message) {
      var waitItem = this.waitingFor[message.topic];
      if (waitItem && waitItem.value === message.value) {
        this.unsubscribe(message.topic);
        waitItem.cb(message);
      }
      this.commitMessage(message);
    }
  }, {
    key: 'createTopics',
    value: function createTopics(topics) {
      var _this3 = this;

      return new (_get__('Promise'))(function (resolve, reject) {
        var topicsToCreate = topics.filter(function (topic) {
          return !_get__('_topics')[topic];
        });
        if (topicsToCreate.length) {
          _this3.producer.createTopics(topicsToCreate, false, function (err, data) {
            if (err) {
              reject(err);
            }
            topicsToCreate.forEach(function (topic) {
              return _get__('_topics')[topic] = 'created';
            });
            resolve(data);
          });
        } else {
          resolve(topics);
        }
      });
    }
  }, {
    key: 'addTopicsToConsumer',
    value: function addTopicsToConsumer(topics) {
      var _this4 = this;

      var topicsToAdd = topics.filter(function (topic) {
        return _get__('_topics')[topic] !== 'added';
      });
      return new (_get__('Promise'))(function (resolve, reject) {
        if (topicsToAdd.length) {
          _this4.consumer.addTopics(topicsToAdd, function (err, added) {
            if (err) {
              reject(err);
            }
            topicsToAdd.forEach(function (topic) {
              return _get__('_topics')[topic] = 'added';
            });
            resolve(added);
          });
        } else {
          resolve(topics);
        }
      });
    }
  }, {
    key: 'removeTopicsFromConsumer',
    value: function removeTopicsFromConsumer(topics) {
      var _this5 = this;

      var topicsToRemove = topics.filter(function (topic) {
        return _get__('_topics')[topic] === 'added';
      });

      return new (_get__('Promise'))(function (resolve, reject) {
        _this5.consumer.removeTopics(topics, function (err, removed) {
          if (err) {
            reject(err);
          }
          topicsToRemove.forEach(function (topic) {
            return _get__('_topics')[topic] = null;
          });

          resolve(removed);
        });
      });
    }
  }, {
    key: 'commitMessage',
    value: function commitMessage(msg, topics, groupId) {
      var _this6 = this;

      topics = topics || this.config.topics;
      groupId = groupId || this.config.groupId;
      var messageOffset = msg.offset;
      var message = Array.from(topics, function (t) {
        return { topic: t, partition: 0, offset: messageOffset };
      });

      return new (_get__('Promise'))(function (resolve, reject) {
        _this6.offset.commit(groupId, message, function (err) {
          if (err) {
            reject(err);
          }
          resolve(null);
        });
      });
    }
  }]);

  return Reactor;
}();
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
    case '_topics':
      return _topics;

    case 'cfg':
      return cfg;

    case 'kafka':
      return kafka;

    case 'Promise':
      return Promise;

    case 'onDeath':
      return onDeath;
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
  switch (variableName) {
    case '_topics':
      return _topics = _value;
  }

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
//# sourceMappingURL=reactor.js.map