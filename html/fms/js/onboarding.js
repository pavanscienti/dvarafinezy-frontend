var url = window.location.search;
var regex = /[?&]([^=#]+)=([^&#]*)/g;
var parameters = {};
var match;
var data={};
var status = "";
while(match = regex.exec(url)) {
	parameters[match[1]] = match[2];
}
$(document).ready(function() {
	var loggedInUser = null;
	if(localStorage.getItem("user") !=null){
		loggedInUser = JSON.parse(localStorage.getItem("user"));
		var tokenExpiry = (loggedInUser["token_expiry"]*1000);
		if(tokenExpiry > ((new Date).getTime())){
			getOnboardingData();		
		}
	}
	
	
});



function getOnboardingData() {
	var mobileNo = parameters["mobile_no"];
	var dob = parameters["dob"];
	var params={};
  	params["option"]=parameters["option"];
  	params["mobile_no"]=mobileNo;
  	params["dob"]=dob;
  	console.log(params);
  	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_APTITUDE, params, function(json){
		showLoader(false);
		if(json != null){
			data = json["data"];
				console.log(json);
				$("#name").val(data.name);
				$("#father_name").val(data.father_name);
				$("#mobile_no").val(data.mobile_no);
				$("#email_id").val(data.mail_id);
				$("#dob").val(data.dob);
				$("#age").val(data.age);
				$("#gender").val(data.gender);
				$("#education").val(data.education);
				$("#maritial_status").val(data.maritial_status);
				$("#spouse_name").val(data.spouse_name);
				$("#two_wheeler").val(data.two_wheeler);
				$("#experience").val(data.experience);
				$("#experience_total").val(data.experience_total);
				$("#position").val(data.applying_position); 
				$("#highest_level_education").val(data.education_level);
				if(data.current_company_obj){
					var companyObj = data["current_company_obj"];
					$("#current_company_name").val(companyObj.company_name);
					$("#current_working_location").val(companyObj.working_location);
					$("#current_working_start_date").val(companyObj.from_date);
					$("#current_working_end_date").val(companyObj.end_date);
				}
				
				if(data.current_salary_obj){
					var salaryObj = data["current_salary_obj"];
					$("#current_annual_ctc").val(salaryObj.annual_ctc);
					$("#current_annual_pay_incentive").val(salaryObj.variable_pay_incentive);
					$("#current_monthly_take_home").val(salaryObj.take_home);
					$("#current_travel_allowance").val(salaryObj.travel_allowance);
					$("#current_other_allowance_payment").val(salaryObj.other_payment);
					$("#current_notice_period").val(salaryObj.notice_period);
				}
				
				$("#expected_salary").val(data.expected_salary);
				$("#expected_designation").val(data.expected_designation);
				$("#preferred_location").val(data.preferred_location);
				$("#referral_source").val(data.referral_source);
				$("#referred_by").val(data.refered_by);
				var address = data["address"];
				if(address.permanent_address){
					var permanentAddress = address.permanent_address;
					$("#permanent_address_doorno").val(permanentAddress.door_no);
					$("#permanent_address_street").val(permanentAddress.street);
					$("#permanent_address_town_village").val(permanentAddress.town_village);
					$("#permanent_address_city").val(permanentAddress.city);
					$("#permanent_address_state").val(permanentAddress.state);
					$("#permanent_address_pincode").val(permanentAddress.pincode);
				}
				if(address.current_address){
					var currentAddress = address.current_address;	
					$("#current_address_doorno").val(currentAddress.door_no);
					$("#current_address_street").val(currentAddress.street);
					$("#current_address_town_village").val(currentAddress.town_village);
					$("#current_address_city").val(currentAddress.city);
					$("#current_address_state").val(currentAddress.state);
					$("#current_address_pincode").val(currentAddress.pincode);
				}
				if(data.id_proofs){
					var idProofs = data.id_proofs;
					$("#pancard").val(idProofs.pancard);
					$("#aadhaar_no").val(idProofs.aadhaar);
					$("#voter_id").val(idProofs.voter_id);
					$("#driving_license").val(idProofs.driving_license);
				}
				var mobileObj = data["mobile_obj"];
				$("#alternative_mobile_number").val(mobileObj.alternative_mobile_number);
				var referenceObj = data["reference"];
				$("#ref_1_name").val(referenceObj.ref_1_name);
				$("#ref_1_company").val(referenceObj.ref_1_company);
				$("#ref_1_designation").val(referenceObj.ref_1_designation);
				$("#ref_1_mail_id").val(referenceObj.ref_1_mail_id);
				$("#ref_1_landline_number").val(referenceObj.ref_1_landline_no);
				$("#ref_1_mobile").val(referenceObj.ref_1_mobile);
				$("#ref_2_name").val(referenceObj.ref_2_name);
				$("#ref_2_company").val(referenceObj.ref_2_company);
				$("#ref_2_designation").val(referenceObj.ref_2_designation);
				$("#ref_2_mail_id").val(referenceObj.ref_2_mail_id);
				$("#ref_2_landline_number").val(referenceObj.ref_2_landline_no);
				$("#ref_2_mobile").val(referenceObj.ref_2_mobile);
				$("#about_us").val(data.about_us);
				if(data.rep_manager_obj){
					var managerComments = data["rep_manager_obj"];
					$("#repo_manager_comment").val(managerComments.reporting_manager_comments);	
					$("#reviewing_manager_comment").val(managerComments.reviewing_manager_comments);
				}
				if(data.hr_object){
					var hrManagerComments = data["hr_object"];
					$("#hr_manager_comment").val(hrManagerComments.hr_manager_comments);
					
				}
				status  = data["status"];
				if(status=="HR"){
					$("#submit_manager").show();
					$("#decline_manager").show();
				}else{
					$("#submit_manager").hide();
					$("#decline_manager").hide();
				}
			}else{
				swal("Error", 'You are not access', "error");
				$("#submit_manager").hide();
			}
	}
);
  	
	
}


function save(){
	if(validateData()){
		var params={};
		var canEmailId = $("#email_id").val();
		var canMobNo = $("#mobile_no").val();
		if(status=="HR"){
			params["hr_manager_comment"]=$("#hr_manager_comment").val();
		}
		params["candidate_status"]="SELECTED";
		params["status"]=status;
		params["email_id"]=canEmailId;
		params["mobile_no"]=canMobNo;
		params["option"]="managerReview";
		doAPIRequestWithLoader(API.METHOD_POST, API.PATH_APTITUDE, params, function(json){
			showLoader(false);
			console.log(json);
			if(json != null && json.status_txt && json.status_code == 200){
				swal("Success", json.status_txt, "success");
				$("#submit_manager").hide();
				$("#decline_manager").hide();
			} else {
				swal("Error", json.status_txt, "error");
			}
		});	
		
	}
	
}


function decline(){
	
	if(validateData()){
		var params={};
		var canEmailId = $("#email_id").val();
		var canMobNo = $("#mobile_no").val();
		if(status=="HR"){
			params["hr_manager_comment"]=$("#hr_manager_comment").val();
		}
		
		params["candidate_status"]="REJECTED";
		params["status"]=status;
		params["email_id"]=canEmailId;
		params["mobile_no"]=canMobNo;
		params["option"]="managerReview";
		doAPIRequestWithLoader(API.METHOD_POST, API.PATH_APTITUDE, params, function(json){
			showLoader(false);
			console.log(json);
			if(json != null && json.status_txt && json.status_code == 200){
				swal("Success", json.status_txt, "success");
				$("#submit_manager").hide();
				$("#decline_manager").hide();
			} else {
				swal("Error", json.status_txt, "error");
			}
		});	
		
	}
	
	
	
}



function validateData(){
	var isValid = true;
	
	if(status=="HR"){
		var hr_manager_comment = $("#hr_manager_comment").val();
		
		if(!hr_manager_comment || !hr_manager_comment.trim()){
			swal("Error", "Enter the HR Manager Comment!", "error");
			isValid =false;
			return false;
		}
		
	}
	
	return isValid;
}


function printData(){
	window.print();
}


