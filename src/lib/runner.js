import {
  is,
  forEachKey,
  xor,
  isJsonSafePrimitive,
  generateAssertions,
  getAllAssertions,
  countAssertions
} from './utility';
import tape from 'tape';
import chain from './async'

export default class Runner {
  constructor(pluginManager) {
    this.pluginManager = pluginManager;
    this.harness = null;
  }

  createTestHarness(assertionCount, log, cb) {
    tape(log ? log : 'Planning the operations..', (t) => {
      this.harness = t;
      this.harness.plan(assertionCount);
      cb(t);
    });
  }

  plan(ops) {
    return ops
    .map((op) => countAssertions(op.$payload.$expect))
    .reduce((prev, current) => prev + current, ops.length)
  }

  prepare(ops) {
    this.harness.comment(`Running the operations`);
    return ops.map((op) => this.runOperation.bind(this, op));
  }

  runOperation(op) {
    this.harness.comment(op.$log);
    let { $args, $op, $plugin, $timeout } = op;
    return new Promise((resolve, reject) => {
    const result = this.pluginManager.execute($plugin, $op, $args)
    .catch(this.checkForHTTPError)
    .then((response) => {
      this.harness.pass(`${$plugin}.${$op} successfully returned`);
      console.log(response.body);
      return response;
    })
    .then(this.runAssertions.bind(this, op))
    .then(resolve)
    .catch((err) => {
      reject(err);
    });

    setTimeout(reject.bind(null, new Error('Async Operation timed out')), $timeout);
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

  runAssertions(op, payload) {
    const { $expect } = op.$payload;
    const tests = getAllAssertions(payload, $expect);
    tests.forEach(test => this.harness[test.assertion].call(this.harness, test.actual, test.expectation, test.log));
    return true;
  }
};

