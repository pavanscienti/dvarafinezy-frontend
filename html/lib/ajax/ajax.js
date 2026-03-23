/**
 * Jquery Ajax related configurations 
 */

function getUserAccessToekn() {
	return localStorage.access_token;
}

//set headers for all request
$.ajaxSetup({
	// Disable caching of AJAX responses
    cache: false,
	async: true,
    beforeSend: function (xhr){
       xhr.setRequestHeader("Authorization", localStorage.access_token);
    },
    error: ajaxErrorHandler,
    complete: function(xhr, status) {
    	if(xhr.status == 401) {
    		window.location.reload();
    	} else {
    		var token = xhr.getResponseHeader('refresh_token');
            if(token && token.length > 0){
            	localStorage.access_token = token;
            }    		
    	}
    },
    statusCode: {
        401: function(xhr) {
        	window.location.reload();
        },
        403: function(xhr) {
//          	window.location.reload();
        },
        404: function(xhr) {
        	
        }
    }
});

function ajaxErrorHandler(xhr) {
	console.log("Ajax error occurred");
	//	alert("An error occured: " + xhr.status + " " + xhr.statusText);
}


