var disbList = {};
$(document).ready(function() {
	showLoader(false);
});


function readCSVFile(){
    disbList = {};
    let input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept=".csv";
    input.onchange = (event)=>{
        let file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = ()=>{
            let records = CSVToArray(fileReader.result, '|');
            if(records.length == 0){
                swal({title:'', type:'error', text:'No disbursement entry found in this csv file'});
                return;
            }

            records.forEach((disbRecord, index)=>{ 
                if(index >0) {
                    let json = {
                        trans_type : disbRecord[0],
                        amount : Number(disbRecord[1]).toFixed(2),
                        disb_date: disbRecord[2],
                        acc_name: disbRecord[3],
                        acc_no: disbRecord[4],
                        notifier_email: disbRecord[5],
                        company_acc_no: disbRecord[7],
                        ifscode: disbRecord[9],
                        type_code: disbRecord[10],
                        loan_acc_no: disbRecord[11], 
                        cust_no: disbRecord[12],
                        branch_name: disbRecord[14],
                        disb_amount: Number(disbRecord[21]).toFixed(2),
                        insurance_fee: Number(disbRecord[22]).toFixed(2),
                        processing_fee: Number(disbRecord[23]).toFixed(2),
                        gst: disbRecord[24]
                    };
    
                    if(disbList[json.branch_name]) {
                        disbList[json.branch_name].push(json);
                    } else {
                        disbList[json.branch_name] = [json];
                    }
                    $("#branch_name").html(Object.keys(disbList).map(b=>`<option value="${b}">${b}</option>`));
                    showDisb()
                }
            })
        }     
        fileReader.readAsText(file)
    };
    input.click();

}

function reloadTrxns() {
	table.ajax.reload();
}

function showDisb() {
    var loanDataList = disbList[$("#branch_name").val()];
    console.log(loanDataList)
	var table = $('#tbl_disb_list').DataTable({
        "destroy": true,
		processing: true,
		"language": {
			"processing": "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> please wait...",
	        "emptyTable" : "No records found!",
	        "infoEmpty" : "No records matched!"
	    },
        data: loanDataList || [],
        "scrollX": true,
        columns: [
            {data: null },                        
            {data: 'disb_date', "defaultContent": "" },  
            {data: 'cust_no', "defaultContent": "" },    
            {data: 'acc_name', "defaultContent": "" },      
            {data: 'loan_acc_no', "defaultContent": "" },
            {data: 'acc_no', "defaultContent": "" },
            {data: 'ifscode', "defaultContent": "" },
            {data: 'company_acc_no', "defaultContent": "" },
            {data: 'amount', "defaultContent": "" },
            {data: 'disb_amount', "defaultContent": "" },
            {data: 'insurance_fee', "defaultContent": "" },
            {data: 'processing_fee', "defaultContent": "" },
            {data: 'gst', "defaultContent": "" }
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
        		}
	        ],                
      	// select: true,
        responsive: true,
        dom: 'Bfrtip',
        buttons: [             
            { extend: 'colvis', text: '<span class="glyphicon glyphicon-th-list"></span>' },
            {
                text: "Post Disbursement",
                action: function(){
                    postDisbursement();
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


function postDisbursement() { 
    let branchName = $("#branch_name").val();
    var loansArr = disbList[branchName];
    if(loansArr && loansArr.length > 0) {
        swal({
            title: `Post ${branchName} Disbursement`,
            text: "Enter payment comments",
            input: 'textarea',
            confirmButtonText: 'Post',
            showCloseButton: true,
            showCancelButton: true,
            inputPlaceholder: 'Remarks',
            preConfirm: function(inputComments){
                return new Promise((resolve, reject) => {
                    if(inputComments) {
                    	let params = {}
                        params.code = window.user.user_id;
                        params.name = window.user.user_name;
                        params.comments = inputComments;
                        params.branch_name = branchName;
                        params.disb = loansArr;
                        doAPIRequest("POST", "/api/tps/web/disbursements?option=qbrik", JSON.stringify(params), function(json){
                            if(json && json.code == 200){
                                resolve();	
                                disbList[branchName] = [];
                            } else if(json && json.error) {
                                reject(json.error.join());
                            } else {
                                reject("Disbursement posting failed.");
                            }
                        }, 'json');
                    } else {
                        reject("Payment remarks is required");
                    }
                });
            }
        }).then(function(data){
            showDisb();
        }, function(result){})
    } else {
        swal("no disbursement found");
    }    
}



function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}

function CSV2JSON(csv, strDelimiter) {
    var array = CSVToArray(csv, strDelimiter);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }
    return jsonArr;
}


function uploadPerdixFile() {
	let input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
//    input.accept=".xlsx";
    input.onchange = (event)=>{    	
        let file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = ()=>{
        	showLoader(true);
            $.ajax({
                url: "/api/tps/web/disbursements?option=perdix&input_content_type=" + file.name.split('.').pop(),
                type: "POST",
                data: fileReader.result,
                processData: false,
                contentType: "application/octect-stream",
                success: function (result) {
                	showLoader(false);
                    if(result && result.code == 200) {
                    	showConfirmPerdixPaymentDialog(result.data.ref_id, result.data.total_records)
                    } else {
                         swal({
                             type: 'error',
                             title:'',
                             text: result ? result.error : 'File upload error'
                         })
                    }
                },
	            error: function(error) {
	                showLoader(false)
	                swal({
	                    type: 'error',
	                    title:'',
	                    text: 'File upload error'
	                })
	            }
            });
        }
        fileReader.readAsArrayBuffer(file);
    };
    input.click();
}

function showConfirmPerdixPaymentDialog(payentRefId, noOfPayments){
	swal({
        title: 'Confirm',
        text: `Total ${noOfPayments} payments has been uploaded. Do you confirm to create?`,
        confirmButtonText: 'Create',
        showCloseButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: function(){
            return new Promise((resolve, reject) => {
            	let params = {
        			code   : window.user.user_id,
        			name   : window.user.user_name,
        			ref_id : payentRefId
            	}                   
                doAPIRequest("POST", "/api/tps/web/disbursements?option=createPerdixBatch", params, function(json){
                    if(json && json.code == 200){
                        resolve();
                    } else if(json && json.error) {
                        reject(json.error.join());
                    } else {
                        reject("Batch creation failed.");
                    }
                });                
            });
        }
    }).then(function(data){
        swal({type:'success', title:'', text:'Batch creation in progress. Please check status after few minutes.'})
    }, function(result){})
}


