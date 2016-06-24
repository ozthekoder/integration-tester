'use strict';

var _tester = require('./tester');

var _tester2 = _interopRequireDefault(_tester);

var _runner = require('./runner');

var _runner2 = _interopRequireDefault(_runner);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _pluginManager = require('./plugin-manager');

var _pluginManager2 = _interopRequireDefault(_pluginManager);

var _plugin = require('./plugins/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _utility = require('./utility');

var _utility2 = _interopRequireDefault(_utility);

var _foo = require('./blueprints/foo.json');

var _foo2 = _interopRequireDefault(_foo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const parser = new Parser();
var tester = new _tester2.default(_foo2.default);

//console.log(parser.parse(test.test));
tester.prepare().then(tester.test.bind(tester));
//# sourceMappingURL=test.js.map