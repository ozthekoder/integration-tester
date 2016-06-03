import Promise from 'bluebird';
import glob from 'glob';
import tape from 'tape';
import fs from  'fs';
import converter from 'tap-xunit';
import PluginManager from './plugin-manager';
import Runner from './runner';
import Parser from './parser';
import chain from './async';
import defaults from './config/config.json';
import { validation } from './config/constants.json';

import {
  is,
  forEachKey,
  xor,
  isJsonSafePrimitive,
  generateAssertions,
  getAllAssertions,
  countAssertions
} from './utility';


export default class ApiTester {
  constructor(tests = [], config = defaults) {
    this.config = config;
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
    .map((Plugin) => new Plugin())
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
