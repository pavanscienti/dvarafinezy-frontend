
/**
 * 
 * 
 * 
 */


$(document).ready(function(){
	showLoader(false);
	var fromDate = $("#date_from").val(new Date().format('yyyy-mm-dd'));
	var toDate = $("#date_to").val(new Date().format('yyyy-mm-dd'));
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
		params["action"] = "trxn-aeps";
		params["fromDate"] = fromDate;
		params["toDate"] = toDate;
		doAPIRequest(API.METHOD_GET, API.PATH_ACCOUNT_STMT, params, displayTransaction);
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
		let url =  API.PATH_ACCOUNT_STMT + "?action=downloadAEPS&fromDate=" + fromDate + "&toDate=" + toDate + "&id="+(localStorage.token);
		window.open(url, '_blank');	
	}
	
}

function displayTransaction(json){
	showLoader(false);
	$('#tbl-stmt > tbody:last').html("");
	if(json != null && json.status_code == 200) {
		if(json.data.data.length == 0 ){
			$('#tbl-stmt > tbody:last').append("<tr><td colspan=\"14\" align=\"center\">No transaction found</td>");
		} else {
			$.each(json.data.data, function(index, item) {
				var row = "<tr>";
				row += "<td>" + (index + 1) + "</td>";	
				row += "<td>" + item.id + "</td>";		
				row += "<td>" + (item.rrn ? item.rrn : "") + "</td>";		
				row += "<td nowrap>" + item.trxn_date_time.substr(0, 19) + "</td>";
				row += "<td>" + item.user_id + "</td>";	
				row += "<td>" + item.csr_id + "</td>";		
				row += "<td nowrap>" + item.csr_name + "</td>";		
				row += "<td>" + item.terminal_id + "</td>";	
				row += "<td>" + item.pan.substr(7) + "</td>";	
				row += "<td>" + item.mobile_no + "</td>";
				row += "<td>" + item.pan.substr(0, 6) + "</td>";
				row += "<td align=\"right\">" + (item.trxn_amount/100).toMoney() + "</td>";
				row += "<td>" + item.response_code + "</td>";		
				row += "<td>" + item.transaction_process_type + "</td>";
				row += "<td>" + item.error_desc + "</td>";			
				row += "</tr>";
				$('#tbl-stmt > tbody:last').append(row);
			});
		}	
		
	} else {
		$('#tbl-stmt > tbody:last').append("<tr><td colspan=\"14\" align=\"center\">Failed to get transactions</td>");
	}
}