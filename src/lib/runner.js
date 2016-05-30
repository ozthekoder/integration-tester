const OHCMPlugin = require('./plugins/ohcm');
const KafkaPlugin = require('./plugins/kafka')
const HttpPlugin = require('./plugins/http');
const WaitPlugin = require('./plugins/wait');
const { BASE_URL } = require('./config/constants.json');


export default class Runner {
  constructor(helper) {
    this.helper = helper;
  }

  run(t, blueprint) {
    t.comment(blueprint.title);
    return this.helper.chainPromises(
      blueprint.cases
      .map((testCase) => this.runCase.bind(this, t, testCase))
    );
  }

  runCase(t, testCase) {
    t.comment(testCase.title);
    return this.executeBefore(testCase)
    .then(this.executeTest(testCase))
    .catch(this.checkForHTTPError)
    .then((payload) => this.runAssertions(payload, testCase, t))
    .then(this.executeAfter(testCase))
    .catch((err) => {
      throw err;
    });
  }

  checkForHTTPError(err) {
    const { status, response } = err;
    if (status && status >= 300) {
      return response;
    } else {
      throw err;
    }
  }

  runAssertions(payload, testCase, t) {
    const { expect } = testCase;
    const tests = this.helper.getAllTests(payload, expect);
    tests.forEach(test => t[test.assertion].call(t, test.actual, test.expectation, test.log));
    return testCase;
  }

  executeBefore(testCase) {
    const todos = testCase.before;
    const asyncOps = [];

    for(let i = 0; i < todos.length; i++) {
      let { args, operation, type } = todos[i];
      args = Array.isArray(args) ? args : [args];
      asyncOps.push(this.helper.call(type, operation, args));
    }

    return this.helper.chainPromises(asyncOps);
  }

  executeTest(testCase) {
    return this.helper.call(testCase.type, testCase.action, [testCase.endpoint, testCase.headers, testCase.body]);
  }

  executeAfter(testCase) {
    const todos = testCase.after;
    const asyncOps = [];

    for(let i = 0; i < todos.length; i++) {
      let { args, operation, type } = todos[i];

      args = Array.isArray(args) ? args : [args];
      asyncOps.push(this.helper.call(type, operation, args));
    }
    return this.helper.chainPromises(asyncOps);
  }
};

