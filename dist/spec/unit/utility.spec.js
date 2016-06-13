'use strict';

var _utility = require('../../lib/utility');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('Utility', function () {

  beforeEach(function () {});

  describe('is function', function () {
    it('should be defined', function () {
      expect(_utility.is).to.be.a('function');
    });

    it('should return correct string for any type', function () {
      var Fuckery = function Fuckery() {
        _classCallCheck(this, Fuckery);
      };

      ;

      var fuckery = new Fuckery();
      var map = new Map();
      var set = new Set();

      expect((0, _utility.is)(123)).to.equal('number');
      expect((0, _utility.is)('foo')).to.equal('string');
      expect((0, _utility.is)({})).to.equal('object');
      expect((0, _utility.is)([])).to.equal('array');
      expect((0, _utility.is)(fuckery)).to.equal('object');
      expect((0, _utility.is)(map)).to.equal('map');
      expect((0, _utility.is)(set)).to.equal('set');
      expect((0, _utility.is)(new Error())).to.equal('error');
      expect((0, _utility.is)(null)).to.equal('null');
      expect((0, _utility.is)(undefined)).to.equal('undefined');
      expect((0, _utility.is)(new String('haha'))).to.equal('string');
      expect((0, _utility.is)(global)).to.equal('global');
    });
  });

  describe('forEachKey function', function () {
    it('should be defined', function () {
      expect(_utility.forEachKey).to.be.a('function');
    });

    it('should execute given function for each key of the object', function () {
      var obj = {
        foo: "bar",
        goo: "baz"
      };

      (0, _utility.forEachKey)(obj, function (key, index, keys) {
        obj[key] = index;
      });

      expect(obj.foo).to.equal(0);
      expect(obj.goo).to.equal(1);
    });
  });

  describe('xor function', function () {
    it('should be defined', function () {
      expect(_utility.xor).to.be.a('function');
    });

    it('should only return true when there is only one true and all else is false', function () {
      expect((0, _utility.xor)([false])).to.equal(false);
      expect((0, _utility.xor)([false, false])).to.equal(false);
      expect((0, _utility.xor)([true])).to.equal(true);
      expect((0, _utility.xor)([true, true])).to.equal(false);
      expect((0, _utility.xor)([true, false])).to.equal(true);
      expect((0, _utility.xor)([false, true, false, false])).to.equal(true);
    });
  });

  describe('applyReferences function', function () {
    it('should be defined', function () {
      expect(_utility.applyReferences).to.be.a('function');
    });

    it('should apply the references properly and return a JS object', function () {
      var goo = { "qqq": "www" },
          faa = ["a", "b", "c"];
      var toSave = {
        "foo": {
          "bar": "___#zzzz#___",
          "baz": {
            "goo": "___#xxxx#___",
            "faa": "___#yyyy#___",
            "eee": ["bbb", "hhh", "___#tttt#___"],
            "rrr": {
              "ggg": "___#uuuu#___"
            }
          }
        }
      };

      var payload = {
        "foo": {
          "bar": "minagorum",
          "baz": {
            "goo": goo,
            "faa": faa,
            "eee": ["bbb", "hhh", "hohoho"],
            "rrr": {
              "ggg": "nihoha"
            }
          }
        }
      };
      var saved = (0, _utility.getReferences)(payload, toSave);

      var op = {
        "${zzzz}": {
          "qqq": "${xxxx}",
          "www": "${yyyy}",
          "eee": ["qqqqqqq  ${tttt}  qqqqqqqq"],
          "fff": {
            "ggg": "yoo   fasdas${uuuu} adadasda"
          }
        }
      };
      var _op = {
        "minagorum": {
          "qqq": {
            "qqq": "www"
          },
          "www": ["a", "b", "c"],
          "eee": ["qqqqqqq  hohoho  qqqqqqqq"],
          "fff": {
            "ggg": "yoo   fasdasnihoha adadasda"
          }
        }
      };
      op = (0, _utility.applyReferences)(saved, op);
      expect(op).to.deep.equal(_op);
    });
  });

  describe('getReferences function', function () {
    it('should be defined', function () {
      expect(_utility.getReferences).to.be.a('function');
    });

    it('should collect all references from the given payload and save clause', function () {
      var goo = { "qqq": "www" },
          faa = ["a", "b", "c"];
      var toSave = {
        "foo": {
          "bar": "___#11111#___",
          "baz": {
            "goo": "___#22222#___",
            "faa": "___#33333#___"
          }
        }
      };

      var payload = {
        "foo": {
          "bar": "minagorum",
          "baz": {
            "goo": goo,
            "faa": faa
          }
        }
      };

      expect((0, _utility.getReferences)(payload, toSave)).to.deep.equal({
        "11111": "minagorum",
        "22222": goo,
        "33333": faa
      });
    });
  });
});