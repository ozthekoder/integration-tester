'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _utility = require('./utility');

var _customErrors = require('./utility/custom-errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
  function Parser(validation) {
    _classCallCheck(this, Parser);

    Object.assign(this, validation);
  }

  _createClass(Parser, [{
    key: 'validate',
    value: function validate(blueprint) {
      var _this = this;

      this.validateDesignator(blueprint);
      this.validateKeys(blueprint);
      this.validateTypes(blueprint);
      [].concat(_toConsumableArray(this.recursive), _toConsumableArray(this.each.before), _toConsumableArray(this.each.after)).forEach(function (key) {
        if (key in blueprint && _get__('is')(blueprint[key]) === 'array') blueprint[key].forEach(function (item) {
          return _this.validate(item);
        });
      });
      return true;
    }
  }, {
    key: 'flatten',
    value: function flatten(blueprint) {
      var _this2 = this;

      if (!blueprint.$skip) {
        var _ret = function () {
          _this2.addEachOps(blueprint);
          var toRemove = [].concat(_toConsumableArray(_this2.recursive), _toConsumableArray(_this2.each.before), _toConsumableArray(_this2.each.after));
          return {
            v: _this2.recursive.map(function (key) {
              if (blueprint[key]) {
                if (_get__('is')(blueprint[key]) === 'array') {
                  return blueprint[key].map(function (op) {
                    return _this2.flatten(op);
                  }).reduce(function (prev, current) {
                    return prev.concat(current);
                  }, []);
                } else if (_get__('is')(blueprint[key]) === 'string') {
                  return [blueprint];
                }
              }
              return [];
            }).reduce(function (prev, current) {
              return prev.concat(current);
            }, []).map(function (op) {
              toRemove.forEach(function (key) {
                if (op[key] && _get__('is')(op[key]) === 'array') {
                  delete op[key];
                }
              });
              return op;
            })
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

      return [];
    }
  }, {
    key: 'addEachOps',
    value: function addEachOps(blueprint) {
      var b = Object.assign({}, blueprint);
      var $beforeEach = b.$beforeEach;
      var $afterEach = b.$afterEach;

      var toRemove = [].concat(_toConsumableArray(this.each.before), _toConsumableArray(this.each.after));

      toRemove.forEach(function (key) {
        delete blueprint[key];
      });

      if ($beforeEach && $afterEach && $beforeEach.length + $afterEach.length) {
        var ops = this.getOps(b);
        blueprint.$ops = ops.map(function (op) {
          return [].concat(_toConsumableArray($beforeEach), [op], _toConsumableArray($afterEach));
        }).reduce(function (prev, current) {
          return prev.concat(current);
        }, []);
      }
    }
  }, {
    key: 'getOps',
    value: function getOps(blueprint) {
      return blueprint.$op ? [blueprint] : blueprint.$ops;
    }
  }, {
    key: 'parse',
    value: function parse(blueprint) {
      if (this.validate(blueprint)) return this.flatten(blueprint);
      throw new (_get__('ValidationError'))('Could not parse blueprint');
    }
  }, {
    key: 'validateDesignator',
    value: function validateDesignator(blueprint) {
      var designator = arguments.length <= 1 || arguments[1] === undefined ? this.designator : arguments[1];

      _get__('forEachKey')(blueprint, function (key) {
        if (key.charAt(0) !== designator) {
          throw new (_get__('ValidationError'))('Designator character is missing in the ' + keys + ' key.');
        }
      });
      return true;
    }
  }, {
    key: 'validateKeys',
    value: function validateKeys(blueprint) {
      var keys = arguments.length <= 1 || arguments[1] === undefined ? this.keys : arguments[1];

      this.mustHaveKeys(blueprint, keys);
      this.canHaveKeys(blueprint, keys);
      this.anyKeys(blueprint, keys);
      this.eitherOrKeys(blueprint, keys);
      this.requiredKeys(blueprint, keys);
      //this.validateLeafNodes(blueprint, keys);
      return true;
    }
  }, {
    key: 'generateDefault',
    value: function generateDefault(type) {
      if (type) {
        switch (type) {
          case '$uuid':
            return _get__('uuid').v4();
            break;
          default:
            return '';
            break;
        }
      }

      return '';
    }
  }, {
    key: 'mustHaveKeys',
    value: function mustHaveKeys(blueprint) {
      var _this3 = this;

      var keys = arguments.length <= 1 || arguments[1] === undefined ? this.keys : arguments[1];
      var must = keys.must;
      var defaults = keys.defaults;

      defaults = defaults || {};
      if (must && blueprint) {
        var i = void 0;
        for (i = 0; i < must.length; i++) {
          if (!(must[i] in blueprint)) {
            if (!(must[i] in defaults)) {
              throw new (_get__('ValidationError'))('required key ' + must[i] + ' was not found in the json');
            }
            if (!this.isDesignatedKey(defaults[must[i]])) {
              blueprint[must[i]] = defaults[must[i]];
            } else {
              blueprint[must[i]] = this.generateDefault(defaults[must[i]]);
            }
          }
        }
      }

      if (keys.children) {
        Object.keys(keys.children).filter(this.isDesignatedKey.bind(this)).filter(function (k) {
          return k in blueprint;
        }).forEach(function (k) {
          _this3.mustHaveKeys(blueprint[k], keys.children[k]);
        });
      }
      return true;
    }
  }, {
    key: 'canHaveKeys',
    value: function canHaveKeys(blueprint) {
      var _this4 = this;

      var keys = arguments.length <= 1 || arguments[1] === undefined ? this.keys : arguments[1];
      var can = keys.can;


      if (can && blueprint) {
        _get__('forEachKey')(blueprint, function (k) {
          if (!can.some(function (key) {
            return k === key;
          })) {
            throw new (_get__('ValidationError'))('There is an unrecognized key in the json');
          }
        });
      }
      if (keys.children) {

        Object.keys(keys.children).filter(this.isDesignatedKey.bind(this)).filter(function (k) {
          return k in blueprint;
        }).forEach(function (k) {
          return _this4.canHaveKeys(blueprint[k], keys.children[k]);
        });
      }
      return true;
    }
  }, {
    key: 'eitherOrKeys',
    value: function eitherOrKeys(blueprint) {
      var _this5 = this;

      var keys = arguments.length <= 1 || arguments[1] === undefined ? this.keys : arguments[1];
      var either_or = keys.either_or;


      if (either_or && blueprint) {
        var result = either_or.map(function (pair) {
          return pair.map(function (key) {
            return key in blueprint;
          });
        }).reduce(function (prev, pair) {
          return _get__('xor')(pair) && prev;
        }, true);
        if (!result) {
          throw new (_get__('ValidationError'))('One of the explicit or keys conditions failed');
        }
      }
      if (keys.children) {

        Object.keys(keys.children).filter(this.isDesignatedKey.bind(this)).filter(function (k) {
          return k in blueprint;
        }).forEach(function (k) {
          return _this5.eitherOrKeys(blueprint[k], keys.children[k]);
        });
      }
      return true;
    }
  }, {
    key: 'anyKeys',
    value: function anyKeys(blueprint) {
      var _this6 = this;

      var keys = arguments.length <= 1 || arguments[1] === undefined ? this.keys : arguments[1];
      var any = keys.any;


      if (any && blueprint) {

        var result = any.map(function (key) {
          return key in blueprint;
        }).reduce(function (prev, predicate) {
          return prev || predicate;
        }, false);
        if (!result) {
          throw new (_get__('ValidationError'))('One of any key conditions failed');
        }
      }
      if (keys.children) {

        Object.keys(keys.children).filter(this.isDesignatedKey.bind(this)).filter(function (k) {
          return k in blueprint;
        }).forEach(function (k) {
          return _this6.anyKeys(blueprint[k], keys.children[k]);
        });
      }
      return true;
    }
  }, {
    key: 'requiredKeys',
    value: function requiredKeys(blueprint) {
      var _this7 = this;

      var keys = arguments.length <= 1 || arguments[1] === undefined ? this.keys : arguments[1];
      var requires = keys.requires;


      if (blueprint && requires) {
        var results = requires.map(function (reqs) {
          return reqs.map(function (key) {
            return key in blueprint;
          });
        });
        var result = results.every(function (i) {
          return i.every(function (k) {
            return k === false;
          }) || i.every(function (k) {
            return k === true;
          });
        });
        if (!result) {
          throw new (_get__('ValidationError'))('One of the required keys do not exist on the object');
        }
      }
      if (keys.children) {

        Object.keys(keys.children).filter(this.isDesignatedKey.bind(this)).filter(function (k) {
          return k in blueprint;
        }).forEach(function (k) {
          return _this7.requiredKeys(blueprint[k], keys.children[k]);
        });
      }

      return true;
    }
  }, {
    key: 'validateLeafNode',
    value: function validateLeafNode(blueprint) {
      var keys = arguments.length <= 1 || arguments[1] === undefined ? this.keys : arguments[1];

      var result = this.validateKeys(blueprint, keys);

      if (!result) {
        throw new (_get__('ValidationError'))('Leaf node validation failed!');
      }
      return true;
    }
  }, {
    key: 'validateLeafNodes',
    value: function validateLeafNodes(blueprint) {
      var _this8 = this;

      var keys = arguments.length <= 1 || arguments[1] === undefined ? this.keys : arguments[1];
      var leaf = keys.leaf;


      if (blueprint && leaf) {
        if (this.isLeafNode(blueprint)) {
          this.validateLeafNode(blueprint, leaf);
        } else {
          _get__('forEachKey')(blueprint, function (key) {
            _this8.validateLeafNodes(blueprint[key], keys);
          });
        }
      }
      if (keys.children) {

        Object.keys(keys.children).filter(this.isDesignatedKey.bind(this)).filter(function (k) {
          return k in blueprint;
        }).forEach(function (k) {
          return _this8.validateLeafNodes(blueprint[k], keys.children[k]);
        });
      }

      return true;
    }
  }, {
    key: 'isLeafNode',
    value: function isLeafNode(node) {
      var _this9 = this;

      var check = true;

      _get__('forEachKey')(node, function (key) {
        if (!_this9.isDesignatedKey(key)) {
          check = false;
        }
      });

      return check;
    }
  }, {
    key: 'isDesignatedKey',
    value: function isDesignatedKey(key) {
      if (_get__('is')(key) === 'string') {
        return key.indexOf(this.designator) === 0;
      }

      return false;
    }
  }, {
    key: 'validateTypes',
    value: function validateTypes(blueprint) {
      var _this10 = this;

      var types = arguments.length <= 1 || arguments[1] === undefined ? this.types : arguments[1];

      if (blueprint) {
        Object.keys(blueprint).filter(this.isDesignatedKey.bind(this)).forEach(function (key) {
          return _this10.validateType(blueprint[key], types[key]);
        });

        Object.keys(blueprint).filter(this.isDesignatedKey.bind(this)).forEach(function (key) {
          return _this10.validateTypes(blueprint[key], types[key]);
        });
      }
      return true;
    }
  }, {
    key: 'validateType',
    value: function validateType(value, allowed) {
      var _this11 = this;

      if (allowed && _get__('is')(allowed) === 'string') {
        allowed = allowed.split('|');
        var result = allowed.some(function (type) {
          return type === _get__('is')(value);
        });
        if (!result) {
          throw new (_get__('ValidationError'))('Type validation on key failed!');
        }
      }
      Object.keys(value).filter(this.isDesignatedKey.bind(this)).filter(function (k) {
        return k in allowed;
      }).forEach(function (key) {
        return _this11.validateTypes(value[key], allowed[key]);
      });
      return true;
    }
  }]);

  return Parser;
}();

exports.default = Parser;
var _RewiredData__ = {};
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    Object.defineProperty(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  return _RewiredData__ === undefined || _RewiredData__[variableName] === undefined ? _get_original__(variableName) : _RewiredData__[variableName];
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'is':
      return _utility.is;

    case 'ValidationError':
      return _customErrors.ValidationError;

    case 'forEachKey':
      return _utility.forEachKey;

    case 'uuid':
      return _uuid2.default;

    case 'xor':
      return _utility.xor;
  }

  return undefined;
}

function _assign__(variableName, value) {
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
    Object.keys(variableName).forEach(function (name) {
      _RewiredData__[name] = variableName[name];
    });
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _reset__(variableName) {
  delete _RewiredData__[variableName];
}

function _with__(object) {
  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      _RewiredData__[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = _RewiredData__[variableName];
      _RewiredData__[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

var _typeOfOriginalExport = typeof Parser === 'undefined' ? 'undefined' : _typeof(Parser);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(Parser, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(Parser)) {
  addNonEnumerableProperty('__get__', _get__);
  addNonEnumerableProperty('__GetDependency__', _get__);
  addNonEnumerableProperty('__Rewire__', _set__);
  addNonEnumerableProperty('__set__', _set__);
  addNonEnumerableProperty('__reset__', _reset__);
  addNonEnumerableProperty('__ResetDependency__', _reset__);
  addNonEnumerableProperty('__with__', _with__);
  addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;
//# sourceMappingURL=parser.js.map