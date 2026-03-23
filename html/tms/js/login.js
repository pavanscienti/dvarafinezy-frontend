/**
 * 
 */


function doLogin(){	
	alert();
	showLoader(true);
	var userName = $('#loginContainer input[name=username]');
	var password = $('#loginContainer input[name=password]');
	var error = $('#login-error');	
	if(userName.val() == null || userName.val() == ''){		
		error.html("Invalid User Name.");
		error.show();
		showLoader(false);
	} else if( password.val() != null && password.val() == '' ){
		error.html("Invalid Password.");
		error.show();	
		showLoader(false);
	} else {
		error.hide();	
		var params = {'option' : 'assistLogin', 'username' : userName.val(), 'password' : password.val()};
		doAPIRequest(APIHandler.METHOD_POST, APIHandler.PATH_LOGIN, params, 
			function(response){
				showLoader(false);
				if(response != null){
					if(response.status_code == 200){						
						TOKEN = response.data.token;
						localStorage.emp_code=response.data.emp_code;
						localStorage.emp_name=response.data.emp_name;
						localStorage.office_name = response.data.office_name;
						showNavMenuItem(true);
						navigate('/tms/paymentsapproval.html');
					} else {
						var errorMsg = '<ul>'+ getArrayAsHTMLList(response.error[position]) + '</ul>';
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
