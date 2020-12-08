/*
run all mocha unit tests for @js8path/js8path-pskreporter
test-ALL.js
*/

/* global describe */

// es6-promise polyfill needed for IE and other platforms without native ES6 Promise
import es6Promise from 'es6-promise'
es6Promise.polyfill()

describe('All @js8path/js8path-pskreporter unit tests', function () {
  require('./test-example-data.js')
  require('./test-net.js')
  require('./test-transform.js')
  require('./test-validators.js')
})
