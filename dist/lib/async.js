'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (promises) {
  return promises.reduce(function (prev, next) {
    return prev.then(next);
  }, _bluebird2.default.resolve());
};
//# sourceMappingURL=async.js.map