var Config = {
	route : {
		"default" : 		{ templateURL : "/tms/paymentsapproved.html" },
		"paymentQueued" : 	{ templateURL : "/tms/paymentsQueued.html" },
		"paymentApproval" : { templateURL : "/tms/paymentsapproval.html" },
		"paymentApproved" : { templateURL : "/tms/paymentsapproved.html" },
		"paymentCancelled" :{ templateURL : "/tms/paymentscancelled.html" },
		"thirdPartyPaymentApproval" :{ templateURL : "/tms/thirdpartypaymentsapproval.html" },
		"thirdPartyPaymentApproved" :{ templateURL : "/tms/thirdpartypaymentsapproved.html" },
		"thirdPartyBatchCreation" :{ templateURL : "/tms/thirdpartybatchcreation.html" },
	// 	"aepsTrxn" : 		{ templateURL : "/tms/bankstmt.html" },
		"disbStmt" : 		{ templateURL : "/tms/bankstmt.html" },
		"aepsStmt" : 		{ templateURL : "/tms/bankstmt.html" },
		"aepsTrxn" : 		{ templateURL : "/tms/aeps-trxn-stmt.html" },
		"aepsUser" : 		{ templateURL : "/tms/aeps-user.html" },
		"returnsMgmt" : 	{ templateURL : "/tms/returns-mgmt.html" },
		"login" : 			{ templateURL : "/tms/user-login.html" },
		"notification" : 	{ templateURL : "/cms/vfeeds.html" },
		"vAccount" : 		{ templateURL : "/tms/vAccount/vAccount.html" },
		"vAccTrxns" : 		{ templateURL : "/tms/vAccount/vAccTrxns.html" },
		"vAccTransferMoney":{ templateURL : "/tms/vAccount/vAccTransferMoney.html" },
		"vAccTrxnSummary":	{ templateURL : "/tms/vAccount/vAccTrxnSummary.html"},
		"vAccAbstract":	{ templateURL : "/tms/vAccount/vAccAbstract.html"},
		"vAccLocationAbstract":	{ templateURL : "/tms/vAccount/vAccLocationAbstract.html"},
		"euronetBillPayTrxns":	{ templateURL : "/fms/views/euronet-billpay/trxns/index.html"},
		"bbpsTrxns":	{ templateURL : "/fms/views/bbps/trxns/index.html"},
		"DMTTrxns":	{ templateURL : "/fms/views/dmt/index.html"},
		"inbox":	{ templateURL : "/common/views/inbox/index.html"},
		"cashmonitoring": { templateURL : "/tms/views/cash-monitoring/index.html"},
		"disbUpload": { templateURL : "/tms/views/disbursements/index.html"},
		"disbReport": { templateURL : "/tms/views/disbursement-report/disbursement-report.html"},
		"thirdPartydisbReport": { templateURL : "/tms/views/thirdparty-disbursement-report/thirdparty-disbursement-report.html"},
		"perdixBatchFile" : {templateURL : "/tms/views/batch-file/download-batch-file.html"},
		"paymentRecovery" : {templateURL : "/tms/views/payment-recovery/payment-recovery.html"},
		"paymentBatchCreation" : {templateURL : "/tms/views/payment-batch/payment-batch.html"}
	},
	"payment_category" : [
		"KGFS Loan Disbursement",
		"AXIS Loan Disbursement",
		"MAS Loan Disbursement"
	]
};


/*!
 * IE10 viewport hack for Surface/desktop Windows 8 bug
 */
// See the Getting Started docs for more information:
// http://getbootstrap.com/getting-started/#support-ie10-width

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

function showPopup(isShow, header, body) {
	var dialog = document.getElementById('my-dialog');	 
	if(isShow) {
		document.getElementById('dialog-title').innerHTML = header;
		document.getElementById('dialog-content').innerHTML = body;
		dialog.show();	
	} else {
		dialog.close();
	}
}

function toggleDialog(isShow, id) {
	var dialog = document.getElementById(id);	 
	if(isShow) {		
		dialog.show();	
	} else {
		dialog.close();
	}
}

function hashLocationChanged() {
	showLoader(true);
	let hash = location.hash.replace( /^#/, '' ).split("/", 5);
	let templateURL;
	if(localStorage.nav){
		templateURL = localStorage.nav;
	} else {
		templateURL = Config.route["default"].templateURL;
	}
	if(hash.length == 1) {
		if(Config.route[hash[0]]) {
			templateURL = Config.route[hash[0]].templateURL;			
		}
	} else if(hash.length > 1) {
		var route = [];
		for(var index in hash) {
			route.push(hash[index]);
			if(Config.route[route.join("/")]) {
				templateURL = Config.route[route.join("/")].templateURL;
				break;
			}
		}	
	}
	$('#content').load(templateURL);	
}

// $(window).on('hashchange', hashLocationChanged);



$(document).ready(function(){		
	// setTimeout(function(){showLoader(false);}, 1500);
	// URL Changes	
	// check user have token or not 
	// if token exist then validate token
	// if token valid then redirect to home page 
	// else redirect to login page
	if(localStorage.token) {		
		var params = {'option' : 'validateToken'};
		doAPIRequest(API.METHOD_POST, API.PATH_LOGIN, params, 
			function(res){
				if(res != null && res.status_code == 200 && res.data){
					onLoginSuccess();					
				} else {				
					onLoginFailed();
				}
			}
		);
	} else {
		onLoginFailed();
	}
	
});

function onLoginSuccess() {
	window.user = {};
	window.user['user_id'] = localStorage.emp_code;
	window.user['emp_name'] = localStorage.emp_name;
	$("#menu_logged_in_user").html(`
		<i class="fa fa-user-circle-o" aria-hidden="true"></i>&nbsp;${localStorage.emp_name}
	`);
	for (var key in localStorage){
		sessionStorage[key] = localStorage[key];
	}
	
	if(localStorage.linkNavMenu == "menu/maker.htm"
		|| localStorage.linkNavMenu == "menu/checker.htm"
		|| localStorage.linkNavMenu == "menu/approver.htm" ){
		Config.route["default"] = Config.route["paymentApproval"];
	} else {
		Config.route["default"] = Config.route["paymentApproved"];
	}
	
	if(window.location.hash == "#login"){
		window.location.hash = "#";	
	}/* else if(window.location.hash != "#"){
		hashLocationChanged();
	} else {
		hashLocationChanged();
	}*/	
		
	hashLocationChanged();
	showNavMenuItem(true);
	$('#navMenuItem').load(localStorage.linkNavMenu, null, function(){
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault(); 
			event.stopPropagation(); 
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
	});
	initSocket();
}

function onLoginFailed(){
	$("#menu_logged_in_user").html('');
	/*if(window.location.hash != "#login"){
		window.location.hash = "#login";	
	} else {
		hashLocationChanged();		
	}*/
	window.location.hash = "#login";
	hashLocationChanged()
	localStorage.clear();
	showNavMenuItem(false);
}

function calbackDownloadFile(data){
	window.open(data , '_blank');	
	showLoader(false);
}	

function showNavMenuItem(isVisible){
	if(isVisible){
		$(".user-menu").show();
	} else {
		$(".user-menu").hide();		
	}	
}

function showLoader(isVisible) {
	if(isVisible) {
		$("#loader").show();
		// document.getElementById("container").style.display = "none";
		$('#loader-icon').hide();	
	} else {
		$("#loader").hide();
		// document.getElementById("container").style.display = "block";
		$('#loader-icon').hide();
	}	
}

function logout(){
	localStorage.clear();
	location.reload();
}

function sendOTP(callback){
	
}

function showMessage(){
	
}

function showError(){
	
}

String.prototype.reverse = function() {
	return this.split("").reverse().join("");
};
	
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


Date.prototype.monthNames = [
 	"January", "February", "March",
     "April", "May", "June",
     "July", "August", "September",
     "October", "November", "December" ];

 Date.prototype.getMonthName = function() {
     return this.monthNames[this.getMonth()];
 };
  
 Date.prototype.getShortMonthName = function () {
 	return this.getMonthName().substr(0, 3);
 };

 var dateFormat = function () {
 	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
 		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
 		timezoneClip = /[^-+\dA-Z]/g,
 		pad = function (val, len) {
 			val = String(val);
 			len = len || 2;
 			while (val.length < len) val = "0" + val;
 			return val;
 		};

 	// Regexes and supporting functions are cached through closure
 	return function (date, mask, utc) {
 		var dF = dateFormat;

 		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
 		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
 			mask = date;
 			date = undefined;
 		}

 		// Passing date through Date applies Date.parse, if necessary
 		date = date ? new Date(date) : new Date;
 		if (isNaN(date)) throw SyntaxError("invalid date");

 		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

 		// Allow setting the utc argument via the mask
 		if (mask.slice(0, 4) == "UTC:") {
 			mask = mask.slice(4);
 			utc = true;
 		}

 		var	_ = utc ? "getUTC" : "get",
 			d = date[_ + "Date"](),
 			D = date[_ + "Day"](),
 			m = date[_ + "Month"](),
 			y = date[_ + "FullYear"](),
 			H = date[_ + "Hours"](),
 			M = date[_ + "Minutes"](),
 			s = date[_ + "Seconds"](),
 			L = date[_ + "Milliseconds"](),
 			o = utc ? 0 : date.getTimezoneOffset(),
 			flags = {
 				d:    d,
 				dd:   pad(d),
 				ddd:  dF.i18n.dayNames[D],
 				dddd: dF.i18n.dayNames[D + 7],
 				m:    m + 1,
 				mm:   pad(m + 1),
 				mmm:  dF.i18n.monthNames[m],
 				mmmm: dF.i18n.monthNames[m + 12],
 				yy:   String(y).slice(2),
 				yyyy: y,
 				h:    H % 12 || 12,
 				hh:   pad(H % 12 || 12),
 				H:    H,
 				HH:   pad(H),
 				M:    M,
 				MM:   pad(M),
 				s:    s,
 				ss:   pad(s),
 				l:    pad(L, 3),
 				L:    pad(L > 99 ? Math.round(L / 10) : L),
 				t:    H < 12 ? "a"  : "p",
 				tt:   H < 12 ? "am" : "pm",
 				T:    H < 12 ? "A"  : "P",
 				TT:   H < 12 ? "AM" : "PM",
 				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
 				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
 				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
 			};

 		return mask.replace(token, function ($0) {
 			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
 		});
 	};
 }();

 // Some common format strings
 dateFormat.masks = {
 	"default":      "ddd mmm dd yyyy HH:MM:ss",
 	shortDate:      "m/d/yy",
 	mediumDate:     "mmm d, yyyy",
 	longDate:       "mmmm d, yyyy",
 	fullDate:       "dddd, mmmm d, yyyy",
 	shortTime:      "h:MM TT",
 	mediumTime:     "h:MM:ss TT",
 	longTime:       "h:MM:ss TT Z",
 	isoDate:        "yyyy-mm-dd",
 	isoTime:        "HH:MM:ss",
 	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
 	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
 };

 // Internationalization strings
 dateFormat.i18n = {
 	dayNames: [
 		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
 		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
 	],
 	monthNames: [
 		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
 		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
 	]
 };

 // For convenience...
 Date.prototype.format = function (mask, utc) {
 	return dateFormat(this, mask, utc);
 };
                         
                         
function updateBalance(){
	document.getElementById("balance").innerHTML = "<i style=\"font-size:13px;\" class=\"fa fa-spinner fa-spin\"></i><span style=\"font-size:15px;\"> wait... <span>";
	var params = {};
	params["action"] = "balance";
	doAPIRequest(API.METHOD_GET, API.PATH_PAYMENT_APPROVALS, params, 
		function(response) {
			showLoader(false);			
			if(response != null && response.status_code == 200) {
				document.getElementById("balance").innerHTML = "<span style=\"font-size:13px;\">A/C Bal : " + response.data.balance.toMoney() + "</span>";					
			} else {
				document.getElementById("balance").innerHTML = "<i class=\"fa fa-rupee\"></i> <span> Check Balance?</span>";
			}				
		}
	);
	showLoader(false);
}

function getHashParam(){
	return location.hash.replace( /^#/, '' ).split("/");
}

function getParams(){
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

// JQuery Custom function
$(document).on("click", "[data-nav-link]", function(){
	// console.log($(this).data("nav-link"));
	window.location.hash = $(this).data("nav-link");
	hashLocationChanged();
});

function setPaymentCategoryDropdownOption(id) {
	$("#" + id).html(
		'<option value="ALL">ALL</option>'
		+ Config.payment_category.map(opt=>`<option value='${opt}'>${opt}</option>`).join('')
	)
}
