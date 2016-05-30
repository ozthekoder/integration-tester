import uuid from 'uuid';
import { is, forEachKey, xor } from './utility';
import { ValidationError } from './utility/custom-errors';
import { validation } from './config/constants.json';

export default class Parser {
  constructor(validation) {
    Object.assign(this, validation)
  }

  validate(blueprint) {
    this.validateDesignator(blueprint);
    this.validateKeys(blueprint);
    this.validateTypes(blueprint);
    this.recursive.forEach((key) => { if (key in blueprint && is(blueprint[key]) === 'array') blueprint[key].forEach((item) => this.validate(item))});
    return true;
  }

  flatten(blueprint) {
    if(!blueprint.$skip) {
      return this.recursive
      .map((key) => {
        if (blueprint[key]) {
          if(is(blueprint[key]) === 'array') {
            return blueprint[key]
            .map((op) => this.flatten(op))
            .reduce((prev, current) => prev.concat(current), []);
          }
          else if (is(blueprint[key]) === 'string') {
            return [blueprint];
          }
        }
        return [];
      })
      .reduce((prev, current) => prev.concat(current), [])
      .map((op) => {
        forEachKey(this.recursive, (key) => {
          if (op[key] && is(op[key]) === 'array') {
            delete op[key];
          }
        });
        return op;
      });
    }

    return [];
  }

  parse(blueprint) {
    if(this.validate(blueprint)) return this.flatten(blueprint);
    throw new ValidationError('Could not parse blueprint');
  }

  validateDesignator(blueprint, designator = this.designator) {
    forEachKey(blueprint, (key) => {
      if(key.charAt(0) !== designator) {
        throw new ValidationError(`Designator character is missing in the ${keys} key.`)
      }
    });
    return true;
  }


  validateKeys(blueprint, keys = this.keys) {
    this.mustHaveKeys(blueprint ,keys);
    this.canHaveKeys(blueprint, keys);
    this.anyKeys(blueprint, keys);
    this.eitherOrKeys(blueprint, keys);
    this.requiredKeys(blueprint, keys);
    this.validateLeafNodes(blueprint, keys);
    return true;
  }

  mustHaveKeys(blueprint, keys = this.keys) {
    const { must, defaults } = keys;

    if(must && blueprint) {
      let i;
      for(i=0; i< must.length; i++) {
        if(!(must[i] in blueprint)) {
          if(!(must[i] in defaults)) {
            throw new ValidationError(`required key ${must[i]} was not found in the json`);
          }
          blueprint[must[i]] = defaults[must[i]];
        }
      }
    }

    forEachKey(keys.children, (key) => this.mustHaveKeys(blueprint[key], keys.children[key]));
    return true;
  }

  canHaveKeys(blueprint, keys = this.keys) {
    const { can } = keys;

    if(can && blueprint) {
      forEachKey(blueprint, (k) => {
        if(!can.some((key) => k === key)) {
          throw new ValidationError('There is an unrecognized key in the json');
        }
      });
    }

    forEachKey(keys.children, (key) => this.canHaveKeys(blueprint[key], keys.children[key]));
    return true;
  }

  eitherOrKeys(blueprint, keys = this.keys) {
    const { either_or } = keys;

    if(either_or && blueprint) {
      const result = either_or.map((pair) => pair.map((key) => (key in blueprint))).reduce((prev, pair) => ( xor(pair) && prev ), true);
      if(!result) {
        throw new ValidationError(`One of the explicit or keys conditions failed`);
      }
    }

    forEachKey(keys.children, (key) => this.eitherOrKeys(blueprint[key], keys.children[key]));
    return true;
  }

  anyKeys(blueprint, keys = this.keys) {
    const { any } = keys;

    if(any && blueprint) {

      const result = any
      .map((key) => key in blueprint)
      .reduce((prev, predicate) => (prev || predicate), false);
      if(!result) {
        throw new ValidationError(`One of any key conditions failed`);
      }
    }

    forEachKey(keys.children, (key) => this.anyKeys(blueprint[key], keys.children[key]));
    return true;
  }

  requiredKeys(blueprint, keys = this.keys) {
    const { requires } = keys;

    if(blueprint && requires) {
      const results = requires.map((reqs) => reqs.map((key) => (key in blueprint)));
      const result = results.every((i) => (i.every((k) => k === false) || i.every((k) => k === true)));
      if(!result) {
        throw new ValidationError(`One of the required keys do not exist on the object`);
      }
    }
    forEachKey(keys.children, (key) => this.requiredKeys(blueprint[key], keys.children[key]));

    return true;
  }

  validateLeafNode(blueprint, keys = this.keys) {
    const result = this.validateKeys(blueprint, keys);

    if(!result) {
      throw new ValidationError(`Leaf node validation failed!`);
    }
    return true;
  }

  validateLeafNodes(blueprint, keys = this.keys) {
    const { leaf } = keys;

    if(blueprint && leaf) {
      if (this.isLeafNode(blueprint)) {
        this.validateLeafNode(blueprint, leaf)
      } else {
        forEachKey(blueprint, (key) => {
          this.validateLeafNodes(blueprint[key], keys);
        });
      }
    }

    forEachKey(keys.children, (key) => this.validateLeafNodes(blueprint[key], keys.children[key]));

    return true;
  }

  isLeafNode(node) {
    let check = true;

    forEachKey(node, (key) => {
      if (!this.isDesignatedKey(key)) {
        check = false;
      }
    });

    return check;
  }

  isDesignatedKey(key) {
    return key.indexOf(this.designator) === 0;
  }

  validateTypes(blueprint, types = this.types) {
    forEachKey(blueprint, (key) => {
      this.validateType(blueprint[key], types[key]);
    });

    forEachKey(blueprint, (key) => { this.validateTypes(blueprint[key], types[key])});
    return true;
  }

  validateType(value, allowed) {
    if(allowed && is(allowed) === 'string') {
      allowed = allowed.split('|');
      const result = allowed.some((type) => type === is(value));
      if(!result) {
        throw new ValidationError(`Type validation on key failed!`);
      }
    }
    forEachKey(value, (key) => { this.validateType(value[key], allowed[key])});
    return true;
  }
}
