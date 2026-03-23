var table = null;
$(document).ready(function() {
	$("#date_from").val(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 5).format("yyyy-mm-dd"))
	$("#date_to").val(new Date().format('yyyy-mm-dd'))
    showLoader(false);
    reloadTable()
});


function reloadTable() {
	if(table) 
		table.ajax.reload();	
	else
		getFileEntries()
}

function getFileEntries() {
    let params = function(){
    	return {
            option : "batchFileListByDateRange",
    		fromDate : $("#date_from").val(),
            toDate : $("#date_to").val(),
            status : "Success"
    	}
    }
	
	table = $('#tbl_file_entries').DataTable({
        "destroy": true,
		processing: true,
		"language": {
			"processing": "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> please wait...",
	        "emptyTable" : "No records found!",
	        "infoEmpty" : "No records matched!"
	    },
		"ajax": function (data, callback, settings) {
            doAPIRequest("GET", '/api/tps/web/disbursements/report', params(), function(json){
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
            {data: 'file_name', "defaultContent": "" },  
            {data: 'created_at', "defaultContent": "" },    
            {data: 'id', "defaultContent": "" }
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
        			"className": "text-left text-nowrap"
                },
                {
        			"targets" : 2,
        			"className": "text-left text-nowrap"
        		},
        		{        			
        			"targets" : 3,
        			"className": "text-center text-nowrap",
                    render : function ( data, type, full, meta ) {
                        return `<a onclick="downloadFile('${data}')"> Download </a>`
                    }
                }
	        ],                
      	// select: true,
        responsive: true,
        dom: 'Bfrtip',
        buttons: [             
            
        ]
    });
	
	table.on( 'order.dt search.dt', function () {
		table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        });
    } ).draw();
}

function downloadFile(fileId) {
    showLoader(true);
    ajaxFileDownloader('/api/tps/web/disbursements/report?option=downloadBatchFileById&id=' + fileId)
}