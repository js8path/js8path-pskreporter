/*
run all mocha integration tests for @js8path/js8path-pskreporter
inttest-ALL.js
*/

/* global describe */

// es6-promise polyfill needed for IE and other platforms without native ES6 Promise
import es6Promise from 'es6-promise'
es6Promise.polyfill()

describe('@js8path/js8path-pskreporter integration tests', function () {
  require('./inttest-net.js')
})

