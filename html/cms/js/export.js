if(typeof(EP) == "undefined"){
  EP = {};
}
if(typeof(EP.EXPORT) == "undefined"){
 EP.EXPORT = { 
		 downloadSearchMembers:function(parameters){
			 var parameter = EP.APIHandler.getParameters(parameters);
			 $('#download_div_container').html("");
	      		var url= EP.APIHandler.getSearchMembers+"?ctype=csv"+parameter;
	 			var htm ="<iframe src=\"" + url +"\" id=\"download_frame\"  width=\"1\" height=\"1\"></iframe>";//
	            document.getElementById('download_div_container').innerHTML = htm; 
	            $('#list_members_spinner').hide();
		 } 
 }
}