# @js8path/js8path-pskreporter
PSK Reporter queries for JS8Path

## Usage

### @js8path/js8path-pskreporter javascript module

Usage:

`import js8pathPskreporter from '@js8path/js8path-pskreporter'`
- js8pathPskreporter.net.*: queries pskreporter web service and returns result
- js8pathPskreporter.transform.*: parses pskreporter web service response
- js8pathPskreporter.valdators.*: validates pskreporter request, response, and parsed responses
- js8pathPskreporter.schema.*: JSON Schema definitions for pskreporter request, response, and parsed responses
- js8pathPskreporter.exampleData.*: examples of pskreporter request, response, and parsed responses

```javascript
import js8pathPskreporter from '@js8path/js8path-pskreporter'

// query latest data from PSKReporter
// request schema: js8pathPskreporter.schema.query.requestData
// response schema: js8pathPskreporter.schema.appData.queryResponse
js8pathPskreporter.net.queryAppData({
  flowStartSeconds: -600, // 10 minutes
  rptlimit: 1000, // max 1000 records
}).then(function(appData) {
  console.log(appData.receptionReports.length) // 2021
  console.log(JSON.stringify(appData.receptionReports[0]))
   /*
    {
      "receiverCallsign":"SP2GPU",
      "receiverLocator":"JO94fo",
      "senderCallsign":"W7DO",
      "senderLocator":"EM94nf",
      "frequencyHz":18102356,
      "flowStartSeconds":"1559476847",
      "mode":"FT8",
      "senderDXCC":"United States",
      "senderDXCCCode":"K",
      "senderDXCCLocator":"EM47",
      "senderLotwUpload":"2019-05-01",
      "senderEqslAuthGuar":"A",
      "sNRString":"-18",
      "sNR":-18
    }
  */
})

```

## Development

### development process

Prepare package for development with
  `yarn install`

Run unit tests and coverage once 
  `yarn run test`

Build distribution files 
  `yarn run build`

Start continuous testing with: 
  `yarn run dev`

This will open a web-browser screen with unit test results. 
The tests are re-run every time that changed source code is saved. 

## License

MIT, ©2020, Correspondence Technologies, LLC
