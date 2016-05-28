import ApiTester from '../../lib/index';
let tester = {},
  writeStream = {},
  Stream = {},
  stream = {},
  pipe = {},
  bind = {},
  t = {},
  tape = {},
  fs = {},
  converter = () => {},
  TestRunner = () => {},
  TestHelper = () => {},
  helper = () => {},
  tapToXUnit = {},
  defaults = require('../../lib/config/config.json'),
  test1 = require('../data/test1.json'),
  test2 = require('../data/test2.json'),
  test3 = require('../data/test3.json'),
  tests = [test1, test2, test3];

describe('ApiTester Class', () => {
  beforeEach(() => {
    writeStream = {
      pipe: stub().returns(writeStream)
    };

    Stream = function() {
      this.pipe = pipe = stub().returns(this);
      return this;
    };

    stream = new Stream();

    t = {
      plan: stub(),
      createStream: stub().returns(stream)
    };

    tape = {
      createStream: stub().returns(stream)
    };

    fs = {
      createWriteStream: stub().returns(writeStream)
    };

    tapToXUnit = {
      pipe: stub().returns(writeStream)
    };
    converter = stub().returns(tapToXUnit);
    bind = stub();

    TestRunner = function(h) {
      this.run = {
        bind
      };
      this.helper = h;
      return this;
    };

    TestHelper = function() {
      this.plan = stub();
      this.plan.onCall(0).returns(1)
      this.plan.onCall(1).returns(2)
      this.plan.onCall(2).returns(3);
      this.chainPromises = stub().returns('foo');
      this.createTestHarness = stub().callsArgWith(1, t)
      helper = this;
      return this;
    };

    ApiTester.__Rewire__('tape', tape);
    ApiTester.__Rewire__('TestRunner', TestRunner);
    ApiTester.__Rewire__('TestHelper', TestHelper);
    ApiTester.__Rewire__('fs', fs);
    ApiTester.__Rewire__('converter', converter);

    tester = new ApiTester(tests);
  });

  afterEach(() => {
    ApiTester.__ResetDependency__('tape');
    ApiTester.__ResetDependency__('TestRunner');
    ApiTester.__ResetDependency__('TestHelper');
    ApiTester.__ResetDependency__('fs');
    ApiTester.__ResetDependency__('converter');
  });

  it('should be defined', () => {
    expect(ApiTester).to.be.ok;
  });

  it('can be created', () => {
    expect(tester).to.be.ok;
    expect(tester.config).to.deep.equal(defaults);
    expect(tester.tests).to.deep.equal(tests);
    expect(tester.test).to.be.a('function');
    expect(tester.startStreams).to.be.a('function');
    expect(tester.console).to.be.a('function');
    expect(tester.report).to.be.a('function');
  });

  describe('startStreams Method', () => {
    it('should start the console stream only as default', () =>{
      stub(tester, 'console');
      stub(tester, 'report');
      tester.startStreams();
      expect(tester.console).to.have.been.called;
      expect(tester.report).to.not.have.been.called;
      tester.console.restore();
      tester.report.restore();
    });

    it('should start the report stream if it is enabled in the config', () =>{
      stub(tester, 'console');
      stub(tester, 'report');
      tester.config.output.report = 'spec/integration.xml';
      tester.startStreams();
      expect(tester.console).to.have.been.called;
      expect(tester.report).to.have.been.called;
      tester.console.restore();
      tester.report.restore();
    });
  });

  describe('console Method', () => {
    it('should create test output stream and pipe it to process.stdout', () =>{
      tester.console();
      expect(tape.createStream).to.have.been.called;
      expect(pipe).to.have.been.calledWith(process.stdout);
    });
  });

  describe('report Method', () => {
    it('should create fs writeStream with the given path', () =>{
      tester.config.output.report = 'spec/integration.xml';
      tester.report();
      expect(fs.createWriteStream).to.have.been.calledWith('spec/integration.xml');
    });

    it('should create test output stream and pipe it to tap-xunit then pipe it to the writeStream created', () =>{
      pipe.reset();
      tester.config.output.report = 'spec/integration.xml';
      tester.report();
      expect(tape.createStream).to.have.been.called;
      expect(pipe.firstCall.calledWith()).to.be.ok;
      expect(pipe.secondCall.calledWith(writeStream)).to.be.ok;
    });
  });

  describe('prepare Method', () => {
    beforeEach(() => {
      tape = stub().callsArgWith(1, t);
      stub(tester, 'startStreams');
      stub(tester, 'registerPlugins');
      ApiTester.__Rewire__('tape', tape);
    });

    afterEach(() => {
      tester.registerPlugins.restore();
      tester.startStreams.restore();
    });

    it('should exist', () => {
      expect(tester.prepare).to.be.a('function');
    });

    it('should start test streams', () => {
      tester.prepare();
      expect(tester.startStreams).to.have.been.called;
    });

    it('should create new test harness and plan the test', () => {
      tester.prepare();
      expect(bind.callCount).to.equal(3);
      expect(tester.helper.createTestHarness).to.have.been.called;
    });

  });

  describe('test Method', () => {
    beforeEach(() => {
      tape = stub().callsArgWith(1, t);
      stub(tester, 'startStreams');
      ApiTester.__Rewire__('tape', tape);
    });

    afterEach(() => {
      tester.startStreams.restore();
    });

    it('should exist', () => {
      expect(tester.test).to.be.a('function');
    });

    it('should chain promises and return the promise chain', () => {
      const promise = tester.test();
      expect(tester.helper.chainPromises).to.have.been.called;
      expect(promise).to.equal('foo');
    });
  });
});
