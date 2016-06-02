const Promise = require('bluebird');
const Plugin = require('../plugin');
const i = require('./interface.json');

module.exports = class WaitPlugin extends Plugin {
  constructor() {
    super('wait');
    this.interface = i;
  }

  initialize() {
    return Promise.resolve(this);
  }

  wait(seconds) {
    return new Promise((resolve) => {
      setTimeout(resolve.bind(null, seconds), (seconds * 1000));
    });
  }

}
