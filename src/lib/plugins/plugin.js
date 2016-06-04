import { PluginOrderError } from '../utility/custom-errors';

class Plugin {
  constructor(required = []) {
    this.required = required;
  }

  get type() {
    return this.constructor.type;
  }

  register(context) {
    this.required.forEach((req) => {
      if(!context.plugins[req]) {
        throw new PluginOrderError(`Plugin ${req} is required for ${this.type} plugin.`);
      }
    })
    this.context = context;
  }
};

Plugin.type = 'generic';
module.exports = Plugin;
