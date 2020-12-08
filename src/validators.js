/*
    validators - Validate pskreporter data objects
    validators.js
*/
import Ajv from 'ajv/lib/ajv'

import js8pathData from '@js8path/js8path-data'

import schema from './schema.js'
let ajv = new Ajv({schemas: schema.schemaList})
let ajvValidate = {
  // ajv validator Functions
  queryRequestData: ajv.compile(schema.schemaDefs.query.requestData),
  rawXmlQueryResponse: ajv.compile(schema.schemaDefs.rawXml.queryResponse),
  parsedXmlQueryResponse: ajv.compile(schema.schemaDefs.parsedXml.queryResponse),
  appDataQueryResponse: ajv.compile(schema.schemaDefs.appData.queryResponse)
}

let validate = {}

validate.queryRequestData = function (requestData, validate = true) {
  // validate query request data
  // return promise with the requestData or fail with ValidationError
  return js8pathData.utilities.validOrError (
    requestData,
    ajvValidate.queryRequestData,
    'Invalid queryRequestData',
    validate
  )
}

validate.rawXmlQueryResponse = function (rawXml, validate = true) {
  // validate raw xml query response
  // return promise with the raXml or fail with ValidationError
  return js8pathData.utilities.validOrError (
    rawXml,
    ajvValidate.rawXmlQueryResponse,
    'Invalid rawXmlQueryResponse',
    validate
  )
}

validate.parsedXmlQueryResponse = function (parsedXmlResponse, validate = true) {
  // validate parsed xml query response
  // return promise with the parsedXmlResponse or fail with ValidationError
  return js8pathData.utilities.validOrError (
    parsedXmlResponse,
    ajvValidate.parsedXmlQueryResponse,
    'Invalid parsedXmlQueryResponse',
    validate
  )
}

validate.appDataQueryResponse = function (appDataResponse, validate = true) {
  // validate parsed xml query response
  // return promise with the appDataResponse or fail with ValidationError
  return js8pathData.utilities.validOrError (
    appDataResponse,
    ajvValidate.appDataQueryResponse,
    'Invalid appDataQueryResponse',
    validate
  )
}

export default {
  ajvValidate: ajvValidate,
  validate: validate
}
