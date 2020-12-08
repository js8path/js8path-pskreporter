PSK Reporter Developer Notes

Main page: https://www.pskreporter.info/pskdev.html

Data Retrieval
Reception records can be retrieved from the database by performing an http GET/POST on the URL http://retrieve.pskreporter.info/query?senderCallsign=requestedcall
This will return the last 100 reception records for the requested callsign, but for no more than 6 hours in any event. The default set of fields will be returned (receiverCallsign, receiverLocator, senderCallsign, frequency, flowStartSeconds). [Comments invited on query interface.]

The full list of query parameters is:
Parameter	Explanation
senderCallsign	Specifies the sending callsign of interest.
receiverCallsign	Specifies the receiving callsign of interest.
callsign	Specifies the callsign of interest. Specify only one of these three parameters.
flowStartSeconds	A negative number of seconds to indicate how much data to retreive. This cannot be more than 24 hours.
mode	The mode of the signal that was detected.
rptlimit	Limit the number of records returned.
rronly	Only return the reception report records if non zero
noactive	Do not return the active monitors if non zero
frange	A lower and upper limit of frequency. E.g. 14000000-14100000
nolocator	If non zero, then include reception reports that do not include a locator.
callback	Causes the returned document to be javascript, and it will invoke the function named in the callback.
statistics	Includes some statistical information
modify	If this has the value 'grid' then the callsign are interpreted as grid squares
lastseqno	Limits search to records with a sequence number greater than or equal to this parameter. The last sequence number in the database is returned on each response.
The format of the returned information will be an XML document [is this a useful format?]. A sample XML document is:

<receptionReports>
  <receptionReport receiverCallsign="KB1MBX" receiverLocator="FN42hn" senderCallsign="N1DQ" frequency=14070987 flowStartSeconds=xxxxxxx />
  <receptionReport receiverCallsign="ZZ1ZZ" receiverLocator="GG99" senderCallsign="N1DQ" frequency=14070987 flowStartSeconds=xxxxxxx />
</receptionReports>
An example can be seen for N1DQ.

The actual properties on each receptionReport have obvious (!) names.

Users are encouraged to retrieve reception data no more often than once every five minutes. If the display of reception data is integrated into the PSK transmitting application, then the timing can be optimized — do a retrieval five minutes after each transmission of 'de callsign callsign' (provided that it is more than five minutes since the previous retrieval). The purpose of the five minute delay is to allow all the receivers to make their reports.

The /query url will point to the latest version of the query API. There is an element in the response that indicates the query endpoint being used. If you care about version changes, then you may want to pick a particular version.

Please note that I may require (in the future) that frequent users of the API enable compression on their connections, that they not request the same data frequently etc. I reserve right to block or rate limit anybody who imposes a significant load on my system. If you want to be notified, then please add an additional query parameter of 'appcontact=myemailaddress' so that I can contact you. This will also enable me to work with you to solve any problems.

------------------

https://retrieve.pskreporter.info/query?senderCallsign=n1dq
  see pskreporter_n1dq.xml
https://retrieve.pskreporter.info/query?mode=JS8&flowStartSeconds=-1800
  see pskreporter_js8_all_30min.xml
https://retrieve.pskreporter.info/query?mode=JS8&flowStartSeconds=-1800&rronly=1
  see pskreporter_js8_rronly_30min.xml
  
------------------
<receptionReports currentSeconds="1556282041">
  ...
  <activeReceiver
    callsign="N0JUH"
	locator="FM19qg54"
	frequency="7079745"
	region="Maryland"
	DXCC="United States"
	decoderSoftware="JS8Call v1.0.0"
	antennaInformation="IC7300 10W MAGLOOP"
	mode="JS8"
	/>
  ...
  <activeReceiver
    callsign="N0JUH"
	locator="FM19qg54"
	frequency="7075549"
	region="Maryland"
	DXCC="United States"
	decoderSoftware="WSJT-X v2.0.1 7ddcb7"
	antennaInformation="Mag Loop"
	mode="FT8"
	/>
  ...
  <lastSequenceNumber value="6994420494"/>
  <maxFlowStartSeconds value="1556282040"/>
  ...
  <receptionReport 
    receiverCallsign="KN4AXB"
	receiverLocator="EM78fd76"
	senderCallsign="N0JUH"
	senderLocator="FM19qg54"
	frequency="7079613"
	flowStartSeconds="1556281923"
	mode="JS8"
	senderDXCC="United States"
	senderDXCCCode="K"
	senderDXCCLocator="EM47"
	senderLotwUpload="2019-04-03"
	sNR="1"
	/>
  ...
  <receptionReport
    receiverCallsign="N0JUH"
	receiverLocator="FM19qg54"
	senderCallsign="K4WLO"
	senderLocator="EM65WM"
	frequency="7079745"
	flowStartSeconds="1556281230"
	mode="JS8"
	senderDXCC="United States"
	senderDXCCCode="K"
	senderDXCCLocator="EM47"
	sNR="-9"
	/>
  ...
  <activeCallsign callsign="RV6F" reports="1" DXCC="European Russia" DXCCcode="UA" frequency="14075140"/>
  ...
</receptionReports>
