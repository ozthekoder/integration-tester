import uuid from 'uuid';
import { is, forEachKey, xor } from './utility';
import { ValidationError } from './utility/custom-errors';
import { validation } from './config/constants.json';

export default class Parser {
  constructor(validation) {
    Object.assign(this, validation)
  }

  validate(blueprint) {

  }

  flatten() {

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

    if(must && keys) {
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

    if(can && keys) {
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

    if(either_or && keys) {
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

    if(any && keys) {

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

    if(keys && requires) {
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

    if(keys && leaf) {
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

  validateTypes(blueprint) {
    const keys = Object.keys(blueprint);
    let i;
    for(i=0; i<keys.length; i++) {
      if(keys[i].charAt(0) !== validation.designator) {
        throw new ValidationError(`Designator character is missing in the ${keys[i]} key.`)
      }
    }
  }
}
