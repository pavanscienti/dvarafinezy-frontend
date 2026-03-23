$(document).ready(function(){
	// showLoader(true);
    showLoader(false);
	openCreateInvoice();
});	

function openCreateInvoice(){
	$("#uploadFileFormModal").modal({show: true, backdrop: false});
	$('#uploadFileForm')[0].reset();
}

function uploadfile(){
	$('#uploadFileForm').validator().on('submit', function( event ) {	
		if (event.isDefaultPrevented()) return;
		$("#uploadFileFormModal").modal('hide');
		showLoader(true);
		var vendor = $('#vendor').val();
		var year = $('#year').val();
		var month = $('#month').val();

		let formData = new FormData();
     	formData.append("file", document.getElementById('vendor_trans_file').files[0]);

		doAPIRequestWithLoader2(API.METHOD_POST, 
			API.PATH_INVOICE+"?action=uploadDvaraTransactions&year="+year+"&month="+month, 
			formData, 
			function (json) {
			showLoader(false);
				if(json != null && json.status_code == 200 ){
					$('#success').html("<li>Invoice uploaded successfully...</li>").show();			
				} else {
					// show error message invalid OTP
					$('#error').html("<li>Invoice upload failed!</li>").show();
				}
			} );
		
	 	event.preventDefault();
	});
	
}



