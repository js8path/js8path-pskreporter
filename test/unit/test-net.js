/*
mocha tests for net
test-pskrepporter-net.js
*/

/* global describe, it */
import _isString from 'lodash/isString'
import js8pathData from '@js8path/js8path-data'

import js8pathPskreporter from '../../src/main.js'
let net = js8pathPskreporter.net
let exampleData = js8pathPskreporter.exampleData

import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import _cloneDeep from 'lodash/cloneDeep'

let chai = require('chai')
let assert = chai.assert

describe('pskReporter net module', function () {
  let mock = new AxiosMockAdapter(axios);
  mock.onGet(
    net.urlForQuery
  ).reply(
    200,
    exampleData.rawXmlQueryResponse
  )

  describe('net.queryResponse()', function () {
    let queryFn = net.queryResponse
    it ('returns xml for default query and opts', function () {
      return queryFn().then(function (response) {
        let rawXml = response.data
        assert.isOk(_isString(rawXml), 'ís a string')
      })
    })

    it ('raises validation error on bad query data', function () {
      let parsedXmlData = _cloneDeep(exampleData.parsedXmlQueryResponse)
      parsedXmlData.receptionReports.currentSeconds = {}
      return queryFn(
        {senderCallsign: {}},
        {},
        true
      ).then(function () {
        assert.fail('expected validation to fail')
      }).catch(function (err) {
        // console.log('err: ' + JSON.stringify(err))
        assert.equal(err.name, 'ValidationError')
        assert.equal(err.data[0].keyword, 'type', 'bad senderCallsign')
        assert.deepEqual(String(err), 'ValidationError: Invalid Query Data', 'validation failed as expected')
      })
    })
  })

  describe('net.queryRawXml()', function () {
    let queryFn = net.queryRawXml
    let validate = js8pathPskreporter.validators.ajvValidate.rawXmlQueryResponse
    it ('returns xml for default query and opts', function () {
      return queryFn().then(function (dataToValidate) {
        assert.isOk(validate(dataToValidate), 'validates against schema')
      })
    })
  })

  describe('net.queryParsedXml()', function () {
    let queryFn = net.queryParsedXml
    let validate = js8pathPskreporter.validators.ajvValidate.parsedXmlQueryResponse
    it ('returns parsed xml for default query and opts', function () {
      return queryFn().then(function (dataToValidate) {
        assert.isOk(validate(dataToValidate), 'validates against schema')
      })
    })
  })

  describe('net.queryAppData()', function () {
    let queryFn = net.queryAppData
    let validate = js8pathPskreporter.validators.ajvValidate.appDataQueryResponse
    it ('returns app data for default query and opts', function () {
      return queryFn().then(function (dataToValidate) {
        assert.isOk(validate(dataToValidate), 'validates against schema')
      })
    })
    // FixMe: add a validation test (will need specific mock)
  })

  describe('net.queryJs8pathData()', function () {
    let queryFn = net.queryJs8pathData
    let validate = js8pathData.validators.ajvValidate.receptionReportList
    it ('returns js8path data for default query and opts', function () {
      return queryFn().then(function (dataToValidate) {
        assert.isOk(validate(dataToValidate), 'validates against schema')
      })
    })
    // FixMe: add a validation test (will need specific mock)
  })
})

/*
        assert.isNotOk(validate(dataToValidate))
        let errors = validate.errors
        console.log('errors:' + JSON.stringify(errors))
        console.log('dataToValidate:' + JSON.stringify(dataToValidate))
        assert.equal(JSON.stringify(errors), '...')
 */
