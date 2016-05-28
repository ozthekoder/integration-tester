const Promise = require('bluebird');
const Plugin = require('./plugin');

module.exports = class WaitPlugin extends Plugin {
  constructor() {
    super('wait');
  }

  initialize() {
    return Promise.resolve(this);
  }

  wait(seconds) {
    this.context.harness.comment(`Started waiting for ${seconds} seconds...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.context.harness.comment(`Waited ${seconds} seconds`);
        resolve();
      }, (seconds * 1000));
    });
  }

}
