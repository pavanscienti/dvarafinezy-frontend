var currPageNo = 1;

$(document).ready(function(){
	showLoader(true);	
	setPaymentCategoryDropdownOption("input_filter_payment_category");
	getBatchList()		
});	

function togglePopup(isShow) {
	var dialog = document.getElementById('paymentDetailsView');
	if(isShow){
		dialog.show();	
	} else {
		dialog.close();
	}
}

function getBatchList() {
	$('#paymentsTable > tbody').html("");
	$("#current_page_no").html(currPageNo);
	let params = {
		action : "cancelled",
		page : currPageNo,
		paymentCategory : $("#input_filter_payment_category").val()
	}
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENT_APPROVALS, params, function(json) {
		if(json != null && json.status_code == 200 && json.data){		
			if(json.data.length == 0){
				var row = "<tr><td colspan=\"9\" align=\"center\">No Requests found</td></tr>";				
				$('#paymentsTable > tbody:last-child').append(row);
			} else {			
				var header = "";
				header += "<tr>";
				header += "<th class=\"text-center\">S.No</th>";
				header += "<th class=\"text-center\">Batch Id</th>";
				header += "<th class=\"text-center\">Payment details</th>";
				header += "<th class=\"text-center\">Created On</th>";
				header += "<th class=\"text-center\">Cancelled On</th>";
				header += "<th class=\"text-center\">Notes</th>";
				header += "<th>Amount</th>";			
				header += "<th></th>";
				header += "</tr>";				
				$('#paymentsTable > thead').html(header);	
				
				var sNo = 1;
				for(var position in json.data){
					var data = json.data[position];
					let cancelledOn = "";
					var row = "<tr>";
					row += "<td align=\"center\">&nbsp;" + (sNo++) + "&nbsp;</td>" ;
					row += "<td>" + data.batch_id + "</td>" ;
					row += "<td>" + data.remarks + "</td>" ;
					row += "<td>" + data.created + "</td>" ;
					
					if(data.approver_approved_time) {					
						cancelledOn = data.approver_approved_time + " By Approver";
					} else if(data.checker_approved_time) {
						cancelledOn = data.checker_approved_time + " By Checker";
					} else if(data.maker_approved_time) {
						cancelledOn = data.maker_approved_time + " By Maker";
					} else {
						cancelledOn = data.created;
					}				
					row += "<td>" + cancelledOn + "</td>" ;
					row += "<td>" + (data.reject_reason ? data.reject_reason : "-") + "</td>" ;
					row += "<td align=\"right\">" + (data.amount != null ? data.amount.toMoney() : "-") + "</td>" ;
					row += "<td align=\"center\">&nbsp;&nbsp;<a class=\"show-payments\" ><span class=\"glyphicon glyphicon-eye-open\" onclick=\"viewPaymentDetails('" + data.batch_id + "')\"></span></a>";
					row += "&nbsp;&nbsp;<a class=\"show-payments\" ><span class=\"glyphicon glyphicon-download\" onclick=\"downloadPaymentDetails('" + data.batch_id + "')\"></span></a>&nbsp;&nbsp;</td>" ;
					row += "</tr>";			
					$('#paymentsTable > tbody:last-child').append(row);			
				}
			}
		}	
		showLoader(false);	
		$("#paymentsTable tbody .chk_payment_request").change(function() {		
			checkApprovalBtnEnable();	    
		});
	})	
}

function viewPaymentDetails(batchId){	
	var params = {};
	params['action']='view_payment_details';
	params['batch_id'] = batchId;
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENT_APPROVALS, params, callbackViewPaymentDetails);	
}

function downloadPaymentDetails(batchId){	
	var params = {};
	params['action']='download_payment_details';
	params['batch_id'] = batchId;
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENT_APPROVALS, params, calbackDownloadFile);	
}

function callbackViewPaymentDetails(json){	
	if(json != null && json.status_code == 200 && json.data){
		$('#paymentDetailsViewTable > tbody').html('');
		if(json.data.length == 0){
			var row = "<tr>";
			row += "<td colspan=\"9\" align=\"center\"><center>No Requests found</center></td>" ;			
			row += "</tr>";			
			$('#paymentDetailsViewTable > tbody:last-child').append(row);
		} else {
			
			var totalAmount = 0;
			var totalDisbursementAmount = 0;
			var totalProcessingFee= 0;
			var totalInsuranceFee = 0;
			var totalGST = 0;
			var sNo = 1;
			for(var position in json.data){
				var data = json.data[position];
				var row = "<tr>";
				row += "<td nowarp align=\"center\">&nbsp;" + (sNo++) + "&nbsp;</td>" ;
				row += "<td nowarp>" + data.disb_date + "</td>" ;
				row += "<td nowarp>" + data.customer_no + "</td>" ;
				row += "<td nowarp>" + data.account_name + "</td>" ;
				row += "<td nowarp>" + data.account_no + "</td>" ;	
				row += "<td nowarp>" + data.ifsc_code + "</td>" ;				
				row += "<td nowarp align=\"right\">" + (data.amount != null ? data.amount.toMoney() : "-") + "</td>" ;
				row += "<td nowarp align=\"right\">" + (data.disbursed_loan_amount ? data.disbursed_loan_amount.toMoney() : "") + "</td>" ;
				row += "<td nowarp align=\"right\">" + (data.insurance_fee ? data.insurance_fee.toMoney() : "") + "</td>" ;	
				row += "<td nowarp align=\"right\">" + (data.processing_fee ? data.processing_fee.toMoney() : "") + "</td>" ;
				row += "<td nowarp align=\"right\">" + (data.gst ? data.gst.toMoney() : "") + "</td>" ;
				
				row += "<td>" + (data.utr_no || '') + "</td>" ;
				row += "<td>" + (data.ponum || "") + "</td>" ;
												
				row += "</tr>";			
				$('#paymentDetailsViewTable > tbody:last-child').append(row);
				totalAmount += Number(data.amount);
				totalDisbursementAmount += Number(data.disbursed_loan_amount);
				totalInsuranceFee += Number(data.insurance_fee);
				totalProcessingFee += Number(data.processing_fee);
				totalGST += Number(data.gst);
			}
			var row = "<tr>";
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;	
			row += "<td><b>Total Amount</b></td>" ;			
			row += "<td nowarp align=\"right\"><b>" + totalAmount.toMoney() + "</b></td>" ;
			row += "<td nowarp align=\"right\"><b>" + totalDisbursementAmount.toMoney() + "</b></td>" ;
			row += "<td nowarp align=\"right\"><b>" + totalInsuranceFee.toMoney() + "</b></td>" ;
			row += "<td nowarp align=\"right\"><b>" + totalProcessingFee.toMoney() + "</b></td>" ;
			row += "<td nowarp align=\"right\"><b>" + totalGST.toMoney() + "</b></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;
								
			row += "</tr>";
			$('#paymentDetailsViewTable > tbody:last-child').append(row);
			
			var header = "";
			header += "<tr>";
			header += "<th nowarp class=\"text-center\">S.No</th>";
			header += "<th nowarp class=\"text-center\">Disb Date</th>";
			header += "<th nowarp class=\"text-center\">Customer No</th>";
			header += "<th nowarp class=\"text-center\">Account Name</th>";
			header += "<th nowarp class=\"text-center\">Account No</th>";
			header += "<th nowarp class=\"text-center\">IFSC Code</th>";
			header += "<th nowarp class=\"text-center\">Amount</th>";
			header += "<th nowarp class=\"text-center\">Disbursed Amount</th>";
			header += "<th nowarp class=\"text-center\">Insurance Fee</th>";
			header += "<th nowarp class=\"text-center\">Processing Fee</th>";
			header += "<th nowarp class=\"text-center\">GST</th>";			
			header += "<th class=\"text-center\">UTR No</th>";
			header += "<th class=\"text-center\">Bank Ref No</th>";	
			header += "</tr>";				
			$('#paymentDetailsViewTable > thead').html(header);
		}
	}	
	showLoader(false);
	togglePopup(true);
}

function showRecords(moveTo) {	
	if((moveTo==-1 && currPageNo > 1)
			|| (moveTo == 1 && $('#paymentsTable > tbody>tr').length >= 15)) {
		currPageNo += moveTo;
		getBatchList()
	}
}

