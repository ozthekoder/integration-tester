'use strict';

var Promise = require('bluebird');

module.exports = function (promises) {
  return promises.reduce(function (prev, next) {
    return prev.then(next);
  }, Promise.resolve());
};
//# sourceMappingURL=async.js.map