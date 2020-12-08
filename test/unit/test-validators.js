/*
mocha tests for pskreporter validators (and example-data)
test-validators.js
*/

/* global describe, it */
import _cloneDeep from 'lodash/cloneDeep'

import js8pathPskreporter from '../../src/main.js'
let exampleData = js8pathPskreporter.exampleData

let chai = require('chai')
let assert = chai.assert

describe('pskReporter validators module', function () {
  let validators = js8pathPskreporter.validators

    describe('validators.ajvValidate.queryRequestData', function () {
      let validate = validators.ajvValidate.queryRequestData
      let validExampleData = _cloneDeep(exampleData.queryRequestData)

      it ('validates valid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        assert.isOk(validate(dataToValidate), 'validates against schema')
      })

      it ('fails to validate invalid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        dataToValidate.mode = {}
        assert.isNotOk(validate(dataToValidate))
        let errors = validate.errors
        assert.equal(errors[0].keyword, 'type', 'bad mode type')
      })
    })

  describe('validators.ajvValidate', function () {
    describe('validators.ajvValidate.rawXmlQueryResponse', function () {
      let validate = validators.ajvValidate.rawXmlQueryResponse
      let validExampleData = _cloneDeep(exampleData.rawXmlQueryResponse)

      it ('validates valid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        assert.isOk(validate(dataToValidate), 'validates against schema')
      })

      it ('fails to validate invalid example data', function () {
        // let dataToValidate = _cloneDeep(validExampleData)
        let dataToValidate = {} // '123 ' + dataToValidate
        assert.isNotOk(validate(dataToValidate))
        let errors = validate.errors
        assert.equal(errors[0].keyword, 'type', 'bad pskreporter xml string')
      })
    })

    describe('validators.ajvValidate.parsedXmlQueryResponse', function () {
      let validate = validators.ajvValidate.parsedXmlQueryResponse
      let validExampleData = _cloneDeep(exampleData.parsedXmlQueryResponse)

      it ('validates valid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        assert.isOk(validate(dataToValidate), 'validates against schema')
      })

      it ('fails to validate invalid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        dataToValidate.receptionReports.currentSeconds = {}
        assert.isNotOk(validate(dataToValidate))
        let errors = validate.errors
        assert.equal(errors[0].keyword, 'type', 'bad receptionReports.currentSeconds type')
      })
    })

    describe('validators.ajvValidate.appDataQueryResponse', function () {
      let validate = validators.ajvValidate.appDataQueryResponse
      let validExampleData = _cloneDeep(exampleData.appDataQueryResponse)

      it ('validates valid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        assert.isOk(validate(dataToValidate), 'validates against schema')
      })

      it ('fails to validate invalid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        dataToValidate.currentSeconds = {}
        assert.isNotOk(validate(dataToValidate))
        let errors = validate.errors
        assert.equal(errors[0].keyword, 'type', 'bad currentSeconds type')
      })
    })
  })

  describe('validators.validate', function () {
    describe('validators.validate.queryRequestData', function () {
      let validate = validators.validate.queryRequestData
      let validExampleData = _cloneDeep(exampleData.queryRequestData)

      it ('validates valid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        return validate(
          dataToValidate
        ).then(function (validatedData) {
          assert.deepEqual(dataToValidate, validatedData, 'returns validated error')
        })
      })

      describe('invalid example data', function () {
        let invalidExampleData = _cloneDeep(validExampleData)
        invalidExampleData.mode = {}

        it ('fails to validate invalid example data', function () {
          let dataToValidate = _cloneDeep(invalidExampleData)
          return validate(
            dataToValidate
          ).then(function () {
            assert.fail('expected validation to fail')
          }).catch(function (err) {
            // console.log('err: ' + JSON.stringify(err))
            assert.equal(err.name, 'ValidationError')
            assert.equal(err.data[0].keyword, 'type', 'bad mode type')
            assert.deepEqual(String(err), 'ValidationError: Invalid queryRequestData', 'Invalid queryRequestData')
          })
        })

        it ('validate with invalid data if validation is disabled', function () {
          let dataToValidate = _cloneDeep(invalidExampleData)
          return validate(
            dataToValidate,
            false
          ).then(function (validatedData) {
            assert.deepEqual(validatedData, dataToValidate, 'returns unvalidated invalid data as expected')
          }).catch(function (err) {
            // console.log('err: ' + JSON.stringify(err))
            assert.fail('expected validation to pass: ' + JSON.stringify(err))
          })
        })
      })
    })

    describe('validators.validate.rawXmlQueryResponse', function () {
      let validate = validators.validate.rawXmlQueryResponse
      let validExampleData = _cloneDeep(exampleData.rawXmlQueryResponse)

      it ('validates valid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        return validate(
          dataToValidate
        ).then(function (validatedData) {
          assert.deepEqual(dataToValidate, validatedData, 'returns validated error')
        })
      })

      describe('invalid example data', function () {
        let invalidExampleData = {} // '123 ' + dataToValidate

        it ('fails to validate invalid example data', function () {
          let dataToValidate = _cloneDeep(invalidExampleData)
          return validate(
            dataToValidate
          ).then(function () {
            assert.fail('expected validation to fail')
          }).catch(function (err) {
            // console.log('err: ' + JSON.stringify(err))
            assert.equal(err.name, 'ValidationError')
            assert.equal(err.data[0].keyword, 'type', 'bad raw xml')
            assert.deepEqual(String(err), 'ValidationError: Invalid rawXmlQueryResponse', 'Invalid rawXmlQueryResponse')
          })
        })

        it ('validate with invalid data if validation is disabled', function () {
          let dataToValidate = _cloneDeep(invalidExampleData)
          return validate(
            dataToValidate,
            false
          ).then(function (validatedData) {
            assert.deepEqual(validatedData, dataToValidate, 'returns unvalidated invalid data as expected')
          }).catch(function (err) {
            // console.log('err: ' + JSON.stringify(err))
            assert.fail('expected validation to pass: ' + JSON.stringify(err))
          })
        })
      })
    })

    describe('validators.validate.parsedXmlQueryResponse', function () {
      let validate = validators.validate.parsedXmlQueryResponse
      let validExampleData = _cloneDeep(exampleData.parsedXmlQueryResponse)

      it ('validates valid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        return validate(
          dataToValidate
        ).then(function (validatedData) {
          assert.deepEqual(dataToValidate, validatedData, 'returns validated error')
        })
      })

      describe('invalid example data', function () {
        let invalidExampleData = _cloneDeep(validExampleData)
        invalidExampleData.receptionReports.currentSeconds = {}

        it ('fails to validate invalid example data', function () {
          let dataToValidate = _cloneDeep(invalidExampleData)
          return validate(
            dataToValidate
          ).then(function () {
            assert.fail('expected validation to fail')
          }).catch(function (err) {
            // console.log('err: ' + JSON.stringify(err))
            assert.equal(err.name, 'ValidationError')
            assert.equal(err.data[0].keyword, 'type', 'bad receptionReports.currentSeconds type')
            assert.deepEqual(String(err), 'ValidationError: Invalid parsedXmlQueryResponse', 'Invalid parsedXmlQueryResponse')
          })
        })

        it ('validate with invalid data if validation is disabled', function () {
          let dataToValidate = _cloneDeep(invalidExampleData)
          return validate(
            dataToValidate,
            false
          ).then(function (validatedData) {
            assert.deepEqual(validatedData, dataToValidate, 'returns unvalidated invalid data as expected')
          }).catch(function (err) {
            // console.log('err: ' + JSON.stringify(err))
            assert.fail('expected validation to pass: ' + JSON.stringify(err))
          })
        })
      })
    })

    describe('validators.validate.appDataQueryResponse', function () {
      let validate = validators.validate.appDataQueryResponse
      let validExampleData = _cloneDeep(exampleData.appDataQueryResponse)

      it ('validates valid example data', function () {
        let dataToValidate = _cloneDeep(validExampleData)
        return validate(
          dataToValidate
        ).then(function (validatedData) {
          assert.deepEqual(dataToValidate, validatedData, 'returns validated error')
        })
      })

      describe('invalid example data', function () {
        let invalidExampleData = _cloneDeep(validExampleData)
        invalidExampleData.currentSeconds = {}

        it ('fails to validate invalid example data', function () {
          let dataToValidate = _cloneDeep(invalidExampleData)
          return validate(
            dataToValidate
          ).then(function () {
            assert.fail('expected validation to fail')
          }).catch(function (err) {
            // console.log('err: ' + JSON.stringify(err))
            assert.equal(err.name, 'ValidationError')
            assert.equal(err.data[0].keyword, 'type', 'bad currentSeconds type')
            assert.deepEqual(String(err), 'ValidationError: Invalid appDataQueryResponse', 'Invalid appDataQueryResponse')
          })
        })

        it ('validate with invalid data if validation is disabled', function () {
          let dataToValidate = _cloneDeep(invalidExampleData)
          return validate(
            dataToValidate,
            false
          ).then(function (validatedData) {
            assert.deepEqual(validatedData, dataToValidate, 'returns unvalidated invalid data as expected')
          }).catch(function (err) {
            // console.log('err: ' + JSON.stringify(err))
            assert.fail('expected validation to pass: ' + JSON.stringify(err))
          })
        })
      })
    })
  })
})

/*
        assert.isNotOk(validate(dataToValidate))
        let errors = validate.errors
        console.log('errors: ' + JSON.stringify(errors))
        assert.equal(JSON.stringify(errors), '...')
 */
