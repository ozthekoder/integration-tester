const { PluginOrderError } = require('../utility/custom-errors');
module.exports = class Plugin {
  constructor(type = '', required = []) {
    this.type = type;
    this.required = required;
  }

  register(context) {
    this.required.forEach((req) => {
      if(!context.plugins[req]) {
        throw new PluginOrderError(`Plugin ${req} is required for ${this.type} plugin.`);
      }
    })
    this.context = context;
  }
}
