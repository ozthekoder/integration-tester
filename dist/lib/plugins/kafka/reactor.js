'use strict';

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
      return _topics;
    },
    set: function set(topics) {
      _topics = topics;
    }
  }]);

  function Reactor() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? cfg.empty : arguments[0];

    _classCallCheck(this, Reactor);

    try {
      this.config = config;
      this.client = new kafka.Client(config.host + ':' + config.port);
      this.offset = new kafka.Offset(this.client);
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
      return new Promise(function (resolve, reject) {
        _this.producer.on('ready', function () {
          resolve(true);
        });
      });
    }
  }, {
    key: 'closeConnection',
    value: function closeConnection() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
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
      var consumer = new kafka.Consumer(this.client, topics, { groupId: groupId, encoding: encoding, autoCommit: autoCommit });
      onDeath(this.onExit.bind(this, consumer, this.closeConnection.bind(this)));

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
        return new kafka.Producer(this.client);
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

      return new Promise(function (resolve, reject) {
        var topicsToCreate = topics.filter(function (topic) {
          return !_topics[topic];
        });
        if (topicsToCreate.length) {
          _this3.producer.createTopics(topicsToCreate, false, function (err, data) {
            if (err) {
              reject(err);
            }
            topicsToCreate.forEach(function (topic) {
              return _topics[topic] = 'created';
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
        return _topics[topic] !== 'added';
      });
      return new Promise(function (resolve, reject) {
        if (topicsToAdd.length) {
          _this4.consumer.addTopics(topicsToAdd, function (err, added) {
            if (err) {
              reject(err);
            }
            topicsToAdd.forEach(function (topic) {
              return _topics[topic] = 'added';
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
        return _topics[topic] === 'added';
      });

      return new Promise(function (resolve, reject) {
        _this5.consumer.removeTopics(topics, function (err, removed) {
          if (err) {
            reject(err);
          }
          topicsToRemove.forEach(function (topic) {
            return _topics[topic] = null;
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

      return new Promise(function (resolve, reject) {
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