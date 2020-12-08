/*
    transform - Parse PSK Reporter query XML
    transform.js
*/
// FixMe: transforms need the option to skip bad records

import _forEach from 'lodash/forEach'
import _isNaN from 'lodash/isNaN'
import _map from 'lodash/map'
import xml2js from 'xml2js' // https://www.npmjs.com/package/xml2js

import js8pathData from '@js8path/js8path-data'

import validators from './validators.js'

function parseRawXmlBasic (pskreporterRawXml) {
  // parse the raw XML from a PSKreporter query response
  // Given: XML string
  // Returns: Promise resolving with parsed XML data (schema.schemaDefs.parsedXml.queryResponse)
  return new Promise(function(resolve, reject) {
    let parser = new xml2js.Parser({
      mergeAttrs: true, // merge attributes with child elements
      explicitArray: false // only make array if more than one of same type
    })
    parser.parseString(pskreporterRawXml, function(err, data) {
      if (err !== null) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function parseRawXml (pskreporterRawXml, validateInput = false, validateOutput = false) {
  // parse the raw XML from a PSKreporter query response, with optional validation
  // Given:
  //   pskreporterRawXml: XML string from pskreporter response
  //   validateInput: optional flag to do schema validation on input
  //   validateOutput: optional flag to do schema validation on output
  // Returns: Promise resolving with parsed XML data (schema.schemaDefs.parsedXml.queryResponse)
  // or, fails with validation error
  return validators.validate.rawXmlQueryResponse(
    pskreporterRawXml,
    validateInput
  ).then(
    parseRawXmlBasic
  ).then(function (parsedXmlQueryResponse) {
    return validators.validate.parsedXmlQueryResponse(
      parsedXmlQueryResponse,
      validateOutput
    )
  })
}

function basicXfmParsedXmlToAppData (parsedXmlQueryResponse) {
  // decode app data from the parsed XML PSKreporter response
  // Given:
  //  parsedXmlQueryResponse: parsed XML data (schema.schemaDefs.parsedXml.queryResponse)
  // Returns: Promise with decoded response app data (schema.schemaDefs.appData.queryResponse)
  let rr = parsedXmlQueryResponse.receptionReports
  let appData = {
    currentSeconds: parseInt(rr.currentSeconds, 10),
    lastSequenceNumber: parseInt(rr.lastSequenceNumber.value, 10),
    maxFlowStartSeconds: parseInt(rr.maxFlowStartSeconds.value, 10)
  }
  if (rr.activeReceiver) {
    appData.activeReceivers = _map(rr.activeReceiver, function (rawActiveReceiver) {
      let appActiveReceiver = {}
      _forEach(rawActiveReceiver, function (value, key) {
        if (key === 'frequency') {
          appActiveReceiver['frequencyHz'] = parseInt(value, 10)
        } else {
          appActiveReceiver[key] = value
        }
      })
      return appActiveReceiver
    })
  }
  if (rr.receptionReport) {
    appData.receptionReports = _map(rr.receptionReport, function (rawReceptionReport) {
      let appReceptionReport = {}
      _forEach(rawReceptionReport, function (value, key) {
        if (key === 'frequency') {
          appReceptionReport['frequencyHz'] = parseInt(value, 10)
        } else if (key === 'flowStartSeconds') {
            appReceptionReport['flowStartSeconds'] = parseInt(value, 10)
        } else if (key === 'sNR') {
          appReceptionReport['sNRString'] = value
          let sNRInt = parseInt(value, 10)
          appReceptionReport['sNR'] = _isNaN(sNRInt) ? null : sNRInt
        } else {
          appReceptionReport[key] = value
        }
      })
      return appReceptionReport
    })
  }
  if (rr.activeCallsign) {
    appData.activeCallsigns = _map(rr.activeCallsign, function (rawActiveCallsign) {
      let appActiveCallsign = {}
      _forEach(rawActiveCallsign, function (value, key) {
        if (key === 'frequency') {
          appActiveCallsign['frequencyHz'] = parseInt(value, 10)
        } else if (key === 'reports') {
          appActiveCallsign['reports'] = parseInt(value, 10)
        } else {
          appActiveCallsign[key] = value
        }
      })
      return appActiveCallsign
    })
  }
  return Promise.resolve(appData)
}

function xfmParsedXmlToAppData (parsedXmlQueryResponse, validateInput = false, validateOutput = false) {
  // decode app data from parse the raw XML PSKreporter response
  // Given:
  //  parsedXmlQueryResponse: parsed XML data (schema.schemaDefs.parsedXml.queryResponse)
  //   validateInput: optional flag to do schema validation on input
  //   validateOutput: optional flag to do schema validation on output
  // Returns: Promise resolving with decoded response app data (schema.schemaDefs.appData.queryResponse)
  // or, fails with validation error
  return validators.validate.parsedXmlQueryResponse(
    parsedXmlQueryResponse,
    validateInput
  ).then(
    basicXfmParsedXmlToAppData
  ).then(function (appDataQueryResponse) {
    return validators.validate.appDataQueryResponse(
      appDataQueryResponse,
      validateOutput
    )
  })
}

function parseAndXfm (pskreporterRawXml, validate) {
  // parse the raw XML from a PSKreporter query response, and decode it into appData
  // Given:
  //  pskreporterRawXml: XML string
  //  validate: optional flag to do schema validation on input and output
  // Returns: Promise with decoded response app data (schema.schemaDefs.appData.queryResponse)
  return parseRawXml(
    pskreporterRawXml,
    validate,
    false // output will be validated as input of xfmParsedXmlToAppData
  ).then(function (parsedXmlQueryResponse) {
    return xfmParsedXmlToAppData(
      parsedXmlQueryResponse,
      validate,
      validate
    )
  })
}

function basicXfmAppDataToJs8pathData (appDataQueryResponse) {
  // decode app data from the parsed XML PSKreporter response
  // Given:
  //  appDataQueryResponse: pskreporter app data query response (schema.schemaDefs.appData.queryResponse)
  // Returns: Promise with js8path reception reports (js8pathData.schema.schemaDefs.reports.receptionReportList)
  // FixMe: add option to not save source data
  let receptionReportList = _map(appDataQueryResponse.receptionReports, function (appReceptionReport) {
    let receptionReport = {
      timestamp: js8pathData.utilities.timestampUnixToIso(appReceptionReport.flowStartSeconds),
      freqHz: appReceptionReport.frequencyHz,
      sNR: appReceptionReport.sNR,
      rxCall: appReceptionReport.receiverCallsign,
      rxGrid: appReceptionReport.receiverLocator,
      txCall: appReceptionReport.senderCallsign,
      txGrid: appReceptionReport.senderLocator,
      srcType: 'pskreporter',
      srcData: appReceptionReport
    }
    return receptionReport
  })
  return Promise.resolve(receptionReportList)
}

function xfmAppDataToJs8pathData (appDataQueryResponse, validateInput = false, validateOutput = false) {
  // transform app data query response into js8path data
  // Given:
  //   appDataQueryResponse
  //   validateInput: optional flag to do schema validation on input
  //   validateOutput: optional flag to do schema validation on output
  // Returns: Promise resolving with js8path reception reports (js8pathData.schema.schemaDefs.reports.receptionReportList)
  // or, fails with validation error
  // FixMe: add option to not save source data
  return validators.validate.appDataQueryResponse(
    appDataQueryResponse,
    validateInput
  ).then(
    basicXfmAppDataToJs8pathData
  ).then(function (receptionReportList) {
    return js8pathData.validators.validate.receptionReportList(
      receptionReportList,
      validateOutput
    )
  })
}

export default {
  parseRawXmlBasic: parseRawXmlBasic,
  parseRawXml: parseRawXml,
  basicXfmParsedXmlToAppData: basicXfmParsedXmlToAppData,
  xfmParsedXmlToAppData: xfmParsedXmlToAppData,
  parseAndXfm: parseAndXfm,
  basicXfmAppDataToJs8pathData: basicXfmAppDataToJs8pathData,
  xfmAppDataToJs8pathData: xfmAppDataToJs8pathData
}
