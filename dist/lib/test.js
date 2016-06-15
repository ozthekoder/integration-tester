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

var _test_foo = require('./blueprints/test_foo.json');

var _test_foo2 = _interopRequireDefault(_test_foo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tester = new _tester2.default(_test_foo2.default);

tester.prepare().then(tester.test.bind(tester));
//# sourceMappingURL=test.js.map