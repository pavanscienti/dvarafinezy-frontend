$(document).ready(function(){
	showLoader(true);
    let date = new Date();
	var toDate = $("#date_to").val(date.format('yyyy-mm-dd'));
	date.setDate(date.getDate()-5);
	var fromDate = $("#date_from").val(date.format('yyyy-mm-dd'));
	getBatchList()
	initOTPModal();	
});	


function getBatchList(){
	var fromDate = $("#date_from").val();
	var toDate = $("#date_to").val();
	
	if(fromDate == null || fromDate.length != 10){
		alert("select from date!");
	} else if(toDate == null || toDate.length != 10){
		alert("select to date!");
	} else {		
		showLoader(true);
		var params = {};		
		params["action"] = "batchlist";
		params["fromDate"] = fromDate;
		params["toDate"] = toDate;
		params["category"]= $("#input_filter_category").val();
		$('#paymentsTable > tbody').html("");
		$("#current_page_no").html(currPageNo);
		doAPIRequest(API.METHOD_GET, API.PATH_PAYMENT_THIRDPARTY_APPROVALS, params, function(json) {		
			if(json != null && json.status_code == 200 && json.data){		
				if(json.data.length == 0){
					var row = "<tr><td colspan=\"11\" align=\"center\">No Requests found</td></tr>";				
					$('#paymentsTable > tbody:last-child').append(row);
				} else {	
					if($("#input_filter_category").val()=='Insurance'){		
						var header = "";
						header += "<tr>";
						header += "<th><input type=\"checkbox\" class=\"chk-select-all\" onchange=\"selectAll(this)\" ></th>";
						header += "<th>Transaction ID</th>";
						header += "<th>URN</th>";
						// header += "<th>KGFS</th>";
						header += "<th>Account Number</th>";
						header += "<th>Book Entity</th>";
						header += "<th>Branch Code</th>";
						header += "<th>Branch</th>";
						header += "<th>Amount</th>";
						header += "</tr>";				
						$('#paymentsTable > thead').html(header);			
						
						for(var position in json.data){
							var data = json.data[position];
							var row = "<tr>";
							row += "<td align=\"center\">&nbsp;<input class=\"chk_payment_request\" type=\"checkbox\" value=\"" + data.transaction_id + "\"/>&nbsp;</td>" ;
							row += "<td>" + data.transaction_id + "</td>" ;
							row += "<td class=\"urn\">" + data.urn + "</td>";
							row += "<td>" + data.account_number + "</td>" ;
							// row += "<td>" + data. + "</td>" ;
							row += "<td>" + data.book_entity + "</td>" ;
							row += "<td>" + data.branch_code + "</td>" ;
							row += "<td>" + data.branch + "</td>" ;
							row += "<td align=\"right\">" + (data.amount ? data.amount.toMoney() : "") + "</td>" ;
							row += "</tr>";			
							$('#paymentsTable > tbody:last-child').append(row);			
						}	
					}
					else if($("#input_filter_category").val()=='Gold'){	
						var header = "";
						header += "<tr>";
						header += "<th><input type=\"checkbox\" class=\"chk-select-all\" onchange=\"selectAll(this)\" ></th>";
						header += "<th>Id</th>";
						header += "<th>Applicant Name</th>";
						header += "<th>URN</th>";
						// header += "<th>KGFS</th>";
						header += "<th>Branch</th>";
						header += "<th>Created On</th>";
						header += "<th>Receipt No</th>";
						header += "<th>Status</th>";
						header += "<th>Amount</th>";
						header += "<th>Remarks</th>";
						header += "</tr>";				
						$('#paymentsTable > thead').html(header);			
						
						for(var position in json.data){
							var data = json.data[position];
							var row = "<tr>";
							row += "<td align=\"center\">&nbsp;<input class=\"chk_payment_request\" type=\"checkbox\" value=\"" + data.id + "\"/>&nbsp;</td>" ;
							row += "<td>" + data.id + "</td>" ;
							row += "<td>" + data.applicant_name + "</td>";
							row += "<td>" + data.applicant_urn + "</td>" ;
							// row += "<td>" + data. + "</td>" ;
							row += "<td>" + data.branch_name + "</td>" ;
							row += "<td>" + data.created_at.substr(0, 16) + "</td>" ;
							row += "<td class=\"receipt_no\">" + data.receipt_no + "</td>";
							row += "<td>" + data.status + "</td>" ;
							row += "<td class=\"orderTotalValueInr\" align=\"right\">" + (data.orderTotalValueInr ? data.orderTotalValueInr.toMoney() : "") + "</td>" ;
							row += "<td>" + data.remarks + "</td>" ;
							row += "</tr>";			
							$('#paymentsTable > tbody:last-child').append(row);			
						}
					}
					else {
						var header = "";
						header += "<tr>";
						header += "<th></th>";
						header += "<th>Id</th>";
						header += "<th>Beneficiary Name</th>";
						header += "<th>Bank Account No</th>";
						// header += "<th>KGFS</th>";
						header += "<th>IFSC Code</th>";
						header += "<th>Created On</th>";
						header += "<th>KGFS</th>";
						header += "<th>Status</th>";
						header += "<th>Net Payable</th>";
						header += "</tr>";				
						$('#paymentsTable > thead').html(header);			
						
						for(var position in json.data){
							var data = json.data[position];
							var row = "<tr>";
							row += "<td align=\"center\">&nbsp;<input class=\"chk_payment_request\" type=\"checkbox\" value=\"" + data.id + "\" onchange=\"selectVendor(this,'" + position + "')\"/>&nbsp;</td>" ;
							row += "<td>" + data.id + "</td>" ;
							row += "<td class=\"benificiary_name\">" + data.benificiary_name + "</td>";
							row += "<td class=\"bank_account_no\">" + data.bank_account_no + "</td>" ;
							// row += "<td>" + data. + "</td>" ;
							row += "<td class=\"ifsc_code\">" + data.ifsc_code + "</td>" ;
							row += "<td class=\"branch_name\" style=\"display:none\">" + data.branch_name + "</td>" ;
							row += "<td class=\"branch_code\" style=\"display:none\">" + data.branch_code + "</td>" ;
							row += "<td>" + data.created_at.substr(0, 16) + "</td>" ;
							row += "<td class=\"kgfs\">" + data.kgfs + "</td>";
							row += "<td>" + data.status + "</td>" ;
							row += "<td class=\"net_payable\" align=\"right\">" + (data.net_payable ? data.net_payable.toMoney() : "") + "</td>" ;
							row += "</tr>";			
							$('#paymentsTable > tbody:last-child').append(row);			
						}
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
				createBatch(action, otpAuthId, otpPin);				
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

function authenticateCreateBatch(){
	
	// var notesRequiredBatchId = [];
	// $("table>tbody .chk_payment_request:checkbox:checked").each(function(){
	// 	let	notes = $(this).closest("tr").find("textarea[name=notes]").val();
    //     if(!notes || !notes.trim()){
    //     	notesRequiredBatchId.push($(this).val());
    //     }
    // });
	
	// if(notesRequiredBatchId.length == 0) {
		$('#error').hide();
		$('#success').hide();
		var params = {};
		params['action'] = 'generate';
		doAPIRequestWithLoader(API.METHOD_POST, API.PATH_OTP, params, function (json){
			showLoader(false);		
			if(json != null && json.status_code == 200 && json.data){
				$('#otp_auth_id').val(json.data.auth_id);
				$('#action').val('createbatch');	
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

function createBatch(action, otpAuthId, otpPin){		
	var params = {};
	params['action'] = action;
	params['otp_auth_id'] = otpAuthId;
	params['otp_pin'] = otpPin;
	
	var selectedBatch = [];
	$("table>tbody .chk_payment_request:checkbox:checked").each(function(){ 
		if($("#input_filter_category").val()=='Insurance'){
			selectedBatch.push({
				transaction_id : $(this).val(),
				urn : $(this).closest("tr").find("td.urn").text()
			});
		}
		else if($("#input_filter_category").val()=='Gold'){
			selectedBatch.push({
				batch_id : $(this).val(),
				receipt_no : $(this).closest("tr").find("td.receipt_no").text(),
				orderTotalValueInr : $(this).closest("tr").find("td.orderTotalValueInr").text().replace('₹ ','')
			});
		} 
		else {
			selectedBatch.push({
				id : $(this).val(),
				branch_name : $(this).closest("tr").find("td.branch_name").text(),
				branch_code : $(this).closest("tr").find("td.branch_code").text(),
				benificiary_name : $(this).closest("tr").find("td.benificiary_name").text(),
				bank_account_no : $(this).closest("tr").find("td.bank_account_no").text(),
				ifsc_code : $(this).closest("tr").find("td.ifsc_code").text(),
				kgfs : $(this).closest("tr").find("td.kgfs").text(),
				net_payable : $(this).closest("tr").find("td.net_payable").text().replace('₹ ','')
			});
		}      
    });
	params['batch'] = JSON.stringify(selectedBatch);
	params["category"]= $("#input_filter_category").val();
	doAPIRequestWithLoader(API.METHOD_POST, API.PATH_PAYMENT_THIRDPARTY_APPROVALS, params, function (json){
		$('#error').hide();
		$('#success').hide();
		if(json != null && json.status_code == 200 && json.data){
			var approvedSuccess = json.data.success;
			var approvedFailed = json.data.failed;
			$("#paymentsTable tbody>tr").each(function () {
				var checkBox = $(this).find('.chk_payment_request');
				if($("#input_filter_category").val()=='Insurance'){
					if(checkBox.prop('checked') == true && approvedSuccess.indexOf(checkBox.val()) != -1){
						$(this).remove();
					}
				}
				else{
					if(checkBox.prop('checked') == true && approvedSuccess.indexOf(Number(checkBox.val())) != -1){
						$(this).remove();
					}
				}
				
			});
			
			if(approvedSuccess && approvedSuccess.length > 0){
				$('#success').html("<li>The batches " + JSON.stringify(approvedSuccess) + " successfully created! </li>").show();
			}
			
			if(approvedFailed && approvedFailed.length > 0){
				$('#error').html("<li>The batches " + JSON.stringify(approvedFailed) + " failed!</li>").show();
			}			
		} else {
			$('#error').html("<li>Batch creation failed!</li>").show();
		}
		if($('#paymentsTable tbody>tr').length == 0){
			var row = "<tr><td colspan=\"9\" align=\"center\">No Requests found</td></tr>";	
			$('#paymentsTable > tbody:last-child').append(row);
		}
		checkApprovalBtnEnable();
		showLoader(false);
	});	
}

function selectAll(chkSelecetAll){
	$('table>tbody .chk_payment_request').prop('checked', chkSelecetAll.checked);
	// if(chkSelecetAll.checked){
	// 	$("textarea[name=notes]").show();	
	// } else {
	// 	$("textarea[name=notes]").hide();
	// }
	checkApprovalBtnEnable();
}

function selectVendor(chkVendor,indexval){
	// $('table>tbody .chk_payment_request:checkbox').prop('checked', false);
	// //$(".chk_payment_request").attr("checked", false);
	// $(chkVendor).attr("checked", chkVendor.checked);
	// console.log(chkVendor)
	// console.log($('table>tbody .chk_payment_request:checkbox').length)
	$('table>tbody .chk_payment_request').each(
		function (index, checkbox) {
		  if (index == indexval) checkbox.checked = chkVendor.checked;
		  else checkbox.checked=false
	  });
	checkApprovalBtnEnable();
}

function checkApprovalBtnEnable(){
	var checkedCount = $('table>tbody .chk_payment_request:checkbox:checked').length;
	$('.chk-select-all').prop('checked', (checkedCount == $('.chk_payment_request:checkbox').length));
	if($("#input_filter_category").val()=='Vendor'){
		if(checkedCount == 1){		
			$("#btn-create").removeAttr('disabled');
		} else {		
			$("#btn-create").attr('disabled','disabled');
		}
	}
	else{
		if(checkedCount > 0){		
			$("#btn-create").removeAttr('disabled');
		} else {		
			$("#btn-create").attr('disabled','disabled');
		}
	}
}