const vm = require('vm');
var tableHead = '<table  cellspacing="0" cellpadding="9" border="1" style="width:auto; height:auto; background-color:#f6f6f7; border-color:#f2f2f2;" id="tab"><tbody>';
var tableFooter = '</tbody></table>';

var query = inputData.jsa;

var columnPixelWidths = [
	20,
	40,
	500,
	50,
	50,
	50,
	50,
	50,
	50
];

var columnHeaders = [
	"ID#",
	"Client",
	"Reseller",
	"Merchant",
	"Subject",
	"Bucket",
	"Contact Name",
	"Date Created",
	"Date Modified",
	"Last Commented"
];







/**
 * Takes JSA text returned from QB query and converts it to an array of objects for 
 * use in the next coding step. 
 * @param  {[text]} JSAQueryReponseText [Text returned from QB query to fetch records]
 * @return {[array]}                     [array of objects of QB records]
 */
function createOutputRecords(JSAQueryReponseText) {
	var outputRecords = [];
	var record;
	//get rid of line breaks
	JSAQueryReponseText = JSAQueryReponseText.replace(/(\r\n|\n|\r)/gm,"");

	//run the JSA text and execute it as JavaScript.
	var script = new vm.Script(JSAQueryReponseText);
    script.runInThisContext();

  	if( qdb_numrows ) {
  		for( var i = 0; i < qdb_numrows; i++ ) {
	  		record = {};
	  		for( var j = 0; j < qdb_numcols; j++ ) {
		  		
		  		record[qdb_heading[j]] = qdb_data[i][j];
		  	}
		  	outputRecords.push(record);
	  	}
	} else {
		outputRecords = { error: "Issue parsing query data" };
	}

  	return outputRecords;
}

var records = createOutputRecords(query);





function createHTML( records, columnPixelWidths, columnHeaders ) {
 	var numColumns = Object.keys(records[0]).length;
 	var numRecords = records.length;
	var html = "";
	var htmlTableRows = [];
	var rowBegin = '<tr style="width:100%; height:auto;">';
	var rowEnd = '</tr>';
	var tdBegin = '<td style="width:';
	var tdMiddle = 'px; height:auto;  color:#232321; font: 12px/21px \'Arial\';">';
	var tdEnd = '</td>';

	//begin table 
	html += tableHead;

	//create column headers row
	html += rowBegin;
	for(var i = 0; i < numColumns; i++) {

		html += '<td style="width:' + columnPixelWidths[i] + 'px; height:auto;  color:#232321; font:bold 12px/21px \'Arial\';">';
		html += columnHeaders[i];
		html += tdEnd;
	}
	html += rowEnd;

	//create content rows
	for(var i = 0; i < numRecords; i++) {

		html += rowBegin;

		for (var key in records[0]) {
			html += '<td style="height:auto;  color:#232321; font: 12px/21px \'Arial\';">';
			html += records[i][key];
			html += tdEnd;
		}

		html += rowEnd;
	}

	//end table
	html += tableFooter;

	return html;
	
}


var htmlTable = createHTML( records, columnPixelWidths, columnHeaders );


output = {htmlTable: htmlTable};