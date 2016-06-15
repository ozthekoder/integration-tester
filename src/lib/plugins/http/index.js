const createURL = require('../../utility').createURL;
const superagent = require('superagent');
const saaspromised = require('superagent-as-promised');
const Plugin = require('../plugin');
const Promise = require('bluebird');
const i = require('./interface.json');

saaspromised(superagent);

class HttpPlugin extends Plugin {
  constructor(config) {
    super();
    this.config = config;
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
    .get(`${createURL(endpoint, this.config)}`)
    .set(headers);
  }

  post(endpoint, headers = {}, body = {}) {
    const { session } = this.context;

    Object
    .keys(session)
    .forEach((k) => headers[k] = session[k]);

    return superagent
    .post(`${createURL(endpoint, this.config)}`)
    .set(headers)
    .send(body);
  }

  put(endpoint, headers = {}, body = {}) {
    const { session } = this.context;

    Object
    .keys(session)
    .forEach((k) => headers[k] = session[k]);

    return superagent
    .put(`${createURL(endpoint, this.config)}`)
    .set(headers)
    .send(body);

  }

  delete(endpoint, headers = {}) {
    const { session } = this.context;

    Object
    .keys(session)
    .forEach((k) => headers[k] = session[k]);

    return superagent
    .del(`${createURL(endpoint, this.config)}`)
    .set(headers);
  }
};

HttpPlugin.type = 'http';
module.exports = HttpPlugin;
