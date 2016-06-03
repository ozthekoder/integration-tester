'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _parser = require('../../lib/parser');

var _parser2 = _interopRequireDefault(_parser);

var _utility = require('../../lib/utility');

var _customErrors = require('../../lib/utility/custom-errors');

var _customErrors2 = _interopRequireDefault(_customErrors);

var _constants = require('../../lib/config/constants.json');

var _test = require('../data/test1.json');

var _test2 = _interopRequireDefault(_test);

var _test3 = require('../data/test2.json');

var _test4 = _interopRequireDefault(_test3);

var _test5 = require('../data/test3.json');

var _test6 = _interopRequireDefault(_test5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parser = void 0,
    json1 = void 0,
    json2 = void 0,
    json3 = void 0,
    json4 = void 0,
    json5 = void 0,
    json6 = void 0,
    json7 = void 0,
    json8 = void 0,
    json9 = void 0,
    json10 = void 0,
    json11 = void 0,
    json12 = void 0,
    json13 = void 0;
describe('Parser Class', function () {

  beforeEach(function () {
    _assign__('json1', {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": {},
      "$timeout": 5000,
      "$after": []
    });

    _assign__('json2', {
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": {},
      "$timeout": 5000,
      "$after": []
    });

    _assign__('json3', {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": {}
    });

    _assign__('json4', {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$plugin": "http",
      "$ops": [],
      "$op": "post",
      "$args": [],
      "$payload": {},
      "$timeout": 5000,
      "$after": []
    });

    _assign__('json5', {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": {
        "$expect": {
          "foo": {
            "bar": {
              "$assert": "equal",
              "$value": "goo",
              "$log": "qqq"
            },
            "baz": {
              "goo": {
                "$assert": "equal",
                "$value": "qoo",
                "$log": "qqq"
              },
              "woo": {
                "$assert": "equal",
                "$value": "xoo",
                "$log": "qqq"
              }
            }
          }
        },
        "$waitFor": {
          "foo": {
            "bar": {
              "$value": "goo",
              "$log": "qqq"
            },
            "baz": {
              "goo": {
                "$value": "qoo",
                "$log": "qqq"
              },
              "woo": {
                "$value": "xoo",
                "$log": "qqq"
              }
            }
          }
        }

      },
      "$timeout": 5000,
      "$after": []
    });

    _assign__('json6', {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": {},
      "$timeout": 5000,
      "$after": []
    });

    _assign__('json7', {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$op": "post",
      "$args": [],
      "$payload": "",
      "$timeout": 5000,
      "$after": []
    });

    _assign__('json8', {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": {
        "$expect": {
          "foo": {
            "bar": {
              "$assert": "equal",
              "$value": "goo",
              "$log": "qqq"
            },
            "baz": {
              "goo": {
                "$assert": "equal",
                "$value": "qoo",
                "$log": "qqq"
              },
              "woo": {
                "$assert": "equal",
                "$value": "xoo",
                "$log": "qqq"
              }
            }
          }
        },
        "$waitFor": {
          "foo": {
            "bar": {
              "$assert": "equal",
              "$value": "goo",
              "$log": "qqq"
            },
            "baz": {
              "goo": {
                "$value": "qoo",
                "$log": "qqq"
              },
              "woo": {
                "$value": "xoo",
                "$log": "qqq"
              }
            }
          }
        }

      },
      "$timeout": 5000,
      "$after": []
    });

    _assign__('json9', {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": "",
      "$timeout": 5000,
      "$after": []
    });

    _assign__('json10', {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": {
        "$expect": {
          "$value": "foo",
          "$assert": "equal",
          "$log": 5
        }
      },
      "$timeout": 5000,
      "$after": []
    });

    _assign__('json11', {
      "$beforeEach": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "be1",
        "$after": []
      }, {
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "be2",
        "$after": []
      }],
      "$afterEach": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "ae1",
        "$after": []
      }, {
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "ae2",
        "$after": []
      }],
      "$before": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "before",
        "$after": []
      }],
      "$ops": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "op1",
        "$after": []
      }, {
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "op2",
        "$after": []
      }],
      "$after": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "after",
        "$after": []
      }]
    });

    _assign__('json12', {
      "$beforeEach": [],
      "$afterEach": [],
      "$before": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "0",
        "$skip": true,
        "$after": [{
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "1",
          "$after": []
        }]
      }],
      "$ops": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "2",
        "$after": []
      }],
      "$after": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "3",
        "$after": []
      }]
    });

    _assign__('json13', {
      "$beforeEach": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "be1",
        "$after": []
      }, {
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "be2",
        "$after": []
      }],
      "$afterEach": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "ae1",
        "$after": []
      }, {
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "ae2",
        "$after": []
      }],
      "$before": [],
      "$ops": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "op1",
        "$after": []
      }, {
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "op2",
        "$after": []
      }],
      "$after": []
    });

    _assign__('parser', new (_get__('Parser'))(_get__('validation')));
  });

  it('is defined', function () {
    expect(_get__('Parser')).to.be.ok;
  });

  it('and can be created', function () {
    expect(_get__('parser')).to.be.ok;
    expect(_get__('parser').types).to.be.a('object');
    expect(_get__('parser').keys).to.be.a('object');
    expect(_get__('parser').designator).to.be.a('string');
    expect(_get__('parser').recursive).to.be.a('array');
  });

  describe('validateDesignator method', function () {
    it('should be defined', function () {
      expect(_get__('parser').validateDesignator).to.be.a('function');
    });

    it('should return true if all keys have the designator charactor', function () {
      expect(_get__('parser').validateDesignator(_get__('json1'))).to.be.ok;
    });

    it('should throw Validation Error when one or more of the keys do not start with the designator charactor', function () {
      expect(_get__('parser').validateDesignator.bind(_get__('parser'), { "foo": "bar" })).to.throw(_get__('ValidationError'));
    });
  });

  describe('canHaveKeys method', function () {
    it('should be defined', function () {
      expect(_get__('parser').canHaveKeys).to.be.a('function');
    });

    it('should return true if all keys on the json are expected to be there', function () {
      expect(_get__('parser').canHaveKeys(_get__('json1'))).to.be.ok;
    });

    it('should throw Validation Error when the given doesn\'t belong the json', function () {
      expect(_get__('parser').canHaveKeys.bind(_get__('parser'), { "foo": "bar" })).to.throw(_get__('ValidationError'));
    });
  });

  describe('generateDefault method', function () {
    it('should be defined', function () {
      expect(_get__('parser').generateDefault).to.be.a('function');
    });

    it('should return empty string if no parameter passed', function () {
      expect(_get__('parser').generateDefault()).to.equal('');
    });

    it('should return a uuid when $uuid is passed as an argument', function () {
      expect(_get__('parser').generateDefault('$uuid')).to.be.a('string');
      expect(_get__('parser').generateDefault('$uuid').length).to.equal(36);
    });
  });

  describe('mustHaveKeys method', function () {
    it('should be defined', function () {
      expect(_get__('parser').mustHaveKeys).to.be.a('function');
    });

    it('should return true if no required keys are missing in the json', function () {
      expect(_get__('parser').mustHaveKeys(_get__('json1'))).to.be.ok;
    });

    it('should throw Validation Error when a required is not found on the json and it has no default value to be given', function () {
      expect(_get__('parser').canHaveKeys.bind(_get__('parser'), { "foo": "bar" })).to.throw(_get__('ValidationError'));
    });

    it('should return true if a required key is not found but the key has a default value defined', function () {
      expect(_get__('parser').mustHaveKeys(_get__('json3'))).to.be.ok;
      expect(_get__('json3').$beforeEach).to.deep.equal([]);
      expect(_get__('json3').$afterEach).to.deep.equal([]);
      expect(_get__('json3').$before).to.deep.equal([]);
      expect(_get__('json3').$after).to.deep.equal([]);
    });
  });

  describe('eitherOrKeys method', function () {
    it('should be defined', function () {
      expect(_get__('parser').eitherOrKeys).to.be.a('function');
    });

    it('should return true if only one of the given keys exist on the object', function () {
      expect(_get__('parser').eitherOrKeys(_get__('json1'))).to.equal(true);
    });

    it('should throw ValidationError if there are more then one of the given keys', function () {
      expect(_get__('parser').eitherOrKeys.bind(_get__('parser'), _get__('json4'))).to.throw(_get__('ValidationError'));
    });
  });

  describe('anyKeys method', function () {
    it('should be defined', function () {
      expect(_get__('parser').anyKeys).to.be.a('function');
    });

    it('should return true if at least one of the given keys is present', function () {
      expect(_get__('parser').anyKeys(_get__('json5'))).to.equal(true);
    });

    it('should throw ValidationError if none of the keys exist', function () {
      expect(_get__('parser').anyKeys.bind(_get__('parser'), _get__('json6'))).to.throw(_get__('ValidationError'));
    });
  });

  describe('requiredKeys method', function () {
    it('should be defined', function () {
      expect(_get__('parser').requiredKeys).to.be.a('function');
    });

    it('should return true if all required keys are present', function () {
      expect(_get__('parser').requiredKeys(_get__('json1'))).to.equal(true);
    });

    it('should throw ValidationError if any of the requirements are missing', function () {
      expect(_get__('parser').requiredKeys.bind(_get__('parser'), _get__('json7'))).to.throw(_get__('ValidationError'));
    });
  });

  describe('validateLeafNode method', function () {
    it('should be defined', function () {
      expect(_get__('parser').validateLeafNode).to.be.a('function');
    });

    it('should return true if the leaf node validation succeeds', function () {
      var keys = {
        "leaf": {
          "must": ["$value", "$assert"],
          "can": ["$value", "$assert", "$log"]
        }
      };
      expect(_get__('parser').validateLeafNode(_get__('json5').$payload.$expect.foo.bar, keys.leaf)).to.equal(true);
    });

    it('should throw ValidationError if the leaf node validation fails', function () {
      var keys = {
        "leaf": {
          "must": ["$value"],
          "can": ["$value", "$log"]
        }
      };

      expect(_get__('parser').validateLeafNode.bind(_get__('parser'), _get__('json8').$payload.$waitFor.foo.bar, keys.leaf)).to.throw(_get__('ValidationError'));
    });
  });

  describe('validateLeafNodes method', function () {
    it('should be defined', function () {
      expect(_get__('parser').validateLeafNodes).to.be.a('function');
    });

    it('should return true if all leaf nodes are valid', function () {
      expect(_get__('parser').validateLeafNodes(_get__('json5')));
    });

    it('should throw ValidationError if any of the leaf nodes are invalid', function () {
      expect(_get__('parser').validateLeafNodes.bind(_get__('parser'), _get__('json8'))).to.throw(_get__('ValidationError'));
    });
  });

  describe('isLeafNode method', function () {
    it('should be defined', function () {
      expect(_get__('parser').isLeafNode).to.be.a('function');
    });

    it('should return true if the node is a leaf node', function () {
      expect(_get__('parser').isLeafNode({ "$foo": "bar", "$goo": "baz" })).to.equal(true);
    });

    it('should return false if the node is not a leaf node', function () {
      expect(_get__('parser').isLeafNode({ "$aaa": "bbb", "w$w": "eee" })).to.equal(false);
    });
  });

  describe('isDesignatedKey method', function () {
    it('should be defined', function () {
      expect(_get__('parser').isDesignatedKey).to.be.a('function');
    });

    it('should return true if the key is a designated key', function () {
      expect(_get__('parser').isDesignatedKey("$foo")).to.equal(true);
    });

    it('should return false if the key is not a designated key', function () {
      expect(_get__('parser').isDesignatedKey("eee")).to.equal(false);
    });
  });

  describe('validateTypes method', function () {
    it('should be defined', function () {
      expect(_get__('parser').validateTypes).to.be.a('function');
    });

    it('should return true if all the value types are what\'s expected', function () {
      expect(_get__('parser').validateTypes(_get__('json9'))).to.equal(true);
    });

    it('should throw a ValidationError if any of the types are not correct', function () {
      expect(_get__('parser').validateTypes.bind(_get__('parser'), _get__('json10'))).to.throw(_get__('ValidationError'));
    });
  });

  describe('validate method', function () {
    it('should be defined', function () {
      expect(_get__('parser').validate).to.be.a('function');
    });

    it('should return true if the blueprint is valid', function () {
      expect(_get__('parser').validate(_get__('test1'))).to.equal(true);
    });

    it.skip('should throw a ValidationError if any of the required keys are missing or keys that are not supposed be there are there', function () {
      expect(_get__('parser').validate.bind(_get__('parser'), _get__('test2'))).to.throw(_get__('ValidationError'));
    });

    it('should throw a ValidationError if any of the values are not of required type', function () {
      expect(_get__('parser').validate.bind(_get__('parser'), _get__('test3'))).to.throw(_get__('ValidationError'));
    });
  });

  describe('flatten method', function () {
    it('should be defined', function () {
      expect(_get__('parser').flatten).to.be.a('function');
    });

    it('should successfully flatten all recursive fields into an array and remove recursive fields from each item', function () {
      var flat = _get__('parser').flatten(_get__('json11'));
      expect(flat.length).to.equal(12);
      expect(flat[0].$op).to.equal('before');
      expect(flat[11].$op).to.equal('after');
      flat.forEach(function (op, i) {
        if (op.$op === 'op1' || op.$op === 'op2') {
          expect(flat[i - 1].$op).to.equal('be2');
          expect(flat[i - 2].$op).to.equal('be1');
          expect(flat[i + 1].$op).to.equal('ae1');
          expect(flat[i + 2].$op).to.equal('ae2');
        }
      });
    });

    it('should skip the operations with $skip: true', function () {
      var flat = _get__('parser').flatten(_get__('json12'));
      expect(flat.length).to.equal(2);
    });
  });

  describe('addEachOps method', function () {
    it('should be defined', function () {
      expect(_get__('parser').addEachOps).to.be.a('function');
    });

    it('should successfully append/prepend beforeEach and afterEach operations to each of the operations', function () {
      _get__('parser').addEachOps(_get__('json13'));
      expect(_get__('json13')).to.deep.equal({
        "$before": [],
        "$ops": [{
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "be1",
          "$after": []
        }, {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "be2",
          "$after": []
        }, {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "op1",
          "$after": []
        }, {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "ae1",
          "$after": []
        }, {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "ae2",
          "$after": []
        }, {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "be1",
          "$after": []
        }, {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "be2",
          "$after": []
        }, {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "op2",
          "$after": []
        }, {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "ae1",
          "$after": []
        }, {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "ae2",
          "$after": []
        }],
        "$after": []
      });
    });
  });

  describe('parse method', function () {
    beforeEach(function () {
      stub(_get__('parser'), 'validate').onFirstCall().returns(true);
      stub(_get__('parser'), 'flatten').returns([]);
    });

    after(function () {
      _get__('parser').validate.restore();
      _get__('parser').flatten.restore();
    });

    it('should be defined', function () {
      expect(_get__('parser').parse).to.be.a('function');
    });

    it('should return the validated, completed, flattened blueprint', function () {
      _get__('parser').parse(_get__('json1'));
      expect(_get__('parser').validate).to.have.been.calledWith(_get__('json1'));
      expect(_get__('parser').flatten).to.have.been.calledWith(_get__('json1'));
    });

    it('should throw a ValidationError if the blueprint is invalid', function () {
      _get__('parser').validate.restore();
      stub(_get__('parser'), 'validate').onFirstCall().returns(false);

      expect(_get__('parser').parse.bind(_get__('parser'), _get__('json1'))).to.throw(_get__('ValidationError'));
    });
  });
});
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
    case 'json1':
      return json1;

    case 'json2':
      return json2;

    case 'json3':
      return json3;

    case 'json4':
      return json4;

    case 'json5':
      return json5;

    case 'json6':
      return json6;

    case 'json7':
      return json7;

    case 'json8':
      return json8;

    case 'json9':
      return json9;

    case 'json10':
      return json10;

    case 'json11':
      return json11;

    case 'json12':
      return json12;

    case 'json13':
      return json13;

    case 'parser':
      return parser;

    case 'Parser':
      return _parser2.default;

    case 'validation':
      return _constants.validation;

    case 'ValidationError':
      return _customErrors2.default;

    case 'test1':
      return _test2.default;

    case 'test2':
      return _test4.default;

    case 'test3':
      return _test6.default;
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
  switch (variableName) {
    case 'json1':
      return json1 = _value;

    case 'json2':
      return json2 = _value;

    case 'json3':
      return json3 = _value;

    case 'json4':
      return json4 = _value;

    case 'json5':
      return json5 = _value;

    case 'json6':
      return json6 = _value;

    case 'json7':
      return json7 = _value;

    case 'json8':
      return json8 = _value;

    case 'json9':
      return json9 = _value;

    case 'json10':
      return json10 = _value;

    case 'json11':
      return json11 = _value;

    case 'json12':
      return json12 = _value;

    case 'json13':
      return json13 = _value;

    case 'parser':
      return parser = _value;
  }

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

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;
exports.default = _RewireAPI__;
//# sourceMappingURL=parser.spec.js.map