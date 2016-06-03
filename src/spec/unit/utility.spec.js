import { is, forEachKey, xor, getReferences, applyReferences } from '../../lib/utility';

describe('Utility', () => {

  beforeEach(() => {
  });

  describe('is function', () => {
    it('should be defined', () => {
      expect(is).to.be.a('function');
    });

    it('should return correct string for any type', () => {
      class Fuckery {
        constructor() {}
      };

      const fuckery = new Fuckery();
      const map = new Map();
      const set = new Set();

      expect(is(123)).to.equal('number');
      expect(is('foo')).to.equal('string');
      expect(is({})).to.equal('object');
      expect(is([])).to.equal('array');
      expect(is(fuckery)).to.equal('object');
      expect(is(map)).to.equal('map');
      expect(is(set)).to.equal('set');
      expect(is((new Error()))).to.equal('error');
      expect(is(null)).to.equal('null');
      expect(is(undefined)).to.equal('undefined');
      expect(is(new String('haha'))).to.equal('string');
      expect(is(global)).to.equal('global');
    });
  });

  describe('forEachKey function', () => {
    it('should be defined', () => {
      expect(forEachKey).to.be.a('function');
    });

    it('should execute given function for each key of the object', () => {
      const obj = {
        foo: "bar",
        goo: "baz"
      };

      forEachKey(obj, (key, index, keys) => {
        obj[key] = index;
      });

      expect(obj.foo).to.equal(0);
      expect(obj.goo).to.equal(1);
    });
  });

  describe('xor function', () => {
    it('should be defined', () => {
      expect(xor).to.be.a('function');
    });

    it('should only return true when there is only one true and all else is false', () => {
      expect(xor([false])).to.equal(false);
      expect(xor([false, false])).to.equal(false);
      expect(xor([true])).to.equal(true);
      expect(xor([true, true])).to.equal(false);
      expect(xor([true, false])).to.equal(true);
      expect(xor([false, true, false, false])).to.equal(true);
    });
  });

  describe('applyReferences function', () => {
    it('should be defined', () => {
      expect(applyReferences).to.be.a('function');
    });

    it('should apply the references properly and return a JS object', () => {
      const goo = { "qqq": "www" }, faa = ["a", "b", "c"];
      const toSave = {
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

      const payload = {
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
      const saved = getReferences(payload, toSave);

      let op = {
        "${zzzz}": {
          "qqq": "${xxxx}",
          "www": "${yyyy}",
          "eee": [
            "qqqqqqq  ${tttt}  qqqqqqqq"
          ],
          "fff": {
            "ggg": "yoo   fasdas${uuuu} adadasda"
          }
        }
      };
      let _op = {
        "minagorum": {
          "qqq": {
            "qqq": "www"
          },
          "www": [
            "a",
            "b",
            "c"
          ],
          "eee": ["qqqqqqq  hohoho  qqqqqqqq"],
          "fff": {
            "ggg": "yoo   fasdasnihoha adadasda"
          }
        }
      };
      op = applyReferences(saved, op)
      expect(op).to.deep.equal(_op);
    });
  });


  describe('getReferences function', () => {
    it('should be defined', () => {
      expect(getReferences).to.be.a('function');
    });

    it('should collect all references from the given payload and save clause', () => {
      const goo = { "qqq": "www" }, faa = ["a", "b", "c"];
      const toSave = {
        "foo": {
          "bar": "___#11111#___",
          "baz": {
            "goo": "___#22222#___",
            "faa": "___#33333#___"
          }
        }
      };

      const payload = {
        "foo": {
          "bar": "minagorum",
          "baz": {
            "goo": goo,
            "faa": faa
          }
        }
      };

      expect(getReferences(payload, toSave)).to.deep.equal({
        "11111": "minagorum",
        "22222": goo,
        "33333": faa,
      });
    });
  });

});
