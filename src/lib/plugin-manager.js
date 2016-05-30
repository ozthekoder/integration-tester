const Promise = require('bluebird');

export default class PluginManager {
  constructor() {
    this.session = {};
    this.plugins = {};
  }

  registerPlugin(plugin) {
    if(!this.plugins[plugin.type]) {
      plugin.register(this);
      this.plugins[plugin.type] = plugin;
    }
  }

  execute(plugin, operation, args) {
    const p = this.plugins[plugin];
    return p[operation].bind(p, ...args)
  }
};
