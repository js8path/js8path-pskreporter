/*
mocha integration tests for net
inttest-pskrepporter-net.js
*/

/* global describe, it */
import Ajv from 'ajv/lib/ajv'

import js8pathPskreporter from '../../src/main.js'
import js8pathData from "@js8path/js8path-data";
let net = js8pathPskreporter.net
let schema = js8pathPskreporter.schema

let chai = require('chai')
let assert = chai.assert

describe('pskReporter net module', function () {
  let ajv = new Ajv({schemas: schema.schemaList})

  describe('net.queryAppData()', function () {
    let queryFn = net.queryAppData
    let validate = ajv.compile(schema.schemaDefs.appData.queryResponse)
    it ('returns app data for default query and opts', function () {
      return queryFn({}, true).then(function (appData) {
        // console.log('appData: '+ JSON.stringify(appData))
        assert.isOk(validate(appData), 'validates against schema')
        // console.log(appData.receptionReports.length)
        // console.log(JSON.stringify(appData.receptionReports[0]))
      }).catch (function (err) {
        // console.log('err' + JSON.stringify(err))
        throw err
      })
    })
  })

  /*
  describe('net.queryJs8pathData()', function () {
    let queryFn = net.queryJs8pathData
    let validate = js8pathData.validators.ajvValidate.receptionReportList
    it ('returns js8pathdata reception reports data for default query and opts', function () {
      return queryFn({}, true).then(function (res) {
        // console.log('res: '+ JSON.stringify(res))
        assert.isOk(validate(res), 'validates against schema')
        // console.log(res.length)
        // console.log(JSON.stringify(res[0]))
      }).catch (function (err) {
        console.log('err' + JSON.stringify(err))
        throw err
      })
    })
  })
  */
})

/*
        assert.isNotOk(validate(dataToValidate))
        let errors = validate.errors
        assert.equal(JSON.stringify(errors), '...')
 */
