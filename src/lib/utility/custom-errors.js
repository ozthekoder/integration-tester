class ExtendableError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}

class PluginOrderError extends ExtendableError {
  constructor(m) {
    super(m);
  }
}

class PluginNotFoundError extends ExtendableError {
  constructor(m) {
    super(m);
  }
}

module.exports = {
  PluginOrderError,
  PluginNotFoundError,
  ExtendableError
}
