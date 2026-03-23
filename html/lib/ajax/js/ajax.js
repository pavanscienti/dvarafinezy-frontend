/**
 * Jquery Ajax related configurations 
 */

function getUserAccessToekn() {
	return localStorage ? localStorage.access_token : null;
}

//set headers for all request
$.ajaxSetup({
	// Disable caching of AJAX responses
    cache: false,
	async: true,
    beforeSend: function (xhr){
        if(localStorage && localStorage.access_token)
            xhr.setRequestHeader("Authorization", localStorage.access_token);
    },
    error: ajaxErrorHandler,
    complete: function(xhr, status) {
    	if(xhr.status == 401) {
    		window.location.reload();
    	} else {
			var token = xhr.getResponseHeader('refresh_token');
            if(token && token.length > 0 && localStorage){
            	localStorage.access_token = token;
            }    		
    	}
    },
    statusCode: {
        401: function(xhr) {
        	window.location.reload();
        }
//         403: function(xhr) {
// //          	window.location.reload();
//         },
//         404: function(xhr) {
        	
//         }
    }
});

function ajaxErrorHandler(xhr) {
	console.log("Ajax error occurred");
	//	alert("An error occured: " + xhr.status + " " + xhr.statusText);
}


function doAPIRequestWithLoader(method, path, params, callback, dataType){
	showLoader(true);
	doAPIRequest(method, path, params, callback, dataType);
}

function doAPIRequest(method, url, params, callback, dataType) {	
	var reqHeader = {};
	if(localStorage && localStorage.token){
		reqHeader['token'] = localStorage.token;
	}
	let ajaxReq = {
		url: url,
		type: method,
		headers: reqHeader,	    
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