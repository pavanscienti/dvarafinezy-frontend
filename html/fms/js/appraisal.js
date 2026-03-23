var empAppraisalData = null;
$(document).ready(function() {
	let selectAppriasalPeroid = $("#appraisal_period");
	selectAppriasalPeroid.empty();
	for(var currentYear = new Date().getFullYear();currentYear > 2016; currentYear--){
		let peroid = (currentYear-1)+ "-" + currentYear;
		selectAppriasalPeroid.append("<option value=\""+ peroid +"\">" + peroid + "</option>")
	}
	var loggedInUser = null;
	if(localStorage.getItem("user") !=null){
		loggedInUser = JSON.parse(localStorage.getItem("user"));
		var tokenExpiry = (loggedInUser["token_expiry"]*1000);
		if(tokenExpiry > ((new Date).getTime())){
			getAppraisalData();		
		}
	}
});

function isBranchEmployee() {
	let branchEmpDdesignations = ["Relationship Officer", "Senior Relationship Officer", "Senior Sales Officer", "Branch Manager", "Senior Branch Manager", "Cluster Manager", "Branch Operation Executive", "Sales Officer","Assistant Branch Manager"];
	let isBranchEmp = branchEmpDdesignations.includes(empAppraisalData.designation);		
	return isBranchEmp;
}


function getAppraisalData() {
	var params={};
	params["option"]="getUser";
	params["emp_id"]=getHashParam();
	params["appraisal_period"] = getAppraisalPeriod();
	doAPIRequestWithLoader(APIHandler.METHOD_GET, APIHandler.PATH_APPRAISAL, params, function(json){
		showLoader(false);
		empAppraisalData = json;	
		if(empAppraisalData){
			$("#content_appraisal").show();
			$("#emp_code").html(empAppraisalData.emp_code);
			$("#emp_name").html(empAppraisalData.emp_name);
			$("#emp_designation").html(empAppraisalData.designation);
			$("#emp_doj").html(empAppraisalData.doj);
			$("#emp_reporting").html(empAppraisalData.reportee_manager_name);
			$("#tbl_info_appraisal_period").html(getAppraisalPeriod());
			ratingsVisibiltyChanged();
			toGetPageName();
			$("#view_msg").text('');
		} else {
			$("#content_appraisal").hide();
			let errMsg = "";
			if(status == 'OPEN'){
				errMsg = "Goals are not set.";
			} else if(status == 'APPROVE_GOALS'){
				errMsg = "Goals are not approved";
			} else if(status == 'SELF_RATING'){
				errMsg = "Self rating is not completed.";
			} else if(status == 'MNGR_RATING'){
				errMsg = "Rporting manager rating is not completed.";
			} else if(status == 'RV_MNGR_RATING'){
				errMsg = "Review manager rating is not completed.";
			} else if(status == 'HR'){
				errMsg = "you have successfully completed the appraisal process(2016-2017).";
			} else {
				errMsg = "Contact varam digital Team!";
			}			
			errMsg = empAppraisalData.emp_name + ' (' + empAppraisalData.emp_code + ')<br>' + errMsg;			
			$("#view_msg").html('<center><b>' + errMsg + '</b></center>');
		}
	});	
}

function toGetPageName(){
	var docdate=empAppraisalData.doc;
	var confCheckDate='31-12-2016';
	var date1 =Date.parse(docdate.split('-')[1]+'-'+docdate.split('-')[0]+'-'+docdate.split('-')[2]);
	var date2=Date.parse(confCheckDate.split('-')[1]+'-'+confCheckDate.split('-')[0]+'-'+confCheckDate.split('-')[2]);
    if(parseInt(date1) <= parseInt(date2))
    {
    	$("#page_name").text("Appraisal");
    }else{
    	$("#page_name").text("Confirmation");
    }

}


function ratingsVisibiltyChanged(){
	let isBranchEmp = isBranchEmployee();
	$("#tbl-appraisal > tbody").text('');
	let noOfKRA = (empAppraisalData && empAppraisalData.appraisal && empAppraisalData.appraisal.rating && empAppraisalData.appraisal.rating.length > 6) ? empAppraisalData.appraisal.rating.length : empAppraisalData.appraisal.rating.length;
	console.log(noOfKRA)
	for(var i=0;i<noOfKRA;i++) {
		$('#tbl-appraisal tbody').append(
				'<tr>'										
				+'	<td align="center">'+ ($('#tbl-appraisal tbody>tr').length + 1) +'</td>'
				+'	<td></td>'
				+'	<td></td>'										
				+'	<td></td>'
				+'	<td></td>'										
				+'	<td></td>'
				+'	<td></td>'												
				+'	<td></td>'
				+'	<td></td>'	
				+'</tr>'
			);
		if(isBranchEmployee() && empAppraisalData.designation !="Branch Operation Executive") {		
			$("#tbl-appraisal th:nth-child(5)").show();
		  	$("#tbl-appraisal td:nth-child(5)").show();
		  	$("#tbl-appraisal th:nth-child(4)").show();
		  	$("#tbl-appraisal td:nth-child(4)").show();
		  	$("#tbl-appraisal th:nth-child(3)").hide();
		  	$("#tbl-appraisal td:nth-child(3)").hide();	  	
		} else {
		  	$("#tbl-appraisal th:nth-child(5)").hide();
		  	$("#tbl-appraisal td:nth-child(5)").hide();
		  	$("#tbl-appraisal th:nth-child(4)").hide();
		  	$("#tbl-appraisal td:nth-child(4)").hide();
		  	$("#tbl-appraisal th:nth-child(3)").show();
		  	$("#tbl-appraisal td:nth-child(3)").show();	
		}
	}	
				
	if(empAppraisalData && empAppraisalData.appraisal) {	
		
		if(empAppraisalData.appraisal.rating){		
			$.each(empAppraisalData.appraisal.rating, function(iRec, oRec){			
				let row = $("#tbl-appraisal > tbody > tr:eq(" + iRec + ")");			
				if(oRec.kra){
					$('td:eq(1)', $(row)).text(oRec.kra);
				}			
				if(oRec.weightage){
					$('td:eq(2)', $(row)).text(oRec.weightage);
				}			
				if(oRec.target){
					$('td:eq(3)', $(row)).text(oRec.target);
				}
				if(oRec.acheivement || oRec.acheivement ==0){
					$('td:eq(4)', $(row)).text(oRec.acheivement);
				}
				if(oRec.self_rating){
					$('td:eq(5)', $(row)).text(oRec.self_rating);
				}
				if(oRec.self_comments){
					$('td:eq(6)', $(row)).text(oRec.self_comments);
				}
				if(oRec.mngr_rating){
					$('td:eq(7)', $(row)).text(oRec.mngr_rating);
				}
				if(oRec.mngr_comments){
					$('td:eq(8)', $(row)).text(oRec.mngr_comments);
				}			
			});
		}
				
		
		$("#emp_achievement").val(empAppraisalData.appraisal.achievement);				
		$("#mngr_rating").val(empAppraisalData.appraisal.mngr_rating);
		$("#mngr_recommending_promotion").prop('checked', empAppraisalData.appraisal.mngr_recommending_promotion);
		
		$("#mngr_learning_area").val(empAppraisalData.appraisal.mngr_learning_area);
		$("#mngr_training_need").val(empAppraisalData.appraisal.mngr_training_need);
		$("#rv_mngr_rating").val(empAppraisalData.appraisal.rv_mngr_rating);
		$("#rv_mngr_recommending_promotion").prop('checked', empAppraisalData.appraisal.rv_mngr_recommending_promotion);
		$("#rv_mngr_comments").val(empAppraisalData.appraisal.rv_mngr_comments);
		$("#rv_mngr_learning_area").val(empAppraisalData.appraisal.rv_mngr_learning_area);
		$("#rv_mngr_training_need").val(empAppraisalData.appraisal.rv_mngr_training_need);
		if(empAppraisalData.appraisal.aspiration){
			$("#emp_aspiration").val(empAppraisalData.appraisal.aspiration);
		}
		
		if(isBranchEmp && empAppraisalData.appraisal.rep_mngr_score){
			var repMngr={};
				repMngr =  empAppraisalData.appraisal.rep_mngr_score;
				$("#repo_mngr_punctuality").val(repMngr.repo_mngr_punctuality);
				$("#repo_mngr_cust_relationship").val(repMngr.repo_mngr_cust_relationship);
				$("#repo_mngr_team_spirit").val(repMngr.repo_mngr_team_spirit);
				$("#repo_mngr_know_additional_products").val(repMngr.repo_mngr_know_additional_products);
				$("#repo_mngr_rules_regulation").val(repMngr.repo_mngr_rules_regulation);
				$("#repo_mngr_anything_to_the_table").val(repMngr.repo_mngr_anything_to_the_table);
				$("#repo_mngr_integrity").val(repMngr.repo_mngr_integrity);
				$("#rep_mngr_score_total").val(repMngr.total_repo_mngr_score);
		}else{
			$("#mngr_comments").val(empAppraisalData.appraisal.mngr_comments);
			$("#repo_mngr_punctuality").val('');
			$("#repo_mngr_cust_relationship").val('');
			$("#repo_mngr_team_spirit").val('');
			$("#repo_mngr_know_additional_products").val('');
			$("#repo_mngr_rules_regulation").val('');
			$("#repo_mngr_anything_to_the_table").val('');
			$("#repo_mngr_integrity").val('');
			$("#rep_mngr_score_total").val('');
		}
	} 
	
	if(isBranchEmp){
		$("#comments_id").hide();
		$("#reporting_manager_score").show();
	//	$("#aspiration").show();
	}else{
		$("#reporting_manager_score").hide();
		$("#comments_id").show();
		//$("#aspiration").hide();
	}
		
}

function printData(){
	window.print();
}

function getAppraisalPeriod(){
	return appraisalPeriod = $("#appraisal_period").val();
}


