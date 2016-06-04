const Promise = require('bluebird');
const Reactor = require('./reactor');
const Plugin = require('../plugin');
const i = require('./interface.json');

class KafkaPlugin extends Plugin {
  constructor(config) {
    super();
    this.config = config;
    this.interface = i;
  }

  initialize() {
    this.reactor = new Reactor();
    return this.reactor.initialize();
  }

  subscribe(topic, waitFor, parse=false) {
    const addTopics = this.addTopicsToConsumer.bind(this, [topic]);
    return new Promise((resolve, reject) => {
      this.createTopics([topic])
      .then(addTopics)
      .then((added) => {
        this.reactor.subscribe(topic, waitFor, (message) => {
          this.removeTopicsFromConsumer([message.topic]);
          message.value = parse ? JSON.parse(message.value) : message.value;
          resolve(message);
        });
        this.reactor.consumer.on('error', reject);
      })
      .catch(reject);
    });
  }

  publish(payload) {
    return new Promise((resolve, reject) => {
      this.createTopics([payload.topic]).then(() => {
        this.reactor.producer.send([payload], (err, data) => {
          if(err) {
            reject(err);
          }
          resolve(data);
        });
      });
    });
  }

  createTopics(topics) {
    return this.reactor.createTopics(topics);
  }

  addTopicsToConsumer(topics) {
    return this.reactor.addTopicsToConsumer(topics);
  }

  removeTopicsFromConsumer(topics) {
    return this.reactor.removeTopicsFromConsumer(topics);
  }
}

KafkaPlugin.type = 'kafka';
module.exports = KafkaPlugin;
