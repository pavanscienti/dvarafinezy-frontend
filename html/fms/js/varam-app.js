/**
 * Jquery Ajax related configurations 
 */
Object.keys(localStorage).forEach(function(key){
    sessionStorage[key]=localStorage.getItem(key);
});

var callBackLogin = null;

var API_SERVER_URL = '';
var API = {
	METHOD_GET : 'GET',
	METHOD_POST : 'POST',
	METHOD_DELETE : 'DELETE',	
	PATH_LOGIN : '/vengine/cms/user',
	PATH_DISBURSEMENT : '/vengine/vw/disbVerifier',
	PATH_APPRAISAL:'/vengine/vw/appraisal',
	PATH_APTITUDE:'/vengine/vw/insiderOnboarding',
	PATH_PROCESS:'/vengine/vw/process',
	PATH_MESSAGE_GROUP:'/vengine/fms/messageGroup'
}

//set headers for all request
$.ajaxSetup({
	cache: false,
	async: true,
    beforeSend: function (xhr){
       xhr.setRequestHeader("token", sessionStorage.token);
       //xhr.setRequestHeader("access_token", sessionStorage.access_token);
    },
    error:function(xhr) {
    	ajaxErrorHandler(xhr);        
    },
    complete: function(xhr, status) {        
        var token = xhr.getResponseHeader('refresh_token');
        if(token && token.length > 0){
        	sessionStorage.token = token;
        }
    },
    statusCode: {
        401: function(xhr) {
        	
        },
        403: function(xhr) {
          	onLoginFailed();
        }
    }
});

EP.branchNames1 = function (callback){
	var data = {};
	var branchIds = localStorage.branch_id.split(",");
	var branchNames = localStorage.branch_name.split(",");
	
	//var i=0;
	for(var k in branchIds){
		data[branchIds[k]] = branchNames[k];
	}
	callback(data);		
}

function ajaxErrorHandler(xhr){
	alert("An error occured: " + xhr.status + " " + xhr.statusText);
}

function doAPIRequestWithLoader(method, path, params, callback){
	showLoader(true);
	doAPIRequest(method, path, params, callback);
}

function doAPIRequest(method, path, params, callback){	
	if(params == null){
		params = {};
	}
	var url = path;    
    var jqxhr = $.ajax({
	    url: url,
	    type: method,
	    data: params,	    
	    cached: false,
	    success: function(response) {
	    	if(callback != null){
	    		eval(callback(response));
	    	} 			        
	    },
	    error: function(response) {
	    	if(callback != null){
	    		eval(callback(response));
	    	}
	    }
	});
}

(function () {
	  'use strict';
	  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	    var msViewportStyle = document.createElement('style')
	    msViewportStyle.appendChild(
	      document.createTextNode(
	        '@-ms-viewport{width:auto!important}'
	      )
	    )
	    document.querySelector('head').appendChild(msViewportStyle)
	  }
	})();

	$(document).ready(function(){
		initializePage();
	});
	
	function checkLogin(){
		if(sessionStorage.token) {
			var params = {'option' : 'validateToken'};
			params['token'] = sessionStorage.token;
			doAPIRequest(API.METHOD_POST, API.PATH_LOGIN, params, 
				function(res){
					if(res != null && res.code == 200 && res.data){
						onLoginSuccess();					
					} else {
						onLoginFailed();
					}
				}
			);
		} else {
			onLoginFailed();
		}
	}

	function onLoginSuccess() {
		$("#content").show();
		showNavMenuItem(true);
		showLoader(false);
		if(callBackLogin != null){
			callBackLogin(true);	
		}
	}

	function onLoginFailed(){	
		$("#content").hide();
		sessionStorage.clear();
		showNavMenuItem(false);
		showLoginDialog();
		if(callBackLogin != null){
			callBackLogin(false);	
		}
		
	}

	function showNavMenuItem(isVisible){
		if(isVisible){		
			$('#navMenuItem').show();
			$('#logout').show();
			$('#login').hide();
		} else {
			$('#navMenuItem').hide();
			$('#logout').hide();
			$('#login').show();
			
		}	
	}

	function showLoader(isVisible){
		if(isVisible){
			document.getElementById("loader").style.display = "block";
			$('#loader-icon').show();	
		} else {
			document.getElementById("loader").style.display = "none";
			$('#loader-icon').hide();
		}	
	}

	function logout(){
		sessionStorage.clear();
		location.reload();
	}
	
	Array.prototype.contains = function(obj) {
	    var i = this.length;
	    while (i--) {
	        if (this[i] == obj) {
	            return true;
	        }
	    }
	    return false;
	}
	
	String.prototype.toMoney = function() {
		var n = this,
		   c = 2,
		   d = '.',
		   t = ',',
		   sign = (n < 0) ? '-' : '₹ ',
		   //extracting the absolute value of the integer part of the number and converting to string
		   i = parseInt(n = Math.abs(n).toFixed(c)) + '',
		   j = ((j = i.length) > 3) ? j % 3 : 0; 
		   return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 	
	};


	Number.prototype.toMoney = function() {
		var n = this,
		   c = 2,
		   d = '.',
		   t = ',',
		   sign = (n < 0) ? '-' : '₹ ',
		   //extracting the absolute value of the integer part of the number and converting to string
		   i = parseInt(n = Math.abs(n).toFixed(c)) + '',
		   j = ((j = i.length) > 3) ? j % 3 : 0; 
		   return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 	
	};


	function getHashParam(){
		var hash = location.hash.replace( /^#/, '' );		
		return hash;
	}
	
	function getHashParams(){
		var hash = location.hash.replace( /^#/, '' ).split("/");
		var params = {};
		for(var i=1;i<hash.length;i+=2) {
			params[hash[i]]=params[hash[i+1]];
		}
		return params;
	}

	function getArrayAsHTMLList(items) {
		if(!items) return "";
		var htmlList = "";
		$.each(items, function( key, value ) {
			if(value){
				htmlList += "<li>" + value + "</li>";	
			}		
		});
		return htmlList;
	}
	// $.fn.dataTable.ext.errMode = 'none';


	
	
	