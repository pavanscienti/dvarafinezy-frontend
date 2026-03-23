if(typeof(EP) == "undefined"){
  EP = {};
}
if(typeof(EP.API) == "undefined"){
 EP.API = {
		 getbranches:function(subsidiary){
			 var parameters = new Array();
			 EP.APIHandler.apiCall(EP.APIHandler.getbranches,parameters,false,null,branchesCallBack,"",true);
		 },getgroupsinbranch:function(branchid){
			 var branchid	=	branchid;
			 var parameters = new Array();
			 parameters.push("branchid="+branchid);
			 EP.APIHandler.apiCall(EP.APIHandler.getgroupsinbranch,parameters,false,null,groupsCallBack,"",true);
		 },getmembersinbranch:function(branchid,groupid) {
            var parameters = new Array();
            parameters.push("branchid="+branchid);
			parameters.push("groupid="+groupid);
			EP.APIHandler.apiCall(EP.APIHandler.getmembersinbranch,parameters,false,null,EP.MASTER.getmembers,"",true);
		 },gethmmember:function(branchid,groupid) {
	            var parameters = new Array();
	            parameters.push("branchid="+branchid);
				parameters.push("groupid="+groupid);
				EP.APIHandler.apiCall(EP.APIHandler.gethmmember,parameters,false,null,EP.MASTER.gethmmember,"",true);
		 },getEmployee:function(){
			 var parameters = new Array();
			 EP.APIHandler.apiGetCall(EP.APIHandler.getEmployee,parameters,EP.MASTER.getEmployee,"");
			 
	     },getHighMark:function(memberIDs){
			 var parameters = new Array();
			 parameters.push("member_ids="+memberIDs.join());
			 EP.APIHandler.apiGetCall(EP.APIHandler.getHighMark,parameters,EP.MASTER.getHighMark,"");			 
	     
	     },getsamsung:function(callBack){
			 var parameters = new Array();
			 EP.APIHandler.apiGetCall(EP.APIHandler.getsamsung,parameters,callBack,"");	
	     },user:function(callBack){
			 var parameters = new Array();
			 EP.APIHandler.apiRequest("GET",EP.APIHandler.user,parameters,callBack);	
	     },showLoading:function() {
	    	 $("#loading").show();
	         $("#loader_1").addClass("overlay");
	         $("#loader_2").addClass("loading-img");
		 },hideLoading:function() {
			 $("#loading").hide();
	         $("#loader_1").removeClass("overlay");
	         $("#loader_2").removeClass("loading-img");
		 },encode:function(str){
        	 str=str.replace('&','and');
        	 str=str.replace('&','and');
        	 str=str.replace('&','and');
        	 str=str.replace('&','and');
        	 str=str.replace('&','and');
        	 str= str.trim();
        	 return str;
         }
 	}
 }