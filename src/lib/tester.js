const TestRunner = require('./test-runner');
const Promise = require('bluebird');
const { PluginOrderError, PluginNotFoundError } = require('./utility/custom-errors');
const TestHelper = require('./helper');
const tape = require('tape');
const fs = require( 'fs');
const converter = require('tap-xunit');
const defaults = require('./config/config.json');

export default class ApiTester {
  constructor(tests = [], config = defaults) {
    this.config = config;
    this.loadedPlugins = {};
    this.tests = tests;
    this.helper = new TestHelper();
    this.runner = new TestRunner(this.helper);
    this.consoleStream = null;
    this.reportStream = null;
    this.tapToXUnitConverter = converter();
  }

  startStreams() {
    const streams = Object.keys(this.config.output);
    streams.forEach((outputType) => this.config.output[outputType] ? this[outputType].call(this) : false );
  }

  console() {
    this.consoleStream = tape.createStream();
    this.consoleStream.pipe(process.stdout);
  }

  report() {
    const writeStream = fs.createWriteStream(this.config.output.report);
    this.reportStream = tape.createStream();
    this.reportStream.pipe(this.tapToXUnitConverter).pipe(writeStream);
  }

  loadPlugin(type) {
    if(!this.loadedPlugins[type]) {
      const Plugin = require(`./plugins/${type}`);
      const plugin = new Plugin();
      this.loadedPlugins[type] = plugin;
    }

    return this.loadedPlugins[type];
  }

  registerPlugins(testCase) {
    const plugin = this.loadPlugin(testCase.type);
    this.registerPlugin(plugin)
    if(testCase.title) {
      testCase.before.forEach((op) => this.registerPlugins(op))
      testCase.after.forEach((op) => this.registerPlugins(op))
    }
  }

  registerPlugin(plugin) {
    plugin.required.forEach((req) => this.registerPlugin(this.loadPlugin(req)));
    this.helper.registerPlugin(plugin);
  }

  filterSkipped(test) {
    test.cases = test.cases.filter((tCase) => !tCase.skip);
  }

  prepare() {
    return new Promise((resolve, reject) => {
      this.tests.forEach((test) => {
        this.filterSkipped(test);
        test.cases
        .forEach((tCase) => this.registerPlugins(tCase));
      });

      Promise.all(
        Object
        .keys(this.loadedPlugins)
        .map((plugin) => this.loadedPlugins[plugin].initialize())
      )
      .then(() => {
        this.startStreams();
        this.helper.createTestHarness(tape, this.tests, (t) => {
          resolve(this.tests.map(item => this.runner.run.bind(this.runner, t, item)));
        });
      }).catch(reject);
    });
  }

  test(tests) {
    return this.helper.chainPromises(tests);
  }
};
