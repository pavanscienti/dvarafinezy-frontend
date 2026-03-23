/**
 * 
 */


function showUpdatePasswordDialog() {
	document.getElementById("password-update-dialog").show();
	$('#passwordUpdateForm')[0].reset();
	$('#passwordUpdateForm input[name=option]').val('update');
	$('#passwordUpdateForm input[name=otp_auth_id]').val('');
	$('#update-password-view').show();
	$('#update-password-otp').hide();
	$('#update-password-btn').show();
	$('#update-password-error').hide();
	$('#update-password-success').hide();
	return false;
	
}

function generateUpdatePasswordOTP() {
	var oldPassword = $('#passwordUpdateForm input[name=old_password]').val();
	var newPassword = $('#passwordUpdateForm input[name=new_passsword]').val();
	var confirmPassword = $('#passwordUpdateForm input[name=confirm_password]').val();
	var otpAuthId = $('#passwordUpdateForm input[name=otp_auth_id]').val();
	var otpAuthPin = $('#passwordUpdateForm input[name=otp_auth_pin]').val();
	
	var error = $('#update-password-error');
	var success = $('#update-password-success');
	
	error.hide();
	success.hide();
	
	if(otpAuthId.length == 0) {		
		if(oldPassword == null || oldPassword.length < 2) {
			error.html("<li>Old password required!</li>").show();
		} else if(newPassword == null || newPassword.length < 5) {
			error.html("<li>new password required!</li>").show();
		} else if(confirmPassword == null || confirmPassword.length < 5) {
			error.html("<li>Confirm password required!</li>").show();
		} else if(newPassword.localeCompare(confirmPassword) != 0) {
			error.html("<li>New and confirm password required!</li>").show();
		} else if(oldPassword.localeCompare(confirmPassword) == 0) {
			error.html("<li>Current and new password should not be same</li>").show();
		} else {
		
			$('#update-password-view').hide();
			$('#update-password-otp').show();
						
			var params = {};
			params['action'] = 'generate';
			doAPIRequestWithLoader(API.METHOD_POST, API.PATH_OTP, params, function (json){
				showLoader(false);		
				if(json != null && json.status_code == 200 && json.data){
					$('#passwordUpdateForm input[name=otp_auth_id]').val(json.data.auth_id);
				} else {
					$('#error').html("<li>Failed to generate OTP!... Try after some time...</li>").show();			
				}
			});	
		}
		
	} else if(otpAuthPin != null && otpAuthPin.length >= 6 && otpAuthPin.length <=8){
		updatePassword();
	} else {
		error.html("<li>Valid otp pin!</li>").show();
	}		
}


function updatePassword(){
	showLoader(true);
	var error = $('#update-password-error');
	var success = $('#update-password-success');
	error.hide();
	success.hide();
	$('#update-password-btn').hide();
	$('#update-password-otp').hide();
	var params = $('#passwordUpdateForm').serializeArray();	
	doAPIRequest(API.METHOD_POST, API.PATH_LOGIN, params, 
		function(response) {
			showLoader(false);
			if(response != null) {
				if(response.status_code == 200) {						
					success.html("<li>" + response.data + "</li>").show();					
				} else {
					var errorMsg = '<ul>';					
					for(var position in response.error){
						errorMsg += "<li>" + response.error[position] + "</li>"; 
					}
					error.html(errorMsg);
					error.show();
				}
			} else {
				error.html("can't communicate server");
				error.show();
			}	
		}
	);	
}