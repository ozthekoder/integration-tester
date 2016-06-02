import uuid from 'uuid';
import { is, forEachKey, xor } from './utility';
import { ValidationError } from './utility/custom-errors';

export default class Parser {
  constructor(validation) {
    Object.assign(this, validation)
  }

  validate(blueprint) {
    this.validateDesignator(blueprint);
    this.validateKeys(blueprint);
    this.validateTypes(blueprint);
    [...this.recursive, ...this.each.before, ...this.each.after].forEach((key) => { if (key in blueprint && is(blueprint[key]) === 'array') blueprint[key].forEach((item) => this.validate(item))});
    return true;
  }

  flatten(blueprint) {
    if(!blueprint.$skip) {
      this.addEachOps(blueprint)
      const toRemove = [...this.recursive, ...this.each.before, ...this.each.after];
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
        toRemove.forEach((key) => {
          if (op[key] && is(op[key]) === 'array') {
            delete op[key];
          }
        });
        return op;
      });
    }

    return [];
  }

  addEachOps(blueprint) {
    const b = Object.assign({}, blueprint);
    const { $beforeEach, $afterEach } = b;
    const toRemove = [...this.each.before, ...this.each.after];

    toRemove.forEach((key) => {
      delete blueprint[key];
    });

    if (($beforeEach && $afterEach) &&
        ($beforeEach.length + $afterEach.length)) {
      const ops = this.getOps(b);
    blueprint.$ops = ops
    .map((op) =>[...$beforeEach, op, ...$afterEach])
    .reduce((prev, current) =>  prev.concat(current), []);
    }
  }

  getOps(blueprint) {
    return blueprint.$op ? [blueprint] : blueprint.$ops;
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
    //this.validateLeafNodes(blueprint, keys);
    return true;
  }

  generateDefault(type) {
    if (type) {
      switch(type) {
        case '$uuid':
          return uuid.v4();
        break;
        default:
          return '';
        break;
      }
    }

    return '';
  }

  mustHaveKeys(blueprint, keys = this.keys) {
    let { must, defaults } = keys;
    defaults = defaults || {};
    if(must && blueprint) {
      let i;
      for(i=0; i< must.length; i++) {
        if(!(must[i] in blueprint)) {
          if(!(must[i] in defaults)) {
            throw new ValidationError(`required key ${must[i]} was not found in the json`);
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
      Object
      .keys(keys.children)
      .filter(this.isDesignatedKey.bind(this))
      .filter((k) => k in blueprint)
      .forEach((k) => {
        this.mustHaveKeys(blueprint[k], keys.children[k])
      });
    }
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
    if (keys.children) {

      Object
      .keys(keys.children)
      .filter(this.isDesignatedKey.bind(this))
      .filter((k) => k in blueprint)
      .forEach((k) => this.canHaveKeys(blueprint[k], keys.children[k]));
    }
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
    if (keys.children) {

      Object
      .keys(keys.children)
      .filter(this.isDesignatedKey.bind(this))
      .filter((k) => k in blueprint)
      .forEach((k) => this.eitherOrKeys(blueprint[k], keys.children[k]));
    }
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
    if (keys.children) {

      Object
      .keys(keys.children)
      .filter(this.isDesignatedKey.bind(this))
      .filter((k) => k in blueprint)
      .forEach((k) => this.anyKeys(blueprint[k], keys.children[k]));
    }
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
    if (keys.children) {

      Object
      .keys(keys.children)
      .filter(this.isDesignatedKey.bind(this))
      .filter((k) => k in blueprint)
      .forEach((k) => this.requiredKeys(blueprint[k], keys.children[k]));
    }

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
    if (keys.children) {

      Object
      .keys(keys.children)
      .filter(this.isDesignatedKey.bind(this))
      .filter((k) => k in blueprint)
      .forEach((k) => this.validateLeafNodes(blueprint[k], keys.children[k]));
    }

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
    if(is(key) === 'string'){
      return key.indexOf(this.designator) === 0;
    }

    return false;
  }

  validateTypes(blueprint, types = this.types) {
    if(blueprint) {
      Object
      .keys(blueprint)
      .filter(this.isDesignatedKey.bind(this))
      .forEach((key) => this.validateType(blueprint[key], types[key]));

      Object
      .keys(blueprint)
      .filter(this.isDesignatedKey.bind(this))
      .forEach((key) => this.validateTypes(blueprint[key], types[key]));
    }
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
      Object
      .keys(value)
      .filter(this.isDesignatedKey.bind(this))
      .filter((k) => k in allowed)
      .forEach((key) => this.validateTypes(value[key], allowed[key]));
    return true;
  }
}
