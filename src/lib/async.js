
export function chain (promises) {
  return promises.reduce((prev, next) => prev.then(next), Promise.resolve());
}
