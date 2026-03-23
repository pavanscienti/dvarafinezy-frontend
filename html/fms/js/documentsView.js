	var aadhaar_no;
	var loanOrAadhaar;
	var customerNo;
	var selectedDoc;
	
	$(document).ready(function() {
		showLoader(false);
	//	if(localStorage.user_type == "ADMIN"
	//		|| (localStorage.user_type == "HO" && localStorage.user_group == "it")) {
			$("#btn_create_document").show();
	//	}
	});
	
	function chooseDocumentView(){
		$('#loan_or_aadhaar').val("");
		$("#kyc-details").hide();
		$("#loan-details").hide();
		selectedDoc = $("#document_select option:selected").val();
			//loan_documents
		if(selectedDoc == 'kyc_documents'){
			$('#loan_or_aadhaar').attr('placeholder','Aadhaar No.');
		}else{
			$('#loan_or_aadhaar').attr('placeholder','Loan No.');
		}
		
	}
	
	function getDocuments() {
		loanOrAadhaar = $("#loan_or_aadhaar").val();	
		selectedDoc = $("#document_select option:selected").val();
		
		if(selectedDoc == "kyc_documents" && loanOrAadhaar == ""){
			swal("Enter Aadhaar number");
			return true;
		} else if(selectedDoc == "kyc_documents" && (loanOrAadhaar.length < 12 || loanOrAadhaar.length > 12 )){
			swal("Enter correct aadhaar number");
			return true;
		} else if(loanOrAadhaar == ""){
			swal("Enter Loan account number");
			return true;
		} else {
			$("#member_photo").attr("src","images/spiner.gif");
			$("#guarantor_photo").attr("src", "images/spiner.gif");	
			$("#house_photo").attr("src","images/spiner.gif");		
			$('#bank_passbook_photo').attr("src","images/spiner.gif"); 		
			$("#aadhaar").attr("src","images/spiner.gif"); 		
			$("#aadhaar_2").attr("src","images/spiner.gif");	
			$("#rationcard").attr("src","images/spiner.gif");
			$("#rationcard_2").attr("src","images/spiner.gif");
			$("#voter_id").attr("src","images/spiner.gif");		
			$("#voter_id_2").attr("src","images/spiner.gif");
			$("#driving_license").attr("src","images/spiner.gif");
			$("#pancard").attr("src","images/spiner.gif");
			
			$("#loan1").attr("src", "images/spiner.gif");
			$("#loan2").attr("src", "images/spiner.gif");
			$("#loan3").attr("src", "images/spiner.gif");
			$("#mandate_form").attr("src",  "images/spiner.gif");
			$("#mandate_form2").attr("src",  "images/spiner.gif");
			$("#sanction_letter").attr("src", "images/spiner.gif");
			$("#dpn").attr("src",  "images/spiner.gif");
			$("#customer_signature").attr("src", "images/spiner.gif");			
			$("#jlg_agrement_form").attr("src", "images/spiner.gif");			
			$("#terms_and_condition").attr("src", "images/spiner.gif");		
			$("#form_60").attr("src", "images/spiner.gif");
			
			var params={};
			params["option"] = "getDocuments";
			params["loan_or_aadhaar"] = loanOrAadhaar;
			params["document_type"] = selectedDoc;
			doAPIRequestWithLoader("GET",  APIHandler.PATH_DOCUMENTS_VIEW, params, documentsCallback);
			$("#kyc-details").hide();
			$("#loan-details").hide();
		}
		
	}
	
	function documentsCallback(json){
		showLoader(false);		
		if(json && json.status_code == 200 && json.data){
			var data = json.data;
			if(selectedDoc == 'kyc_documents'){
				$("#kyc-details").show();
				aadhaar_no = data.id_proofs.aadhaar;
				//member photo
				var paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.member_photo");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, 
						function(response){
							if(response != null && response.length > 10){
								//alert(response);
								$("#member_photo").attr("src", response);
							}else{
								$("#member_photo").attr("src", "images/avatar_64.png");
							}
						});
			    
			  //Guarantor Photo
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.guarantor_photo");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, 
						function(response){
							if(response != null && response.length > 10){
								$("#guarantor_photo").attr("src", response);
							}else{
								$("#guarantor_photo").attr("src", "images/avatar_64.png");
							}
						});
			    //House Photo
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.house_photo");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, 
						function(response){		    			
							if(response != null && response.length > 10){
								$("#house_photo").attr("src", response);
							}else{
								$("#house_photo").attr("src", "images/no_image_available.jpg");
							}
						});
			    
			  //Bank Passbook Photo
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.bank_passbook_photo");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, function(response){
					/*if(response){
						$('#image-gallery-bank-passbook').html("<img src=\""+response+"\" id=\"image_bank_passbook\" alt=\"\" class=\"pannable-image\" style=\"min-width:340px;width:100%;height: 320px;\">");
					} else {
						$('#image-gallery-bank-passbook').html("<img src=\"images/no_image_available.jpg\" id=\"image_bank_passbook\" alt=\"\" class=\"pannable-image\" style=\"min-width:340px;width:100%;height: 320px;\">");
					}*/
					//$('#bank_passbook_photo').ImageViewer();
			    	$('#bank_passbook_photo').attr("src", response ? response : "images/no_image_available.jpg");
				});
			    
			    // Aadhaar Front Image
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.aadhaar");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, function(response) {
					$("#aadhaar").attr("src", response ? response : "images/no_image_available.jpg");
				});
			    
			    // Aadhaar Back Image
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.aadhaar_2");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, function(response) {
					$("#aadhaar_2").attr("src", response ? response : "images/no_image_available.jpg");
				});
			    
			    // Ration Card Front Image
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.rationcard");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, function(response) {
					$("#rationcard").attr("src", response ? response : "images/no_image_available.jpg");
				});
			    // Ration Card Back Image
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.rationcard_2");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, function(response) {
					$("#rationcard_2").attr("src", response ? response : "images/no_image_available.jpg");
				});
			    
			    // Voter id Front Image
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.voter_id");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, function(response) {
					$("#voter_id").attr("src", response ? response : "images/no_image_available.jpg");
				});
			    
			    // Voter id Back Image
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.voter_id_2");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, function(response) {
					$("#voter_id_2").attr("src", response ? response : "images/no_image_available.jpg");
				});
			    
			    // Driving license
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.driving_license");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, function(response){
					$("#driving_license").attr("src", response ? response : "images/no_image_available.jpg");
				});	
			    
			 // Pan card
			    paramsBase64 = new Array();
				paramsBase64.push("selection=miscellaneous.pancard");
				paramsBase64.push("wherearg=id_proofs.aadhaar");
				paramsBase64.push("whereargvalue="+aadhaar_no);
			    EP.APIHandler.apiRequest("GET", EP.APIHandler.base64Image, paramsBase64, function(response){
					$("#pancard").attr("src", response ? response : "images/no_image_available.jpg");
				});	
			    
			} else {
				let html = data.documents.map(doc => {
						let docFileURL = doc.document ? EP.APIHandler.base64Image+"?option=base64ImgCloud&image=1&name="+doc.document : "images/no_image_available.jpg";
						return`
							<div class="col-md-offset-1 col-md-3  col-centered">
									<div class="" style="text-align: left;padding-left:60px;">
										<span>${doc.doc_name.replace(/_/g, " ").capitalizeWord()} - ${doc.page_no}<span>&nbsp;&nbsp;<a onclick="showUpdateDocDialog('${doc.doc_name}',${doc.page_no},${doc.no_of_page})"><i class="fa fa-edit" /></a></span></span>	
									</div>
									<img alt="${doc.doc_name.replace(/_/g, " ").capitalizeWord()}" onclick="showImageViewer(this.src)" class="form-control" style="cursor: pointer;width:210px;height:240px;margin-bottom: 10px;margin-top: 10px;" id="loan1" src="${docFileURL}" >
							</div>
						`;
				}).join('');
				$("#loan-documents").html(html);
				$("#loan-details").show()
			}			
		} else {
			$("#loan_or_aadhaar").val("");
			swal( (json && json.error) ? json.error.join(", ") :  "Customer/Document not exists");
			return true;
		}
	}
	
	
	function showFullScreenImage(imgSrc) {
		window.parent.imageViewer.show(imgSrc.src, imgSrc.src);
	}
	
var openFile = function(imgDom, event) {
	if(imgDom.files[0].size > 1572864){
	   $(".swal2-validationerror").text("File size must be less than 1.5 MB is required.").show();
	   imgDom.value = "";
	   $(".swal2-image").attr("src", "").hide();
       $(".swal2-input").val("");
    } else {
    	var input = event.target;
    	var reader = new FileReader();
    	reader.onload = function() {    		
    		let fileData = reader.result.substr(reader.result.indexOf(',') + 1);
    		$(".swal2-input").val(fileData);
    		$(".swal2-image").show().attr("src", reader.result);
    		$(".swal2-validationerror").text("").hide();
    	};
    	reader.onError = function() {
    		$(".swal2-input").val('');
    		$(".swal2-image").hide();
    	}
    	reader.readAsDataURL(input.files[0]);	
    }
};

function showUpdateDocDialog(docName, pageNo, noOfPage) { 
	 swal({
		  title: 'Update Loan documents',
		  input: 'file',
		  inputAttributes: {
			'onchange' : 'openFile(this, event)', 
		    'accept': 'image/jpeg',
		    'aria-label': 'Upload loan document'
		  },
		  inputPlaceholder : 'select file',
		  showCloseButton : true,
		  confirmButtonText: 'Update',
		  cancelButtonText: 'Cancel',
		  showLoaderOnConfirm: true,
		  allowOutsideClick: true,
		  preConfirm: function () {
		    return new Promise(function (resolve, reject) {
		    	let inputFile = $(".swal2-file");
		    	let size = inputFile && inputFile[0] && inputFile[0].files ? inputFile[0].files[0] : 0;
		    	let base64Image = $(".swal2-input").val();
		    	if(!base64Image || size == 0) {
		    		reject("Select a image");
		    	} else if(size > 1572864) {
		    		reject("File size must be less than 1.5 MB");
		    	} else {
		        	let params = {
		        			option : "updateLoanDoc",
		        			loan_account_no : $('#loan_or_aadhaar').val(),
		        			doc_name : docName,
		        			emp_code : localStorage.user_id,
		        			emp_name : localStorage.user_name,
		        			no_of_page: noOfPage,
		        			page_no: pageNo,
		        			doc_image : base64Image		        			
		        	};
		        	
					doAPIRequest("POST", APIHandler.PATH_DOCUMENTS_VIEW, params, function(json) {
						if(json && json.code == 200) {
							resolve("docuemnt updated.");
						} else if(json && json.error) {
							reject(json.error.join());
						} else {
							reject("failed to update loan document!");
						}
					});		        	
		        }		      
		    });
		  },
		  onOpen : function() {
			  
		  }
	}).then(function (data) {
		swal({'type' : 'success', 'text': 'Uploaded document will be available after few minutes.'});
	},function(dismiss) {});
 }

function showUpdateCsutomerDocDialog(docName, pageNo, noOfPage) { 
	 swal({
		  title: 'Update Loan documents',
		  input: 'file',
		  inputAttributes: {
			'onchange' : 'openFile(this, event)', 
		    'accept': 'image/jpeg',
		    'aria-label': 'Upload loan document'
		  },
		  inputPlaceholder : 'select file',
		  showCloseButton : true,
		  confirmButtonText: 'Update',
		  cancelButtonText: 'Cancel',
		  showLoaderOnConfirm: true,
		  allowOutsideClick: true,
		  preConfirm: function () {
		    return new Promise(function (resolve, reject) {
		    	let inputFile = $(".swal2-file");
		    	let size = inputFile && inputFile[0] && inputFile[0].files ? inputFile[0].files[0] : 0;
		    	let base64Image = $(".swal2-input").val();
		    	if(!base64Image || size == 0) {
		    		reject("Select a image");
		    	} else if(size > 1572864) {
		    		reject("File size must be less than 1.5 MB");
		    	} else {
		        	let params = {
		        			option : "updateCustomerDoc",
		        			aadhaar : $('#loan_or_aadhaar').val(),
		        			doc_name : docName,
		        			emp_code : localStorage.user_id,
		        			emp_name : localStorage.user_name,
		        			no_of_page: noOfPage,
		        			page_no: pageNo,
		        			doc_image : base64Image		        			
		        	};
		        	
					doAPIRequest("POST", APIHandler.PATH_DOCUMENTS_VIEW, params, function(json) {
						if(json && json.code == 200) {
							resolve("docuemnt updated.");
						} else if(json && json.error) {
							reject(json.error.join());
						} else {
							reject("failed to update loan document!");
						}
					});		        	
		        }		      
		    });
		  },
		  onOpen : function() {
			  
		  }
	}).then(function (data) {
		swal({'type' : 'success', 'text': 'Uploaded document will be available after few minutes.'});
	},function(dismiss) {});
}


function createDocument() {
	
	swal({
		  title: 'Create Document',
		  text: 'Enter Loan account no',
		  input: 'text',
		  inputPlaceholder: 'Loan account no',
		  animation: true,
		  showCancelButton: true,
		  showCloseButton : true,
		  confirmButtonText: 'Create Document',
		  showLoaderOnConfirm: true,
		  allowOutsideClick: false,
		  preConfirm: function (loanAccountNo) {
			  return new Promise(function (resolve, reject) {
				  let params = {
		        			option : "createEmptyLoanDocEntry",
		        			loan_account_no : loanAccountNo,
		        			emp_code : localStorage.user_id,
		        			emp_name : localStorage.user_name
		        	};
					doAPIRequest(API.METHOD_POST, API.PATH_DOCUMENTS_VIEW, params, function(json){
						if(json != null && json.status_code == 200 && json.data && json.data.success){
							resolve();
						} else if(json != null && json.error) {
							reject(json.error.join());
						} else {
							reject("Document creation failed.");
						}
					});			       		      
			  });
		  }		  
		}).then(function () {
			swal({type: 'success'});
		},function(dismiss) {
			 // dismiss can be "cancel" | "close" | "outside"
		});
}
