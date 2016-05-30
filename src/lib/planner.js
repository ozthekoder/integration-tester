import Promise from 'bluebird';
import Parser from './parser';

export default class Planner {
  constructor() {
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

};
