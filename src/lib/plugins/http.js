const superagent = require('superagent');
const saaspromised = require('superagent-as-promised');
const Plugin = require('./plugin');
const Promise = require('bluebird');

saaspromised(superagent);

module.exports = class HttpPlugin extends Plugin {
  constructor() {
    super('http');
  }

  initialize() {
    return Promise.resolve(this);
  }

  get(endpoint, headers = {}) {
    const { session } = this.context;

    if (session.cookie) {
      headers.cookie = session.cookie;
    }

    if (session.userToken) {
      headers['x-ohcm-user'] = session.userToken;
    }

    return superagent
    .get(`${this.context.createURL(endpoint)}`)
    .set(headers);
  }

  post(endpoint, headers = {}, body = {}) {
    const { session } = this.context;

    if (session.cookie) {
      headers.cookie = session.cookie;
    }

    if (session.userToken) {
      headers['x-ohcm-user'] = session.userToken;
    }

    return superagent
    .post(`${this.context.createURL(endpoint)}`)
    .set(headers)
    .send(body);
  }

  put(endpoint, headers = {}, body = {}) {
    const { session } = this.context;

    if (session.cookie) {
      headers.cookie = session.cookie;
    }

    if (session.userToken) {
      headers['x-ohcm-user'] = session.userToken;
    }

    return superagent
    .put(`${this.context.createURL(endpoint)}`)
    .set(headers)
    .send(body);

  }

  delete(endpoint, headers = {}) {
    const { session } = this.context;
    if (session.cookie) {
      headers.cookie = session.cookie;
    }

    if (session.userToken) {
      headers['x-ohcm-user'] = session.userToken;
    }

    return superagent
    .del(`${this.context.createURL(endpoint)}`)
    .set(headers);
  }
}
