
var currPageNo = 1;

$(document).ready(function(){
	showLoader(true);
	initOTPModal();
	setPaymentCategoryDropdownOption("input_filter_payment_category");
	getBatchList();
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
		action : "thirdpartyapprovals",
		page : currPageNo,
		paymentCategory : $("#input_filter_payment_category").val()
	}
	// doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENT_THIRDPARTY_APPROVALS, {action : "thirdpartyapprovals", "paymentCategory" : $("#input_filter_payment_category").val()}, function(json){
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENT_THIRDPARTY_APPROVALS, params , function(json){
	
		if(json != null && json.status_code == 200 && json.data){		
			if(json.data.length == 0){
				var row = "<tr><td colspan=\"11\" align=\"center\">No Requests found</td></tr>";				
				$('#paymentsTable > tbody:last-child').append(row);
			} else {			
				var header = "";
				header += "<tr>";
				header += "<th><input type=\"checkbox\" class=\"chk-select-all\" onchange=\"selectAll(this)\" ></th>";
				header += "<th>Batch Id</th>";
				header += "<th>Payment Category</th>";
				header += "<th>Payment Mode</th>";
				header += "<th>Payment details</th>";
				header += "<th>Created On</th>";
				if(json.data[0].maker_approved_time){
					header += "<th>Scheduled On</th>";
				} 
				if(json.data[0].checker_approved_time){
					header += "<th>Verified On</th>";
				}
				header += "<th>Status</th>";
				header += "<th>Amount</th>";
				// if(json.data[0].maker_notes){
				// 	header += "<th>Maker Notes</th>";
				// }
				// if(json.data[0].checker_notes){
				// 	header += "<th>Checker Notes</th>";	
				// }
				if(!localStorage.getItem('linkNavMenu') || !localStorage.getItem('linkNavMenu').includes('maker')){
					header += "<th>Maker Notes</th>";
				}
				// if(!localStorage.getItem('linkNavMenu') || (!localStorage.getItem('linkNavMenu').includes('maker') && !localStorage.getItem('linkNavMenu').includes('checker'))){
				// 	header += "<th>Checker Notes</th>";
				// }		
				header += "<th>Notes</th>";			
				header += "<th>Action</th>";
				header += "</tr>";				
				$('#paymentsTable > thead').html(header);			
				
				for(var position in json.data){
					var data = json.data[position];
					var row = "<tr>";
					row += "<td align=\"center\">&nbsp;<input class=\"chk_payment_request\" type=\"checkbox\" value=\"" + data.batch_id + "\"/>&nbsp;</td>" ;
					row += "<td>" + data.batch_id + "</td>" ;
					row += "<td>" + (data.payment_category=='Insurance'?('Ins_' + data.vendor_product + '_' + data.vendor):data.payment_category) + "</td>";
					row += "<td>" + data.transfer_type + "</td>";
					row += "<td>" + data.remarks + "</td>" ;
					row += "<td>" + data.created.substr(0, 16) + "</td>" ;
					if(data.maker_approved_time){
						row += "<td>" + data.maker_approved_time.substr(0, 16) + "</td>" ;
					}
					if(data.checker_approved_time){
						row += "<td>" + data.checker_approved_time.substr(0, 16) + "</td>" ;
					}
					row += "<td>" + data.status + "</td>" ;
					row += "<td align=\"right\">" + data.amount.toMoney() + "</td>" ;
					// if(data.maker_notes){
					// 	row += "<td>" + data.maker_notes + "</td>" ;
					// }
					// if(data.checker_notes){
					// 	row += "<td>" + data.checker_notes + "</td>" ;
					// }
					if(!localStorage.getItem('linkNavMenu') || !localStorage.getItem('linkNavMenu').includes('maker')){
						if(data.maker_notes){
							row += "<td>" + data.maker_notes + "</td>" ;
						}
						else{
							row += "<td align=\"center\">-</td>" ;
						}
					}
					// if(!localStorage.getItem('linkNavMenu') || (!localStorage.getItem('linkNavMenu').includes('maker') && !localStorage.getItem('linkNavMenu').includes('checker'))){
					// 	if(data.checker_notes){
					// 		row += "<td>" + data.checker_notes + "</td>" ;
					// 	}
					// 	else{
					// 		row += "<td align=\"center\">-</td>" ;
					// 	}
					// }
					row += "<td><textarea name=\"notes\"style=\"display: none;width: 100%;min-width: 100px;\" ></textarea></td>" ;
					row += "<td align=\"center\">&nbsp;&nbsp;<a class=\"show-payments cur-pointer\" ><span class=\"glyphicon glyphicon-eye-open\" onclick=\"viewPaymentDetails('" + data.batch_id + "')\"></span></a>";
					row += "&nbsp;&nbsp;<a class=\"show-payments cur-pointer\" ><span class=\"glyphicon glyphicon-download\" onclick=\"downloadPaymentDetails('" + data.batch_id + "')\"></span></a>&nbsp;&nbsp;</td>";
					row += "</tr>";			
					$('#paymentsTable > tbody:last-child').append(row);			
				}			
			}
		}
		
		showLoader(false);	
		$("#paymentsTable tbody .chk_payment_request").change(function() {			
			if($(this).is(':checked')){
				$(this).closest("tr").find("textarea[name=notes]").show();	
			} else {
				$(this).closest("tr").find("textarea[name=notes]").hide();
			}
			checkApprovalBtnEnable();
		});
	});
}

function checkApprovalBtnEnable(){
	var checkedCount = $('table>tbody .chk_payment_request:checkbox:checked').length;
	$('.chk-select-all').prop('checked', (checkedCount == $('.chk_payment_request:checkbox').length));
	if(checkedCount > 0){		
		$("#btn-cancell").removeAttr('disabled');
		$("#btn-approve").removeAttr('disabled');
	} else {		
		$("#btn-cancell").attr('disabled','disabled');
		$("#btn-approve").attr('disabled','disabled');
	}
}

function selectAll(chkSelecetAll){
	$('table>tbody .chk_payment_request').prop('checked', chkSelecetAll.checked);
	if(chkSelecetAll.checked){
		$("textarea[name=notes]").show();	
	} else {
		$("textarea[name=notes]").hide();
	}
	checkApprovalBtnEnable();
} 


function initOTPModal(){				
	$('#otpVerificationForm').validator().on('submit', function( event ) {	
		if (event.isDefaultPrevented()) return;
		$("#otpVerificationModal").modal('hide');
		showLoader(true);
		var otpPin = $('#otp_pin').val();
		var otpAuthId = $('#otp_auth_id').val();
		var action = $('#action').val();
		
		var params = {};
		params['action'] = 'verify';
		params['otp_pin'] = otpPin;
		params['otp_auth_id'] = otpAuthId;		
		
		
				
		doAPIRequestWithLoader(API.METHOD_POST, API.PATH_OTP, params, function (json){
			showLoader(false);
			if(json != null && json.status_code == 200 && json.data.is_verified){
				// Successfully verified
				// perform a approval process for selected payments
				$('#success').html("<li>OTP verified...</li>").show();
				approvePayment(action, otpAuthId, otpPin);				
			} else {
				// show error message invalid OTP
				$('#error').html("<li>OTP verification failed!</li>").show();
			}
		});
	 	event.preventDefault();
	});
	
	$('#otpVerificationModal').on('show.bs.modal', function () {
		$('#otpVerificationForm')[0].reset();
		$('#otpVerificationForm').validator('update');
	});
	
}

function authenticateApprovePayment(isApproved){
	
	var notesRequiredBatchId = [];
	$("table>tbody .chk_payment_request:checkbox:checked").each(function(){
		let	notes = $(this).closest("tr").find("textarea[name=notes]").val();
        if(!notes || !notes.trim()){
        	notesRequiredBatchId.push($(this).val());
        }
    });
	
	// if(notesRequiredBatchId.length == 0) {
		$('#error').hide();
		$('#success').hide();
		var params = {};
		params['action'] = 'generate';
		doAPIRequestWithLoader(API.METHOD_POST, API.PATH_OTP, params, function (json){
			showLoader(false);		
			if(json != null && json.status_code == 200 && json.data){
				$('#otp_auth_id').val(json.data.auth_id);
				$('#action').val(isApproved ? 'thirdpartyapproved' : 'cancelled');	
				$("#otpVerificationModal").modal({show: true, backdrop: 'static'});
			} else {
				$('#error').html("<li>Failed to generate OTP!... Try after some time...</li>").show();			
			}
		});	
	// } else {
		// validation error
	//	$('#error').html("<li>Notes required for following batches " + JSON.stringify(notesRequiredBatchId) + "</li>").show();
	// }
	
}

function approvePayment(action, otpAuthId, otpPin){		
	var params = {};
	params['action'] = action;
	params['otp_auth_id'] = otpAuthId;
	params['otp_pin'] = otpPin;
	
	var selectedBatch = [];
	$("table>tbody .chk_payment_request:checkbox:checked").each(function(){ 
        selectedBatch.push({
        	batch_id : $(this).val(),
        	notes : $(this).closest("tr").find("textarea[name=notes]").val()
        });
    });
	params['batch'] = JSON.stringify(selectedBatch);
	doAPIRequestWithLoader(API.METHOD_POST, API.PATH_PAYMENT_THIRDPARTY_APPROVALS, params, function (json){
		$('#error').hide();
		$('#success').hide();
		if(json != null && json.status_code == 200 && json.data){
			var approvedSuccess = json.data.success;
			var approvedFailed = json.data.failed;
			$("#paymentsTable tbody>tr").each(function () {
				var checkBox = $(this).find('.chk_payment_request');
				if(checkBox.prop('checked') == true && approvedSuccess.indexOf(Number(checkBox.val())) != -1){
					$(this).remove();
				}
			});
			
			if(approvedSuccess && approvedSuccess.length > 0){
				$('#success').html("<li>The third party payment batches " + JSON.stringify(approvedSuccess) + " successfully approved! </li>").show();
			}
			
			if(approvedFailed && approvedFailed.length > 0){
				$('#error').html("<li>The third party payment batches " + JSON.stringify(approvedFailed) +" failed!</li>").show();
			}			
		} else {
			$('#error').html("<li>Payment approval failed!</li>").show();
		}
		if($('#paymentsTable tbody>tr').length == 0){
			var row = "<tr><td colspan=\"9\" align=\"center\">No Requests found</td></tr>";	
			$('#paymentsTable > tbody:last-child').append(row);
		}
		checkApprovalBtnEnable();
		showLoader(false);
	});	
}

function viewPaymentDetails(batchId){	
	var params = {};
	params['action']='view_payment_details';
	params['batch_id'] = batchId;
	// params['id'] = TOKEN;
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENT_THIRDPARTY_APPROVALS, params, callbackViewPaymentDetails);	
}

function downloadPaymentDetails(batchId) {
	/*var params = {};
	params['action']='download_payment_details';
	params['batch_id'] = batchId;
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENT_THIRDPARTY_APPROVALS, params, calbackDownloadFile);*/
	window.open(API.PATH_PAYMENT_THIRDPARTY_APPROVALS + "?action=download_payment_details&batch_id="+batchId+"&id="+localStorage.token, '_blank');
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
			var header = "";
			header += "<tr>";
			header += "<th nowarp class=\"text-center\">S.No</th>";
			header += "<th nowarp class=\"text-center\">Receipt No</th>";
			header += "<th nowarp class=\"text-center\">Assist Transaction ID</th>";
			header += "<th nowarp class=\"text-center\">KGFS</th>";
			header += "<th nowarp class=\"text-center\">Applicant URN</th>";
			header += "<th nowarp class=\"text-center\">Account Name</th>";
			header += "<th nowarp class=\"text-center\">Account No</th>";
			header += "<th nowarp class=\"text-center\">IFSC Code</th>";
			header += "<th nowarp class=\"text-center\">NEFT Amount</th>";
			// header += "<th nowarp class=\"text-center\">Loan Amount</th>";
			// header += "<th nowarp class=\"text-center\">Insurance Fee</th>";
			// header += "<th nowarp class=\"text-center\">Processing Fee</th>";
			// header += "<th nowarp class=\"text-center\">GST</th>";
			header += "</tr>";				
			$('#paymentDetailsViewTable > thead').html(header);	
			var totalAmount = 0;
			// var totalDisbursementAmount = 0;
			// var totalInsuranceFee = 0;
			// var totalProcessingFee= 0;
			var totalGST = 0;
			var sNo = 1;
			for(var position in json.data){
				var data = json.data[position];
				var row = "<tr>";
				row += "<td nowarp align=\"center\">&nbsp;" + (sNo++) + "&nbsp;</td>" ;
				row += "<td nowarp>" + data.receipt_no + "</td>" ;
				row += "<td nowarp>" + data.transaction_id + "</td>" ;
				row += "<td nowarp>" + data.kgfs + "</td>" ;
				row += "<td nowarp>" + data.applicant_urn + "</td>" ;
				row += "<td nowarp>" + data.beneficiary_name + "</td>" ;
				row += "<td nowarp>" + data.beneficiary_bank_account_no + "</td>" ;	
				row += "<td nowarp>" + data.beneficiary_bank_ifsc_code + "</td>" ;		
				row += "<td nowarp align=\"right\">" + data.amount.toMoney() + "</td>" ;
				// row += "<td nowarp align=\"right\">" + (data.disbursed_loan_amount ? data.disbursed_loan_amount.toMoney() : "") + "</td>" ;
				// row += "<td nowarp align=\"right\">" + (data.insurance_fee ? data.insurance_fee.toMoney() : "") + "</td>" ;	
				// row += "<td nowarp align=\"right\">" + (data.processing_fee ? data.processing_fee.toMoney() : "") + "</td>" ;
				// row += "<td nowarp align=\"right\">" + (data.gst ? data.gst.toMoney() : "") + "</td>" ;
				row += "</tr>";			
				$('#paymentDetailsViewTable > tbody:last-child').append(row);
				totalAmount += Number(data.amount);
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
			row += "<td><b>Total Amount</b></td>" ;		
			row += "<td nowarp align=\"right\"><b>" + totalAmount.toMoney() + "</b></td>" ;
			// row += "<td nowarp align=\"right\"><b>" + totalDisbursementAmount.toMoney() + "</b></td>" ;
			// row += "<td nowarp align=\"right\"><b>" + totalInsuranceFee.toMoney() + "</b></td>" ;
			// row += "<td nowarp align=\"right\"><b>" + totalProcessingFee.toMoney() + "</b></td>" ;
			// row += "<td nowarp align=\"right\"><b>" + totalGST.toMoney() + "</b></td>" ;				
			row += "</tr>";
			$('#paymentDetailsViewTable > tbody:last-child').append(row);
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


