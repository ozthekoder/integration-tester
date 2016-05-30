import { is, forEachKey, xor } from '../../lib/utility';

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


});
