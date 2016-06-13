'use strict';

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
    json1 = {
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
    };

    json2 = {
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": {},
      "$timeout": 5000,
      "$after": []
    };

    json3 = {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": {}
    };

    json4 = {
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
    };

    json5 = {
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
    };

    json6 = {
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
    };

    json7 = {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$before": [],
      "$op": "post",
      "$args": [],
      "$payload": "",
      "$timeout": 5000,
      "$after": []
    };

    json8 = {
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
    };

    json9 = {
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
    };

    json10 = {
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
    };

    json11 = {
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
    };

    json12 = {
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
    };

    json13 = {
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
    };

    parser = new _parser2.default(_constants.validation);
  });

  it('is defined', function () {
    expect(_parser2.default).to.be.ok;
  });

  it('and can be created', function () {
    expect(parser).to.be.ok;
    expect(parser.types).to.be.a('object');
    expect(parser.keys).to.be.a('object');
    expect(parser.designator).to.be.a('string');
    expect(parser.recursive).to.be.a('array');
  });

  describe('validateDesignator method', function () {
    it('should be defined', function () {
      expect(parser.validateDesignator).to.be.a('function');
    });

    it('should return true if all keys have the designator charactor', function () {
      expect(parser.validateDesignator(json1)).to.be.ok;
    });

    it('should throw Validation Error when one or more of the keys do not start with the designator charactor', function () {
      expect(parser.validateDesignator.bind(parser, { "foo": "bar" })).to.throw(_customErrors2.default);
    });
  });

  describe('canHaveKeys method', function () {
    it('should be defined', function () {
      expect(parser.canHaveKeys).to.be.a('function');
    });

    it('should return true if all keys on the json are expected to be there', function () {
      expect(parser.canHaveKeys(json1)).to.be.ok;
    });

    it('should throw Validation Error when the given doesn\'t belong the json', function () {
      expect(parser.canHaveKeys.bind(parser, { "foo": "bar" })).to.throw(_customErrors2.default);
    });
  });

  describe('generateDefault method', function () {
    it('should be defined', function () {
      expect(parser.generateDefault).to.be.a('function');
    });

    it('should return empty string if no parameter passed', function () {
      expect(parser.generateDefault()).to.equal('');
    });

    it('should return a uuid when $uuid is passed as an argument', function () {
      expect(parser.generateDefault('$uuid')).to.be.a('string');
      expect(parser.generateDefault('$uuid').length).to.equal(36);
    });
  });

  describe('mustHaveKeys method', function () {
    it('should be defined', function () {
      expect(parser.mustHaveKeys).to.be.a('function');
    });

    it('should return true if no required keys are missing in the json', function () {
      expect(parser.mustHaveKeys(json1)).to.be.ok;
    });

    it('should throw Validation Error when a required is not found on the json and it has no default value to be given', function () {
      expect(parser.canHaveKeys.bind(parser, { "foo": "bar" })).to.throw(_customErrors2.default);
    });

    it('should return true if a required key is not found but the key has a default value defined', function () {
      expect(parser.mustHaveKeys(json3)).to.be.ok;
      expect(json3.$beforeEach).to.deep.equal([]);
      expect(json3.$afterEach).to.deep.equal([]);
      expect(json3.$before).to.deep.equal([]);
      expect(json3.$after).to.deep.equal([]);
    });
  });

  describe('eitherOrKeys method', function () {
    it('should be defined', function () {
      expect(parser.eitherOrKeys).to.be.a('function');
    });

    it('should return true if only one of the given keys exist on the object', function () {
      expect(parser.eitherOrKeys(json1)).to.equal(true);
    });

    it('should throw ValidationError if there are more then one of the given keys', function () {
      expect(parser.eitherOrKeys.bind(parser, json4)).to.throw(_customErrors2.default);
    });
  });

  describe('anyKeys method', function () {
    it('should be defined', function () {
      expect(parser.anyKeys).to.be.a('function');
    });

    it('should return true if at least one of the given keys is present', function () {
      expect(parser.anyKeys(json5)).to.equal(true);
    });

    it('should throw ValidationError if none of the keys exist', function () {
      expect(parser.anyKeys.bind(parser, json6)).to.throw(_customErrors2.default);
    });
  });

  describe('requiredKeys method', function () {
    it('should be defined', function () {
      expect(parser.requiredKeys).to.be.a('function');
    });

    it('should return true if all required keys are present', function () {
      expect(parser.requiredKeys(json1)).to.equal(true);
    });

    it('should throw ValidationError if any of the requirements are missing', function () {
      expect(parser.requiredKeys.bind(parser, json7)).to.throw(_customErrors2.default);
    });
  });

  describe('validateLeafNode method', function () {
    it('should be defined', function () {
      expect(parser.validateLeafNode).to.be.a('function');
    });

    it('should return true if the leaf node validation succeeds', function () {
      var keys = {
        "leaf": {
          "must": ["$value", "$assert"],
          "can": ["$value", "$assert", "$log"]
        }
      };
      expect(parser.validateLeafNode(json5.$payload.$expect.foo.bar, keys.leaf)).to.equal(true);
    });

    it('should throw ValidationError if the leaf node validation fails', function () {
      var keys = {
        "leaf": {
          "must": ["$value"],
          "can": ["$value", "$log"]
        }
      };

      expect(parser.validateLeafNode.bind(parser, json8.$payload.$waitFor.foo.bar, keys.leaf)).to.throw(_customErrors2.default);
    });
  });

  describe('validateLeafNodes method', function () {
    it('should be defined', function () {
      expect(parser.validateLeafNodes).to.be.a('function');
    });

    it('should return true if all leaf nodes are valid', function () {
      expect(parser.validateLeafNodes(json5));
    });

    it('should throw ValidationError if any of the leaf nodes are invalid', function () {
      expect(parser.validateLeafNodes.bind(parser, json8)).to.throw(_customErrors2.default);
    });
  });

  describe('isLeafNode method', function () {
    it('should be defined', function () {
      expect(parser.isLeafNode).to.be.a('function');
    });

    it('should return true if the node is a leaf node', function () {
      expect(parser.isLeafNode({ "$foo": "bar", "$goo": "baz" })).to.equal(true);
    });

    it('should return false if the node is not a leaf node', function () {
      expect(parser.isLeafNode({ "$aaa": "bbb", "w$w": "eee" })).to.equal(false);
    });
  });

  describe('isDesignatedKey method', function () {
    it('should be defined', function () {
      expect(parser.isDesignatedKey).to.be.a('function');
    });

    it('should return true if the key is a designated key', function () {
      expect(parser.isDesignatedKey("$foo")).to.equal(true);
    });

    it('should return false if the key is not a designated key', function () {
      expect(parser.isDesignatedKey("eee")).to.equal(false);
    });
  });

  describe('validateTypes method', function () {
    it('should be defined', function () {
      expect(parser.validateTypes).to.be.a('function');
    });

    it('should return true if all the value types are what\'s expected', function () {
      expect(parser.validateTypes(json9)).to.equal(true);
    });

    it('should throw a ValidationError if any of the types are not correct', function () {
      expect(parser.validateTypes.bind(parser, json10)).to.throw(_customErrors2.default);
    });
  });

  describe('validate method', function () {
    it('should be defined', function () {
      expect(parser.validate).to.be.a('function');
    });

    it('should return true if the blueprint is valid', function () {
      expect(parser.validate(_test2.default)).to.equal(true);
    });

    it.skip('should throw a ValidationError if any of the required keys are missing or keys that are not supposed be there are there', function () {
      expect(parser.validate.bind(parser, _test4.default)).to.throw(_customErrors2.default);
    });

    it('should throw a ValidationError if any of the values are not of required type', function () {
      expect(parser.validate.bind(parser, _test6.default)).to.throw(_customErrors2.default);
    });
  });

  describe('flatten method', function () {
    it('should be defined', function () {
      expect(parser.flatten).to.be.a('function');
    });

    it('should successfully flatten all recursive fields into an array and remove recursive fields from each item', function () {
      var flat = parser.flatten(json11);
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
      var flat = parser.flatten(json12);
      expect(flat.length).to.equal(2);
    });
  });

  describe('addEachOps method', function () {
    it('should be defined', function () {
      expect(parser.addEachOps).to.be.a('function');
    });

    it('should successfully append/prepend beforeEach and afterEach operations to each of the operations', function () {
      parser.addEachOps(json13);
      expect(json13).to.deep.equal({
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
      stub(parser, 'validate').onFirstCall().returns(true);
      stub(parser, 'flatten').returns([]);
    });

    after(function () {
      parser.validate.restore();
      parser.flatten.restore();
    });

    it('should be defined', function () {
      expect(parser.parse).to.be.a('function');
    });

    it('should return the validated, completed, flattened blueprint', function () {
      parser.parse(json1);
      expect(parser.validate).to.have.been.calledWith(json1);
      expect(parser.flatten).to.have.been.calledWith(json1);
    });

    it('should throw a ValidationError if the blueprint is invalid', function () {
      parser.validate.restore();
      stub(parser, 'validate').onFirstCall().returns(false);

      expect(parser.parse.bind(parser, json1)).to.throw(_customErrors2.default);
    });
  });
});