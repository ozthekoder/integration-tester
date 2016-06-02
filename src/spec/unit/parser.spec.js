import Parser from '../../lib/parser';
import { is, forEachKey, xor } from '../../lib/utility';
import ValidationError from '../../lib/utility/custom-errors';
import { validation } from '../../lib/config/constants.json';
import test1 from '../data/test1.json';
import test2 from '../data/test2.json';
import test3 from '../data/test3.json';

let parser, json1, json2, json3, json4, json5, json6, json7, json8, json9, json10, json11, json12, json13;
describe('Parser Class', () => {

  beforeEach(() => {
    json1 = {
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

    json2 = {
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

    json3 = {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "name of the operation. For reuse later",
      "$plugin": "http",
      "$op": "post",
      "$args": [],
      "$payload": "",
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
      "$payload": "",
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
      "$payload": {
      },
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
      "$beforeEach": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "be1",
          "$after": []
        },
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "be2",
          "$after": []
        }
      ],
      "$afterEach": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "ae1",
          "$after": []
        },
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "ae2",
          "$after": []
        }
      ],
      "$before": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "before",
          "$after": []
        }
      ],
      "$ops": [{
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "op1",
        "$after": []
      },
      {
        "$beforeEach": [],
        "$afterEach": [],
        "$before": [],
        "$op": "op2",
        "$after": []
      }
      ],
      "$after": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "after",
          "$after": []
        }
      ]
    };

    json12 = {
      "$beforeEach": [],
      "$afterEach": [],
      "$before": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "0",
          "$skip": true,
          "$after": [
            {
              "$beforeEach": [],
              "$afterEach": [],
              "$before": [],
              "$op": "1",
              "$after": []
            }
          ]
        }
      ],
      "$ops": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "2",
          "$after": []
        }
      ],
      "$after": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "3",
          "$after": []
        }
      ]
    };

    json13 = {
      "$beforeEach": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "be1",
          "$after": []
        },
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "be2",
          "$after": []
        }
      ],
      "$afterEach": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "ae1",
          "$after": []
        },
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "ae2",
          "$after": []
        }
      ],
      "$before": [],
      "$ops": [
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "op1",
          "$after": []
        },
        {
          "$beforeEach": [],
          "$afterEach": [],
          "$before": [],
          "$op": "op2",
          "$after": []
        }
      ],
      "$after": []
    }

    parser = new Parser(validation);
  });

  it('is defined', () => {
    expect(Parser).to.be.ok;
  });

  it('and can be created', () => {
    expect(parser).to.be.ok;
    expect(parser.types).to.be.a('object');
    expect(parser.keys).to.be.a('object');
    expect(parser.designator).to.be.a('string');
    expect(parser.recursive).to.be.a('array');
  });

  describe('validateDesignator method', () => {
    it('should be defined', () => {
      expect(parser.validateDesignator).to.be.a('function');
    });

    it('should return true if all keys have the designator charactor', () => {
      expect(parser.validateDesignator(json1)).to.be.ok;
    });

    it('should throw Validation Error when one or more of the keys do not start with the designator charactor', () => {
      expect(parser.validateDesignator.bind(parser, { "foo": "bar" })).to.throw(ValidationError);
    });
  });

  describe('canHaveKeys method', () => {
    it('should be defined', () => {
      expect(parser.canHaveKeys).to.be.a('function');
    });

    it('should return true if all keys on the json are expected to be there', () => {
      expect(parser.canHaveKeys(json1)).to.be.ok;
    });

    it('should throw Validation Error when the given doesn\'t belong the json', () => {
      expect(parser.canHaveKeys.bind(parser, { "foo": "bar" })).to.throw(ValidationError);
    });
  });

  describe('generateDefault method', () => {
    it('should be defined', () => {
      expect(parser.generateDefault).to.be.a('function');
    });

    it('should return empty string if no parameter passed', () => {
      expect(parser.generateDefault()).to.equal('');
    });

    it('should return a uuid when $uuid is passed as an argument', () => {
      expect(parser.generateDefault('$uuid')).to.be.a('string');
      expect(parser.generateDefault('$uuid').length).to.equal(36)
    });
  });


  describe('mustHaveKeys method', () => {
    it('should be defined', () => {
      expect(parser.mustHaveKeys).to.be.a('function');
    });

    it('should return true if no required keys are missing in the json', () => {
      expect(parser.mustHaveKeys(json1)).to.be.ok;
    });

    it('should throw Validation Error when a required is not found on the json and it has no default value to be given', () => {
      expect(parser.canHaveKeys.bind(parser, { "foo": "bar" })).to.throw(ValidationError);
    });

    it('should return true if a required key is not found but the key has a default value defined', () => {
      expect(parser.mustHaveKeys(json3)).to.be.ok;
      expect(json3.$timeout).to.equal(10000);
      expect(json3.$before).to.deep.equal([]);
      expect(json3.$after).to.deep.equal([]);
    });
  });

  describe('eitherOrKeys method', () => {
    it('should be defined', () => {
      expect(parser.eitherOrKeys).to.be.a('function');
    });

    it('should return true if only one of the given keys exist on the object', () => {
      expect(parser.eitherOrKeys(json1)).to.equal(true);
    });

    it('should throw ValidationError if there are more then one of the given keys', () => {
      expect(parser.eitherOrKeys.bind(parser, json4)).to.throw(ValidationError);
    });
  });

  describe('anyKeys method', () => {
    it('should be defined', () => {
      expect(parser.anyKeys).to.be.a('function');
    });

    it('should return true if at least one of the given keys is present', () => {
      expect(parser.anyKeys(json5)).to.equal(true);
    });

    it('should throw ValidationError if none of the keys exist', () => {
      expect(parser.anyKeys.bind(parser, json6)).to.throw(ValidationError);
    });
  });

  describe('requiredKeys method', () => {
    it('should be defined', () => {
      expect(parser.requiredKeys).to.be.a('function');
    });

    it('should return true if all required keys are present', () => {
      expect(parser.requiredKeys(json1)).to.equal(true);
    });

    it('should throw ValidationError if any of the requirements are missing', () => {
      expect(parser.requiredKeys.bind(parser, json7)).to.throw(ValidationError);
    });
  });

  describe('validateLeafNode method', () => {
    it('should be defined', () => {
      expect(parser.validateLeafNode).to.be.a('function');
    });

    it('should return true if the leaf node validation succeeds', () => {
      const keys = {
        "leaf": {
          "must": [
            "$value",
            "$assert"
          ],
          "can": [
            "$value",
            "$assert",
            "$log"
          ]
        }
      };
      expect(parser.validateLeafNode(json5.$payload.$expect.foo.bar, keys.leaf)).to.equal(true);
    });

    it('should throw ValidationError if the leaf node validation fails', () => {
      const keys = {
        "leaf": {
          "must": [
            "$value"
          ],
          "can": [
            "$value",
            "$log"
          ]
        }
      };

      expect(parser.validateLeafNode.bind(parser, json8.$payload.$waitFor.foo.bar, keys.leaf)).to.throw(ValidationError);
    });
  });


  describe('validateLeafNodes method', () => {
    it('should be defined', () => {
      expect(parser.validateLeafNodes).to.be.a('function');
    });

    it('should return true if all leaf nodes are valid', () =>{
      expect(parser.validateLeafNodes(json5))
    });

    it('should throw ValidationError if any of the leaf nodes are invalid', () => {
      expect(parser.validateLeafNodes.bind(parser, json8)).to.throw(ValidationError);
    });
  });

  describe('isLeafNode method', () => {
    it('should be defined', () => {
      expect(parser.isLeafNode).to.be.a('function');
    });

    it('should return true if the node is a leaf node', () =>{
      expect(parser.isLeafNode({ "$foo": "bar", "$goo": "baz" })).to.equal(true);
    });

    it('should return false if the node is not a leaf node', () => {
      expect(parser.isLeafNode({"$aaa": "bbb", "w$w": "eee"})).to.equal(false);
    });
  });

  describe('isDesignatedKey method', () => {
    it('should be defined', () => {
      expect(parser.isDesignatedKey).to.be.a('function');
    });

    it('should return true if the key is a designated key', () =>{
      expect(parser.isDesignatedKey("$foo")).to.equal(true);
    });

    it('should return false if the key is not a designated key', () => {
      expect(parser.isDesignatedKey("eee")).to.equal(false);
    });
  });

  describe('validateTypes method', () => {
    it('should be defined', () => {
      expect(parser.validateTypes).to.be.a('function');
    });

    it('should return true if all the value types are what\'s expected', () =>{
      expect(parser.validateTypes(json9)).to.equal(true);
    });

    it('should throw a ValidationError if any of the types are not correct', () => {
      expect(parser.validateTypes.bind(parser, json10)).to.throw(ValidationError);
    });
  });

  describe('validate method', () => {
    it('should be defined', () => {
      expect(parser.validate).to.be.a('function');
    });

    it('should return true if the blueprint is valid', () => {
      expect(parser.validate(test1)).to.equal(true);
    });

    it('should throw a ValidationError if any of the required keys are missing or keys that are not supposed be there are there', () => {
      expect(parser.validate.bind(parser, test2)).to.throw(ValidationError);
    });

    it('should throw a ValidationError if any of the values are not of required type', () => {
      expect(parser.validate.bind(parser, test3)).to.throw(ValidationError);
    });

  });

  describe('flatten method', () => {
    it('should be defined', () => {
      expect(parser.flatten).to.be.a('function');
    });

    it('should successfully flatten all recursive fields into an array and remove recursive fields from each item', () => {
      const flat = parser.flatten(json11);
      expect(flat.length).to.equal(12);
      expect(flat[0].$op).to.equal('before');
      expect(flat[11].$op).to.equal('after');
      flat.forEach((op, i) => {
        if (op.$op === 'op1' || op.$op === 'op2') {
          expect(flat[i-1].$op).to.equal('be2');
          expect(flat[i-2].$op).to.equal('be1');
          expect(flat[i+1].$op).to.equal('ae1');
          expect(flat[i+2].$op).to.equal('ae2');
        }
      });
    });

    it('should skip the operations with $skip: true', () => {
      const flat = parser.flatten(json12);
      expect(flat.length).to.equal(2);
    });
  });

  describe('addEachOps method', () => {
    it('should be defined', () => {
      expect(parser.addEachOps).to.be.a('function');
    });

    it('should successfully append/prepend beforeEach and afterEach operations to each of the operations', () => {
      parser.addEachOps(json13);
      expect(json13).to.deep.equal({
        "$before": [],
        "$ops": [
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "be1",
            "$after": []
          },
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "be2",
            "$after": []
          },
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "op1",
            "$after": []
          },
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "ae1",
            "$after": []
          },
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "ae2",
            "$after": []
          },
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "be1",
            "$after": []
          },
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "be2",
            "$after": []
          },
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "op2",
            "$after": []
          },
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "ae1",
            "$after": []
          },
          {
            "$beforeEach": [],
            "$afterEach": [],
            "$before": [],
            "$op": "ae2",
            "$after": []
          }
        ],
        "$after": []
      });
    });
  });


  describe('parse method', () => {
    beforeEach(() => {
      stub(parser, 'validate')
      .onFirstCall()
      .returns(true);
      stub(parser, 'flatten').returns([]);
    });

    after(() => {
      parser.validate.restore();
      parser.flatten.restore();
    });

    it('should be defined', () => {
      expect(parser.parse).to.be.a('function');
    });

    it('should return the validated, completed, flattened blueprint', () => {
      parser.parse(json1);
      expect(parser.validate).to.have.been.calledWith(json1);
      expect(parser.flatten).to.have.been.calledWith(json1);
    });

    it('should throw a ValidationError if the blueprint is invalid', () => {
      parser.validate.restore();
      stub(parser, 'validate')
      .onFirstCall()
      .returns(false);

      expect(parser.parse.bind(parser, json1)).to.throw(ValidationError);
    });
  });

});
