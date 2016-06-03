import Promise from 'bluebird';

module.exports = function(promises) {
  return promises.reduce((prev, next) => prev.then(next), Promise.resolve());
};
