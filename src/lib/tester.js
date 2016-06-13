const Promise = require('bluebird');
const glob = require('glob');
const tape = require('tape');
const fs = require('graceful-fs');
const converter = require('tap-xunit');
const PluginManager = require('./plugin-manager');
const Runner = require('./runner');
const Parser = require('./parser');
const chain = require('./async');
const defaults = require('./config/config.json');
const validation = require('./config/constants.json').validation;
const Utility = require('./utility');

const {
  is,
  forEachKey,
  xor,
  isJsonSafePrimitive,
  generateAssertions,
  getAllAssertions,
  countAssertions
} = Utility

module.exports = class Tester {
  constructor(tests = [], config = defaults) {
    this.config = Object.assign(defaults, config);
    this.pluginManager = new PluginManager();
    this.tests = tests;
    this.runner = new Runner(this.pluginManager);
    this.parser = new Parser(validation);
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

  registerNativePlugins(ops) {
    const { plugins } = this.config;
    const pluginsForOps = ops.reduce((prev, current) => {
      prev[current.$plugin] = true;
      return prev;
    }, {});
    Object
    .keys(plugins)
    .filter((plugin) => pluginsForOps[plugin])
    .map((key) => require(plugins[key].file))
    .map((Plugin) => new Plugin(plugins[Plugin.type]))
    .map(this.registerPlugin.bind(this));
  }

  registerPlugin(plugin) {
    this.pluginManager.registerPlugin(plugin);
  }

  prepare() {
    return new Promise((resolve, reject) => {
      this.tests = Array.isArray(this.tests) ? this.tests : [this.tests];
      const ops = this.tests
      .map(this.parser.parse.bind(this.parser))
      .reduce((prev, current) => [...prev, ...current], []);
      const assertionCount = this.runner.plan(ops);

      this.registerNativePlugins(ops);
      this.pluginManager.initializePlugins()
      .then(() => {
        this.startStreams();
        this.runner.createTestHarness(assertionCount, null, (t) => {
          resolve(this.runner.prepare(ops));
        });
      });
    });
  }

  test(tests) {
    return chain(tests);
  }
};
