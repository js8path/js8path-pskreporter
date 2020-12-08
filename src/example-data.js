/*
example data for pskreporter transform
example-data.js
*/
import _join from 'lodash/join'

let rawXmlQueryResponse = _join(
  [
    '<?xml version="1.0"?>',
    '<receptionReports currentSeconds="1556282041">',
    '<activeReceiver callsign="DF2LV" locator="JO44rs15" frequency="14075140" region="Schleswig-Holstein" DXCC="Fed. Rep. of Germany" decoderSoftware="JTDX v2.0.1-rc135" antennaInformation="SIM31  Mode " mode="FT8" />',
    '<activeReceiver callsign="KI5BYN" locator="EM25ol40" frequency="7075999" region="Oklahoma" DXCC="United States" decoderSoftware="WSJT-X v2.0.1 7ddcb7" mode="FT8" />',
    '<lastSequenceNumber value="6994420494"/>',
    '<maxFlowStartSeconds value="1556282040"/>',
    '<receptionReport receiverCallsign="SM6FMB" receiverLocator="JO57vo28" senderCallsign="OH8STN" senderLocator="KP25QC92LD" frequency="7079110" flowStartSeconds="1556281995" mode="JS8" senderDXCC="Finland" senderDXCCCode="OH" senderDXCCLocator="KP33" senderEqslAuthGuar="A" sNR="-13" />',
    '<receptionReport receiverCallsign="WB0SIO" receiverLocator="EN24WS05SK" senderCallsign="K4WLO" senderLocator="EM65WM" frequency="7079485" flowStartSeconds="1556281965" mode="JS8" senderDXCC="United States" senderDXCCCode="K" senderDXCCLocator="EM47" sNR="xyz" />',
    '<activeCallsign callsign="RV6F" reports="1" DXCC="European Russia" DXCCcode="UA" frequency="14075140"/>',
    '<activeCallsign callsign="WA9THI" reports="1" DXCC="United States" DXCCcode="K" frequency="7075999"/>',
    '</receptionReports>\n'
  ],
  '\n'
)

let queryRequestData = {
  // senderCallsign: 'N0JUH',
  receiverCallsign: 'N0JUH',
  // callsign: : 'N0JUH',
  flowStartSeconds: -1800, // 30 minutes
  rptlimit: 1000, // max 1000 records
  // rronly: 0,
  mode: 'JS8',
  // noactive: 0,
  // frange: 14000000-14100000',
  // nolocator: 0,
  // callback: 'processData',
  // statistics: 0,
  // modify: 'grid\' then the callsign are interpreted as grid squares.',
  // lastseqno: 123456,
  appcontact: 'jjkunce+pskreporter@gmail.com',
}

let parsedXmlQueryResponse = {
  receptionReports: {
    currentSeconds: "1556282041",
    activeReceiver: [
      {
        callsign: "DF2LV",
        locator: "JO44rs15",
        frequency: "14075140",
        region: "Schleswig-Holstein",
        DXCC: "Fed. Rep. of Germany",
        decoderSoftware: "JTDX v2.0.1-rc135",
        antennaInformation: "SIM31  Mode ",
        mode: "FT8"
      },
      {
        callsign: "KI5BYN",
        locator: "EM25ol40",
        frequency: "7075999",
        region: "Oklahoma",
        DXCC: "United States",
        decoderSoftware: "WSJT-X v2.0.1 7ddcb7",
        mode: "FT8"
      }
    ],
    lastSequenceNumber: {
      value: "6994420494"
    },
    maxFlowStartSeconds: {
      value: "1556282040"
    },
    receptionReport: [
      {
        receiverCallsign: "SM6FMB",
        receiverLocator: "JO57vo28",
        senderCallsign: "OH8STN",
        senderLocator: "KP25QC92LD",
        frequency: "7079110",
        flowStartSeconds: "1556281995",
        mode: "JS8",
        senderDXCC: "Finland",
        senderDXCCCode: "OH",
        senderDXCCLocator: "KP33",
        senderEqslAuthGuar: "A",
        sNR: "-13"
      },
      {
        receiverCallsign: "WB0SIO",
        receiverLocator: "EN24WS05SK",
        senderCallsign: "K4WLO",
        senderLocator: "EM65WM",
        frequency: "7079485",
        flowStartSeconds: "1556281965",
        mode: "JS8",
        senderDXCC: "United States",
        senderDXCCCode: "K",
        senderDXCCLocator: "EM47",
        sNR: "xyz" // not always a valid integer
      }
    ],
    activeCallsign: [
      {
        callsign: "RV6F",
        reports: "1",
        DXCC: "European Russia",
        DXCCcode: "UA",
        frequency: "14075140"
      },
      {
        callsign: "WA9THI",
        reports: "1",
        DXCC: "United States",
        DXCCcode: "K",
        frequency: "7075999"
      }
    ]
  }
}

let appDataQueryResponse = {
  currentSeconds: 1556282041,
  lastSequenceNumber: 6994420494,
  maxFlowStartSeconds: 1556282040,
  activeReceivers: [
    {
      callsign: "DF2LV",
      locator: "JO44rs15",
      frequencyHz: 14075140,
      region: "Schleswig-Holstein",
      DXCC: "Fed. Rep. of Germany",
      decoderSoftware: "JTDX v2.0.1-rc135",
      antennaInformation: "SIM31  Mode ",
      mode: "FT8"
    },
    {
      callsign: "KI5BYN",
      locator: "EM25ol40",
      frequencyHz: 7075999,
      region: "Oklahoma",
      DXCC: "United States",
      decoderSoftware: "WSJT-X v2.0.1 7ddcb7",
      mode: "FT8"
    }
  ],
  receptionReports: [
    {
      receiverCallsign: "SM6FMB",
      receiverLocator: "JO57vo28",
      senderCallsign: "OH8STN",
      senderLocator: "KP25QC92LD",
      frequencyHz: 7079110,
      flowStartSeconds: 1556281995,
      mode: "JS8",
      senderDXCC: "Finland",
      senderDXCCCode: "OH",
      senderDXCCLocator: "KP33",
      senderEqslAuthGuar: "A",
      sNRString: "-13",
      sNR: -13,
    },
    {
      receiverCallsign: "WB0SIO",
      receiverLocator: "EN24WS05SK",
      senderCallsign: "K4WLO",
      senderLocator: "EM65WM",
      frequencyHz: 7079485,
      flowStartSeconds: 1556281965,
      mode: "JS8",
      senderDXCC: "United States",
      senderDXCCCode: "K",
      senderDXCCLocator: "EM47",
      sNRString: 'xyz',
      sNR: null
    }
  ],
  activeCallsigns: [
    {
      callsign: "RV6F",
      reports: 1,
      DXCC: "European Russia",
      DXCCcode: "UA",
      frequencyHz: 14075140
    },
    {
      callsign: "WA9THI",
      reports: 1,
      DXCC: "United States",
      DXCCcode: "K",
      frequencyHz: 7075999
    }
  ]
}

let js8pathDataReceptionReports = [
  {
    timestamp: '2019-04-26T12:33:15Z',
    freqHz: 7079110,
    sNR: -13,
    rxCall: "SM6FMB",
    rxGrid: "JO57vo28",
    txCall: "OH8STN",
    txGrid: "KP25QC92LD",
    srcType: 'pskreporter',
    srcData: {
      receiverCallsign: "SM6FMB",
      receiverLocator: "JO57vo28",
      senderCallsign: "OH8STN",
      senderLocator: "KP25QC92LD",
      frequencyHz: 7079110,
      flowStartSeconds: 1556281995,
      mode: "JS8",
      senderDXCC: "Finland",
      senderDXCCCode: "OH",
      senderDXCCLocator: "KP33",
      senderEqslAuthGuar: "A",
      sNRString: "-13",
      sNR: -13
    }
  },
  {
    timestamp: '2019-04-26T12:32:45Z',
    freqHz: 7079485,
    sNR: null,
    rxCall: "WB0SIO",
    rxGrid: "EN24WS05SK",
    txCall: "K4WLO",
    txGrid: "EM65WM",
    srcType: 'pskreporter',
    srcData: {
      receiverCallsign: "WB0SIO",
      receiverLocator: "EN24WS05SK",
      senderCallsign: "K4WLO",
      senderLocator: "EM65WM",
      frequencyHz: 7079485,
      flowStartSeconds: 1556281965,
      mode: "JS8",
      senderDXCC: "United States",
      senderDXCCCode: "K",
      senderDXCCLocator: "EM47",
      sNRString: 'xyz',
      sNR: null
    }
  }
]

export default {
  queryRequestData: queryRequestData,
  rawXmlQueryResponse: rawXmlQueryResponse,
  parsedXmlQueryResponse: parsedXmlQueryResponse,
  appDataQueryResponse: appDataQueryResponse,
  js8pathDataReceptionReports: js8pathDataReceptionReports
}
