

var specialKeys = new Array();
        specialKeys.push(8); //Backspace
        specialKeys.push(9); //Tab
        specialKeys.push(46); //Delete
        specialKeys.push(36); //Home
        specialKeys.push(35); //End
        specialKeys.push(37); //Left
        specialKeys.push(39); //Right
        
function isNumericKey(e, field){
	var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;  
    if ((keyCode >= 48 && keyCode <= 57) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode)){
    	return true;
    }
    return false;
}

function isAlphaKey(e, field) {
	var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;    
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode)) {
    	return true;
    }
    return false;
}

function isAlphaNumericKey(e, field) {	
	var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;    
    if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode)) {
    	return true;
    }
    return false;
}

function isAlphaKey(e, field) {
	var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;    
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode)) {
    	return true;
    }
    return false;
}

function isAlphaSpaceKey(e, field) {
	var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;    
    if (keyCode == 32 || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode)) {
    	return true;
    }
    return false;
}

function isAlphaNumericSpaceKey(e, field) {	
	var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;    
    if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode)) {
    	return true;
    }
    return false;
}

function isDigits(str){
	if((/^ *[0-9]+ *$/.test(str))){
		return true;
	}
    return false;
}

function isAlpha(value, minLen, maxLen){
	if(str!= null && (/^ *[a-zA-Z]+ *$/.test(str)) && (str.length>=minLen && str.length <= maxLen)){
		return true;
	}
    return false;
}

function isAlphaNumeric(value, minLen, maxLen){
	if(str!= null && (/^ *[0-9a-zA-Z]+ *$/.test(str)) && (str.length>=minLen && str.length <= maxLen)){
		return true;
	}
    return false;
}

function isAlphaSpace(str, minLen, maxLen){
	if(str!= null && (/^ *[ a-zA-Z]+ *$/.test(str)) && (str.length>=minLen && str.length <= maxLen)){
		return true;
	}
    return false;
}

function isAlphaNumericSpace(value, minLen, maxLen){
	if(str!= null && (/^ *[ 0-9a-zA-Z]+ *$/.test(str)) && (str.length>=minLen && str.length <= maxLen)){
		return true;
	}
    return false;
}

function isEmpty(value){
	if(value != null && value.length > 0){
		return true;
	}
	return false;
}
