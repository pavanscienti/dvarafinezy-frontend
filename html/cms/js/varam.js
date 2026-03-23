function navigate(page){
	EP.API.showLoading();
	var url = EP.APIHandler.SERVER_URL + "/cms" + page;    	
	$('#content_frame').load(url);
}

function navigateFms(page){
	EP.API.showLoading();
	var url = EP.APIHandler.SERVER_URL + "/fms" + page;    	
	$('#content_frame').load(url);
}

function getMenu(url) {
	$.get( url, function( data ) {
		var menu = menuBuilder(JSON.parse(data));
		//$("#user_menu").append(menu);
		$("#user_menu").html(menu);
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault(); 
			event.stopPropagation(); 
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
	});
}

function menuBuilder(menuItems, isSubmenu){
	var linkAttr = function(data){
   		attrs = "";
   		if(data){
   			$.each(data, function(key, value){ 
   				attrs += " " + key + "=\"" + value + "\" ";
   			});
   		}
   		return attrs;
   	};
   	var menuDomElemment = "";
   	$.each(menuItems, function(index, item){  
   		menuDomElemment += "<li class=\"dropdown";
   		if(isSubmenu && item.sub_menu && item.sub_menu.length > 0) {
   			menuDomElemment += " dropdown-submenu\">";	
   		} else {
   			menuDomElemment += "\">";
   		}
   		
		if(item.sub_menu ) {
			menuDomElemment += "<a " + linkAttr(item.attr) + " class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"" + item.href + "\">"+ item.label;
			if(!isSubmenu) {
				menuDomElemment +="<span class=\"caret\"></span></a>";	
			}			
			menuDomElemment +="<ul class=\"dropdown-menu\">";
			menuDomElemment += menuBuilder(item.sub_menu, (item.sub_menu && item.sub_menu.length > 0));
			menuDomElemment +="</ul>";
	    } else {
	    	menuDomElemment += "<a " + linkAttr(item.attr) + " href=\"" + item.href + "\">"+ item.label +"</a>";
	    }
		menuDomElemment += "</li>";
	});	   	
   return menuDomElemment;
}

function showLoader(isVisible) {
	if(isVisible) {
		EP.API.showLoading();
	} else {
		EP.API.hideLoading();
	}	
}

function memberdistancereport(){
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
		function(isConfirm){
		  if (isConfirm) {
		    swal("Sucess!", "Thank you for downloading", "success");
		    window.open(EP.APIHandler.downloadmemberdistancereport);
		  } else {
		    swal("Cancelled", "Your Download was cancelled:)", "error");
		  }
		});
}

function groupdumpdownload(){
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
		function(isConfirm){
		  if (isConfirm) {
		    swal("Sucess!", "Thank you for downloading", "success");
		    window.open(EP.APIHandler.downloadgroupdump);
		  } else {
		    swal("Cancelled", "Your Download was cancelled:)", "error");
		  }
		});
}

EP.branchNames = function (callback){
	var params = new Array();
	params.push("option=namelist");
	EP.APIHandler.apiRequest("GET", EP.APIHandler.branch, params,
			function(json){	
				var data = {};
				if(json != null && json.status && json.status_code == 200){
					data = json.data;
				}
				callback(json.data);
			}
	);	
}
EP.branchNames1 = function (callback){
	var data = {};
	var branchIds = EP.user.branch_id.split(",");
	var branchNames = EP.user.branch_name.split(",");
	
	//var i=0;
	for(var k in branchIds){
		data[branchIds[k]] = branchNames[k];
	}
	callback(data);		
}

function capitalizeWord(s){
	if(s) {
		return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );	
	}
	return "";
};

function downloadVaramLoanForm(){	
	let loanAccNo = $("#varam_loan_account_no").val();
	if(!loanAccNo || loanAccNo.length < 5) {
		swal({type: 'warning', 'title' : '', text : 'Loan account no required.'});
	} else {
		let formSelected = $("#loan_application_forms").val();
		if(formSelected === "hdfc_dogh_form") {
			window.open(EP.APIHandler.formDownloads + "?option=downLoadHdfcDOGHForm&loan_account_no="+loanAccNo);
		} else {
			let jsonForm = {"app_form" : false, "manadate"  : false, "dpn" : false, "sanction_letter" : false};
			if("JLG_APPLICATION" == formSelected) {
				jsonForm.app_form = true;	
			} else if("ADDITIONAL_LOAN" == formSelected) {
				jsonForm.app_form = true;
			} else if("MANDATE" == formSelected) {
				jsonForm.manadate = true;
			} else if("DPN" == formSelected) {
				jsonForm.dpn = true;
			} else if("SANCTION_LETTER" == formSelected) {
				jsonForm.sanction_letter = true;
			} else {
				jsonForm = {"app_form" : true, "manadate"  : true, "dpn" : true, "sanction_letter" : true}
			}		
			let url = EP.APIHandler.DOWNLOAD_VARAM_LOAN_FORM + "?account_no=" + loanAccNo + "&language=" + $("#varam_loan_application_language").val();
			url += "&forms=" + JSON.stringify(jsonForm);
			window.open(url, "_blank");
		}
	}
}

function getHashParamArray(){
	return location.hash.replace( /^#/, '' ).split("/");
}

function getHashParamString(){
	return location.hash.replace( /^#/, '' );
}
