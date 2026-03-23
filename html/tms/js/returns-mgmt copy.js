/**
 * 
 * 
 * 
 */


$(document).ready(function(){
	let date = new Date();
	var toDate = $("#date_to").val(date.format('yyyy-mm-dd'));
	date.setDate(date.getDate()-30);
	var fromDate = $("#date_from").val(date.format('yyyy-mm-dd'));
	paymentIssueTypeChanged();	
});


function paymentIssueTypeChanged() {
	let type = $("input[name=payment_issue_type]:checked").val();
	$("#btn-recheck").hide();
	if(type == "returns"){
		$('.payment-failure-view').hide();
		$('.payment-returns-view').show();
		getReturns();
	} else if(type == "failures"){
		$('.payment-returns-view').hide();
		$('.payment-failure-view').show();
		getFailures();
	} else if(type == "inprogress"){
		$('.payment-returns-view').hide();
		$('.payment-failure-view').show();
		getInProgress();
	}
	
}

function getReturns() {
	let status = $("#retunrs-status").val();
	if(status == 'Verified'){
		$("#btn-create-new-batch").hide();
	} else {
		$("#btn-create-new-batch").hide();
	}
	var params = {};
	params['status']=status;
	params['from']=$("#date_from").val();
	params['to']=$("#date_to").val();
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENTS_RETURNS_MGMT, params, callbackReturns);
}

function callbackReturns(json) {
	var table = $('#tbl-returns > tbody');
	table.html("");
	if(json != null && json.status_code == 200 && json.data){
		var status = $("#retunrs-status").val();		
		var paymentsReturns = json.data.data;
		if(paymentsReturns.length == 0) {
			table.html("<tr><td colspan=\"9\" align=\"center\" > No records found.</td></tr>");
		} else {
			for(var index in paymentsReturns) {
				var data = paymentsReturns[index];		
				var row = "<tr id=\"" + index + "\">";
				row +="<td align=\"center\">" + (Number(index)+1) + "</td>";
				row +="<td>" + data.pstd_date + "</td>";
				row +="<td>";
				let txnSendToBankDesc = "";
								
				if(data.txn_desc){					
					let txnDesc = data.txn_desc.split('`');					
					// row += txnDesc[1] + "<br>";
					row += txnDesc[2] + "&nbsp;&nbsp;";
					row += txnDesc[3] + "(" + txnDesc[4] + ")<br>";
					row += "A/C No : " + txnDesc[5] + ", IFSC : " + txnDesc[6] + "<br>";
					if(txnDesc[7]) {
						row += "Disbursement Date : " + txnDesc[7] + "<br>";	
					}
					
					if(!txnSendToBankDesc) {
						txnSendToBankDesc =  data.ponum + "/" + data.utr_no + "/" + txnDesc[2] + "/" + txnDesc[3] + "/" + txnDesc[4];	
					}					
				}
				
				if(data.stmt_txn_desc) {				
					row += txnSendToBankDesc = data.stmt_txn_desc;
					row += "<br>";
				}
				
				
				if(data.return_type == 'Wrong Account') {
					row += "<h6><a>Updated Bank Details</a></h6> A/C No : " + data.cust_acc_no + ", IFSC : " + data.ifsc_code + "<br>";	
				}
				
				if(!data.ponum && data.possible_payments){
					row +="<h6><a class=\"icon-collapse  collapsed\" data-toggle=\"collapse\" data-target=\"#possible-payments"+index+"\">Possible Payment(s)</a></h6>";
					row += "<ul id=\"possible-payments"+index+"\" class=\"collapse\">"+ getArrayAsHTMLList(data.possible_payments.split('\n')) + "</li></ul>";
				}
				if(data.notes || data.branch_notes){
					row +="<h6><a class=\"icon-collapse  collapsed\" data-toggle=\"collapse\" data-target=\"#notes"+index+"\">Comments</a></h6>";
					row += "<ul id=\"notes"+index+"\" class=\"collapse\">";
					if(data.notes){
						row += getArrayAsHTMLList(data.notes.split('\n'));
					}
					if(data.branch_notes){
						row += getArrayAsHTMLList(data.branch_notes.split('\n'));						
					}
					row += "</ul>";
				}				
				row +="</td>";

				row +="<td nowrap>" + data.amount.toMoney() + "</td>";
				row +="<td>" + (data.ponum ? data.ponum : "") + "</td>";
				row +="<td>" + (data.utr_no ? data.utr_no : "") + "</td>";
				row +="<td>" + data.return_type + "</td>";
				row +="<td>" + data.status + "</td>";
				row +="<td nowrap>";
				if(data.status !='Closed' && data.status !='Completed' && data.status !='Cancelled' && data.status != 'Verified') {
					row +="&nbsp;<a><span class=\"glyphicon glyphicon-remove-circle\" onclick=\"cancelReturn('" + data.id + "')\"></span></a>&nbsp;";			
					/*if(data.return_type != 'Wrong Account') {
						row +="&nbsp;<a><span class=\"glyphicon glyphicon-envelope\" onclick=\"askToBank('" + data.id + "','" + txnSendToBankDesc + "')\"></span></a>&nbsp;";
					}*/
					row +="&nbsp;<a><span class=\"glyphicon glyphicon-edit\" onclick=\"update('" + index + "','" + data.id + "','"+data.cust_name+"', '"+data.cust_acc_no+"', '"+data.ifsc_code+"', '"+data.ponum+"', '"+data.return_type+"', '"+data.status+"', '"+data.bank_passbook+"')\"></span></a>&nbsp;";
					/* row +="&nbsp;<a><span class=\"glyphicon glyphicon-ok-circle\" onclick=\"markAsReturnCompletd('" + data.id + "')\"></span></a>&nbsp;"; */
				} else if('Verified' == data.status) {
					row +="&nbsp;<a><span class=\"glyphicon glyphicon-ok-circle\" onclick=\"markAsReturnCompletd('" + data.id + "','" + data.payment_id + "')\"></span></a>&nbsp;";
				}
				/*if(status == 'Verified' && status == data.status) {
					row +="&nbsp;<input data-id=\""+ data.id+"\" data-customer-no=\""+ data.cust_no+"\"  data-customer-name=\""+ data.cust_name+"\" data-account-no=\""+ data.cust_acc_no+"\" type=\"checkbox\" onclick=\"rowSelectionChanged(this)\" />&nbsp;";					
				}*/
				row += "</td>";
				row += "</tr>";
				table.append(row);
			}
		}
	} else {
		table.html("<tr><td colspan=\"9\" align=\"center\"> Failed to get the details.</td></tr>");
	}
	showLoader(false);
}

/**
 * Get failures list
 * */
function getFailures() {
	var params = {};
	params['action']="failures";
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENTS_FAILURES, params, function(json){
		console.log(json);
		var table = $('#tbl-failures > tbody');
		table.html("");
		if(json != null && json.status_code == 200 && json.data){
			var status = $("#retunrs-status").val();			
			var paymentsReturns = json.data.data;
			if(paymentsReturns.length == 0) {
				table.html("<tr><td colspan=\"15\" align=\"center\" > No records found.</td></tr>");
			} else {
				for(var index in paymentsReturns) {
					var data = paymentsReturns[index];		
					var row = "<tr id=\"" + index + "\">";
					row +="<td align=\"center\">" + (Number(index)+1) + "</td>";
					row +="<td nowrap>" + data.disb_date + "</td>";
					row +="<td nowrap>" + data.created + "</td>";
					row +="<td nowrap>" + data.neft_init_time + "</td>";
					row +="<td nowrap>" + data.branch_name + "</td>";
					row +="<td nowrap>" + data.account_name + "</td>";
					row +="<td nowrap>" + data.customer_no + "</td>";
					row +="<td nowrap>" + data.loan_acc_no + "</td>";
					row +="<td nowrap>" + data.account_no + "</td>";
					row +="<td nowrap>" + data.ifsc_code + "</td>";
					row +="<td nowrap>" + data.amount + "</td>";
					row +="<td nowrap>" + data.ponum + "</td>";
					row +="<td nowrap>" + data.utr_no + "</td>";
					row +="<td nowrap>" + data.status + "</td>";
					row +="<td align=\"center\">&nbsp;<a><span class=\"glyphicon glyphicon-edit\" onclick=\"updatePaymentStatus(false, '" + data.payment_id + "', '" + data.account_name + "', '" + data.customer_no + "', '" + data.loan_acc_no + "', '" + data.ifsc_code + "', '" + data.account_no + "', '" + data.amount + "')\"></span></a>&nbsp;</td>";					
					row += "</tr>";
					table.append(row);
				}
			}
		} else {
			table.html("<tr><td colspan=\"15\" align=\"center\"> Failed to get the details.</td></tr>");
		}		
		showLoader(false);
	});
}

/**
 * Get failures list
 * */
function getInProgress() {
	var params = {};
	params['action']="inprogress";
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENTS_FAILURES, params, function(json){
		console.log(json);
		var table = $('#tbl-failures > tbody');
		table.html("");
		if(json != null && json.status_code == 200 && json.data){
			var status = $("#retunrs-status").val();			
			var paymentsReturns = json.data.data;
			if(paymentsReturns.length == 0) {
				table.html("<tr><td colspan=\"15\" align=\"center\" > No records found.</td></tr>");
			} else {
				for(var index in paymentsReturns) {
					var data = paymentsReturns[index];		
					var row = "<tr id=\"" + index + "\">";
					row +="<td align=\"center\">" + (Number(index)+1) + "</td>";
					row +="<td nowrap>" + data.disb_date + "</td>";
					row +="<td nowrap>" + data.created + "</td>";
					row +="<td nowrap>" + data.neft_init_time + "</td>";
					row +="<td nowrap>" + data.branch_name + "</td>";
					row +="<td nowrap>" + data.customer_no + "</td>";
					row +="<td nowrap>" + data.customer_no + "</td>";
					row +="<td nowrap>" + data.loan_acc_no + "</td>";
					row +="<td nowrap>" + data.account_no + "</td>";
					row +="<td nowrap>" + data.ifsc_code + "</td>";
					row +="<td nowrap>" + data.amount + "</td>";
					row +="<td nowrap>" + data.ponum + "</td>";
					row +="<td nowrap>" + data.utr_no + "</td>";
					row +="<td nowrap>" + data.status + "</td>";
					row +="<td nowrap>";					
					row +="&nbsp;<a><span class=\"glyphicon glyphicon-edit\" onclick=\"updatePaymentStatus(false, '" + data.payment_id + "', '" + data.account_name + "', '" + data.customer_no + "', '" + data.loan_acc_no + "', '" + data.ifsc_code + "', '" + data.account_no + "', '" + data.amount + "')\"></span></a>&nbsp;";
					row +="&nbsp;<a><span class=\"glyphicon glyphicon-ok-circle\" onclick=\"updatePaymentStatus(true, '" + data.payment_id + "', '" + data.account_name + "', '" + data.customer_no + "', '" + data.loan_acc_no + "', '" + data.ifsc_code + "', '" + data.account_no + "', '" + data.amount + "')\"></span></a>&nbsp;";
					// row +="&nbsp;<a><span class=\"glyphicon glyphicon-refresh\" onclick=\"reCheckStatus(this, '" + data.payment_id + "', '" + data.account_name + "', '" + data.customer_no + "', '" + data.loan_acc_no + "', '" + data.ifsc_code + "', '" + data.account_no + "', '" + data.amount + "')\"></span></a>&nbsp;";
					row +="&nbsp;&nbsp;<input type=\"checkbox\" value=\"" + data.payment_id + "\" class=\"chk-re-check-status\" />&nbsp;&nbsp;";
					row += "</td>";					
					row += "</tr>";
					table.append(row);
				}
			}
		} else {
			table.html("<tr><td colspan=\"15\" align=\"center\"> Failed to get the details.</td></tr>");
		}
		
		$('.chk-re-check-status:checkbox').change(function() { 
			statusRecheckSelectionChanged();
		});
		statusRecheckSelectionChanged();
		showLoader(false);
	});
	$("#btn-recheck").show();
}

function statusRecheckSelectionChanged() {
	let selectedCount = $('.chk-re-check-status:checkbox:checked').length;
	if(selectedCount == 0) {
		$("#btn-recheck").attr('disabled','disabled');	
	} else {
		$("#btn-recheck").removeAttr('disabled');
	}
}


function rowSelectionChanged(chk){
	if(chk.checked){
		$(chk).closest("tr").addClass("success");
	} else {
		$(chk).closest("tr").removeClass("success");
	}
}

function cancelReturn(id){	
	swal({
	  title: 'Are you sure to cancel?',
	  input: 'textarea',
	  inputPlaceholder: 'Enter cancel reason',
	  showCancelButton: true,
	  confirmButtonText: 'Submit',
	  showLoaderOnConfirm: true,
	  allowOutsideClick: true,
	  preConfirm: function (notes) {
	    return new Promise(function (resolve, reject) {		      
	        if (notes == null || notes.length == 0) {
	        	reject("Return cancel reason is required!");
	        } else {		          
	          var params = {'action' : 'cancel'};
				params["id"] = id;
				params["notes"]=notes;
				doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_RETURNS_MGMT, params, function(json){
					if(json != null && json.status_code == 200 && json.data && json.data.success){
						//successfully update
						resolve();
					} else if(json != null && json.error){
						reject(json.error.join());
					} else {
						reject("failed to update!");
					}
				});		        	
	        }		      
	    });
	  }		  
	}).then(function () {			
		swal({type: 'success'});
		getReturns();
	},function(dismiss) {
		 // dismiss can be "cancel" | "close" | "outside"
	});
	
}

function markAsReturnCompletd(id, paymentId) {	
	swal({
	  title: 'Is payment re-initiated?',
	  input: 'textarea',
	  inputPlaceholder: 'Enter remarks',
	  showCancelButton: true,
	  confirmButtonText: 'Submit',
	  showLoaderOnConfirm: true,
	  allowOutsideClick: true,
	  preConfirm: function (notes) {
	    return new Promise(function (resolve, reject) {		      
	        if (notes == null || notes.length == 0) {
	        	reject("Remarks is required!");
	        } else {		          
	          var params = {'action' : 'completed'};
				params["id"] = id;
				params["payment_id"] = paymentId;
				params["notes"]=notes;
				doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_RETURNS_MGMT, params, function(json){
					if(json != null && json.status_code == 200 && json.data && json.data.success){
						//successfully update
						resolve();
					} else if(json != null && json.error){
						reject(json.error.join());
					} else {
						reject("failed to update!");
					}
				});		        	
	        }		      
	    });
	  }		  
	}).then(function () {			
		swal({type: 'success'});
		getReturns();
	},function(dismiss) {
		 // dismiss can be "cancel" | "close" | "outside"
	});
	
}


function askToBank(id, desc){
	swal({
		  title: 'Sending bank enquiry. Do you confirm?',
		  text : "Transaction details",
		  type : 'warning',
		  input: 'textarea',
		  inputValue : desc,
		  inputPlaceholder: 'Transaction details',
		  showCancelButton: true,
		  confirmButtonText: 'Submit',
		  showLoaderOnConfirm: true,
		  allowOutsideClick: true,
		  preConfirm: function (txnDesc) {			  
			  return new Promise(function (resolve, reject) {
				  if(!txnDesc){
					  reject("failed to update!");
				  } else {
			    	var params = {'action' : 'askToBank'};
					params["id"] = id;
					params["trxn_desc"] = txnDesc;
					doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_RETURNS_MGMT, params, function(json){
						if(json != null && json.status_code == 200 && json.data && json.data.success){
							resolve();
						} else if(json != null && json.error){
							reject(json.error.join());
						} else {
							reject("failed to update!");
						}
					});				    				  
				  }		
			  });
		  }
		}).then(function () {
			swal({type: 'success'});
			getReturns();
		},function(dismiss) {
			 // dismiss can be "cancel" | "close" | "outside"
		});
}

function update(rowId, id, accountName, accountNo, ifscCode, poNum, type, status, bankPassbook) {	
	/* if(type == 'Wrong Account' && status == 'Open' && poNum) {
		updateRecoveryInitiated(poNum);
	} else */ if(poNum) {
		verifyDetails(id, accountName, accountNo, ifscCode, bankPassbook);
	} else {
		updatePoNum(id);
	}
}

function updateRecoveryInitiated(poNum) {	
	swal({
		  title: 'Recovery',
		  text: 'Are you sure Recovery has been initiated?',
		  input: 'textarea',
		  inputPlaceholder: 'Enter remarks',
		  animation: true,
		  showCancelButton: true,
		  confirmButtonText: 'Submit',
		  showLoaderOnConfirm: true,
		  allowOutsideClick: true,
		  preConfirm: function (notes) {
			  return new Promise(function (resolve, reject) {			    	
		        	var params = {'action' : 'recovery'};
					params["ponum"] = poNum;
					params["notes"] = notes;
					doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_RETURNS_MGMT, params, function(json){
						if(json != null && json.status_code == 200 && json.data && json.data.success){
							resolve();
						} else if(json != null && json.error) {
							reject(json.error.join());
						} else {
							reject("failed to update PoNum!");
						}
					});			       		      
			  });
		  }		  
		}).then(function () {
			swal({type: 'success'});
			getReturns();
		},function(dismiss) {
			 // dismiss can be "cancel" | "close" | "outside"
		});
}

function updatePoNum(id){
	swal({
		  title: 'PoNum & Remarks?',
		  html: '<label for="swal-input-poNum">Enter PoNum : </label><input id="swal-input-poNum" class="swal2-input" placeholder="Enter PoNum">' +
			    '<label for="swal-input-notes">Enter Remarks(optional) : </label><textarea id="swal-input-notes" class="swal2-input" placeholder="Enter Remarks (optional)"></textarea>',
		  showCancelButton: true,
		  confirmButtonText: 'Submit',
		  showLoaderOnConfirm: true,
		  allowOutsideClick: true,
		  preConfirm: function () {
		    return new Promise(function (resolve, reject) {
		    	let poNum = $('#swal-input-poNum').val();
		    	let notes = $('#swal-input-notes').val();		    	
		        if (poNum == null || poNum.length == 0) {
		        	reject("PoNum is required!");
		        } else {
		        	var params = {'action' : 'update'};
					params["id"] = id;
					params["ponum"] = poNum;
					params["notes"] = notes;
					doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_RETURNS_MGMT, params, function(json){
						if(json != null && json.status_code == 200 && json.data && json.data.success){
							resolve();
						} else if(json != null && json.error) {
							reject(json.error.join());
						} else {
							reject("failed to update PoNum!");
						}
					});		        	
		        }		      
		    });
		  }		  
		}).then(function () {
			swal({type: 'success'});
			getReturns();
		},function(dismiss) {
			 // dismiss can be "cancel" | "close" | "outside"
		});
}

function verifyDetails(id, accountName, accountNo, ifscCode, bankPassbook) {	
	swal({
		  title: 'Bank Account Verification',
		  text: 'Are you sure to verify the account',
		  html: '<div style="text-align:left"><br>Account Name : ' +  accountName +
		  		'<br>Account No : ' +  accountNo +
			  	'<br>IFSC Code : ' + ifscCode + '<br><br> </div>' +
			  	(bankPassbook ? '<img src="data:image/jpeg;base64,'+bankPassbook+'" width="360" />' : ''),		  		
		  input: 'textarea',
		  inputPlaceholder: 'Enter remarks',
		  animation: true,
		  showCancelButton: true,
		  confirmButtonText: 'Submit',
		  showLoaderOnConfirm: true,
		  allowOutsideClick: true,
		  preConfirm: function (notes) {
			  return new Promise(function (resolve, reject) {			    	
		        	var params = {'action' : 'verify'};
					params["id"] = id;
					params["notes"] = notes;
					doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_RETURNS_MGMT, params, function(json){
						if(json != null && json.status_code == 200 && json.data && json.data.success){
							resolve();
						} else if(json != null && json.error) {
							reject(json.error.join());
						} else {
							reject("failed to update PoNum!");
						}
					});			       		      
			  });
		  }/*,
		  onOpen: function () {			  
			  sweetAlert.showLoading();
			  setTimeout(function() {
				  $('#modalContentId').html(getHTML());
				  sweetAlert.hideLoading();
			  }, 2000);			 
		  }*/
		}).then(function () {
			swal({type: 'success'});
			getReturns();
		},function(dismiss) {
			 // dismiss can be "cancel" | "close" | "outside"
		});
}

function createNewBatch(){
	var checkedCount = $('#tbl-returns').find('input[type="checkbox"]:checked').length;
	if(checkedCount == 0) {
		swal({type: 'error', text : 'select atleast one payment!'});
	} else {
		var selectdePayments = [];
		var htmlSelected = "";
		$.each($("input[type='checkbox']:checked"), function() {
           var data = $(this).parents('tr:eq(0)');
           let id = $(this).data("id");
           let accountNo = $(this).data("account-no");
           let customerNo = $(this).data("customer-no");
           let customerName = $(this).data("customer-name");           
           selectdePayments.push(id);
           htmlSelected += "<li>" + customerName + " (" + customerNo + ")</li>";
       });		
		
	   swal({
		  title: 'New Batch Creation',
		  text: 'Enter batch details',
		  input: 'textarea',
		  inputPlaceholder: 'Enter remarks',
		  html : '<div style="text-align:left;">' + htmlSelected + '</div>',
		  animation: true,
		  showCancelButton: true,
		  confirmButtonText: 'Submit',
		  showLoaderOnConfirm: true,
		  allowOutsideClick: false,
		  preConfirm: function (notes) {
			  return new Promise(function (resolve, reject) {			    	
		        	var params = {'action' : 'create'};
					params["notes"] = notes;
					params["payments"] = selectdePayments;
					doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_RETURNS_MGMT, params, function(json){
						if(json != null && json.status_code == 200 && json.data && json.data.success){
							resolve();
						} else if(json != null && json.error) {
							reject(json.error.join());
						} else {
							reject("new batch creation failed!");
						}
					});			       		      
			  });
		  }
		}).then(function () {
			swal({type: 'success'});
			getReturns();
		},function(dismiss) {
			 // dismiss can be "cancel" | "close" | "outside"
		});
	}	
}

function updatePaymentStatus(isReceived, paymentId, customerName, customerNo, loanAccountNo, ifscCode, accountNo, amount) {
	swal({
		  title: isReceived ? 'Is payment recevied' : 'Is payment re-initiated?',
		  html: '<table class="table table-striped table-bordered" cellpadding="10" align="center">' +
		  		'	<tr><td align="left">Customer Name</td><td align="left">' + customerName + '</td></tr>' +
		  		'	<tr><td align="left">Customer No</td><td align="left">' + customerNo + '</td></tr>' +
		  		'	<tr><td align="left">Loan Acc No</td><td align="left">' + loanAccountNo + '</td></tr>' +
		  		'	<tr><td align="left">IFSC Code</td><td align="left">' + ifscCode + '</td></tr>' +
		  		'	<tr><td align="left">Bank Account No</td><td align="left">' + accountNo + '</td></tr>' +
		  		'	<tr><td align="left">Amount</td><td align="left">' + (amount ? amount : '') + '</td></tr>' +
			  	'</table>',
		  animation: true,
		  input : isReceived ? null : 'textarea',
		  inputPlaceholder: isReceived ? '' : 'Enter comments...',
	  	  showCancelButton: true,
	  	  showLoaderOnConfirm: true,
	  	  allowOutsideClick : false,
	  	  confirmButtonText: isReceived ? 'Update' : 'Re-Initiated',
		  preConfirm: function (comments) {
			  return new Promise(function (resolve, reject) {
				  if(!isReceived && !comments){
					  reject('comments required.');
				  } else {
					  var params = {};
					  params['action'] = isReceived ? 'update-status-payment-received' : 'update-status-rePayment';
					  params['payment_id'] = paymentId;
					  if(!isReceived) { 
						  params['comments'] = comments;
					  }
					  
					  doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_FAILURES, params, function(json){					 
						    if(json != null && json.status_code == 200 && json.data && json.data.success){
								resolve('Successfully updated.');
							} else if(json != null && json.error) {
								reject(json.error.join());
							} else {
								reject("Failed to update the status!");
							}					      
					  });  
				  }  
			  });
		  }
	}).then(function () {
		swal({type: 'success'});
		paymentIssueTypeChanged();
	}, function(dismiss){});
	
}


function reCheckAllStatus() {	
	
	let paymentIds = [];
	let htmlText =  '<table class="table table-striped table-bordered" cellpadding="10" align="center">' +
				'<tr><td align="left">Customer Name</td><td align="left">Account No</td><td align="left">IFSC Code</td></tr>';
	
	$('.chk-re-check-status:checkbox:checked').each(function() {
		paymentIds.push($(this).val());
		let row = $(this).closest('tr');
		let name = $('td:eq(5)', row).text();
		let accountNo = $('td:eq(7)', row).text();
		let ifscCode = $('td:eq(8)', row).text();
		htmlText += '<tr><td align="left">' + name + '</td><td align="left">' + accountNo + '</td><td align="left">' + ifscCode + '</td></tr>';
	});
	htmlText += "</table>"; 
	console.log(paymentIds);
	if(paymentIds.length == 0){
		alert('At least select one payments');
		return;
	}
	swal({
		  title: 'Re-Check Status',
		  html: htmlText,
		  animation: true,
	  	  showCancelButton: true,
	  	  showLoaderOnConfirm: true,
	  	  allowOutsideClick : false,
	  	  confirmButtonText: 'Check status',
		  preConfirm: function () {
			  return new Promise(function (resolve, reject) {
				  var params = {};
				  params['action'] = 're-check_status';
				  params['payment_id'] = paymentIds;
				  doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_FAILURES, params, function(json){					 
					    if(json != null && json.status_code == 200 && json.data && json.data.success){
							resolve(json.data.status);
						} else if(json != null && json.error) {
							reject(json.error.join());
						} else {
							reject("Failed to check the status!");
						}					      
				  });
					  
			  });
		  }
	}).then(function (statusList) {
		let htmlStatusText = '<table class="table table-striped table-bordered" cellpadding="10" align="center">' +
							 '<tr><td align="left">UTR No</td><td align="left">Status</td></tr>';
		for(status in statusList) {
			htmlStatusText += '<tr><td align="left">' + status + '</td><td align="left">' + statusList[status] + '</td></tr>';
		}
		swal({title : 'Updated Status',  html : htmlStatusText});
		paymentIssueTypeChanged();
	}, function(dismiss){});
	
	
	
}


