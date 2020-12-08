/*
mocha tests for example data
test-example-data.js
*/

/* global describe, it */
import _isObject from 'lodash/isObject'
import js8pathData from '@js8path/js8path-data'

import js8pathPskreporter from '../../src/main.js'
import _cloneDeep from "lodash/cloneDeep";

let chai = require('chai')
let assert = chai.assert

describe('example-data module', function () {
  let exampleData = js8pathPskreporter.exampleData

  describe('exampleData.queryRequestData', function () {
    it('is an object', function () {
      assert.isOk(_isObject(exampleData.queryRequestData), 'isObject')
    })
    it('is validated against schema in test-validator: validators.ajvValidate.queryRequestData', function () {
    })
  })

  describe('exampleData.parsedXmlQueryResponse', function () {
    it('is an object', function () {
      assert.isOk(_isObject(exampleData.parsedXmlQueryResponse), 'isObject')
    })
    it('is validated against schema in test-validator: validators.ajvValidate.parsedXmlQueryResponse', function () {
    })
  })

  describe('exampleData.appDataQueryResponse', function () {
    it('is an object', function () {
      assert.isOk(_isObject(exampleData.appDataQueryResponse), 'isObject')
    })
    it('is validated against schema in test-validator: validators.ajvValidate.appDataQueryResponse', function () {
    })
  })

  describe('exampleData.js8pathDataReceptionReports', function () {
    let validate = js8pathData.validators.ajvValidate.receptionReportList
    let validExampleData = _cloneDeep(exampleData.js8pathDataReceptionReports)

    it('is validated by appropriate validator', function () {
      let dataToValidate = _cloneDeep(validExampleData)
      assert.isOk(validate(dataToValidate), 'validates against schema')
    })
  })
})

/*
        assert.isNotOk(validate(dataToValidate))
        let errors = validate.errors
        console.log(JSON.stringify(errors))
        assert.equal(JSON.stringify(errors), '...')
 */
