import TestRunner from '../../lib/test-runner';
import ActualHelper from '../../lib/helper';
let t = {},
  actualChainPromises = ActualHelper.prototype.chainPromises,
  actualCall = ActualHelper.prototype.call,
  helper = {},
  call = {},
  registerPlugin = {},
  executeTest = {},
  response = {},
  TestHelper = () => {},
  runner = {},
  bind = {},
  b = null,
  wait = {},
  login = {},
  logout = {},
  foo = 'foo',
  bar = 'bar',
  baz = 'baz',
  after = {},
  goo = 'goo',
  chainPromises = {},
  getAllTests = {},
  get = {},
  post = {},
  put = {},
  dlete = {},
  assertions = [
  { assertion: 'equal', expectation: 'b', actual: 'c'},
  { assertion: 'equal', expectation: 'e', actual: 'f'},
  { assertion: 'deepEqual', expectation: 'h', actual: 'j'}
],
test1 = require('../data/test1.json'),
  test2 = require('../data/test2.json'),
  test3 = require('../data/test3.json'),
  tests = [test1, test2, test3];

describe('TestRunner Class', () => {
  beforeEach(() => {
    response = {
      status: 200,
      body: {
        foo : 'bar'
      }
    };
    call = stub().returns(Promise.resolve(true));
    registerPlugin = stub();
    chainPromises = stub();
    getAllTests = stub().returns(assertions);
    wait = stub().resolves(true);
    login = stub().resolves(true);
    logout = stub().resolves(true);
    get = (endpoint) => {
      return Promise.resolve(endpoint);
    };
    post = stub().resolves(response);
    put = stub().resolves(response);
    dlete = stub().resolves(response);

    TestHelper = function() {
      this.chainPromises = chainPromises;
      this.getAllTests = getAllTests;
      this.registerPlugin = registerPlugin;
      this.call = call;
      this.plugins = {
        wait : { wait },
        http : { get, post, put , delete: dlete },
        ohcm : { login, logout }
      };
      helper = this;
      return this;
    };

    t = {
      comment: stub(),
      equal: stub(),
      deepEqual: stub()
    };

    TestRunner.__Rewire__('TestHelper', TestHelper);
    runner = new TestRunner(new TestHelper());
  });

  afterEach(() => {
    TestRunner.__ResetDependency__('TestHelper');
  });

  it('should be defined', () => {
    expect(TestRunner).to.be.ok;
  });

  it('can be created', () => {
    expect(runner).to.be.ok;
  });

  describe('run method', () => {

    beforeEach(() => {
      bind = stub();
      bind.onCall(0).returns(foo);
      bind.onCall(1).returns(bar);
      bind.onCall(2).returns(baz);
      bind.onCall(3).returns(goo);
      b = runner.runCase.bind;
      runner.runCase.bind = bind;
    });

    afterEach(() => {
      runner.runCase.bind = b;
    });

    it('should exist', () => {
      expect(runner.run).to.be.a('function');
    });

    it('should print the test title', () => {
      runner.run(t, test1);
      expect(t.comment).to.have.been.calledWith(test1.title);
    });

    it('should chain all async operations in the test', () => {
      runner.run(t, test2);
      expect(chainPromises).to.have.been.calledWith([foo, bar, baz, goo]);
    });
  });

  describe('runCase method', () => {

    beforeEach(() => {
      stub(runner, 'executeBefore').resolves(response);
      stub(runner, 'executeTest').resolves(response);
      stub(runner, 'executeAfter').resolves('baz');
      stub(runner, 'runAssertions').resolves(test2.cases[0]);
    });

    afterEach(() => {
      runner.executeBefore.restore();
      runner.executeTest.restore();
      runner.executeAfter.restore();
      runner.runAssertions.restore();
    });

    it('should exist', () => {
      expect(runner.runCase).to.be.a('function');
    });

    it('should log the test case title', () => {
      runner.runCase(t, test2.cases[0]);
      expect(t.comment).to.have.been.calledWith('service can be pinged')
    });

    it('should execute the before clause of the test', () => {
      runner.runCase(t, test2.cases[0]);
      expect(runner.executeBefore).to.have.been.calledWith(test2.cases[0]);
    });

    it('should execute the actual test operation', () => {
      runner.runCase(t, test2.cases[0]);
      expect(runner.executeTest).to.have.been.calledWith(test2.cases[0]);
    });

    it('should run the assertions', (done) => {
      runner.runCase(t, test2.cases[0]).then(() => {
        expect(runner.runAssertions).to.have.been.calledWith(response, test2.cases[0], t);
        done();
      });
    });

    it('should execute the after clause of the test', (done) => {
      runner.runCase(t, test2.cases[0]).then(() => {
        expect(runner.executeAfter).to.have.been.calledWith(test2.cases[0]);
        done();
      });
    });

    it('should check for http errors if an error is thrown while testing', (done) => {
      const err = new Error('foo');
      runner.executeBefore.restore();
      runner.executeTest.restore();
      stub(runner, 'executeBefore').rejects(err);
      stub(runner, 'executeTest').rejects(err);

      runner.runCase(t, test2.cases[0])
      .catch((e) => {
        expect(e).to.equal(err);
      })
      .done(() =>{
        expect(runner.runAssertions).to.not.have.been.called;
        done();
      });
    });

    it('should bypass http errors as part of testing', (done) => {
      const err = new Error();
      err.status = 400;
      err.response = 'foo';
      runner.executeBefore.restore();
      runner.executeTest.restore();
      stub(runner, 'executeBefore').rejects(err);
      stub(runner, 'executeTest').rejects(err);

      runner.runCase(t, test2.cases[0])
      .done(() =>{
        expect(runner.runAssertions).to.have.been.calledWith('foo', test2.cases[0], t);
        expect(runner.executeAfter).to.have.been.called;
        done();
      });
    });
  });

  describe('checkForHTTPError method', () => {
    it('should exist', () => {
      expect(runner.checkForHTTPError).to.be.a('function');
    });

    it('should throw if there is no http status in the error', () => {
      const err = new Error();
      const checkForHTTPError = runner.checkForHTTPError.bind(runner, err);
      expect(checkForHTTPError).to.throw(Error);
    });

    it('should return the response if the error is an HTTP response', () => {
      const err = new Error();
      err.status = 400;
      err.response = 'foo';
      const checkForHTTPError = runner.checkForHTTPError.bind(runner, err);
      expect(checkForHTTPError()).to.equal('foo')
    });


  });


  describe('runAssertions method', () => {
    it('should exist', () => {
      expect(runner.runAssertions).to.be.a('function');
    });

    it('should get all assertions', () => {
      const payload = { foo : 'bar' };
      runner.runAssertions(payload, test2.cases[0] ,t);
      expect(getAllTests).to.have.been.calledWith(payload, test2.cases[0].expect);
    });

    it('should run all assertions using tape', () => {
      const payload = { foo : 'bar' };
      runner.runAssertions(payload, test2.cases[0] ,t);
      expect(t.equal.getCall(0).calledWith(assertions[0].actual, assertions[0].expectation)).to.be.ok;
      expect(t.equal.getCall(1).calledWith(assertions[1].actual, assertions[1].expectation)).to.be.ok;
      expect(t.deepEqual.getCall(0).calledWith(assertions[2].actual, assertions[2].expectation)).to.be.ok;
    });

    it('should return the testCase for after case processing', () => {
      const payload = { foo : 'bar' };
      expect(runner.runAssertions(payload, test2.cases[0] ,t)).to.deep.equal(test2.cases[0]);
    });
  });

  describe('executeBefore method', () => {
    beforeEach(() => {
      chainPromises = actualChainPromises;
      TestHelper = function() {
        this.chainPromises = chainPromises;
        this.getAllTests = getAllTests;
        this.registerPlugin = registerPlugin;
        this.call = actualCall;
        this.plugins = {
          wait : { wait },
          http : { get, post, put , delete: dlete },
          ohcm : { login, logout }
        };
        helper = this;
        return this;
      };

      TestRunner.__Rewire__('TestHelper', TestHelper);
      runner = new TestRunner(new TestHelper());
    });

    afterEach(() => {
      chainPromises = stub();
      TestHelper = function() {
        this.chainPromises = chainPromises;
        this.getAllTests = getAllTests;
        this.registerPlugin = registerPlugin;
        this.call = call;
        this.plugins = {
          wait : { wait },
          http : { get, post, put , delete: dlete },
          ohcm : { login, logout }
        };
        helper = this;
        return this;
      };

      TestRunner.__Rewire__('TestHelper', TestHelper);
    });

    it('should exist', () => {
      expect(runner.executeBefore).to.be.a('function');
    });

    it('should call helper function for each operation', (done) => {
      runner.executeBefore(test2.cases[0])
      .done(() => {
        expect(wait).to.have.been.calledWith(0)
        expect(login).to.have.been.calledWith(...test2.cases[0].before[1].args)
        done();
      });
    });
  });

  describe('executeAfter method', () => {
    beforeEach(() => {
      chainPromises = actualChainPromises;
      TestHelper = function() {
        this.chainPromises = chainPromises;
        this.getAllTests = getAllTests;
        this.registerPlugin = registerPlugin;
        this.call = actualCall;
        this.plugins = {
          wait : { wait },
          http : { get, post, put , delete: dlete },
          ohcm : { login, logout }
        };
        helper = this;
        return this;
      };

      TestRunner.__Rewire__('TestHelper', TestHelper);
      runner = new TestRunner(new TestHelper());
    });

    afterEach(() => {
      chainPromises = stub();
      TestHelper = function() {
        this.chainPromises = chainPromises;
        this.getAllTests = getAllTests;
        this.registerPlugin = registerPlugin;
        this.call = call;
        this.plugins = {
          wait : { wait },
          http : { get, post, put , delete: dlete },
          ohcm : { login, logout }
        };

        return this;
      };

      TestRunner.__Rewire__('TestHelper', TestHelper);
    });


    it('should exist', () => {
      expect(runner.executeAfter).to.be.a('function');
    });

    it('should call helper function for each operation', (done) => {
      runner.executeAfter(test2.cases[0])
      .done(() => {
        expect(wait).to.have.been.calledWith(100)
        expect(logout).to.have.been.called;
        done();
      });
    });
  });

  describe('executeTest method', () => {
    beforeEach(() => {
      bind = stub();
      bind.onCall(3).resolves(true);
      b = get.bind;
      get.bind = bind;
    });

    afterEach(() => {
      get.bind = b;
    });

    it('should exist', () => {
      expect(runner.executeTest).to.be.a('function');
    });

    it('should make the proper http call to the specified endpoint with given headers and body', () => {
      const cse = test2.cases[0];
      runner.executeTest(cse)
      expect(call).to.have.been.calledWith(cse.type, cse.action, [cse.endpoint, cse.headers, cse.body]);
    });
  });
});
