const superagent = require('superagent');
const saaspromised = require('superagent-as-promised');
import { createURL } from '../../utility';
const Plugin = require('../plugin');
const Promise = require('bluebird');
const i = require('./interface.json');

saaspromised(superagent);

module.exports = class HttpPlugin extends Plugin {
  constructor() {
    super('http');
    this.interface = i;
  }

  initialize() {
    return Promise.resolve(this);
  }

  get(endpoint, headers = {}) {
    const { session } = this.context;

    Object
    .keys(session)
    .forEach((k) => headers[k] = session[k]);

    return superagent
    .get(`${createURL(endpoint)}`)
    .set(headers);
  }

  post(endpoint, headers = {}, body = {}) {
    const { session } = this.context;

    Object
    .keys(session)
    .forEach((k) => headers[k] = session[k]);

    return superagent
    .post(`${createURL(endpoint)}`)
    .set(headers)
    .send(body);
  }

  put(endpoint, headers = {}, body = {}) {
    const { session } = this.context;

    Object
    .keys(session)
    .forEach((k) => headers[k] = session[k]);

    return superagent
    .put(`${createURL(endpoint)}`)
    .set(headers)
    .send(body);

  }

  delete(endpoint, headers = {}) {
    const { session } = this.context;

    Object
    .keys(session)
    .forEach((k) => headers[k] = session[k]);

    return superagent
    .del(`${createURL(endpoint)}`)
    .set(headers);
  }
}
