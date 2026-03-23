$(document).ready(function(){
	showLoader(true);
	CreateInvoice();
	getInvoiceList();
});	

function togglePopup(isShow) {
	var dialog = document.getElementById('invoiceDetailsView');
	if(isShow){
		dialog.show();	
	} else {
		dialog.close();
	}
}

function togglePopupInvoice(isShow){
	var dialog = document.getElementById('invoiceModal');
	if(isShow){
		dialog.show();	
	} else {
		dialog.close();
	}
}

function getInvoiceList() {
	$('#invoiceTable > tbody').html("");
	$("#current_page_no").html(currPageNo);
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_INVOICE, {action : "getAllinvoices"}, function(json){
		if(json != null && json.status_code == 200 && json.data){		
			if(json.data.length == 0){
				var row = "<tr><td colspan=\"11\" align=\"center\">No Requests found</td></tr>";				
				$('#invoiceTable > tbody:last-child').append(row);
			} else {			
				var header = "";
				header += "<tr>";
				header += "<th>Id</th>";
				header += "<th>Vendor</th>";
				header += "<th>Created On</th>";
				header += "<th>Status</th>";
				header += "<th>Amount</th>";		
				header += "<th>Notes</th>";			
				header += "<th>Action</th>";
				header += "</tr>";				
				$('#invoiceTable > thead').html(header);			
				
				for(var position in json.data){
					var data = json.data[position];
					var row = "<tr>";
					row += "<td>" + data.batch_id + "</td>" ;
					row += "<td>" + data.vendor + "</td>";
					row += "<td>" + data.created.substr(0, 16) + "</td>" ;
					row += "<td>" + data.status + "</td>" ;
					row += "<td align=\"right\">" + data.amount.toMoney() + "</td>" ;
					row += "<td>" + data.remarks + "</td>" ; ;
					row += "<td align=\"center\">&nbsp;&nbsp;<a class=\"show-payments cur-pointer\" ><span class=\"glyphicon glyphicon-eye-open\" onclick=\"viewInvoiceDetails('" + data.batch_id + "')\"></span></a>";
					row += "&nbsp;&nbsp;<a class=\"show-payments cur-pointer\" ><span class=\"glyphicon glyphicon-download\" onclick=\"downloadInvoiceDetails('" + data.batch_id + "','" + data.year + "','" + data.month + "','" + data.vendor +"')\"></span></a>&nbsp;&nbsp;</td>";
					row += "</tr>";			
					$('#invoiceTable > tbody:last-child').append(row);			
				}			
			}
		}	
		showLoader(false);	
		// $("#invoiceTable tbody .chk_payment_request").change(function() {			
		// 	if($(this).is(':checked')){
		// 		$(this).closest("tr").find("textarea[name=notes]").show();	
		// 	} else {
		// 		$(this).closest("tr").find("textarea[name=notes]").hide();
		// 	}
		// 	checkApprovalBtnEnable();
		// });
	});
}

function viewInvoiceDetails(batchId){	
	var params = {};
	params['action']='getInvoicetransactionsByBatchId';
	params['batch_id'] = batchId;
	// params['id'] = TOKEN;
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_INVOICE, params, callbackViewInvoiceDetails);	
}

function callbackViewInvoiceDetails(json){	
	var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	if(json != null && json.status_code == 200 && json.data){
		$('#invoiceDetailsViewTable > tbody').html('');
		if(json.data.length == 0){
			var row = "<tr>";
			row += "<td colspan=\"9\" align=\"center\"><center>No Requests found</center></td>" ;			
			row += "</tr>";			
			$('#invoiceDetailsViewTable > tbody:last-child').append(row);
		} else {
			var header = "";
			header += "<tr>";
			header += "<th nowarp class=\"text-center\">ID</th>";
			header += "<th nowarp class=\"text-center\">Customer ID</th>";
			header += "<th nowarp class=\"text-center\">Vendor ID</th>";
			header += "<th nowarp class=\"text-center\">Policy Number</th>";
			header += "<th nowarp class=\"text-center\">Policy Name</th>";
			header += "<th nowarp class=\"text-center\">Loan ID</th>";
			header += "<th nowarp class=\"text-center\">Notes</th>";
			header += "<th nowarp class=\"text-center\">Month</th>";
			header += "<th nowarp class=\"text-center\">Year</th>";
			header += "<th nowarp class=\"text-center\">Premium Amount</th>";
			header += "<th nowarp class=\"text-center\">Commission Amount</th>";
			header += "</tr>";				
			$('#invoiceDetailsViewTable > thead').html(header);	
			var totalPremiumAmount = 0;
			// var totalDisbursementAmount = 0;
			// var totalInsuranceFee = 0;
			// var totalProcessingFee= 0;
			var totalCommissionAmount = 0;
			var sNo = 1;
			for(var position in json.data){
				var data = json.data[position];
				var row = "<tr>";
				row += "<td nowarp align=\"center\">&nbsp;" + data.id + "&nbsp;</td>" ;
				row += "<td nowarp>" + data.customer_id + "</td>" ;
				row += "<td nowarp>" + data.vendor_id + "</td>" ;
				row += "<td nowarp>" + data.policy_number + "</td>" ;
				row += "<td nowarp>" + data.policy_name + "</td>" ;
				row += "<td nowarp>" + data.loan_id + "</td>" ;
				row += "<td nowarp>" + data.notes + "</td>" ;
				row += "<td nowarp>" + months[data.month-1] + "</td>" ;	
				row += "<td nowarp>" + data.year + "</td>" ;		
				row += "<td nowarp align=\"right\">" + data.premium_amount.toMoney() + "</td>" ;
				row += "<td nowarp align=\"right\">" + data.commission_amount.toMoney() + "</td>" ;
				row += "</tr>";			
				$('#invoiceDetailsViewTable > tbody:last-child').append(row);
				totalPremiumAmount += Number(data.premium_amount);
				totalCommissionAmount += Number(data.commission_amount);
				// totalDisbursementAmount += Number(data.disbursed_loan_amount);
				// totalInsuranceFee += Number(data.insurance_fee);
				// if(data.processing_fee) totalProcessingFee += Number(data.processing_fee);
				// if(data.gst) totalGST += Number(data.gst);
			}
			var row = "<tr>";
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td></td>" ;
			row += "<td><b>Total Amount</b></td>" ;		
			row += "<td nowarp align=\"right\"><b>" + totalPremiumAmount.toMoney() + "</b></td>" ;
			row += "<td nowarp align=\"right\"><b>" + totalCommissionAmount.toMoney() + "</b></td>" ;
			// row += "<td nowarp align=\"right\"><b>" + totalDisbursementAmount.toMoney() + "</b></td>" ;
			// row += "<td nowarp align=\"right\"><b>" + totalInsuranceFee.toMoney() + "</b></td>" ;
			// row += "<td nowarp align=\"right\"><b>" + totalProcessingFee.toMoney() + "</b></td>" ;
			// row += "<td nowarp align=\"right\"><b>" + totalGST.toMoney() + "</b></td>" ;				
			row += "</tr>";
			$('#invoiceDetailsViewTable > tbody:last-child').append(row);
		}
	}	
	showLoader(false);
	togglePopup(true);
	
}

function downloadInvoiceDetails(batchId,year,month,vendor) {
	/*var params = {};
	params['action']='download_payment_details';
	params['batch_id'] = batchId;
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENT_THIRDPARTY_APPROVALS, params, calbackDownloadFile);*/
	window.open(API.PATH_INVOICE + "?action=download_invoice&batch_id="+batchId+"&vendor_id="+vendor+"&year="+year+"&month="+month+"&id="+localStorage.token, '_blank');
}

function openCreateInvoice(){
	$("#invoiceModal").modal({show: true, backdrop: false});
	$('#invoiceForm')[0].reset();
}

function CreateInvoice(){
	$('#invoiceForm').validator().on('submit', function( event ) {	
		if (event.isDefaultPrevented()) return;
		$("#invoiceModal").modal('hide');
		showLoader(true);
		var vendor = $('#vendor').val();
		var year = $('#year').val();
		var month = $('#month').val();
		var invoicefile = $('#invoicefile').val();
		let formData = new FormData();
     	formData.append("invoicefile", invoicefile);
		
		var params = {};
		params['action'] = 'uploadInvoiceFile';
		params['vendor_id'] = vendor;
		params['year'] = year;
		params['month'] = month;
		params['invoicefile'] = formData;			
		
		console.log("params" , params)
				
		doAPIRequestWithLoader(API.METHOD_POST, API.PATH_INVOICE, params, function (json){
			showLoader(false);
			if(json != null && json.status_code == 200 && json.data.is_verified){
				$('#success').html("<li>Invoice uploaded successfully...</li>").show();	
				getInvoiceList()		
			} else {
				// show error message invalid OTP
				$('#error').html("<li>Invoice upload failed!</li>").show();
			}
		});
	 	event.preventDefault();
	});
	
	$('#invoiceModal').on('show.bs.modal', function () {
		$('#invoiceForm')[0].reset();
		$('#invoiceForm').validator('update');
	});
}