const Promise = require('bluebird');

export default class PluginManager {
  constructor() {
    this.session = {};
    this.plugins = {};
    this.saved = {};
  }

  registerPlugin(plugin) {
    if(!this.plugins[plugin.type]) {
      plugin.register(this);
      this.plugins[plugin.type] = plugin;
    }
  }

  initializePlugins() {
    const initCalls = Object
    .keys(this.plugins)
    .map((plugin) => this.plugins[plugin].initialize());
    return Promise.all(initCalls);
  }

  execute(plugin, operation, args) {
    const p = this.plugins[plugin];
    return p[operation].call(p, ...args)
  }

  saveRefs(refs) {
    this.saved = Object.assign(this.saved, refs);
  }
};
