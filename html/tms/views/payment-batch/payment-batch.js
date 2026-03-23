var table = null;
var API_PATH_PAYMENT_BATCH = "/api/tps/web/payments/batch";
var findbyDialog = null;

$(document).ready(function(){    
	showLoader(false)
	initTable();
});

function clearTable() {

}

function initTable() {
    table = $('#tbl_payments').DataTable({
        "destroy": true,
		processing: true,
		"language": {
			"processing": "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> please wait...",
	        "emptyTable" : "No records found!",
	        "infoEmpty" : "No records matched!"
	    },
		"data": [],
        "lengthMenu": [
           [10, 15, 20, 25, 50, 100, 150, 200],   // values
           [10, 15, 20, 25, 50, 100, 150, 200]    // texts
        ],
        "iDisplayLength": 15,
        "scrollX": true,
        columns: [
            {data: null },
            {data : 'batch_id', defaultContent: ""},
            {data: 'disb_date', defaultContent: "" },  
            {data: 'branch_name', defaultContent: "" }, 
            {data: 'customer_no', defaultContent: "" }, 
            {data: 'account_name', defaultContent: "" }, 
            {data: 'loan_acc_no', defaultContent: "" }, 
            {data: 'amount', defaultContent: "0" }, 
            {data: 'account_no', defaultContent: "" }, 
            {data: 'ifsc_code', defaultContent: "" }, 
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
        		{ // Batch ID
        			targets : 1,
        			className: "text-left text-nowrap",
                    visible: true
                },
        		{ // Disbursement Date
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
        		{ // status
        			targets : 10,
        			className: "text-left text-nowrap"
                },        		
        		{ // action
        			targets : 11,
        			className: "text-center text-nowrap",
                    render : function ( data, type, full, meta ) {                        
						return `<a onclick="table.row($(this).closest('tr')).remove().draw()"><i class="fa fa-times-circle" style="color:red" aria-hidden="true"></i></a>`
                    }
                }
	        ],                
      	// select: true,
        responsive: true,
        dom: 'Brt',
        buttons: [             
            { 
                extend: 'colvis', 
                className : "custom-datatable-btn btn-sm",
                text: '<span class="glyphicon glyphicon-th-list"></span>' 
            },
            {
                text: '<i class="fa fa-search" aria-hidden="true"></i> Search Payment',
                className : "custom-datatable-btn btn-sm btn-warning",
                action: function ( e, dt, node, config ) {
                    showSearchDialog()
                }
            },
            {
                text: '<i class="fa fa-trash" aria-hidden="true"></i> Delete All',
                className : "custom-datatable-btn btn-sm btn-danger",
                action: function ( e, dt, node, config ) {
                    table.clear().draw()
                }
            },
            {
                text: 'Create New Batch',
                className : "custom-datatable-btn btn-sm btn-primary",
                action: function ( e, dt, node, config ) {
                    createNewBatch()
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

function showSearchDialog(){
    initializeSearchDialog();
    findbyDialog.modal({show : true})
}

function initializeSearchDialog(){
    if(!findbyDialog) {
        findbyDialog = $("#findPaymentEntryModal");        
        findbyDialog.inputSearchByKey  = $("#input_find_by_key");
        findbyDialog.inputSearchByValue  = $("#input_find_by_value");
        findbyDialog.paymentListTable = $("#tbl_search_payment_list");
        findbyDialog.paymentListTableBody = $("#tbl_search_payment_list>tbody");        
        findbyDialog.findPaymentButton = $("#btn_find_payment");

        findbyDialog.css("margin-top", "-" + $("#nav-bar").height() + "px")
        findbyDialog.findPaymentButton.on("click", function(){
            actionButton = this;
            this.disabled = false
            this.innerHTML = "Please Wait..."
            actionButton.enableButton = function(){
                actionButton.disabled = false;
                actionButton.innerHTML = '<i class="glyphicon glyphicon-search"></i>'
            }            
            actionButton.disabled = true;            
            findbyDialog.paymentListTable.hide()
            findbyDialog.paymentListTableBody.html('')
            let searchKey = findbyDialog.inputSearchByKey.val();
            let searchValue = (findbyDialog.inputSearchByValue.val() || "").trim();            
            if (!searchValue || searchValue.length < 4) {
                if(searchKey == "name") {
                    swal({type:'error',text: $("option:selected", findbyDialog.inputSearchByKey).text() + " required and it must be min 4 chars"});
                } else {
                    swal({type:'error', text: $("option:selected", findbyDialog.inputSearchByKey).text() + " required"});
                }                
                actionButton.enableButton()
            } else {
                doAPIRequest("GET", API_PATH_PAYMENT_BATCH, {option: "serachPayment", serachBy: searchKey, searchValue: searchValue}, function(json){
                    if(json.code == 200) {
                        let existingAccountNoList = [];
                        table.rows().data().toArray().forEach(paymentEntry => existingAccountNoList.push(paymentEntry.loan_acc_no))
                        let paymentEntryList = [];
                        json.data.forEach(paymentEntry=>{
                            if(existingAccountNoList.indexOf(paymentEntry.loan_acc_no) < 0) {                                
                                paymentEntryList.push(paymentEntry)
                            }
                        })
                        if(paymentEntryList.length > 0) {
                            // Render Payment List
                            findbyDialog.paymentListTable.show()
                            paymentEntryList.forEach(paymentEntry=>{
                                let row = $(`
                                    <tr style="cursor: pointer !important;">
                                        <td class="nowrap text-center" nowrap><input type="checkbox" name="chk_payment_row"></th>                                        
                                        <td class="nowrap text-center" nowrap>${paymentEntry.batch_id}</th>
                                        <td class="nowrap text-center" nowrap>${paymentEntry.disb_date}</th>
                                        <td class="nowrap text-center" nowrap>${paymentEntry.branch_name}</th>
                                        <td class="nowrap text-center" nowrap>${paymentEntry.customer_no}</th>
                                        <td class="nowrap text-center" nowrap>${paymentEntry.account_name}</th>
                                        <td class="nowrap text-center" nowrap>${paymentEntry.loan_acc_no}</th>
                                        <td class="nowrap text-center" nowrap>${paymentEntry.amount}</th>
                                        <td class="nowrap text-center" nowrap>${paymentEntry.account_no}</th>
                                        <td class="nowrap text-center" nowrap>${paymentEntry.ifsc_code}</th>                            
                                        <td class="nowrap text-center" nowrap>${paymentEntry.status}</th>
                                    </tr>
                                `);
                                row.data(paymentEntry)
                                row.on("click", function(){                                    
                                    let checkbox = $("input[name=chk_payment_row]", row);
                                    checkbox.prop("checked", checkbox.prop("checked") ? false : true)
                                })
                                findbyDialog.paymentListTableBody.append(row);
                            })
                        } else {
                            swal({text: "No payments found...", type:'error'})
                        }                      
                    } else {
                        swal({text: json.error.join(', '), type:'error'})
                    }
                    actionButton.enableButton()
                })
            }
        });
    }
    findbyDialog.inputSearchByKey.val('');
    findbyDialog.inputSearchByValue.val('');
    findbyDialog.paymentListTable.hide();
    findbyDialog.paymentListTableBody.html('');
    findbyDialog.findPaymentButton.prop('disabled', false);
    findbyDialog.findPaymentButton.html('<i class="glyphicon glyphicon-search"></i>')
}

function addSelectedRowToPaymentListTable(src){
    src.disabled = true;    
    let selectedPaymentList = [];
    $("tr", findbyDialog.paymentListTableBody).each(function(){
        if($("input[name=chk_payment_row]", this).prop("checked")) {
            selectedPaymentList.push($(this).data())
        }
    })
    if(selectedPaymentList.length > 0) {
        selectedPaymentList.forEach(paymentEntry=>table.row.add(paymentEntry))
        table.draw()
        findbyDialog.paymentListTableBody.html('')
        findbyDialog.modal('hide')
    } else {
        swal({type:'error', text: "Select atleast one payment"})
    }
    src.disabled = false;
}

function createNewBatch() { 
    let paymentEntryList = table.rows().data().toArray();
    if(paymentEntryList.length == 0) {
        swal({type:'error', title:'', text: 'Atleast One payment is required...'})
        return false;
    }
	swal({
	  title: 'Confirm',
	  text : `Do you confirm to create new payment batch with ${paymentEntryList.length} Payments?`,
	  input: 'text',
	  inputPlaceholder: 'Enter Batch Description',
	  showCancelButton: true,
	  showCloseButton : true,
	  confirmButtonText: 'Create Batch',
	  showLoaderOnConfirm: true,
	  allowOutsideClick: false,
	  preConfirm: function (comments) {
	    return new Promise(function (resolve, reject) {		      
	        if (comments == null || comments.length < 5) {
	        	reject("Payment batch description required and it must be min 5 chars");
	        } else {
                let postData = {
                    paymentEntryList : paymentEntryList,
                    batch_remarks : comments.trim()
                }				
				doAPIRequest(API.METHOD_POST, API_PATH_PAYMENT_BATCH + "?option=createNewBatch", postData, function(json){
					if(json && json.code == 200) {
                        table.clear().draw()
						resolve(json.data);                        
					} else if(json && json.error){
						reject(json.error.join(', '));
					} else {
						reject("Batch creation failed!");
					}
				}, 'json');
	        }		      
	    });
	  }		  
	}).then(function (result) {			
		swal({type: 'success', title: '', text: `New batch ${result.batch_id} is created with ${result.paymentEntryList.length} payments.`});
	},function(dismiss) {
		 // dismiss can be "cancel" | "close" | "outside"
	});

}
