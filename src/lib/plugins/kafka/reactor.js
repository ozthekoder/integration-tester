const kafka = require('kafka-node');
const Promise = require('bluebird');
const onDeath = require('death');
const cfg = require('../../config/constants.json').kafka;
let _topics = {};

module.exports = class Reactor {
  static get topics() { return _topics; }
  static set topics(topics) { _topics = topics }

  constructor(config=cfg.empty) {
    try {
      this.config = config;
      this.client = new kafka.Client(`${config.host}:${config.port}`);
      this.offset = new kafka.Offset(this.client);
      this.consumer = this.getConsumer();
      this.producer = this.getProducer();
      this.waitingFor = {};
      this.producer.on('error', (err) => {
        console.log(err);
      });
    } catch (err) {
      throw err;
    }
  }

  initialize() {
    this.consumer.on('message', this.onMessage.bind(this));
    return new Promise((resolve, reject) => {
      this.producer.on('ready', () => { resolve(true) });
    });
  }

  closeConnection() {
    return new Promise((resolve, reject) => {
      this.client.close(resolve);
    });
  }

  getConsumer(topics = this.config.topics, groupId = this.config.groupId) {
    const autoCommit = false, encoding = 'utf8';

    topics.forEach((t) => {
      t = { topic: t };
    });
    const consumer = new kafka.Consumer(this.client, topics, {groupId, encoding, autoCommit});
    onDeath(this.onExit.bind(this, consumer, this.closeConnection.bind(this)));

    return consumer;
  }

  onExit(consumer, close) {
    consumer.close(true, function(){
      close().then(process.exit)
    });
  }

  getProducer() {
    try {
      return new kafka.Producer(this.client);
    } catch (err) {
      throw err;
    }
  }

  consumeMessage(message) {
    this.commitMessage(message);
  }

  subscribe(topic, waitFor, cb) {
    this.waitingFor[topic] = {
      value: waitFor.value,
      cb
    };
  }

  unsubscribe(topic) {
    this.waitingFor[topic] = null;
  }

  onMessage(message) {
    const waitItem = this.waitingFor[message.topic];
    if(waitItem && waitItem.value === message.value) {
      this.unsubscribe(message.topic);
      waitItem.cb(message);
    }
    this.commitMessage(message);
  }

  createTopics(topics) {
    return new Promise((resolve, reject) => {
      const topicsToCreate = topics.filter((topic) => !_topics[topic])
      if(topicsToCreate.length) {
        this.producer.createTopics(topicsToCreate, false, (err, data) => {
          if(err) {
            reject(err);
          }
          topicsToCreate.forEach((topic) => _topics[topic] = 'created');
          resolve(data);
        });
      } else {
        resolve(topics);
      }
    });
  }

  addTopicsToConsumer(topics) {
    const topicsToAdd = topics.filter((topic) => _topics[topic] !== 'added')
    return new Promise((resolve, reject) => {
      if(topicsToAdd.length) {
        this.consumer.addTopics(topicsToAdd, (err, added) => {
          if(err) {
            reject(err);
          }
          topicsToAdd.forEach((topic) => _topics[topic] = 'added');
          resolve(added);
        });
      } else {
        resolve(topics);
      }
    });
  }

  removeTopicsFromConsumer(topics) {
    const topicsToRemove = topics.filter((topic) => _topics[topic] === 'added')

    return new Promise((resolve, reject) => {
      this.consumer.removeTopics(topics, (err, removed) => {
        if(err) {
          reject(err);
        }
          topicsToRemove.forEach((topic) => _topics[topic] = null);

        resolve(removed);
      });
    });
  }


  commitMessage(msg, topics, groupId) {
    topics = topics || this.config.topics;
    groupId = groupId || this.config.groupId;
    const messageOffset = msg.offset;
    const message = Array.from(topics, t => {
      return {topic: t, partition: 0, offset: messageOffset};
    });

    return new Promise((resolve, reject) => {
      this.offset.commit(groupId, message, (err) => {
        if (err) {
          reject(err);
        }
        resolve(null);
      });
    });
  }
}
