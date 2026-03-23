if(typeof(EP) == "undefined"){
  EP = {};
}
if(typeof(EP.APIHandler) == "undefined"){
	EP.APIHandler = {	
		 METHOD_GET : 'GET',
		 METHOD_POST : 'POST',
		 METHOD_DELETE : 'DELETE',
		 getbranches:"/vengine/getbranches",
		 getgroupsinbranch:"/vengine/getgroupsinbranch",
		 getmembersinbranch:"/vengine/getmembersinbranch",
		 getEmployee:"/vengine/employee",
		 gethmmember:"/vengine/getmembersinbranch",
		 getHighMark:"/vengine/gethighmark",
		 getsamsung:"/vengine/getsamsung",
		 login:"/vengine/cms/user",
		 user:"/vengine/cms/user",
		 getvfscore:"/vengine/getvfscore",
		 getvdecision:"/vengine/getvdecision",
		 auditreport:"/vengine/audit",
		 groupformation:"/vengine/cms/groupformation",
		 cgt:"/vengine/cms/cgt",
		 grt:"/vengine/cms/grt",
		 applied:"/vengine/cms/applied",
		 cancelled:"/vengine/cms/cancelled",
		 auditsummary:"/vengine/auditreport",
		 televerify:"/vengine/televerify",
		 otp:"/vengine/sms",
		 tvr:"/vengine/cms/tvr",
		 base64Image:"/vengine/cms/base64",
		 collection:"/vengine/collection",
		 luc:"/vengine/luc",
		 pipelinedreport:"/vengine/salespipelinedreport",
		 downloadreport:"/vengine/cms/report",
		 downloadRetentionMember:"/vengine/cms/memberRetention",
		 downloadgroupdump:"/vengine/cms/groupdump",
		 downloadmemberdump:"/vengine/cms/memberdump",
		 downloadmemberdistancereport:"/vengine/cms/memberdistancereport",
		 collectiondetail:"/vengine/cms/collectionmeeting",	
		 grievances:"/vengine/cms/grievances",
		 branch : "/vengine/cms/branch",
		 highmarkxmldownload:"/vengine/cms/highmarkxmldownload",
		 ifscvalidator:"/vengine/cms/ifsccodevalidator",
		 cmslogin:"/vengine/cbs/user",
		 assetmanagement:"/vengine/cms/assetmanagement",
		 assettracker:"/vengine/assettracker",
		 portfolio:"/vengine/cms/portfoliomonitoring",
		 sanctionack:"/vengine/cms/loansanctionack",
		 offlinepipelinemgmt:"/vengine/cms/offlinepipelinemgmt",
		 leads:"/vengine/cms/leads",
		 products:"/vengine/cms/products",
		 assetFinance:"/vengine/cms/assetFinance",
		 hr:"/vengine/fms/hr",
		 taskmgmt:"/vengine/notificationTaskMgmt",
		 formDownloads:"/vengine/cms/applicationforms",
		 PATH_MESSAGE_GROUP:"/vengine/fms/messageGroup",
		 PATH_ADMIN_UPDATE:"/vengine/cms/adminUpdate",
		 PATH_LC:"/vengine/vw/LC",
		 PATH_ADDITIONAL_LOANS:"/vengine/cms/additionalLoans",
		 PATH_LOAN_AWAITING_SANCTION:"/vengine/cms/loan/awaitingSanction",
		 PATH_LOAN_SANCTIONED:"/vengine/cms/loan/sanctioned",
		 PATH_INDIVIDUAL_LOANS: "/vengine/cms/individualLoans",
		 DOWNLOAD_VARAM_LOAN_FORM: "/vengine/cms/downlaods/applicationforms",
		 DOWNLOAD_ESAF_LOAN_FORM: "/vengine/cms/downlaods/applicationforms/esaf",
		 PATH_CREDIT:"/vengine/fms/credit",
		 API_LOAN_VERIFICATION : "/vengine/enrollment/loanapplicationverification",
		 //SERVER_URL:"http://localhost:8090",
		 //SERVER_URL:"http://192.168.1.20:8090",
		 //SERVER_URL:"http://digital.varam.org",
		 SERVER_URL:"",
		 getParameters:function(parameters){
				var parameter = "";
				var escapedParams = "";
				if(parameters != null && parameters.length > 0){
					for(var i=0;i<parameters.length;i++){
						var paramValueArray = new Array();
						paramValueArray = parameters[i].split("=");
						escapedParams = paramValueArray[1];
						parameter += "&"+paramValueArray[0]+"="+escapedParams;
						escapedParams = "";
					}
				}
				return parameter;
			},apiCall:function(mode,parameters,cached,cacheTtl,callback,changePageName,noSpinner){
				var url = EP.APIHandler.SERVER_URL;
				url = url+mode;
				//alert(url);
				 var parameter = EP.APIHandler.getParameters(parameters);
				//alert(parameter);
				 var jqxhr = $.ajax({
					  url: url,
					  type: "POST",
					  data:encodeURI(parameter),
					  //timeout:50000,
					  cached:false,
					  success: function(response){						  
				    	 //alert("S");
						 //console.log("s");
						  var stringJson = JSON.stringify(response);
						  stringJson = EP.APIHandler.customUnEscape(stringJson);
						  response = EP.APIHandler.htmlDecode(stringJson);
						  response = JSON.parse(response);
						  eval(callback(response,changePageName));
					  },error:function(data){
						  //alert("E");
						  //console.log("e");
						  eval(callback(null,changePageName));
					  }
				 });
			},
	        apiGetCall: function(mode, parameters, cached, cacheTtl, callback, changePageName) {
	        	
	            var url = EP.APIHandler.SERVER_URL;
	                url = url+mode;
	            var parameter = EP.APIHandler.getParameters(parameters);
	            var jqxhr = $.ajax({
	                url: url,
	                type: "GET",
	                //timeout: 60000,
	                data: encodeURI(parameter),
	                cached: false,
	                success: function(response) {	
	                	console.log("Response : " + JSON.stringify(response));
	                	//var stringJson = JSON.stringify(response);
	                    //stringJson = EP.UTIL.customUnEscape(stringJson);
	                    //response = EP.UTIL.htmlDecode(stringJson);
	                    response = JSON.parse(response);
	                    eval(callback(response,changePageName));
	                },
	                error: function(data) {
	                	eval(callback(null,changePageName));
	                }
	            });
	        },
	        apiGetCall: function(mode, parameters, callback) {
	        	
	            var url = EP.APIHandler.SERVER_URL;
	                url = url+mode;
	            var parameter = EP.APIHandler.getParameters(parameters);
	            var jqxhr = $.ajax({
	                url: url,
	                type: "GET",
	                //timeout: 60000,
	                data: encodeURI(parameter),
	                cached: false,
	                success: function(response) {	                	
	                    eval(callback(response));
	                },
	                error: function(data) {
	                	eval(callback(null));
	                }
	            });
	        },
	        apiRequest: function(method, mode, parameters, callback) {
	        	
	            var url = EP.APIHandler.SERVER_URL;
	                url = url+mode;
	            var parameter = EP.APIHandler.getParameters(parameters);
	            var jqxhr = $.ajax({
	                url: url,
	                type: method,
	                timeout: 60000,
	                data: encodeURI(parameter),
	                cached: false,
	                success: function(response) {	                	
	                    eval(callback(response));
	                },
	                error: function(data) {
	                	eval(callback(null));
	                }
	            });
	        },
	        customUnEscape:function(str){
	        	 //str=str.replace(/%5C+/g,"\\");
	        	 str=str.replace(/(&quot;)/gm,"\\\"");
	        	 return str;
	        },
	        htmlDecode:function(value){
				  return $('<div/>').html(value).text();
	 		}
 	}
}
if(typeof(APIHandler) == "undefined"){
	APIHandler = EP.APIHandler;
}