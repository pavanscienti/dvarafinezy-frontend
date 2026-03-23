var table = null, inputDateFrom, inputDateTo, inputStatus;
var API_PATH_PAYMENT_RECOVERY = "/api/tps/web/payments/recovery";

$(document).ready(function(){
    inputDateFrom = $("#date_from");
    inputDateTo = $("#date_to")
	let date = new Date();
	inputDateTo.val(date.format('yyyy-mm-dd'));
	date.setDate(date.getDate()-30);
	inputDateFrom.val(date.format('yyyy-mm-dd'));
	inputStatus = $("#recovery_status")
	showLoader(false)
	reloadTable();
});

function reloadTable(){
    if(table) table.ajax.reload()
    else  getTransactions();
}


function getTransactions() {
    let exportColumnFormat = {
		body: function ( data, row, column, node ) {
			return (column === 2 || column === 3 || column === 4 || column === 5 || column === 6) ? '\'' + data : data;
		}
	};
	
	table = $('#tbl_trxns').DataTable({
        "destroy": true,
		processing: true,
		"language": {
			"processing": "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> please wait...",
	        "emptyTable" : "No records found!",
	        "infoEmpty" : "No records matched!"
	    },
		"ajax": function (data, callback, settings) {
			let params = {
				option : "listByDateRange",
				fromDate : inputDateFrom.val(),
				toDate : inputDateTo.val(),
				status: inputStatus.val()
			}
            doAPIRequest("GET", API_PATH_PAYMENT_RECOVERY, params, function(json){
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
            {data: 'disb_date', defaultContent: "" },  
            {data: 'branch_name', defaultContent: "" }, 
            {data: 'urn_no', defaultContent: "" }, 
            {data: 'customer_name', defaultContent: "" }, 
            {data: 'loan_acc_no', defaultContent: "" }, 
            {data: 'amount', defaultContent: "0" }, 
            {data: 'bank_acc_no', defaultContent: "" }, 
            {data: 'ifsc_code', defaultContent: "" }, 
            {data: 'utr_no', defaultContent: "" }, 
            {data: 'status', defaultContent: "" }, 
            {data: 'disb_cancelled_by_name', defaultContent: "" }, 
            {data: 'disb_cancelled_reason', defaultContent: "" }, 
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
        		{ // created_at
        			targets : 1,
        			className: "text-left text-nowrap",
                    visible: false
                },
        		{ // disb_date
        			targets : 2,
        			className: "text-left text-nowrap"
                },
        		{ // branch_name
        			targets : 3,
        			className: "text-left text-nowrap"
                },
        		{ // urn_no
        			targets : 4,
        			className: "text-left text-nowrap"
                },
        		{ // customer_name
        			targets : 5,
        			className: "text-left text-nowrap"
                },
        		{ // loan_acc_no
        			targets : 6,
        			className: "text-left text-nowrap"
                },
        		{ // amount
        			targets : 7,
        			className: "text-right text-nowrap"
                },
        		{ // bank_acc_no
        			targets : 8,
        			className: "text-left text-nowrap"
                },
        		{ // ifsc_code
        			targets : 9,
        			className: "text-left text-nowrap"
                },
        		{ // utr_no
        			targets : 10,
        			className: "text-left text-nowrap"
                },
        		{ // status
        			targets : 11,
        			className: "text-left text-nowrap"
                },
        		{ // disb_cancelled_by_name
        			targets : 12,
        			className: "text-left text-nowrap",
                    visible : false
                },
        		{ // disb_cancelled_reason
        			targets : 13,
        			className: "text-left text-nowrap",
                    visible : false
                },
        		{ // action
        			targets : 14,
        			className: "text-center text-nowrap",
                    render : function ( data, type, full, meta ) {
						if(data == "Payment Recovery Pending"
                            || data == "Payment Recovery Initiated") {
                            return `
                                &nbsp;&nbsp;&nbsp;
                                <a onclick='changePaymentRecoveryAction(this)'><i class="fa fa-edit" aria-hidden="true" style="font-size:18px" ></i></a>
                                &nbsp;&nbsp;&nbsp;
                                <a onclick='changePaymentRecoveryAction(this)' style="color:red"><i class="fa fa-times-circle" aria-hidden="true" style="font-size:18px" ></i> </a>
                                &nbsp;&nbsp;&nbsp;
                            `
                        } else {
                            return '';
                        }
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

function changePaymentRecoveryAction(src) {
    let data = table.row($(src).closest('tr')).data();
    let new_stage_name;
    if(data.status == "Payment Recovery Pending") {
        new_stage_name =  "Payment Recovery initiated?";
    } else if(data.status == "Payment Recovery Initiated"){
        new_stage_name =  "Payment Recovered?";
    } else {
        alert("-" + data.status + "-")
        return;
    }
	swal({
	  title: 'Confirm',
	  text : 'Do you confirm to update the status as ' + new_stage_name,
	  input: 'textarea',
	  inputPlaceholder: 'Enter comments',
	  showCancelButton: true,
	  showCloseButton : true,
	  confirmButtonText: 'Submit',
	  showLoaderOnConfirm: true,
	  allowOutsideClick: false,
	  preConfirm: function (comments) {
	    return new Promise(function (resolve, reject) {		      
	        if (comments == null || comments.length < 5) {
	        	reject("Return cancel reason is required and it must be min 5 chars");
	        } else {
				data.comments = comments;
                let option;
                if(data.status == "Payment Recovery Pending") {
                    data.new_status =  "Payment Recovery Initiated";
                    option = "updateAsPaymentRecoveryInitiated";
                } else if(data.status == "Payment Recovery Initiated"){
                    data.new_status =  "Payment Recovered";
                    option = "updateAsPaymentRecovered";
                }
				doAPIRequest(API.METHOD_POST, API_PATH_PAYMENT_RECOVERY + "?option=" + option, data, function(json){
					if(json && json.code == 200) {
						// successfully update
						reloadTable();
						resolve();
					} else if(json != null && json.error){
						reject(json.error.join(', '));
					} else {
						reject("Status update failed!");
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


function onPaymentRecoveryCancellClicked(src) {
    let data = table.row($(src).closest('tr')).data();
	swal({
	  title: 'Confirm',
	  text : 'Do you confirm to cancell the payment recovery?',
	  input: 'textarea',
	  inputPlaceholder: 'Enter comments',
	  showCancelButton: true,
	  showCloseButton : true,
	  confirmButtonText: 'Submit',
	  showLoaderOnConfirm: true,
	  allowOutsideClick: false,
	  preConfirm: function (comments) {
	    return new Promise(function (resolve, reject) {		      
	        if (comments == null || comments.length < 5) {
	        	reject("Return cancel reason is required and it must be min 5 chars");
	        } else {
				data.comments = comments;
                data.new_status =  "Payment Recovery initiated";

				doAPIRequest(API.METHOD_POST, API_PATH_PAYMENT_RECOVERY + "?option=updateAsPaymentRecoveryCancelled", data, function(json){
					if(json && json.code == 200) {
						// successfully update
						reloadTable();
						resolve();
					} else if(json != null && json.error){
						reject(json.error.join(', '));
					} else {
						reject("Status update failed!");
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