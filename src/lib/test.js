import Tester from './tester';
import Runner from './runner';
import Parser from './parser';
import PluginManager from './plugin-manager';
import Plugin from './plugins/plugin';
import Utility from './utility';

import test from './blueprints/foo.json';

//const parser = new Parser();
const tester = new Tester(test);

//console.log(parser.parse(test.test));
tester
.prepare()
.then(tester.test.bind(tester));

