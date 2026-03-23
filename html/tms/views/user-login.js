/**
 * 
 */


function doLogin(){	
	showLoader(true);
	var userName = $('#loginContainer input[name=username]');
	var password = $('#loginContainer input[name=password]');
	var error = $('#login-error');	
	if(userName.val() == null || userName.val() == ''){		
		error.html("Invalid User Name");
		error.show();
		showLoader(false);
	} else if( password.val() != null && password.val() == '' ){
		error.html("Invalid Password");
		error.show();	
		showLoader(false);
	} else {
		error.hide();	
		var params = {'option' : 'assistLogin', 'username' : userName.val(), 'password' : password.val()};
		doAPIRequest(API.METHOD_POST, API.PATH_LOGIN, params, 
			function(response){
				console.log('resp==>',response)
				showLoader(false);
				if(response != null){
					if(response.status_code == 200){
						localStorage.token = response.data.token;
						localStorage.linkNavMenu = response.data.nav;						
						localStorage.emp_code=response.data.emp_code;
						localStorage.emp_name=response.data.emp_name;
						localStorage.user_email=response.data.user_email;						
						localStorage.user_name=response.data.user_name;
						localStorage.user_type=response.data.user_type;						
						localStorage.user_id=response.data.user_id;						
						localStorage.branch_id=response.data.branch_id;
						localStorage.branch_name=response.data.branch_name;
						localStorage.user_group=response.data.group;
						localStorage.office_name = response.data.office_name;
						// TOKEN = response.data.token;
						onLoginSuccess();
					} else if(response.status_code == 400 && response.error=='User already logged in') {
						$("#forceLoginModal").modal('show');
					}else {
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
	return false;
}

$(document).ready(function(){	
	if(localStorage.token){
		showLoader(false);
		var params = {'option' : 'validateToken'};
		doAPIRequest(API.METHOD_POST, API.PATH_LOGIN, params, 
			function(res){
				if(res != null && res.status_code == 200 && res.data){
					onLoginSuccess();					
				} else {
					localStorage.clear();
					showLoader(false);
					showNavMenuItem(false);
				}
			}
		);
	} else {
		localStorage.clear();
		showLoader(false);
		showNavMenuItem(false);
	}
});
