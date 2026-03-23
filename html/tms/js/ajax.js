/**
 * Jquery Ajax related configurations 
 */


var API_SERVER_URL = '';
var API = {
	METHOD_GET : 'GET',
	METHOD_POST : 'POST',
	METHOD_DELETE : 'DELETE',	
	PATH_LOGIN : '/vengine/tms/login',
	PATH_OTP : '/vengine/tms/otp',
	user : "/vengine/cms/user",
	PATH_PAYMENT_APPROVALS : '/vengine/tms/approvals',
	PATH_PAYMENT_THIRDPARTY_APPROVALS : '/vengine/tms/thirdpartyapprovals',
	PATH_INVOICE :'/vengine/tms/invoice',
	PATH_ACCOUNT_STMT : '/vengine/tms/account/statement',
	PATH_PAYMENTS_RETURNS_MGMT : '/api/tps/web/payments/returnsmgmt',
	PATH_AEPS_USER : '/vengine/tms/user/aeps',
	PATH_PAYMENTS_FAILURES : '/vengine/tms/payments/failures',
	PATH_VACCOUNTS_ACCOUNT : '/vengine/tms/vAccounts/accounts',
	PATH_ACCESS_PERMISSION : '/vengine/tms/accessPermission',	
	PATH_VACCOUNT_TRXNS : '/vengine/tms/vAccount/vAccTrxns',	
	PATH_VACCOUNT_ABSTRACT : '/vengine/tms/vAccount/vAccAbstract',
	PATH_VACCOUNT_CEHCKLIST : '/vengine/tms/vaccount/checklist',
	PATH_USER_MOBILE: '/vengine/cms/user',
	PATH_IMAGE: '/vengine/cms/base64',
	API_BBPS : "/vengine/tms/app/bbps",
	API_EURONET_BILL_PAY: "/vengine/tms/app/utility/recharge",
	API_DMT_TRXNS : "/vengine/tms/dmt/trxns",

	PATH_LEAD_FULFILLMENTS : '/vengine/tms/leadmodule',

}

//set headers for all request
$.ajaxSetup({
	cache: false,
	async: true,
    beforeSend: function (xhr){
		 
       xhr.setRequestHeader("token", localStorage.token);
	   console.log("localStorage.token",localStorage.token)
	   xhr.setRequestHeader("X-frame-options" , "SAMEORIGIN")
	   xhr.setRequestHeader("X-content-type-options","nosniff" );
	   xhr.setRequestHeader("X-xss-protection", "1; mode=block ");
	   xhr.setRequestHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload ");
	   xhr.setRequestHeader("Cache-control", "no-cache, no-store, Private, must-revalidate" );
	   xhr.setRequestHeader("Pragma", "no-cache");
	   xhr.setRequestHeader("Expires", "0");
	   xhr.setRequestHeader("Cache-Control", "pre-check=0, post-check=0, max-age=0, s-maxage=0 ");
	   xhr.setRequestHeader("Server", "Apache");
	  
    },
    error: ajaxErrorHandler,
    complete: function(xhr, status) {
    	if(xhr.status == 403) {
    		window.location.reload();
    	} else {
    		var token = xhr.getResponseHeader('refresh_token');
            if(token && token.length > 0){
            	localStorage.token = token;
            }    		
    	}
    },
    statusCode: {
        401: function(xhr) {
        	window.location.reload();
        	// window.location.hash="#login";
        },
        403: function(xhr) {
          	window.location.reload();
        },
        404: function(xhr) {
        	
        }
    }
});

function ajaxErrorHandler(xhr){
	alert("An error occured: " + xhr.status + " " + xhr.statusText);
}

function doAPIRequestWithLoader(method, url, params, callback, dataType){
	showLoader(true);
	doAPIRequest(method, url, params, callback, dataType);
}

function doAPIRequest(method, url, params, callback, dataType){		
	let ajaxReq = {
		url: url,
		type: method,    
		cached: false,
		success: function(response, status, xhr) {
			if(callback != null) {
				callback(response, status, xhr);
			} 					        
		},
		error: function(response) {
			if(callback != null) {
				callback(response);
			}
		}
	};
		
	if(dataType == 'json') {
		ajaxReq.dataType = 'json';
		ajaxReq.contentType = 'application/json; charset=utf-8';
		if(params) ajaxReq.data = (typeof params === 'string') ? params : JSON.stringify(params);
	} else if(params) {
		ajaxReq.data = params;
	}
    $.ajax(ajaxReq);
}


function ajaxFileDownloader(url, fileName){	
	showLoader(true);
	return new Promise(resolve=>{		
		var xhr;
		if (window.XMLHttpRequest) {
			// code for modern browsers
			xhr = new XMLHttpRequest();
		} else {
			// code for old IE browsers
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhr.open('GET', url, true);
		xhr.setRequestHeader("X-Auth-Token", localStorage.access_token);
		xhr.setRequestHeader("CHANNEL", "KGFS-APP-WEB");		
		xhr.responseType = 'arraybuffer';
		xhr.onload = function () {
			try {
				if (this.status === 200) {
					if(!fileName){
						var disposition = xhr.getResponseHeader('Content-Disposition');
						if (disposition && disposition.indexOf('attachment') !== -1) {
							var filenameRegex = /filename[^=\n]*=((['"]).*?\2|[^;\n]*)/;
							var matches = filenameRegex.exec(disposition);
							if (matches != null && matches[1]) fileName = matches[1].replace(/['"]/g, '');
						}
					}
					
					var type = xhr.getResponseHeader('Content-Type');
					var blob = new Blob([this.response], { type: type });
					if (typeof window.navigator.msSaveBlob !== 'undefined') {
						// IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
						window.navigator.msSaveBlob(blob, fileName);
					} else {
						var URL = window.URL || window.webkitURL;
						var downloadUrl = URL.createObjectURL(blob);
						if (fileName) {
							// use HTML5 a[download] attribute to specify filename
							var a = document.createElement("a");
							// safari doesn't support this yet
							if (typeof a.download === 'undefined') {
								window.location = downloadUrl;
							} else {
								a.href = downloadUrl;
								a.download = fileName;
								document.body.appendChild(a);
								a.click();
							}
						} else {
							window.location = downloadUrl;
						}
						setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
					}
				} else {				
					var decoder = new TextDecoder('utf8');
					var responseJSON = JSON.parse(decoder.decode(this.response));
					swal({type:'error', text:responseJSON.error, title: ""});
					resolve({success : false, error:responseJSON.error})
				}
			} catch(err) {
				resolve({success : false, error: err})
			} finally {
				showLoader(false)
			}
		};
		xhr.send();
	})
}


function doAPIRequestWithLoader2(method, url, params, callback, dataType){

	console.log("api method" , method)
	console.log("api url" , url)
	console.log("api parms" , params)
	console.log("api callback" , callback)
	console.log("api dataType" , dataType)
	showLoader(true);
	doAPIRequest2(method, url, params, callback, dataType);
}

function doAPIRequest2(method, url, params, callback, dataType ){
	let ajaxReq = {
		url: url,
		type: method,    
		cached: false,
		processData: false,
		contentType:false,
        // contentType: "application/octect-stream",
		success: function(response, status, xhr) {
			if(callback != null) {
				callback(response, status, xhr);
			} 					        
		},
		error: function(response) {
			if(callback != null) {
				callback(response);
			}
		}
	};
	
	if(dataType == 'json') {
		ajaxReq.dataType = 'json';
		ajaxReq.contentType = 'application/json; charset=utf-8';
		if(params) ajaxReq.data = (typeof params === 'string') ? params : JSON.stringify(params);
	} else if(params) {
		ajaxReq.data = params;
	}
	console.log("ajaxReq",ajaxReq)
	
    $.ajax(ajaxReq);
	callback
}

