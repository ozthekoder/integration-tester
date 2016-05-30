const { endpoints, BASE_URL, kafka } = require('./config/constants.json');
const Promise = require('bluebird');

export default class Planner {
  constructor() {
    this.session = {};
    this.plugins = {};
    this.harness = null;
  }

  plan(json) {
    if(Array.isArray(json.cases)) {
      return json.cases
      .map(tCase => this.countAssertionsInObject(tCase.expect))
      .reduce((prev, current) => prev + current, 0);
    } else {
      return this.countAssertionsInObject(json.expect);
    }
  }

  createTestHarness(tape, tests, log, cb) {
    tape(log ? log : 'Planning the operations..', (t) => {
      this.harness = t;
      t.plan(
        tests
        .map(test => this.plan(test))
        .reduce((prev, current) => prev + current, 0)
      );
      cb(t);
    });
  }

  isJsonSafePrimitive(value) {
    return (
      typeof value === 'number' ||
        typeof value === 'string' ||
        typeof value === 'boolean'
    );
  }

  generateAssertions(json, path='payload') {
    const keys = Object.keys(json);
    const length = keys.length;
    const assert = 'equal';
    let expect = {};
    let log;
    for(let i = 0; i < length; i++) {
      const key = keys[i];
      const value = json[key];
      if (this.isJsonSafePrimitive(value)) {
        log = `${path}.${key} should be ${value}`;
        expect[key] = {
          value,
          assert,
          log
        };
      } else {
        expect[key] = this.generateAssertions(value, `${path}.${key}`);
      }
    }

    return expect;
  }

  getAllTests(actual, expectation) {
    let tests = [];

    if (expectation.assert && expectation.value) {
      tests.push({
        expectation: expectation.value,
        actual: actual,
        assertion: expectation.assert,
        log: expectation.log
      });
    } else {
      const keys = Object.keys(expectation);
      const length = keys.length;

      for(var i = 0; i < length; i++) {
        tests = tests.concat(this.getAllTests((actual ? actual[keys[i]] : null), expectation[keys[i]]));
      }
    }
    return tests;
  }

  countAssertionsInObject(obj) {
    let count = 0;

    if (obj.assert && obj.value) {
      ++count;
    } else {
      const keys = Object.keys(obj);
      const length = keys.length;

      for(var i = 0; i < length; i++) {
        count += this.countAssertionsInObject(obj[keys[i]]);
      }
    }
    return count;
  }
};
