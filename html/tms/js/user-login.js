/**
 * Login Handling Script
 */

// ---------------------- Rate Limiting ----------------------
var _loginAttempts = 0;
var _loginBlockedUntil = 0;
var MAX_LOGIN_ATTEMPTS = 5;
var LOGIN_LOCKOUT_MS = 30000; // 30 seconds

function isLoginBlocked() {
	if (_loginBlockedUntil > Date.now()) {
		var remaining = Math.ceil((_loginBlockedUntil - Date.now()) / 1000);
		$('#login-error').html("Too many failed attempts. Please wait " + remaining + " seconds.").show();
		showLoader(false);
		return true;
	}
	return false;
}

function recordLoginFailure() {
	_loginAttempts++;
	if (_loginAttempts >= MAX_LOGIN_ATTEMPTS) {
		_loginBlockedUntil = Date.now() + LOGIN_LOCKOUT_MS;
		_loginAttempts = 0;
	}
}

function resetLoginAttempts() {
	_loginAttempts = 0;
	_loginBlockedUntil = 0;
}

// ---------------------- Normal Login ----------------------
function doLogin() {
	console.log("Function called ..... ");

	// if (isLoginBlocked()) return false;

	showLoader(true);
	var userName = $('#loginContainer input[name=username]');
	var password = $('#loginContainer input[name=password]');
	var error = $('#login-error');

	if (!userName.val()) {
		error.html("Invalid User Name").show();
		showLoader(false);
		return false;
	}

	if (!password.val()) {
		error.html("Invalid Password").show();
		showLoader(false);
		return false;
	}

	error.hide();

	var params = {
		'option': 'assistLogin',
		'username': userName.val(),
		'password': encryptPassword(password.val())
	};

	doAPIRequest(API.METHOD_POST, API.PATH_LOGIN, params, function (response) {
		showLoader(false);

		console.log("API response ", response);
		if (response != null) {
			if (response.status_code == 200) {
				// resetLoginAttempts();
				saveUserData(response.data);
				onLoginSuccess();
			} else if (response.status_code == 429) {
				error.html(response.error || "Too many login attempts").show();
			} else {
				// recordLoginFailure();
				showErrorList(response.error);
			}
		} else {
			// recordLoginFailure();
			error.html("Can't communicate with server").show();
		}
	});

	return false;
}

// ---------------------- Google SSO Login ----------------------
function doSamlLogin(email, firstName, lastName, isAuth  ) {
	showLoader(true);
	var error = $('#login-error');
	error.hide();

	var params = { 'option': 'googleLogin', 'email': email , 'firstName':firstName , 'lastName':lastName, 'isAuth':isAuth};

	doAPIRequest(API.METHOD_POST, API.PATH_LOGIN, params, function (response) {
		showLoader(false);

		if (response != null) {
			if (response.status_code == 200) {
				saveUserData(response.data);
				onLoginSuccess();
				removeUrlParams();
			} else {
				showErrorList(response.error);
			}
		} else {
			error.html("Can't communicate with server").show();
		}
	});

	return false;
}

// ---------------------- SSO Redirect Handler ----------------------
function doSSOLogin() {
	// window.open('https://finezyuat.dvarakgfs.com/login', 'authWindow', 'width=600,height=400');
	//  window.location.href = "https://finezy.dvarakgfs.com/login";
	window.location.href = "https://finezyuat.dvarakgfs.com/login";
	// window.location.href = "https://finezyuat.dvarakgfs.com/login/saml2/authenticate/google-saml";
	// https://finezyuat.dvarakgfs.com/login/saml2/sso/
	// window.location.href = "https://finezyuat.dvarakgfs.com/tms"
}


// ---------------------- Helpers ----------------------
function saveUserData(data) {
	localStorage.token = data.token;
	localStorage.linkNavMenu = data.nav;
	localStorage.emp_code = data.emp_code;
	localStorage.emp_name = data.emp_name;
	localStorage.user_email = data.user_email;
	localStorage.username = data.emp_code;
	localStorage.user_type = data.user_type;
	localStorage.user_id = data.user_id;
	localStorage.branch_id = data.branch_id;
	localStorage.branch_name = data.branch_name;
	localStorage.user_group = data.group;
	localStorage.office_name = data.office_name;
	TOKEN = data.token;
}

function showErrorList(errors) {
	var error = $('#login-error');
	var errorMsg = '<ul>';
	for (var position in errors) {
		errorMsg += "<li>" + errors[position] + "</li>";
	}
	errorMsg += '</ul>';
	error.html(errorMsg).show();
}

function removeUrlParams() {
	const url = new URL(window.location.href);
	url.search = ''; // remove ?params
	window.history.replaceState({}, document.title, url.toString());
}

// ---------------------- On Page Load ----------------------
$(document).ready(function () {
	showLoader(false);

	// Token Validation
	if (localStorage.token) {
		var params = { 'option': 'validateToken', 'username': localStorage.username };
		doAPIRequest(API.METHOD_POST, API.PATH_LOGIN, params, function (res) {
			if (res != null && res.status_code == 200 && res.data) {
				onLoginSuccess();
			} else {
				localStorage.clear();
				showLoader(false);
				showNavMenuItem(false);
			}
		});
	} else {
		localStorage.clear();
		showLoader(false);
		showNavMenuItem(false);
	}

	// Check if redirected from SSO
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('isAuth') && urlParams.get('isAuth') === "true") {
		const email = decodeURIComponent(urlParams.get('email'));
		const firstName = decodeURIComponent(urlParams.get('firstName'));
		const lastName = decodeURIComponent(urlParams.get('lastName'));
		const isAuth = decodeURIComponent(urlParams.get('isAuth'));

		if (email) {
			console.log("SSO Login detected for:", email);
			doSamlLogin(email, firstName, lastName, isAuth);
		} else {
			$('#login-error').html("Missing email parameter").show();
			showLoader(false);
		}
	} else if (urlParams.has('isAuth') && urlParams.get('isAuth') === "false") {
		$('#login-error').html("Invalid User").show();
		showLoader(false);
		console.log('Invalid user, isAuth=false');
	}
});

