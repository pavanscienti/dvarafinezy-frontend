
/**
 * 
 * 
 * 
 */


$(document).ready(function(){
	showLoader(false);	
	let date = new Date();
	var toDate = $("#date_to").val(date.format('yyyy-mm-dd'));
	date.setDate(date.getDate()-5);
	var fromDate = $("#date_from").val(date.format('yyyy-mm-dd'));
	getStatement();
});

function getStatement(){
	var fromDate = $("#date_from").val();
	var toDate = $("#date_to").val();
	
	if(fromDate == null || fromDate.length != 10){
		alert("select from date!");
	} else if(toDate == null || toDate.length != 10){
		alert("select to date!");
	} else {		
		showLoader(true);
		var params = {};		
		params["action"] = (getHashParam() == "aepsStmt") ? "stmt-aeps" : "stmt-disb";
		params["fromDate"] = fromDate;
		params["toDate"] = toDate;
		params["trxn_type"]=$("input[type='radio'][name='trxn_type']:checked").val();
		doAPIRequest(API.METHOD_GET, API.PATH_ACCOUNT_STMT, params, function(response) {
			showLoader(false);		
			displayStatement(response);							
		});
	}	
}

function download(){
	var fromDate = $("#date_from").val();
	var toDate = $("#date_to").val();
	
	if(fromDate == null || fromDate.length != 10){
		alert("select from date!");
	} else if(toDate == null || toDate.length != 10){
		alert("select to date!");
	} else {
		let accountStmt = (getHashParam() == "aepsStmt") ? "AEPS" : "DISB";
		let trxnType = $("input[type='radio'][name='trxn_type']:checked").val();
		let url =  API.PATH_ACCOUNT_STMT + "?action=download&stmt=" + accountStmt + "&fromDate=" + fromDate + "&toDate=" + toDate + "&trxn_type=" + trxnType + "&id="+(localStorage.token);
		window.open(url, '_blank');	
	}
	
}

// http://localhost:8080/vengine/tms/account/statement?action=download&stmt=DISB&fromDate=2017-04-03&toDate=2017-04-03&trxn_type=C&id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUTVMiLCJ1c2VyX3JvbGUiOiJBRE1JTiIsInRrbl9leHAiOjE0OTI1MDE4MzQsIm5iZiI6MTQ5MjQ5ODQ4MzgxNywidXNlcl9pZCI6NSwidGtuIjoiOTYyNzI3MDdhNzkyY2I4N2RjMzIwNjA4NDhkZjdiNTEzZWQ2YmM1YjdkZGE3YzI1MWY4OTVhNjgzMjJhOWQxOCIsImlzcyI6Imh0dHBzOi8vdmFyYW1kaWdpdGFsLm9yZyIsImV4cCI6MTQ5MjUwMTE4MzgxNywiaWF0IjoxNDkyNDk4NDgzODE3LCJlbWFpbCI6InZhcmFtLnJhbWFyYWpAZ21haWwuY29tIiwidXNlcm5hbWUiOiJyYW1hcmFqIn0.AcrjtWm07WBezFxXxp5IHTnEgRH6SHO7b3hVUEOTGjU


function displayStatement(json){
	if(json != null && json.status_code == 200) {
					
		$("#account-no").html(json.data.account_no);		
		$("#stmt-date-range").html(json.data.from + " - " + json.data.to);
		var row = "";
		var totalDebit = 0;
		var totalCredit = 0;			
		$.each(json.data.data.data, function(index, item) {
			row += "<tr>";
			row += "<td>" + (index + 1) + "</td>";
			// row += "<td>" + item.txn_date.substr(0, 10) + "</td>";
			row += "<td>" + item.pstd_date + "</td>";
			row += "<td>" + item.txn_id + "</td>";
			row += "<td>" + item.txn_desc + "</td>";
			if(item.txn_type == "C"){
				row += "<td align=\"right\" style=\"color:green;\">" + item.txn_amt.toMoney() + "</td> <td></td>";
				totalCredit += Number(item.txn_amt);
			} else {
				row += "<td></td><td align=\"right\" style=\"color:red;\">" + item.txn_amt.toMoney() + "</td>";
				totalDebit += Number(item.txn_amt);
			}
			row += "<td align=\"right\">" + item.balance_amt.toMoney() + "</td>";
			row += "</tr>";
		});	
		if(json.data.data.data.length == 0 ){
			row += "<tr><td colspan=\"7\" align=\"center\">No transaction found</td>";
		} else {
			row += "<tr><td colspan=\"4\" align=\"right\"><b>Total</b></td><td align=\"right\"><b>" + totalCredit.toMoney() + "</b></td><td align=\"right\"><b>" + totalDebit.toMoney() + "</b></td><td></td></tr>";	
		}
		$('#tbl-stmt > tbody').html(row);
		
	} else {
		alert("failed to get statement!");
	}
}