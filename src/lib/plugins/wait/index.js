const Promise = require('bluebird');
const Plugin = require('../plugin');
const i = require('./interface.json');

class WaitPlugin extends Plugin {
  constructor() {
    super();
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
};

WaitPlugin.type = 'wait';
module.exports = WaitPlugin;
