import TestHelper from '../../lib/helper';
let helper = {},
clock = {},
tape = {},
t = {},
comment = {},
plan = {},
superagent = {},
saaspromised = {},
get = {},
assertions = require('../data/assertions.json'),
post = {},
put = {},
dlete = {},
dummy = require('../data/dummy.json'),
test1 = require('../data/test1.json'),
test2 = require('../data/test2.json'),
test3 = require('../data/test3.json'),
tests = [test1, test2, test3];

describe('TestHelper Class', () => {
  beforeEach(() => {
    saaspromised = stub();
    get = stub().resolves(true);
    post = stub().resolves(true);
    put = stub().resolves(true);
    dlete = stub().resolves(true);

    superagent = {
      get,
      post,
      put,
      dlete
    };

    plan = stub();
    comment = stub();
    t = {
      plan,
      comment
    }
    tape = stub().callsArgWith(1, t);
    TestHelper.__Rewire__('superagent', superagent);
    TestHelper.__Rewire__('saaspromised', saaspromised);
    TestHelper.__Rewire__('tape', tape);

    helper = new TestHelper();
  });

  afterEach(() => {
    TestHelper.__ResetDependency__('superagent');
    TestHelper.__ResetDependency__('saaspromised');
    TestHelper.__ResetDependency__('tape');
  });

  it('should be defined', () => {
    expect(TestHelper).to.be.ok;
  });

  it('can be created', () => {
    expect(helper).to.be.ok;
  });

  describe('plan method', () => {
    beforeEach(() => {
      stub(helper, 'countAssertionsInObject').returns([1,2,3]);
    });

    afterEach(() => {
      helper.countAssertionsInObject.restore();
    });

    it('should exist', () => {
      expect(helper.plan).to.be.a('function');
    });

    it('it should count assertions', () => {
      helper.plan(test1);
      expect(helper.countAssertionsInObject).to.have.been.called;
    });

    it('it should return the total number of assertions', () => {
      helper.countAssertionsInObject.restore();
      expect(helper.plan(test1)).to.equal(9);
      stub(helper, 'countAssertionsInObject').returns([1,2,3]);
    });
  });

  describe('createTestHarness method', () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('should exist', () => {
      expect(helper.createTestHarness).to.be.a('function');
    });

    it('should create a new test harness', () => {
      const s = spy()
      helper.createTestHarness(tests, s);
      expect(tape).to.have.been.calledWith('Integration Tests');
    });

    it('should plan the test', () => {
      const s = spy()
      helper.createTestHarness(tests, s);
      expect(plan).to.have.been.calledWith(27);
    });

    it('should call the callback function with generated t object', () => {
      const s = spy()
      helper.createTestHarness(tests, s);
      expect(s).to.have.been.calledWith(t);
    });

  });

  describe('isJsonSafePrimitive method', () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('should exist', () => {
      expect(helper.isJsonSafePrimitive).to.be.a('function');
    });

    it('should return true only for json primitives', () => {
      expect(helper.isJsonSafePrimitive(234)).to.be.ok;
      expect(helper.isJsonSafePrimitive('foo')).to.be.ok;
      expect(helper.isJsonSafePrimitive(false)).to.be.ok;
      expect(helper.isJsonSafePrimitive(new Map())).to.not.be.ok;
      expect(helper.isJsonSafePrimitive(() => {})).to.not.be.ok;
      expect(helper.isJsonSafePrimitive([])).to.not.be.ok;
    });
  });

  describe('generateAssertions method', () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('should exist', () => {
      expect(helper.generateAssertions).to.be.a('function');
    });

    it('should generate assertions correctly', () => {
      expect(helper.generateAssertions(dummy)).to.deep.equal(assertions);
    });

  });

  describe('getAllTests method', () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('should exist', () => {
      expect(helper.getAllTests).to.be.a('function');
    });
  });

  describe('countAssertionsInObject method', () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('should exist', () => {
      expect(helper.countAssertionsInObject).to.be.a('function');
    });
  });

  describe('chainPromises method', () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('should exist', () => {
      expect(helper.chainPromises).to.be.a('function');
    });
  });

  describe('createURL method', () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('should exist', () => {
      expect(helper.createURL).to.be.a('function');
    });
  });
});
