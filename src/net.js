/*
    net - Query pskreporter server
    net.js
*/

import _merge from 'lodash/merge'
import AnnotatedError from '@js8path/annotated-error'
import axios from 'axios'
import Ajv from 'ajv/lib/ajv'

import schema from './schema.js'
import transform from './transform.js'

let ajv = new Ajv({schemas: schema.schemaList})
let validators = {
  requestData: ajv.compile(schema.schemaDefs.query.requestData)
}

let urlForQuery = 'https://retrieve.pskreporter.info/query'

let queryDataDefault = {
  appcontact: 'jjkunce+js8path@gmail.com', // comment this out for repeated tests
  flowStartSeconds: -1800, // 30 minutes
  rptlimit: 5000, // max 5000 records
  rronly: 1,
  mode: 'JS8'
}

let addlAxiosOptsDefault = {
  method: 'get',
  url: urlForQuery
  // .data for POST, .params for GET  (post+dat didn't seem to work right)
}

function queryResponse (queryData = {}, validate = false, addlAxiosOpts = {}) {
  // query pskreporter, and answer promise with raw axios response
  //  validate: optional flag to do schema validation on request
  let axiosOpts = _merge({}, addlAxiosOptsDefault, addlAxiosOpts)
  if (validate && !validators.requestData(queryData)) {
    return Promise.reject(
      new AnnotatedError(
        {
          name: 'ValidationError',
          data: validators.requestData.errors,
          message: 'Invalid Query Data'
        }
      )
    )
  }
  axiosOpts.params = _merge({}, queryDataDefault, queryData)
  // console.log(JSON.stringify(axiosOpts, null, 2))
  return axios(axiosOpts)
}

function queryRawXml (queryData = {}, validate = false, addlAxiosOpts = {}) {
  // query pskreporter, and answer promise where response.data is rawXml
  return queryResponse(
    queryData,
    validate,
    addlAxiosOpts
  ).then(function (response) {
    return response.data
  })
}

function queryParsedXml (queryData = {}, validate = false, addlAxiosOpts = {}) {
  // query pskreporter, and answer promise where response.data is JSON parsed XML data
  return queryRawXml(
    queryData,
    validate,
    addlAxiosOpts
  ).then(function (rawXml) {
    // console.log('rawXml: '+ rawXml)
    return transform.parseRawXml(rawXml)
  })
}

function queryAppData (queryData = {}, validate = false, addlAxiosOpts = {}) {
  // query pskreporter, and answer promise where response.data is JSON App data
  return queryParsedXml(
    queryData,
    validate,
    addlAxiosOpts
  ).then(function (parsedXML) {
    // console.log('parsedXML: '+ JSON.stringify(parsedXML))
    return transform.xfmParsedXmlToAppData(parsedXML, validate)
  })
}

function queryJs8pathData (queryData = {}, validate = false, addlAxiosOpts = {}) {
  // query pskreporter, and answer promise where response.data is js8pathData.receptionReportList
  return queryAppData(
    queryData,
    validate,
    addlAxiosOpts
  ).then(function (appData) {
    // console.log('parsedXML: '+ JSON.stringify(parsedXML))
    return transform.xfmAppDataToJs8pathData(appData, validate)
  })
}

// FixMe: in/out validate for each transform, so validate can work on queryParsedXml (maybe separate validate module)

export default {
  urlForQuery: urlForQuery,
  queryResponse: queryResponse,
  queryRawXml: queryRawXml,
  queryParsedXml: queryParsedXml,
  queryAppData: queryAppData,
  queryJs8pathData: queryJs8pathData
}
