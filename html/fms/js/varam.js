
var TOKEN = null;
var API_SERVER_URL = 'http://localhost:8080';
var EP = {};
var APIHandler = {
	METHOD_GET: 'GET',
	METHOD_POST: 'POST',
	METHOD_DELETE: 'DELETE',
	PATH_HR: "/vengine/fms/hr",
	PATH_LOGIN: "/vengine/user",
	PATH_CMS_LOGIN: "/vengine/cbs/user",
	PATH_APPRAISAL: "/vengine/vw/appraisal",
	PATH_APTITUDE: '/vengine/vw/insiderOnboarding',
	PATH_PROCESS: '/vengine/vw/process',
	PATH_MESSAGE_GROUP: '/vengine/fms/messageGroup',
	PATH_CAR: '/vengine/fms/car',
	PATH_AUDIT: "/vengine/audit",
	PATH_PIPELINED_REPORT: "/vengine/salespipelinedreport",
	PATH_HIGHMARK_XML_DOWNLOAD: "/vengine/cms/highmarkxmldownload",
	PATH_LOAN_SANCTION: "/vengine/cms/loansanctionack",
	PATH_ASSET_FINANCE: "/vengine/cms/assetFinance",
	PATH_PORTFOLIO: "/vengine/cms/portfoliomonitoring",
	PATH_COLLECTION_MEETING: "/vengine/cms/collectionmeeting",
	PATH_BASE64IMAGE: "/vengine/cms/base64",
	user: "/vengine/cms/user",
	branch: "/vengine/cms/branch",
	products: "/vengine/cms/products",
	assetmanagement: "/vengine/cms/assetmanagement",
	downloadmemberdistancereport: "/vengine/cms/memberdistancereport",
	downloadgroupdump: "/vengine/cms/groupdump",
	downloadmemberdump: "/vengine/cms/memberdump",
	highmarkxmldownload: "/vengine/cms/highmarkxmldownload",
	amoigoNotifyType: "/vengine/fms/amigoNotifyType",
	PATH_CREDIT: "/vengine/fms/credit",
	base64Image: "/vengine/cms/base64",
	PATH_BANK_SURVEY: "/vengine/vw/BankSurvey",
	PATH_LC: "/vengine/vw/LC",
	login: "/vengine/cms/user",
	PATH_FRESH_OVERDUES: "/vengine/vw/freshOverdue",
	PATH_AUDIT_GRADE: "/vengine/fms/audit/Grading",
	PATH_AUDIT_WORK_BENCH: "/vengine/vw/AuditWorkBench",
	PATH_VACCOUNTS: "/vengine/fms/vAccountSetup",
	PATH_BAROMETER: "/vengine/fms/Barometer",
	PATH_ROCHART: "/vengine/fms/RoChart",
	assetmanagement: "/vengine/cms/assetmanagement",
	PATH_OTP: '/vengine/tms/otp',
	PATH_VACCOUNTS: "/vengine/tms/vAccount/vAccountSetup",
	PATH_VACCOUNTS_ACCOUNT: '/vengine/tms/vAccounts/accounts',
	PATH_VACCOUNT_TRXNS: '/vengine/tms/vAccount/vAccTrxns',
	PATH_VACCOUNT_ABSTRACT: '/vengine/tms/vAccount/vAccAbstract',
	PATH_VACCOUNT_CEHCKLIST: '/vengine/tms/vaccount/checklist',
	PATH_USER_MOBILE: '/vengine/cms/user',
	PATH_GEOANALYTICS: '/vengine/fms/Geoanalytics',
	PATH_GET_CENTER_DATA: '/vengine/fms/BranchAudit',
	PATH_GET_GRIEVANCES: '/vengine/cms/grievances',
	PATH_MEMBER_DATA: '/vengine/fms/MemberData',
	PATH_PSYCHOMETRIC_DATA: '/vengine/fms/Psychometric',
	cgt: "/vengine/cms/cgt",
	PATH_LOAN_APPROVE: '/vengine/fms/LoanApprove',
	PATH_AEPS_TRXN_REPORT: '/vengine/tms/account/statement',
	PATH_ISSUE_TRACKER: '/vengine/fms/IssueTracker',
	PATH_ADHOC_CBCHECK: '/vengine/fms/AdhocCBcheck',
	PATH_DOCUMENTS_VIEW: '/vengine/fms/DocumentsView',
	PATH_MERGE_LOAN: '/vengine/fms/mergeloan',
	PATH_APPROVALS: '/vengine/fms/approvals',
	PATH_USER_ACTIVITY_TRACKER: '/vengine/fms/UserActivityTracker',
	TRAINING_MODULE: '/vengine/fms/TrainingModule',
	API_DISB_APPROVAL: "/vengine/disbursements/approval",
	API_GET_COLLECTION: "/vengine/cbs/collection",
	API_POST_COLLECTION: "/vengine/tms/collection",
	API_LOAN_VERIFICATION: "/vengine/enrollment/loanapplicationverification",
	API_BBPS: "/vengine/tms/app/bbps",
	API_EURONET_BILL_PAY: "/vengine/tms/app/utility/recharge",
	API_DMT_TRXNS: "/vengine/tms/dmt/trxns",
	PATH_INSURANCE:"/vengine/vw/insurance",
	PATH_DASHBOARD : "/vengine/fms/Dashboard"
}

if (typeof (API) == "undefined") {
	API = APIHandler;
}
// //set headers for all request
// $.ajaxSetup({
// 	cache: false,
// 	async: true,
//     beforeSend: function (xhr){
//        xhr.setRequestHeader("Authorization", localStorage.access_token);
//     },
//     error: function(xhr){},
//     complete: function(xhr, status) {
//     	if(xhr.status == 401) {
//     		window.location.reload();
//     	} else {
//     		var token = xhr.getResponseHeader('refresh_token');
//             if(token && token.length > 0){
//             	localStorage.access_token = token;
//             }    		
//     	}
//     },
//     statusCode: {
//         401: function(xhr) {
// //        	window.location.reload();
//         },
//         403: function(xhr) {
// //          	window.location.reload();
//         },
//         404: function(xhr) { }
//     }
// });

function showPopup(isShow, header, body) {
	var dialog = document.getElementById('my-dialog');
	if (isShow) {
		document.getElementById('dialog-title').innerHTML = header;
		document.getElementById('dialog-content').innerHTML = body;
		dialog.show();
	} else {
		dialog.close();
	}
}

function toggleDialog(isShow, id) {
	var dialog = document.getElementById(id);
	if (isShow) {
		dialog.show();
	} else {
		dialog.close();
	}
}

function navigate(page) {
	showLoader(true);
	var url = page;
	$('#content').load(url);
}

$(document).ready(function () {
	setTimeout(function () { showLoader(false); }, 1500);
});

function calbackDownloadFile(data) {
	window.open(data, '_blank');
	showLoader(false);
}

function showNavMenuItem(isVisible) {
	if (isVisible) {
		$('#navMenuItem').show();
		$('#logout').show();
	} else {
		$('#navMenuItem').hide();
		$('#logout').hide();
	}
}

function showLoader(isVisible) {
	if (isVisible) {
		$('#loading').show();
	} else {
		$('#loading').hide();
	}
}

function logout() {
	location.reload();
}


function sendOTP(callback) {

}

function showMessage() {

}

function showError() {

}

EP.branchNames = function (callback) {
	var params = new Array();
	params.push("option=namelist");
	EP.APIHandler.apiRequest("GET", EP.APIHandler.branch, params,
		function (json) {
			var data = {};
			if (json != null && json.status && json.status_code == 200) {
				data = json.data;
			}
			callback(json.data);
		}
	);
}
EP.branchNames1 = function (callback) {
	var data = {};
	var branchIds = EP.user.branch_id.split(",");
	var branchNames = EP.user.branch_name.split(",");

	//var i=0;
	for (var k in branchIds) {
		data[branchIds[k]] = branchNames[k];
	}
	callback(data);
}

function getMenu(url) {
	$.get(url, function (data) {
		var menu = menuBuilder(JSON.parse(data));
		//$("#user_menu").append(menu);
		$("#user_menu").html(menu);
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
	});
}

function menuBuilder(menuItems, isSubmenu) {
	var linkAttr = function (data) {
		attrs = "";
		if (data) {
			$.each(data, function (key, value) {
				attrs += " " + key + "=\"" + value + "\" ";
			});
		}
		return attrs;
	};
	var menuDomElemment = "";
	$.each(menuItems, function (index, item) {
		menuDomElemment += "<li class=\"dropdown";
		if (isSubmenu && item.sub_menu && item.sub_menu.length > 0) {
			menuDomElemment += " dropdown-submenu\">";
		} else {
			menuDomElemment += "\">";
		}

		if (item.sub_menu) {
			menuDomElemment += "<a " + linkAttr(item.attr) + " class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"" + item.href + "\">" + item.label;
			if (!isSubmenu) {
				menuDomElemment += "<span class=\"caret\"></span>";
			}
			menuDomElemment += "</a>";
			menuDomElemment += "<ul class=\"dropdown-menu\">";
			menuDomElemment += menuBuilder(item.sub_menu, (item.sub_menu && item.sub_menu.length > 0));
			menuDomElemment += "</ul>";
		} else {
			menuDomElemment += "<a " + linkAttr(item.attr) + " href=\"" + item.href + "\">" + item.label + "</a>";
		}
		menuDomElemment += "</li>";
	});
	return menuDomElemment;
}

function navigate(page) {
	showLoader();
	var url = "/fms" + page;
	$('#content_frame').load(url);
}

function getHashParam() {
	var hash = location.hash.replace(/^#/, '');
	return hash;
}

function memberdistancereport() {
	swal({
		title: "Are you sure want to download member distance report ?",
		text: "Your download will take some time Please stay tuned!",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, download it!",
		cancelButtonText: "No, cancel it!",
		closeOnConfirm: false,
		closeOnCancel: false
	},
		function (isConfirm) {
			if (isConfirm) {
				swal("Sucess!", "Thank you for downloading", "success");
				window.open(APIHandler.downloadmemberdistancereport);
			} else {
				swal("Cancelled", "Your Download was cancelled:)", "error");
			}
		});
}

function groupdumpdownload() {
	swal({
		title: "Are you sure want to download group data dump ?",
		text: "Your download will start in a second Please stay tuned!",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, download it!",
		cancelButtonText: "No, cancel it!",
		closeOnConfirm: false,
		closeOnCancel: false
	},
		function (isConfirm) {
			if (isConfirm) {
				swal("Sucess!", "Thank you for downloading", "success");
				window.open(APIHandler.downloadgroupdump);
			} else {
				swal("Cancelled", "Your Download was cancelled:)", "error");
			}
		});
}

function downloadAEPSReport() {
	if (!(window.user.user_type == "ADMIN" || window.user.user_type == "HO" || window.user.user_type == "SH" || window.user.user_type == "RM")) {
		swal({ type: 'error', title: 'Not authorized' });
		return;
	}

	let htmlText = '<div class="pull-right form-inline" >'
		+ '	<div class="input-group input-daterange  datepicker" data-provide="datepicker" data-date-default-date="now" data-date-end-date="now" data-date-autoclose="true" data-date-format="yyyy-mm-dd">'
		+ '	    <div class="input-group-addon">'
		+ '	        <span class="glyphicon glyphicon-calendar"></span>'
		+ '	    </div>'
		+ '	    <input type="text" name="date_from" id="aeps_report_date_from" class="form-control" value="' + new Date().format("yyyy-mm-dd") + '"  >'
		+ '	    <div class="input-group-addon"> to </div>'
		+ '	    <input type="text" name="date_to" id="aeps_report_date_to" class="form-control" value="' + new Date().format("yyyy-mm-dd") + '"  >'
		+ '	</div>'
		+ '</div>';

	swal({
		title: 'Download AEPS Report',
		html: htmlText,
		animation: true,
		showCancelButton: true,
		showLoaderOnConfirm: true,
		allowOutsideClick: false,
		confirmButtonText: 'Download',
		preConfirm: function () {
			return new Promise(function (resolve, reject) {
				let fromDate = $("#aeps_report_date_from").val();
				let toDate = $("#aeps_report_date_to").val();
				resolve({ 'from_date': fromDate, 'to_date': toDate });
			});
		}
	}).then(function (params) {
		let url = API.PATH_AEPS_TRXN_REPORT + "?action=downloadAEPS&fromDate=" + params.from_date + "&toDate=" + params.to_date;
		window.open(url, "_blank");
	}, function (dismiss) { });

}


