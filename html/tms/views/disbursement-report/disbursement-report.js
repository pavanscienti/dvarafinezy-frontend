var table = null;
$(document).ready(function() {
	let date = new Date().format('yyyy-mm-dd')
	$("#date_from").val(date)
	$("#date_to").val(date)
	showLoader(false);
});

function reloadTrxns() {
	if(table) 
		table.ajax.reload();	
	else
		getReport()
}

function getReport() {
    let params = function(){
		let branchNameList = [];
		let branchNameDropdown = $("#branch_name");		
		if(branchNameDropdown.val() == "ALL") {
			$("option", branchNameDropdown).each(function(i){
				if(i > 0) {
					branchNameList.push($(this).text());
				}
			}); 
		} else {
			branchNameList.push($("option:selected", branchNameDropdown).text());
		}		
    	return {
    		cbs_name: $("#cbs_name").val(),
			date_filter_by : $("#date_filter_by").val(),
    		from_date : $("#date_from").val(),
    		to_date : $("#date_to").val(),
    		branch_names : branchNameList,
			flag_disable_branch_filter: true
    	}
    }
	let exportColumnFormat = {
                body: function ( data, row, column, node ) {
			return (column === 2 || column === 3 || column === 4 || column === 5 ) ? '\'' + data : data;
                }
            };
	table = $('#tbl_disb_list').DataTable({
        "destroy": true,
		processing: true,
		"language": {
			"processing": "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> please wait...",
	        "emptyTable" : "No records found!",
	        "infoEmpty" : "No records matched!"
	    },
		"ajax": function (data, callback, settings) {
            doAPIRequest("POST", '/api/tps/web/disbursements/report?option=getReportByDateRange', params(), function(json){
                if(json && json.code == 200) {
                    data.data = json.data;
                } else {
                    data.data = [];
                    swal({title: '', status : "error", text: json.error});
                }
                console.log(data)
                callback(data)
            }, 'json')
        },	    
        "lengthMenu": [
           [10, 15, 20, 25, 50, 100, 150, 200],   // values
           [10, 15, 20, 25, 50, 100, 150, 200]    // texts
        ],
        "iDisplayLength": 10,
        "scrollX": true,
        columns: [
            {data: null },                        
            {data: 'branch_name', "defaultContent": "" },  
            {data: 'loan_acc_no', "defaultContent": "" },    
            {data: 'customer_no', "defaultContent": "" },   
            {data: 'debit_acc_no', "defaultContent": "" },
            {data: 'credit_acc_no', "defaultContent": "" },
            {data: 'beneficiary_name', "defaultContent": "" },
            {data: 'amount', "defaultContent": "" },
            {data: 'utr_no', "defaultContent": "" },
            {data: 'ponum', "defaultContent": "" },
            {data: 'ifscode', "defaultContent": "" },
            {data: 'status', "defaultContent": "" },
            {data: 'liquidation_date', "defaultContent": "" },
            {data: 'neft_init_time', "defaultContent": "" },
            {data: 'error_desc', "defaultContent": "" }
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
        			"targets" : 1,
        			"className": "text-left text-nowrap",
        			"visible": true
        		},
        		{        			
        			"targets" : 2,
        			"className": "text-right text-nowrap",
	            		"visible": true
        		},
        		{        			
        			"targets" : 3,
        			"className": "text-right text-nowrap",
	            		"visible": true
        		},
        		{        			
        			"targets" : 4,
        			"className": "text-right text-nowrap",
	            		"visible": false
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

