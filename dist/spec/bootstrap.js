'use strict';

var Promise = require('bluebird');
var chai = require('chai');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chai_as_promised = require('chai-as-promised');
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