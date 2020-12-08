/*
mocha tests for transform
test-transform.js
*/

/* global describe, it */
import _cloneDeep from 'lodash/cloneDeep'

import js8pathPskreporter from '../../src/main.js'
let transform = js8pathPskreporter.transform
let exampleData = js8pathPskreporter.exampleData

let chai = require('chai')
let assert = chai.assert

describe('pskReporter transform module', function () {
  describe('parseRawXmlBasic()', function () {
    describe('parse example xml data', function () {
      let parseRawXmlBasic = transform.parseRawXmlBasic
      let xmlToParse = _cloneDeep(exampleData.rawXmlQueryResponse)
      let expectedParsedXml = _cloneDeep(exampleData.parsedXmlQueryResponse)
      it ('parses XML as expected', function () {
        return parseRawXmlBasic(xmlToParse).then(function (parsedXml) {
          // console.log('parsedXml: ' + JSON.stringify(parsedXml))
          assert.deepEqual(parsedXml, expectedParsedXml, 'parsed matches expected')
        })
      })
    })
  })

  describe('parseRawXml()', function () {
    let parseRawXml = transform.parseRawXml
    let validXmlToParse = _cloneDeep(exampleData.rawXmlQueryResponse)
    let expectedParsedXml = _cloneDeep(exampleData.parsedXmlQueryResponse)

    describe('no validation', function () {
      let xmlToParse = _cloneDeep(validXmlToParse)
      it ('parses XML as expected', function () {
        return parseRawXml(xmlToParse).then(function (parsedXml) {
          // console.log('parsedXml: ' + JSON.stringify(parsedXml))
          assert.deepEqual(parsedXml, expectedParsedXml, 'parsed matches expected')
        })
      })
    })

    describe('with validation', function () {
      it ('parses good XML as expected', function () {
        let xmlToParse = _cloneDeep(validXmlToParse)
        return parseRawXml(
          xmlToParse,
          true,
          true
        ).then(function (parsedXml) {
          // console.log('parsedXml: ' + JSON.stringify(parsedXml))
          assert.deepEqual(parsedXml, expectedParsedXml, 'parsed matches expected')
        })
      })

      it ('raises validation error on bad xml input', function () {
        let xmlToParse = {}
        return parseRawXml(
          xmlToParse,
          true,
          true
        ).then(function () {
          assert.fail('expected validation to fail')
        }).catch(function (err) {
          // console.log('err: ' + JSON.stringify(err))
          assert.equal(err.name, 'ValidationError')
          assert.equal(err.data[0].keyword, 'type', 'bad raw xml')
          assert.deepEqual(String(err), 'ValidationError: Invalid rawXmlQueryResponse', 'Invalid rawXmlQueryResponse')
        })
      })

      it ('raises validation error on bad parsed xml output', function () {
        // FixMe: no easy way to test this
      })
    })
  })

  describe('basicXfmParsedXmlToAppData()', function () {
    describe('decode example parsed xml data to app data', function () {
      let xfmParsedXmlToAppData = transform.xfmParsedXmlToAppData
      let expectedAppData = _cloneDeep(exampleData.appDataQueryResponse)
      it ('decodes parsed XML data as expected', function () {
        let parsedXmlData = _cloneDeep(exampleData.parsedXmlQueryResponse)
        return xfmParsedXmlToAppData(parsedXmlData).then(function (appData) {
          // console.log('appData: ' + JSON.stringify(appData))
          assert.deepEqual(appData, expectedAppData, 'parsed matches expected')
        })
      })
    })
  })

  describe('xfmParsedXmlToAppData()', function () {
    let xfmParsedXmlToAppData = transform.xfmParsedXmlToAppData
    let validParsedXmlData = _cloneDeep(exampleData.parsedXmlQueryResponse)
    let expectedAppData = _cloneDeep(exampleData.appDataQueryResponse)

    describe('no validation', function () {
      it ('decodes parsed XML data as expected', function () {
        let parsedXmlData = _cloneDeep(validParsedXmlData)
        return xfmParsedXmlToAppData(parsedXmlData).then(function (appData) {
          // console.log('appData: ' + JSON.stringify(appData))
          assert.deepEqual(appData, expectedAppData, 'parsed matches expected')
        })
      })
    })

    describe('with validation', function () {
      it ('parses good XML as expected', function () {
        let parsedXmlData = _cloneDeep(validParsedXmlData)
        return xfmParsedXmlToAppData(
          parsedXmlData,
          true,
          true
        ).then(function (appData) {
          // console.log('appData: ' + JSON.stringify(appData))
          assert.deepEqual(appData, expectedAppData, 'parsed matches expected')
        })
      })

      it ('raises validation error on bad parsed xml data input', function () {
        let parsedXmlData = _cloneDeep(validParsedXmlData)
        parsedXmlData.receptionReports.currentSeconds = {}

        return xfmParsedXmlToAppData(
          parsedXmlData,
          true,
          true
        ).then(function () {
          assert.fail('expected validation to fail')
        }).catch(function (err) {
          // console.log('err: ' + JSON.stringify(err))
          assert.equal(err.name, 'ValidationError')
          assert.equal(err.data[0].keyword, 'type', 'bad receptionReports.currentSeconds type')
          assert.deepEqual(String(err), 'ValidationError: Invalid parsedXmlQueryResponse', 'Invalid parsedXmlQueryResponse')
        })
      })

      it ('raises validation error on bad app data output', function () {
        // FixMe: no easy way to test this
      })
    })
  })

  describe('parseAndXfm()', function () {
    let parseAndXfm = transform.parseAndXfm
    let validXmlToParse = _cloneDeep(exampleData.rawXmlQueryResponse)
    let expectedAppData = _cloneDeep(exampleData.appDataQueryResponse)

    describe('no validation', function () {
      let xmlToParse = _cloneDeep(validXmlToParse)
      it ('parses and decodes XML as expected', function () {
        return parseAndXfm(xmlToParse).then(function (appData) {
          // console.log('appData: ' + JSON.stringify(appData))
          assert.deepEqual(appData, expectedAppData, 'parsed matches expected')
        })
      })
    })

    describe('with validation', function () {
      it ('parses and decodes good XML as expected', function () {
        let xmlToParse = _cloneDeep(validXmlToParse)
        return parseAndXfm(
          xmlToParse,
          true
        ).then(function (appData) {
          // console.log('appData: ' + JSON.stringify(appData))
          assert.deepEqual(appData, expectedAppData, 'parsed matches expected')
        })
      })

      it ('raises validation error on bad xml input', function () {
        let xmlToParse = {}
        return parseAndXfm(
          xmlToParse,
          true
        ).then(function () {
          assert.fail('expected validation to fail')
        }).catch(function (err) {
          // console.log('err: ' + JSON.stringify(err))
          assert.equal(err.name, 'ValidationError')
          assert.equal(err.data[0].keyword, 'type', 'bad raw xml')
          assert.deepEqual(String(err), 'ValidationError: Invalid rawXmlQueryResponse', 'Invalid rawXmlQueryResponse')
        })
      })

      it ('raises validation error on bad appData output', function () {
        // FixMe: no easy way to test this
      })
    })
  })

  describe('basicXfmAppDataToJs8pathData()', function () {
    let xfm = transform.basicXfmAppDataToJs8pathData
    let goodDataToTransform = _cloneDeep(exampleData.appDataQueryResponse)
    let goodTransformedData = _cloneDeep(exampleData.js8pathDataReceptionReports)

    describe('decode example app data to js8path reception reports', function () {
      let expectedResult = _cloneDeep(goodTransformedData)
      it ('transforms example data as expected', function () {
        let dataToTransform = _cloneDeep(goodDataToTransform)
        return xfm(dataToTransform).then(function (transformedData) {
          // console.log('transformedData: ' + JSON.stringify(transformedData))
          assert.deepEqual(transformedData, expectedResult, 'parsed matches expected')
        })
      })
    })
  })

  describe('xfmAppDataToJs8pathData()', function () {
    let xfm = transform.xfmAppDataToJs8pathData
    let goodDataToTransform = _cloneDeep(exampleData.appDataQueryResponse)
    let goodTransformedData = _cloneDeep(exampleData.js8pathDataReceptionReports)

    describe('no validation', function () {
      let expectedResult = _cloneDeep(goodTransformedData)
      it ('transforms example data as expected', function () {
        let dataToTransform = _cloneDeep(goodDataToTransform)
        return xfm(dataToTransform).then(function (transformedData) {
          // console.log('transformedData: ' + JSON.stringify(transformedData))
          assert.deepEqual(transformedData, expectedResult, 'transformed matches expected')
        })
      })
    })

    describe('with validation', function () {

      it ('transform good data as expected', function () {
        let expectedResult = _cloneDeep(goodTransformedData)
        let dataToTransform = _cloneDeep(goodDataToTransform)
        return xfm(
          dataToTransform,
          true,
          true
        ).then(function (transformedData) {
          // console.log('transformedData: ' + JSON.stringify(transformedData))
          assert.deepEqual(transformedData, expectedResult, 'transformed matches expected')
        })
      })

      it ('raises validation error on bad xml input', function () {
        let expectedResult = _cloneDeep(goodTransformedData)
        let dataToTransform = {}
        return xfm(
          dataToTransform,
          true,
          true
        ).then(function (transformedData) {
          assert.fail('expected validation to fail')
        }).catch(function (err) {
          // console.log('err: ' + JSON.stringify(err))
          assert.equal(err.name, 'ValidationError')
          assert.equal(err.data[0].keyword, 'required', 'bad appDataQueryResponse')
          assert.deepEqual(String(err), 'ValidationError: Invalid appDataQueryResponse', 'Invalid appDataQueryResponse')
        })
      })

      it ('raises validation error on bad js8path data output', function () {
        // FixMe: no easy way to test this
        assert.isOk(true, 'needs test')
      })
    })
  })
})

/*
        assert.isNotOk(validate(dataToValidate))
        let errors = validate.errors
        assert.equal(JSON.stringify(errors), '...')
 */
