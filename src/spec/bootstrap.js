'use strict';
const Promise = require('bluebird');
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai_as_promised = require('chai-as-promised');
require('sinon-as-promised')(Promise);


chai.use(sinonChai);
chai.use(chai_as_promised);


// add test methods to global scope
global.expect = chai.expect;
global.spy = sinon.spy;
global.stub = sinon.stub;
global.mock = sinon.mock;
global.useFakeTimers = sinon.useFakeTimers;
global.proxyquire = proxyquire;


