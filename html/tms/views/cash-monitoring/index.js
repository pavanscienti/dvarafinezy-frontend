var table;
$(document).ready(function() {
	getLocationsAbstract();
	showLoader(false);
});

function reloadTrxns() {
	table.ajax.reload();
}

function getLocationsAbstract() {
	var params = function() {
		let userId = window.user.user_id;
		let dateFrom = $("#date_from").val() || new Date().format('dd-mm-yyyy');
		return {
			"option"  : "VAccAbstarctWithCashInHandApprovals",
			"date"    : dateFrom,
	        "user_id" : userId
		};
	};
	table = $('#tbl_vacc_location_abstract').DataTable({
		processing: true,
		"language": {
			"processing": "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> please wait...",
	        "emptyTable" : "No records found!",
	        "infoEmpty" : "No records matched!"
	    },
        "ajax": {
        	"url" : CONFIG.API.VACC_ABSTRACT, 
        	"data" :params,
        	"deferRender": true
        },
        "scrollX": true,
        columns: [
                {data: null },
				{data: 'location_name', "defaultContent": "" },
				{data: 'opening_balance', "defaultContent": "" },
				{data: 'closing_balance', "defaultContent": "" },
				{data: 'bank_deposit', "defaultContent": "" },
				{data: 'collection', "defaultContent": "" },
				{data: 'aeps_withdraw', "defaultContent": "" },
				{data: 'disb_fees', "defaultContent": "" },
				{data: 'bill_pay', "defaultContent": "" },				
                {data: 'bbps', "defaultContent": "" },
                {data: 'ciha_branch_req_on', "defaultContent": "-"},
				{data: 'ciha_branch_comments', "defaultContent": "" },
				{data: 'ciha_status', "defaultContent": "" },
				{data: 'ciha_approver_name', "defaultContent": "" },
                {data: 'ciha_approved_on', "defaultContent": "-"},
				{data: 'ciha_approver_comments', "defaultContent": "" },
				{data: 'verified_by_name', "defaultContent": "" },
                {data: 'verified_at', "defaultContent": "" },
                {data: 'verifier_comments', "defaultContent": "" }
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
        		{
        			// location_name
        			"targets" : 1,
        			"className": "text-left text-nowrap",
        			"visible": true
        		},
        		{
        			// opening_balance
        			"targets" : 2,
        			"className": "text-right text-nowrap",
            		"visible": true
        		},
        		{
        			// closing_balance
        			"targets" : 3,
        			"className": "text-right text-nowrap",
            		"visible": true
        		},
        		{
        			// bank_deposit
        			"targets" : 4,
        			"className": "text-right text-nowrap",
                    "visible": true
        		},
        		{
        			// collection
        			"targets" : 5,
        			"className": "text-right text-nowrap",
                    "visible": false
        		},
        		{
        			// aeps_withdraw
        			"targets" : 6,
        			"className": "text-right text-nowrap",
                    "visible": false
				},
				{
        			// disb_fees
        			"targets" : 7,
        			"className": "text-right text-nowrap",
                    "visible": false
        		},
        		{
        			// bill_pay
        			"targets" : 8,
        			"className": "text-right text-nowrap",
                    "visible": false
        		},
        		{
        			// bbps
        			"targets" : 9,
        			"className": "text-right text-nowrap",
                    "visible": false
        		},
        		{
        			// ciha_branch_req_on
        			"targets" : 10,
        			"className": "text-left text-nowrap",
                    "visible": true
        		},
        		{
        			// cih_approval_branch_comments
        			"targets" : 11,
        			"className": "text-left text-nowrap",
                    "visible": true
        		},
        		{
        			// cih_approval_status 
        			"targets" : 12,
        			"className": "text-left text-nowrap",
                    "visible": true		
        		},
        		{
        			// cih_approval_approver_name
        			"targets" : 13,
        			"className": "text-left text-nowrap",
                    "visible": true,
                    render : function ( data, type, full, meta ) {
                        return (data && data != "-") ? (data  + "(" + full.ciha_approver_code + ")" ) : "-";
                    }
                },
                {
        			// ciha_approved_on
        			"targets" : 14,
        			"className": "text-left text-nowrap",
            		"visible": true
        		},
				{
        			// cih_approval_approver_comments        			
        			"targets" : 15,
        			"className": "text-left text-nowrap",
            		"visible": true
        		},
        		{
        			// verified_by_name 
        			"targets" : 16,
        			"className": "text-left text-nowrap",
            		"visible": true,
                    render : function ( data, type, full, meta ) {
                        return (data && data != "-") ? (full.verified_by_name  + "(" + full.verified_by_code + ")" ) : "";
                    }
        		},
        		{
        			// verified_at        			
        			"targets" : 17,
        			"className": "text-left text-nowrap",
                    "visible": true
        		},
        		{
        			// verifier_comments
        			"targets" : 18,
        			"className": "text-left text-nowrap",
            		"visible": true	
        		}
	        ],                
      	// select: true,
        responsive: true,
        dom: 'Bfrtip',
        buttons: [             
            { extend: 'colvis', text: '<span class="glyphicon glyphicon-th-list"></span>' },
            {
                extend: 'csv',                
                title:  function(){ return 'Cash Monitoring-' + $("#date_from").val()},
                messageTop: function(){ return 'Cash Monitoring-' + $("#date_from").val()},
                filename: function(){ return 'Cash Monitoring-' + $("#date_from").val()},
                exportOptions: {
                    columns: ':visible'
                }
            },{
                extend: 'excel',
                title:  function(){ return 'Cash Monitoring-' + $("#date_from").val()},
                messageTop: function(){ return 'Cash Monitoring-' + $("#date_from").val()},
                filename: function(){ return 'Cash Monitoring-' + $("#date_from").val()},
                exportOptions: {
                    columns: ':visible'
                }
            },{
                extend: 'print',                
                title:  function(){ return 'Cash Monitoring-' + $("#date_from").val()},
                messageTop: function(){ return 'Cash Monitoring-' + $("#date_from").val()},
                filename: function(){ return 'Cash Monitoring-' + $("#date_from").val()},
                exportOptions: {
                    columns: ':visible'
                }
            }
            // ,{
            //     text: "Share via Inbox",
            //     exportOptions: {
            //         columns: ':visible'
            //     }
            // }
        ]
    });
	
	table.on( 'order.dt search.dt', function () {
		table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        });
    } ).draw();		
	
	table.on('click', 'tbody>tr', function () {
        var data = table.row( this ).data();
        showPreview(data);
    });
	
	let date = new Date();
	if(window.location.pathname.split("/").indexOf("tms") >= 0) { 
		$("#tbl_vacc_location_abstract_filter").prepend('<div class="input-group input-group-sm input-daterange  datepicker" data-provide="datepicker"  data-date-start-date="-6m"  data-date-end-date="now" data-date-autoclose="true" data-date-format="dd-mm-yyyy" >' +
			    '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
			    '<input type="text" name="date_from" id="date_from" value="' + date.format('dd-mm-yyyy') + '" class="form-control" style="margin-left:0px;" readonly>' +			   						    						    
			    '</div>');
	} else {
		$("#tbl_vacc_location_abstract_filter").prepend('<label>Date:<input type="search" name="date_from" id="date_from" value="' + date.format('dd-mm-yyyy') + '" aria-controls="tbl_trxns" data-provide="datepicker"  data-date-start-date="-6m"  data-date-end-date="now" data-date-autoclose="true" data-date-format="dd-mm-yyyy" style="margin-bottom: 0.6em;" readonly></label>' );
	}	
	$("#date_from").on('changeDate', function(event, data){reloadTrxns()});	
}


function showPreview(data){
    // let data = table.row($(src).closest("tr")).data();
    if(!(data.verified_by_name && data.verified_by_name != '-') 
        && sessionStorage.user_group == "accounts" ) {
            verifyAbstract(data);
    } else {
        swal({
            title: '',
            text:'',
            width: "1000px",
            showCloseButton: true,
            html: getDenominationHTML(data.denomination, data.location_name)
        });
    }
}

function verifyAbstract(data) { 
    swal({
        title: 'Verify',
        text: data.location_name + " branch abstract",
        html: getDenominationHTML(data.denomination, data.location_name),
        input: 'textarea',
        width: "1000px",
        confirmButtonText: 'Verify',
        showCloseButton: true,
        showCancelButton: true,
        inputPlaceholder: 'Verifiers Comments',
        preConfirm: function(inputComments){
            return new Promise((resolve, reject) => {
                if(inputComments) {
                    let params = {"option" : "verifyAbstract"};
                    params._id = data._id;
                    params.verifier_code = window.user.user_id;
                    params.verifier_name = window.user.user_name;
                    params.verifier_comments = inputComments;
                    doAPIRequest("POST", CONFIG.API.VACC_ABSTRACT, params, function(json){
                        if(json && json.data && json.data.success){
                            resolve();				
                        } else if(json && json.error) {
                            reject(json.error.join());
                        } else {
                            reject("Verification failed.");
                        }
                    });
                } else {
                    reject("Verification comments is required!");
                }
            });
        }
    }).then(function(data){
        reloadTrxns();
        swal({title: '', text:'Verified', type:'success'})
    }, function(result){})
}

function getDenominationHTML(denominationArr, branchName){
    if(!denominationArr) return "No denomination found.";
    let denominationRs = ["2000", "1000","500", "200", "100", "50", "20", "10", "5", "2", "1"];
    let denominationTotal = {"2000": 0, "1000" : 0, "500" : 0, "200" : 0, "100" : 0, "50" : 0, "20" : 0, "10" : 0, "5" : 0, "2" : 0, "1" : 0 };
    let totalDenominationAmount = 0;
    let html = `
        <div class="table-responsive">
            <table class="table table-striped table-bordered full-width table-hover show-pointer>
                <thead>
                    <tr><th class="text-center" colspan="${4 + denominationRs.length}"></th></tr>
                    <tr>
                        <th class="text-center" colspan="${4 + denominationRs.length}">${branchName} Denomination Details</th>
                    </tr>
                    <tr>
                        <th class="text-center">S.No</th>
                        <th class="text-center">Name</th>
                        <th class="text-center">Branch/Officer</th>
                        ${
                            denominationRs.map(rs=>{
                                return `<th class="text-center">Rs.${rs}</th>`
                            }).join('')
                        }
                        <th class="text-center">Total</th>
                    </tr>
                </thead>
                <tbody>
                ${
                    denominationArr.map((denomination, index) => {
                        let total = 0;
                        return `
                            <tr>
                                <td class="text-center">${index+1}</td>
                                <td class="text-left text-nowrap">${denomination.name}(${denomination.code})</td>
                                <td class="text-left">${denomination.acc_type =='Location' ? 'Branch' : denomination.acc_type}</td>
                                ${
                                    denominationRs.map(rs=>{
                                        let amount = (denomination[rs] || 0)* Number(rs);
                                        denominationTotal[rs] += amount;
                                        total += amount;
                                        return `<td class="text-right">${amount}</td>`
                                    }).join('')
                                }
                                <td class="text-right">${total}</td>
                            </tr> 
                        `;
                    }).join("")
                } 
                </tbody>
                <tfoot>
                    ${
                        `
                            <tr>
                                <th class="text-right" colspan="3">Total</th>
                                ${
                                    denominationRs.map(rs=>{
                                        totalDenominationAmount += denominationTotal[rs];
                                        return `<th class="text-right">${denominationTotal[rs]}</th>`
                                    }).join('')
                                }
                                <th class="text-right">${totalDenominationAmount}</th>
                            </tr> 
                        `
                    }
                </tfoot>
            </table>
        </div>`;
    return html;
}
