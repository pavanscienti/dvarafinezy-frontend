/**
 * 
 * 
 * 
 */

var table = null;

$(document).ready(function(){
	let date = new Date();
	$("#date_to").val(date.format('yyyy-mm-dd'));
	date.setDate(date.getDate()-30);
	$("#date_from").val(date.format('yyyy-mm-dd'));
	showLoader(false)
	reloadTable();
});

function reloadTable(){
	if(table) table.ajax.reload()
	else getPaymentReturnEntries()
}

function getPaymentReturnEntries() {
	let exportColumnFormat = {
		body: function ( data, row, column, node ) {
			return (column === 2 || column === 3 || column === 4 || column === 5 || column === 6) ? '\'' + data : data;
		}
	};
	
	table = $('#tbl_returns').DataTable({
        "destroy": true,
		processing: true,
		"language": {
			"processing": "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> please wait...",
	        "emptyTable" : "No records found!",
	        "infoEmpty" : "No records matched!"
	    },
		"ajax": function (data, callback, settings) {
			let params = {
				option : "returnListByDateRange",
				status : $("#return_status").val(),
				fromDate : $("#date_from").val(),
				toDate : $("#date_to").val()
			}
            doAPIRequest("GET", API.PATH_PAYMENTS_RETURNS_MGMT, params, function(json){
                if(json && json.code == 200) {
                    data.data = json.data;
                } else {
                    data.data = [];
                    swal({title: '', status : "error", text: json.error});
                }
                callback(data)
            })
        },	    
        "lengthMenu": [
           [10, 15, 20, 25, 50, 100, 150, 200],   // values
           [10, 15, 20, 25, 50, 100, 150, 200]    // texts
        ],
        "iDisplayLength": 10,
        "scrollX": true,
        columns: [
            {data: null },                        
            {data: 'created_at', defaultContent: "" },   
            {data: 'stmt_trxn_desc', defaultContent: "" }, 
            {data: 'amount', defaultContent: "" }, 
            {data: 'utr_no', defaultContent: "" }, 
            {data: 'ponum', defaultContent: "" }, 
            {data: 'matched_payments', defaultContent: "{}" }, 
            {data: 'status_updated_by', defaultContent: "" }, 
            {data: 'status_update_comment', defaultContent: "" }, 
            {data: 'status', defaultContent: "" }, 
            {data: 'status', defaultContent: "" }
      	],
      	"columnDefs": [
	            {
               		"searchable": false,
               		"orderable": false,
               		"targets": 0,
               		render : function ( data, type, full, meta ) {
        				return meta.row + 1;
					}
        		},
				
        		{ // Date
        			"targets" : 1,
        			"className": "text-left text-nowrap"
                },
                {	// Details
        			"targets" : 2,
        			"className": "text-left text-nowrap",
					render : function ( data, type, full, meta ) {
        				return data;
					}
        		},
        		{   // Amount    			
        			"targets" : 3,
        			"className": "text-left text-nowrap"
                },
        		{   // UTR No    			
        			"targets" : 4,
        			"className": "text-left text-nowrap",
					"visible" : false
                },
        		{   // PoNum    			
        			"targets" : 5,
        			"className": "text-left text-nowrap",
					"visible" : false
                },
        		{   // Matched Payments    			
        			"targets" : 6,
        			"className": "text-left text-nowrap",
                    render : function ( data, type, full, meta ) {
						try {
							let jsonMatchedPayments = JSON.parse(data);
							if(jsonMatchedPayments.length > 0) {
								return `<a onclick='showMatchedPaymentEntries(this)'><i class="fa fa-eye" aria-hidden="true" style="font-size:18px" ></i> View</a>`
							}
						}catch(error){}
                        return ' - ';
                    }
                },
        		{   // Closed By    			
        			"targets" : 7,
        			"className": "text-left text-nowrap"
                },
        		{   // Comments
        			"targets" : 8,
        			"className": "text-left text-nowrap"
                },
        		{   // Status 			
        			"targets" : 9,
        			"className": "text-left text-nowrap"
                },
        		{   // Action 			
        			"targets" : 10,
        			"className": "text-center text-nowrap",
                    render : function ( data, type, full, meta ) {
						if(data == 'Open') {
							return `
							&nbsp;&nbsp;<span style="font-size:18px;"><a onclick='updateAsPaymentReturned(this)'><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
								&nbsp;&nbsp;&nbsp;&nbsp;<a onclick='updateAsClosed(this)'><i class="fa fa-times-circle" style="color:red" aria-hidden="true"></i></a></span>&nbsp;&nbsp;
							`
						}
                        return ''
                    }
                }
	        ],                
      	// select: true,
        responsive: true,
        dom: 'Bfrtip',
        buttons: [             
            { extend: 'colvis', text: '<span class="glyphicon glyphicon-th-list"></span>' },
			{
                extend: 'csv',
                exportOptions: {
                    columns: ':visible',
					format: exportColumnFormat
                }
            },
			{
                extend: 'excel',
                exportOptions: {
                    columns: ':visible',
					format: exportColumnFormat
                }
            }
        ]
    });
	
	table.on( 'order.dt search.dt', function () {
		table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        });
    } ).draw();
	
}

function showMatchedPaymentEntries(src){
	let data = table.row($(src).closest('tr')).data();
	let jsonMatchedPayments = JSON.parse(data.matched_payments);
	showPaymentMatchedToReturn(data, jsonMatchedPayments)
}

function showPaymentMatchedToReturn(data, jsonMatchedPayments){	
	swal({
		title: 'Confirm',
		text : 'Do you confirm this payment return for the following payment?',
		html : `
			<div class="table-responsive">
			  <table id="tbl_macthed_payment_entries" class='table table-striped table-bordered'>
			  		<thead>
						<tr>
							<th class='text-left text-nowrap'>PaymentID</th>
							<th class='text-left text-nowrap'>Name</th>
							<th class='text-left text-nowrap'>URN</th>
							<th class='text-left text-nowrap'>Bank A/C</th>
							<th class='text-left text-nowrap'>IFSC Code</th>
							<th class='text-left text-nowrap'>UTR</th>
							<th class='text-left text-nowrap'>Disb Date</th>
							<th class='text-right text-nowrap'>Amount</th>
							${data.status =='Open' ? `<th class='text-left text-nowrap'>Action</th>` : ''}
						</tr>
						</thead>
						<tbody></tbody>
			  </table>
		  </div>
		`,
		width : '80%',
		showCloseButton : true,
		showCancelButton: false,
		showConfirmButton : false,
		showLoaderOnConfirm: true,
		allowOutsideClick: false,
		onOpen : function(){
			let tableMatchedPayments = $('#tbl_macthed_payment_entries>tbody');
			jsonMatchedPayments.forEach((entry) => {
				entry.id = data.id;
				entry.status = data.status;
				entry.stmt_trxn_desc = data.stmt_trxn_desc;
				let tableRow = $(`<tr>
						  	<td class='text-left text-nowrap'>${entry.payment_id}</td>
							<td class='text-left text-nowrap'>${entry.cust_name}</td>
							<td class='text-left text-nowrap'>${entry.urn}</td>
							<td class='text-left text-nowrap'>${entry.bank_acc_no}</td>
							<td class='text-left text-nowrap'>${entry.ifsc_code}</td>
							<td class='text-left text-nowrap'>${entry.utr_no}</td>
							<td class='text-left text-nowrap'>${entry.disb_date}</td>
							<td class='text-left text-nowrap'>${entry.amount}</td>
							${data.status == 'Open' ? `<td class='text-center text-nowrap'><a style="font-size:18px;" onclick="showConfirmPaymentReturnDialog($(this).closest('tr').data())"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></td>` : ''}
						</tr>`);
				tableRow.data(entry);
				tableMatchedPayments.append(tableRow);
			})
		}	  
	}).then(function () {
	},function(dismiss) {
		// dismiss can be "cancel" | "close" | "outside"
	});
}

function showConfirmPaymentReturnDialog(data) {
	swal({
		title: 'Confirm',
		text : 'Do you confirm this payment return for the following payment?',
		html : `
			<div>
			  <table class='table table-striped table-bordered'>
				  <tr>
					  <th class='text-left text-nowrap'>Name</th>
					  <td class='text-left text-nowrap'>${data.cust_name}</td>
					  <th class='text-left text-nowrap'>URN</th>
					  <td class='text-left text-nowrap'>${data.urn}</td>
				  </tr>
				  <tr>
					  <th class='text-left text-nowrap'>Bank A/C</th>
					  <td class='text-left text-nowrap'>${data.bank_acc_no}</td>
					  <th class='text-left text-nowrap'>IFSC Code</th>
					  <td class='text-left text-nowrap'>${data.ifsc_code}</td>
				  </tr>
				  <tr>
					  <th class='text-left text-nowrap'>UTR</th>
					  <td class='text-left text-nowrap'>${data.utr_no}</td>				  
					  <th class='text-left text-nowrap'>Disb Date</th>
					  <td class='text-left text-nowrap'>${data.disb_date}</td>
				  </tr>
				  <tr>
					  <th class='text-left text-nowrap'>Amount</th>
					  <td class='text-left text-nowrap' >${data.amount}</td>
					  <th class='text-left text-nowrap'>Payment ID</th>
					  <td class='text-left text-nowrap' >${data.payment_id}</td>
				  </tr>
				  <tr>
					  <th class='text-left text-nowrap'>Bank Stmt</th>
					  <td class='text-left text-nowrap' colspan='3'>${data.stmt_trxn_desc}</td>
				  </tr>
			  </table>
		  </div>
		  <div style="width:100%;text-align:left;">Enter comment and click to submit.</div>
		`,
		width : '600px',
		input: 'textarea',
		inputPlaceholder: 'Enter comments',
		showCancelButton: true,	
		showCloseButton : true,
		confirmButtonText: 'Submit',
		showLoaderOnConfirm: true,
		allowOutsideClick: false,
		preConfirm: function (notes) {
		  return new Promise(function (resolve, reject) {		      
			  if (notes == null || notes.length < 5) {
				  reject("Return reason is required and it must be min 5 chars");
			  } else {
				  data.comments = notes;
				  doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_RETURNS_MGMT + "?option=updateAsPaymentReturned", data, function(json){
					  if(json && json.code == 200) {
						  // successfully update
						  reloadTable();
						  resolve();
					  } else if(json != null && json.error){
						  reject(json.error.join(', '));
					  } else {
						  reject("Close action not successfull!");
					  }
				  }, 'json');
			  }		      
		  });
		}		  
	  }).then(function () {			
		  swal({type: 'success'});
	  },function(dismiss) {
		   // dismiss can be "cancel" | "close" | "outside"
	  });
}

function updateAsPaymentReturned(src){
	let retrunEntry = table.row($(src).closest('tr')).data();
	swal({
	  	title: 'Confirm',
	  	text : 'Enter UTR no to retireve the payment details for return ' + retrunEntry.stmt_trxn_desc,
	  	input: 'text',
	  	inputAttributes : {
			maxlength : 20,
			autofocus : true,
			autocomplete : "off"
		},
		inputPlaceholder: 'UTR No',
		showCancelButton: true,
		showCloseButton : true,
		confirmButtonText: 'Fetch Payment',
		showLoaderOnConfirm: true,
		allowOutsideClick: false,
		preConfirm: function (inputUTRNo) {
			return new Promise(function (resolve, reject) {		      
				if (inputUTRNo && inputUTRNo.length > 5) {
					doAPIRequest(API.METHOD_GET, API.PATH_PAYMENTS_RETURNS_MGMT, { option : 'paymentsByUTRNo', utrNo : inputUTRNo.trim()}, function(json) {
						if(json && json.code == 200) {
							if(json.data.length == 0) {
								reject("No payment entries matched with given UTR no")
							} else {
								resolve(json.data)
							}
							
						} else if(json != null && json.error){
							reject(json.error.join(', '));
						} else {
							reject("Not able to fetch the payment details. Try again!");
						}
					});
				} else {
					reject("Ener valid UTR no");
				}
			});
		}		  
	}).then(function (paymentEntries) {
		if(paymentEntries.length == 1) {
			paymentEntries[0].id = retrunEntry.id;
			paymentEntries[0].status = retrunEntry.status;
			paymentEntries[0].stmt_trxn_desc = retrunEntry.stmt_trxn_desc;
			showConfirmPaymentReturnDialog(paymentEntries[0])
		} else {
			showPaymentMatchedToReturn(retrunEntry, paymentEntries)
		}		
	},function(dismiss) {
		 // dismiss can be "cancel" | "close" | "outside"
	});
	
}

function updateAsClosed(src){
	let data = table.row($(src).closest('tr')).data();
	swal({
	  title: 'Confirm',
	  text : 'Do you confirm this is not payment return? Enter comment and click on submit.',
	  input: 'textarea',
	  inputPlaceholder: 'Enter comments',
	  showCancelButton: true,
	  showCloseButton : true,
	  confirmButtonText: 'Submit',
	  showLoaderOnConfirm: true,
	  allowOutsideClick: false,
	  preConfirm: function (notes) {
	    return new Promise(function (resolve, reject) {		      
	        if (notes == null || notes.length < 5) {
	        	reject("Return cancel reason is required and it must be min 5 chars");
	        } else {
				data.comments = notes;
				doAPIRequest(API.METHOD_POST, API.PATH_PAYMENTS_RETURNS_MGMT + "?option=updateAsClosed", data, function(json){
					if(json && json.code == 200) {
						// successfully update
						reloadTable();
						resolve();
					} else if(json != null && json.error){
						reject(json.error.join(', '));
					} else {
						reject("Close action not successfull!");
					}
				}, 'json');
	        }		      
	    });
	  }		  
	}).then(function () {			
		swal({type: 'success'});
	},function(dismiss) {
		 // dismiss can be "cancel" | "close" | "outside"
	});
}