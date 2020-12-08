/*
  retrieve latest pskreporter xml and save in file

  usage:
    add this to package.json scripts
      "retrieve": "babel-node ./scripts/retrieve-file.js"
    then run with
      yarn run convert
 */

// FixMe: combine with convert-file.js, possibly with yargs cli

let xmlFile = './scripts/data/data_pskreporter.xml'
let fs = require('fs')

import js8pathPskreporter from '../src/main.js'

console.log('begin query rawXml from net')
js8pathPskreporter.net.queryRawXml().then(function (rawXml) {
  console.log('end query rawXml from net')
  // console.log(rawXml)
  console.log('begin write rawxml file')
  fs.writeFileSync(xmlFile, rawXml)
  console.log('end write rawxml file')
})



