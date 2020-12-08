/*
  convert a pskreporter xml file to js8path format and save as json

  usage:
    add this to package.json scripts
      "convert": "babel-node ./scripts/convert-file.js"
    then run with
      yarn run convert
 */

// FixMe: use yargs to make this more full featured cli, combined with retrieve-file.js

let inputFile = './scripts/data/data_pskreporter.xml'
let appOutputFile = './scripts/data/data_app.json'
let js8pathOutputFile = './scripts/data/data_js8path.json'

let fs = require('fs')

import js8pathPskreporter from '../src/main.js'
let transform = js8pathPskreporter.transform

console.log('reading XML')
let xmlData = fs.readFileSync(inputFile, 'utf8')

console.log('converting XML to app data')
transform.parseAndXfm(
  xmlData,
  false // was getting validation errors with xml data from from net
).then(function (appData) {
  console.log('writing app JSON')
  fs.writeFileSync(
    appOutputFile,
    JSON.stringify(appData, null, 2)
  )


  // missing frequencyHz in record 798
  // console.log(JSON.stringify([797, appData.receptionReports[797]], null, 2))
  // console.log(JSON.stringify([798, appData.receptionReports[798]], null, 2))

  console.log('converting app data to js8path data')
  return transform.xfmAppDataToJs8pathData(
    appData,
    false, // set these to false because of missing freq in record 798
    false
  )
}).then(function (js8pathData) {
  console.log('writing js8path JSON')
  fs.writeFileSync(
    js8pathOutputFile,
    JSON.stringify(js8pathData, null, 2)
  )
  console.log('done')
}).catch(function (err) {
  console.log('error: ' + JSON.stringify(err, null, 2))
  // throw err
})


