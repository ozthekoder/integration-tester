'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Promise = require('bluebird');
var Reactor = require('./reactor');
var Plugin = require('../plugin');
var i = require('./interface.json');

var KafkaPlugin = function (_Plugin) {
  _inherits(KafkaPlugin, _Plugin);

  function KafkaPlugin(config) {
    _classCallCheck(this, KafkaPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KafkaPlugin).call(this));

    _this.config = config;
    _this.interface = i;
    return _this;
  }

  _createClass(KafkaPlugin, [{
    key: 'initialize',
    value: function initialize() {
      this.reactor = new Reactor();
      return this.reactor.initialize();
    }
  }, {
    key: 'subscribe',
    value: function subscribe(topic, waitFor) {
      var _this2 = this;

      var parse = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var addTopics = this.addTopicsToConsumer.bind(this, [topic]);
      return new Promise(function (resolve, reject) {
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

      return new Promise(function (resolve, reject) {
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
}(Plugin);

KafkaPlugin.type = 'kafka';
module.exports = KafkaPlugin;