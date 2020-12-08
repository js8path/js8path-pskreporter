/*
  Schema definitions (structured index and list)
  schema.js
*/

// FixMe: needs test-schema.js unit tests for patterns and schemaDefs

import _concat from 'lodash/concat'
import _forOwn from 'lodash/forOwn'

import js8pathData from '@js8path/js8path-data'

let stringPatterns = {
  // FixMe: needs tests
  pskreporterXmlString: '.*' // FixMe: problems with this
}

let schemaIdPrefix = 'http://schemas.js8path.net/js8path/pskreporter'

// compilation of all individual schemas
let schemaDefs = {
  query: {
    requestData: {
      // FixMe: needs example data
      // FixMe: needs tests
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/query/requestData.json',
      title: 'PSKReporter Query Request Data',
      description: 'PSKReporter Query Request Data',
      type: 'object',
      properties: {
        senderCallsign: {
          title: 'Sender Callsign',
          description: 'Specifies the sending callsign of interest',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        receiverCallsign: {
          title: 'Receiver Callsign',
          description: 'Specifies the receiving callsign of interest',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        callsign: {
          title: 'Callsign',
          description: 'Specifies the callsign of interest. Specify only one of senderCallsign, receiverCallsign, callsign',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        flowStartSeconds: {
          title: 'Flow Start Seconds',
          description: 'A negative number of seconds to indicate how much data to retrieve. This cannot be more than 24 hours.',
          type: 'integer',
          minimum: -86400,
          maximum: -1
        },
        rptlimit: {
          title: 'Report Limit',
          description: 'Limit the number of records returned.',
          type: 'integer',
          minimum: 0
        },
        rronly: {
          title: 'Reception Reports Only',
          description: 'Only return the reception report records if non zero.',
          type: 'integer',
          default: 0
        },
        mode: {
          title: 'Mode',
          description: 'The mode of the signal that was detected.',
          type: 'string'
        },
        noactive: {
          title: 'Reception Reports Only',
          description: 'Do not return the active monitors if non zero.',
          type: 'integer',
          default: 0
        },
        frange: {
          title: 'Mode',
          description: 'A lower and upper limit of frequency. E.g. 14000000-14100000.',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.positiveIntegerRangeString
        },
        nolocator: {
          title: 'No Locator',
          description: 'If non zero, then include reception reports that do not include a locator.',
          type: 'integer',
          default: 0 // FixMe: or 1?
        },
        callback: {
          title: 'Callback',
          description: 'Causes the returned document to be javascript, and it will invoke the function named in the callback.',
          type: 'string'
        },
        statistics: {
          title: 'Statistics', // FixMe: research response format and add to schema
          description: 'Includes some statistical information.',
          type: 'integer',
          default: 0
        },
        modify: {
          title: 'Modify',
          description: 'If this has the value \'grid\' then the callsign are interpreted as grid squares.',
          type: 'string'
        },
        lastseqno: {
          title: 'Last Sequence Number',
          description: 'Limits search to records with a sequence number greater than or equal to this parameter. The last sequence number in the database is returned on each response.',
          type: 'integer',
          minimum: 0
        },
        appcontact: {
          title: 'App Contact Email',
          description: 'Email address for PSKReporter to contact if there is an issue.',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.emailAddress
        }
      },
      /* FixMe: only one (or none) of these
      oneOf: [
        {"required": ["senderCallsign"]},
        {"required": ["receiverCallsign"]},
        {"required": ["callsign"]}
      ],
      */
      required: [] // FixMe: research snd set this
    }
  },
  rawXml: {
    queryResponse: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/rawXml/queryResponse.json',
      title: 'PSKReporter Raw XML Query Response',
      description: 'Raw PSKReporter Query Response XML string',
      type: 'string',
      pattern: stringPatterns.pskreporterXmlString
    }
  },
  parsedXml: {
    queryResponse: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/parsedXml/queryResponse.json',
      title: 'PSKReporter Query Response',
      description: 'Raw PSKReporter Query Response decoded from XML',
      type: 'object',
      properties: {
        receptionReports: {
          title: 'Reception Reports Data',
          description: 'All raw data parsed from PSKReporter XML response',
          $ref: schemaIdPrefix + '/parsedXml/receptionReportsData.json'
        }
      },
      required: ['receptionReports']
    },
    receptionReportsData: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/parsedXml/receptionReportsData.json',
      title: 'Reception Reports Data',
      description: 'Top level data structure for all reception report data from a query',
      type: 'object',
      properties: {
        currentSeconds: {
          title: 'Current Seconds',
          description: 'The current seconds value of the query',
          $ref: js8pathData.schema.schemaDefs.general.positiveIntegerString.$id
        },
        activeReceiver: {
          title: 'Active Receiver List',
          description: 'List of active receivers',
          type: 'array',
          items: {$ref: schemaIdPrefix + '/parsedXml/activeReceiver.json'}
        },
        lastSequenceNumber: {
          title: 'Last Sequence Number Object',
          description: 'Contains last sequence number of query results',
          type: 'object',
          properties: {
            value: {
              title: 'Last Sequence Number Value',
              description: 'The value of the last sequence number',
              $ref: js8pathData.schema.schemaDefs.general.positiveIntegerString.$id
            }
          },
          required: ['value']
        },
        maxFlowStartSeconds: {
          title: 'Max Flow Start Seconds Object',
          description: 'Contains last max flow start seconds of query results',
          type: 'object',
          properties: {
            value: {
              title: 'Max Flow Start Seconds',
              description: 'The value of the max flow start seconds',
              $ref: js8pathData.schema.schemaDefs.general.positiveIntegerString.$id
            }
          },
          required: ['value']
        },
        receptionReport: {
          title: 'Reception Reports List',
          description: 'List of Reception Reports',
          type: 'array',
          items: {$ref: schemaIdPrefix + '/parsedXml/receptionReport.json'}
        },
        activeCallsign: {
          title: 'Active Callsign List',
          description: 'List of Active Callsigns',
          type: 'array',
          items: {$ref: schemaIdPrefix + '/parsedXml/activeCallsign.json'}
        }
      },
      required: ['currentSeconds', 'lastSequenceNumber', 'maxFlowStartSeconds']
    },
    activeReceiver: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/parsedXml/activeReceiver.json',
      title: 'Active Receiver',
      description: 'Data about one active receiver from the query results',
      type: 'object',
      properties: {
        receiverCallsign: {
          title: 'Callsign',
          description: 'The callsign of the receiver',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        locator: {
          title: 'Locator',
          description: 'The maidenhead locator of the receiver',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.maidenhead
        },
        frequency: {
          title: 'Frequency',
          description: 'The frequency of the receiver in Hertz',
          $ref: js8pathData.schema.schemaDefs.general.positiveIntegerString.$id
        },
        region: {
          title: 'Region',
          description: 'The region in the DXCC entity of the sender',
          type: 'string'
        },
        DXCC: {
          title: 'DXCC',
          description: 'The DXCC entity of the receiver',
          type: 'string'
        },
        decoderSoftware: {
          title: 'Decoder Software',
          description: 'The decoder software used by the receiver',
          type: 'string'
        },
        antennaInformation: {
          title: 'Antenna Information',
          description: 'The antenna information for the receiver',
          type: 'string'
        },
        mode: {
          title: 'Mode',
          description: 'The mode of the receiver',
          type: 'string'
        }
      },
      required: []
    },
    receptionReport: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/parsedXml/receptionReport.json',
      title: 'Reception Report',
      description: 'Data about one reception report from the query results',
      type: 'object',
      properties: {
        flowStartSeconds: {
          title: 'Flow Start Seconds',
          description: 'Unix seconds timestamp for report.',
          $ref: js8pathData.schema.schemaDefs.general.positiveIntegerString.$id
        },
        receiverCallsign: {
          title: 'Receiver Callsign',
          description: 'The callsign of the receiver',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        receiverLocator: {
          title: 'Receiver Locator',
          description: 'The maidenhead locator of the receiver',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.maidenhead
        },
        senderCallsign: {
          title: 'Sender Callsign',
          description: 'The callsign of the sender',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        senderLocator: {
          title: 'Sender Locator',
          description: 'The maidenhead locator of the sender',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.maidenhead
        },
        frequency: {
          title: 'Frequency',
          description: 'The frequency of the receiver in Hertz',
          $ref: js8pathData.schema.schemaDefs.general.positiveIntegerString.$id
        },
        mode: {
          title: 'Mode',
          description: 'Transmission Mode',
          type: 'string'
        },
        senderDXCC: {
          title: 'Sender DXCC',
          description: 'The DXCC entity of the sender',
          type: 'string'
        },
        senderDXCCCode: {
          title: 'Sender DXCC Code',
          description: 'The DXCC code of the sender',
          type: 'string'
        },
        senderDXCCLocator: {
          title: 'Sender DXCC Locator',
          description: 'The maidenhead locator of the sender DXCC entity',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.maidenhead
        },
        senderEqslAuthGuar: {
          title: 'Sender eQSL Auth Guarantee',
          description: 'Sender eQSL Authentic Guarantee',
          type: 'string'
        },
        sNR: {
          title: 'sNR',
          description: 'Signal to Noise ratio in decibels',
          type: 'string' // not always $ref: js8pathData.schema.schemaDefs.general.integerString.$id
        }
      },
      required: ['flowStartSeconds', 'senderCallsign']
    },
    activeCallsign: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/parsedXml/activeCallsign.json',
      title: 'Active Callsign',
      description: 'Data about one active callsign from the query results',
      type: 'object',
      properties: {
        callsign: {
          title: 'callsign',
          description: 'The (station) callsign',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        reports: {
          title: 'reports',
          description: 'The number of reports for this callsign',
          $ref: js8pathData.schema.schemaDefs.general.positiveIntegerString.$id
        },
        DXCC: {
          title: 'DXCC',
          description: 'DXCC Entity',
          type: 'string'
        },
        DXCCcode: {
          title: 'DXCC Code',
          description: 'DXCC Code',
          type: 'string'
        },
        frequency: {
          title: 'Frequency',
          description: 'The frequency of the callsign in Hertz',
          $ref: js8pathData.schema.schemaDefs.general.positiveIntegerString.$id
        }
      },
      required: ['callsign']
    }
  },
  appData: {
    queryResponse: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/appData/queryResponse.json',
      title: 'PSKReporter Response',
      description: 'PSKReporter Query Response decoded for use in Application',
      type: 'object',
      properties: {
        currentSeconds: {
          title: 'Current Seconds',
          description: 'Current seconds value', // FixMe: need better description
          type: 'integer',
          minimum: 0
        },
        lastSequenceNumber: {
          title: 'Last Sequence Number',
          description: 'The last sequence number', // FixMe: need better description
          type: 'integer',
          minimum: 0
        },
        maxFlowStartSeconds: {
          title: 'Max Flow Start Seconds',
          description: 'The max flow start seconds value', // FixMe: need better description
          type: 'integer',
          minimum: 0
        },
        activeReceivers: {
          title: 'Active Receiver List',
          description: 'List of active receivers',
          type: 'array',
          items: {$ref: schemaIdPrefix + '/appData/activeReceiver.json'}
        },
        receptionReports: {
          title: 'Reception Reports List',
          description: 'List of Reception Reports',
          type: 'array',
          items: {$ref: schemaIdPrefix + '/appData/receptionReport.json'}
        },
        activeCallsigns: {
          title: 'Active Callsign List',
          description: 'List of Active Callsigns',
          type: 'array',
          items: {$ref: schemaIdPrefix + '/appData/activeCallsign.json'}
        }
      },
      required: [
        'currentSeconds', 'lastSequenceNumber', 'maxFlowStartSeconds'
      ]
    },
    activeReceiver: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/appData/activeReceiver.json',
      title: 'Active Receiver',
      description: 'Data about one active receiver from the query results',
      type: 'object',
      properties: {
        callsign: {
          title: 'Callsign',
          description: 'The callsign of the receiver',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        locator: {
          title: 'Locator',
          description: 'The maidenhead locator of the receiver',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.maidenhead
        },
        frequencyHz: {
          title: 'Frequency (Hz)',
          description: 'The frequency of the receiver in Hertz',
          type: 'integer',
          minimum: 0
        },
        region: {
          title: 'Region',
          description: 'The region in the DXCC entity of the sender',
          type: 'string'
        },
        DXCC: {
          title: 'DXCC',
          description: 'The DXCC entity of the receiver',
          type: 'string'
        },
        decoderSoftware: {
          title: 'Decoder Software',
          description: 'The decoder software used by the receiver',
          type: 'string'
        },
        antennaInformation: {
          title: 'Antenna Information',
          description: 'The antenna information for the receiver',
          type: 'string'
        },
        mode: {
          title: 'Mode',
          description: 'The mode of the receiver',
          type: 'string'
        }
      },
      required: [] // FixMe: define this per PSKReporter specs
    },
    receptionReport: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/appData/receptionReport.json',
      title: 'Reception Report',
      description: 'Data about one reception report from the query results',
      type: 'object',
      properties: {
        flowStartSeconds: {
          title: 'Flow Start Seconds',
          description: 'Unix seconds timestamp for report.',
          type: 'integer',
          minimum: 0
        },
        receiverCallsign: {
          title: 'Receiver Callsign',
          description: 'The callsign of the receiver',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        receiverLocator: {
          title: 'Receiver Locator',
          description: 'The maidenhead locator of the receiver',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.maidenhead
        },
        senderCallsign: {
          title: 'Sender Callsign',
          description: 'The callsign of the sender',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        senderLocator: {
          title: 'Sender Locator',
          description: 'The maidenhead locator of the sender',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.maidenhead
        },
        frequencyHz: {
          title: 'Frequency (Hz)',
          description: 'The frequency of the receiver in Hertz',
          type: 'integer',
          minimum: 0
        },
        mode: {
          title: 'Mode',
          description: 'Transmission Mode',
          type: 'string'
        },
        senderDXCC: {
          title: 'Sender DXCC',
          description: 'The DXCC entity of the sender',
          type: 'string'
        },
        senderDXCCCode: {
          title: 'Sender DXCC Code',
          description: 'The DXCC code of the sender',
          type: 'string'
        },
        senderDXCCLocator: {
          title: 'Sender DXCC Locator',
          description: 'The maidenhead locator of the sender DXCC entity',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.maidenhead
        },
        senderEqslAuthGuar: {
          title: 'Sender eQSL Auth Guarantee',
          description: 'Sender eQSL Authentic Guarantee',
          type: 'string' // FixMe: Enum?
        },
        sNRString: {
          title: 'sNR String',
          description: 'Signal to Noise ratio in decibels - as reported',
          type: 'string'
        },
        sNR: {
          title: 'sNR',
          description: 'Signal to Noise ratio in decibels, if reported',
          type: ['integer', 'null']
        }
      },
      required: ['flowStartSeconds', 'senderCallsign'] // FixMe: define this per PSKReporter specs
    },
    activeCallsign: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: schemaIdPrefix + '/appData/activeCallsign.json',
      title: 'Active Callsign',
      description: 'Data about one active callsign from the query results',
      type: 'object',
      properties: {
        callsign: {
          title: 'callsign',
          description: 'The (station) callsign',
          type: 'string',
          pattern: js8pathData.schema.stringPatterns.callsign
        },
        reports: {
          title: 'reports',
          description: 'The number of reports for this callsign',
          type: 'integer',
          minimum: 0
        },
        DXCC: {
          title: 'DXCC',
          description: 'DXCC Entity',
          type: 'string'
        },
        DXCCcode: {
          title: 'DXCC Code',
          description: 'DXCC Code',
          type: 'string'
        },
        frequencyHz: {
          title: 'Frequency (Hz)',
          description: 'The frequency of the receiver in Hertz',
          type: 'integer',
          minimum: 0
        }
      },
      required: ['callsign'] // FixMe: define this per PSKReporter specs
    }
  }
}

let schemaList = []
_forOwn(schemaDefs, function (value1) {
  if (value1.$schema) {
    schemaList.push(value1)
  } else {
    _forOwn(value1, function (value2) {
      if (value2.$schema) {
        schemaList.push(value2)
      }
    })
  }
})

schemaList = _concat(
  js8pathData.schema.schemaList,
  schemaList
)

export default {
  stringPatterns: stringPatterns,
  schemaIdPrefix: schemaIdPrefix,
  schemaDefs: schemaDefs,
  schemaList: schemaList
}
