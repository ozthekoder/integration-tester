import Parser from '../../lib/parser';
import ValidationError from '../../lib/utility/custom-errors';
import { validation } from '../../lib/config/constants.json';

let parser, json1, json2, json3, json4, json5, json6, json7, json8;
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

    it('should return true if the node is a leaf node', () =>{
      expect(parser.isLeafNode({ "$foo": "bar", "$goo": "baz" })).to.equal(true);
    });

    it('should return false if the node is not a leaf node', () => {
      expect(parser.isLeafNode({"$aaa": "bbb", "w$w": "eee"})).to.equal(false);
    });
  });

});
