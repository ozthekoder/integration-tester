const Plugin = require('./plugin');
const Promise = require('bluebird');
const { endpoints, BASE_URL } = require('../config/constants.json');

module.exports = class OHCMPlugin extends Plugin {
  constructor() {
    super('ohcm', ['http']);
  }

  initialize() {
    return Promise.resolve(this);
  }

  checkHealth(serviceURL) {
    return this.context.call('http', 'get', [`${serviceURL}health`, { 'content-type': 'application/json'}])()
    .then((res) => {
      if (res.statusCode === 200) {
        return true;
      }

      return false;
    })
    .catch((err) => {
      this.context.harness.fail(err.message);
    });
  }

  ping(serviceURL) {
    return this.context.call('http', 'get', [`${serviceURL}ping`, { 'content-type': 'application/json'}])()
    .then((res) => {

      if (res.statusCode === 200) {
        return true;
      }

      return false;
    })
    .catch((err) => {
      this.context.harness.fail(err.message);
    });

  }

  login(user) {
    return this.context.call('http', 'get', [`/api/user-token-service/v1/users/${user}/tokens/testToken`, { 'content-type': 'application/json'}])()
    .then((res) => {
      this.context.session.userToken = res.body.userToken;
      return res.body;
    })
    .catch((err) => {
      this.context.harness.fail(err.message);
    });
  }

  logout() {
    return this.context.call('http', 'get', [endpoints.logout])()
    then((payload) => {
      return payload;
    })
    .catch((err) => {
      this.context.harness.fail(err.message);
    });
  }

  configure(config) {
    return this.context.call('http', 'post', [endpoints.auth_config, { 'content-type': 'application/json' }, config])()
    then((payload) => {
      return payload;
    })
    .catch((err) => {
      this.context.harness.fail(err.message);
    });

  }
}
