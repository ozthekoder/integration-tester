import Parser from './parser';
import { validation } from './config/constants.json';
const blueprint = {
  "$id": "0",
  "$log": "what should be logged",
  "$before": [],
  "$after": [],
  "$beforeEach": [],
  "$afterEach": [],
  "$ops": [
    {
      "$id": "1",
      "$log": "what should be logged",
      "$name": "op1",
      "$before": [],
      "$plugin": "wait",
      "$op": "wait",
      "$args": [4],
      "$payload": {
        "$expect": {},
        "$waitFor": {},
        "$save": {}
      },
      "$timeout": 5000,
      "$after": []
    },
    {
      "$id": "2",
      "$log": "what should be logged",
      "$name": "op2",
      "$before": [],
      "$plugin": "wait",
      "$op": "wait",
      "$args": [2],
      "$payload": {
        "$expect": {},
        "$waitFor": {},
        "$save": {}
      },
      "$timeout": 5000,
      "$after": []
    }
  ]
};
const parser = new Parser(validation);

const parsed = parser.parse(blueprint);

console.log(JSON.stringify(parsed, null, 2));
