/**
 * 
 */

$(document).ready(function(){
	user();
	doAPIRequest(API.METHOD_GET, API.PATH_AEPS_USER, {'action':'userNameList'}, function(json){
		if(json && json.status_code == 200) {
			$.each(json.data, function(index, emp) {
				$("#emp_id").append("<option value=\"" + emp.emp_id + "\">" + emp.emp_name +"[" + emp.emp_id+ "]" + "</option>");	
			});
		}
		getUsers();
	});
	
});

function getUsers(){
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_AEPS_USER, null, function (json){
		showLoader(false);	
		$("#tbl-user > tbody").html("");
		if(json != null && json.status_code == 200){				
			if(json.data.users && json.data.length == 0 ) {
				users = [];
				$('#tbl-user > tbody:last-child').append("<tr><td colspan=\"8\" align=\"center\">No users found</td></tr>");
			} else {
				users = json.data;
				$.each(users, function(index, item) {
					$("#emp_id option[value='" + item.emp_id + "']").remove();
					var row = "<tr>";
					row += "<td>" + (index + 1) + "</td>";
					row += "<td>" + item.emp_id + "</td>";
					row += "<td>" + item.aeps_credential.csr_id + "</td>";	
					row += "<td>" + item.emp_name + "</td>";
					row += "<td>" + item.aeps_credential.device_code + "</td>";
					row += "<td>" + item.aeps_credential.location + "</td>";
					row += "<td>" + item.aeps_credential.terminal_id + "</td>";				
					row += "<td>&nbsp;&nbsp;<a class=\"cur-pointer\" ><span class=\"glyphicon glyphicon-edit\" onclick=\"updateStatus(this, '" + item.emp_id+ "','" + item.emp_name+ "'," + (item.aeps_credential.active_status != 'ACTIVE') + ")\"> " + item.aeps_credential.active_status + "</span></a>&nbsp;&nbsp;</td>";
					//row += "<td>&nbsp;&nbsp;<a class=\"cur-pointer\" ><span class=\"glyphicon glyphicon-edit\" onclick=\"user.initializeFormData(" + index + ")\"></span></a>&nbsp;&nbsp;</td>";				
					row += "</td>";			
					row += "</tr>";
					$('#tbl-user > tbody:last-child').append(row);
				});
			}		
		} else {
			users = [];
			$('#tbl-user > tbody:last-child').append("<tr><td colspan=\"8\" align=\"center\">Failed to get the users!</td></tr>");
		}
	});
}

function updateStatus(obj, empId, empName, isActive){
	swal({
	  title: 'Confirm',
	  text: 'Are you sure to ' + (isActive? ' Activate ' : 'Deactivate') + ' ' + empName,
	  type: 'warning',
	  showCancelButton: true,
	  preConfirm: function (email) {
	    return new Promise(function (resolve, reject) {	    
	    	let params = {};
	    	params['emp_id'] = empId;
	    	params['action'] = isActive ? 'activate' : 'deactivate';
	    	doAPIRequest(API.METHOD_POST, API.PATH_AEPS_USER, params, function(json) {
	    		if(json && json.status_code == 200 && json.data && json.data.success) {
	    			resolve(true);
	    		} else {
	    			reject('Failed to update!');
	    		}
	    	});
	    })
	  },
	  confirmButtonText: isActive ? 'Activate' : 'Deactivate'
	}).then(function(isConfirm) {
	  if (isConfirm) {		  
		  let row = "&nbsp;&nbsp;<a class=\"cur-pointer\" ><span class=\"glyphicon glyphicon-edit\" onclick=\"updateStatus(this, '" + empId+ "','" + empName+ "'," + (!isActive) + ")\"> " + (isActive ? 'ACTIVE' : 'INACTIVE') + "</span></a>&nbsp;&nbsp;</td>";
		  $(obj).closest("td").html(row);
		  swal('Updated', isActive ? 'user has actived successfully.' : 'user has deactivated successfully.', 'success');
	  }
	}, function() {});
}

var user = function() {
	var initialize = function() {
		$('#user-modal').validator().on('submit', function( event ) {				
			if (event.isDefaultPrevented()) return false;
		});
		
		$('#user-modal').on('show.bs.modal', function () {			
			$('#user-modal').validator('update');		
		});	
		
		$('#user-modal').on('hidden.bs.modal', function () {		
			$('#user-form')[0].reset();
			$('#user-modal').validator('destroy');
		});
		
		$('#user-form').on('submit', function(event){
			if (event.isDefaultPrevented()) return;
			event.preventDefault();
			
			var params = {'action' : 'add'};
			$.each($(this).serializeArray(), function( i, field ) {						
				params[field.name] =field.value;
		    });
			let empName = $("#emp_id option:selected").text();
			empName = empName.substr(0, empName.indexOf('['));
			params['emp_name'] = empName;
			doAPIRequestWithLoader(API.METHOD_POST, API.PATH_AEPS_USER, params, function(json){
				if(json && json.data && json.data.success){
					getUsers();
					swal('New User', 'New user added successfully.', 'success');
					$("#user-modal").modal('hide');
				} else {
					alert("failed to add user");
				}
			});
		});			
	}
	
	var initializeFormData = function (index) {
		if(index >= 0) {
			var user = users[index];
			$("input[name='option']").val('update');
			$("select[name='emp_id']").val(user.emp_id);
			$("input[name='location']").val(user.location);
			$("input[name='csr_id']").val(user.csr_id);
			$("input[name='terminal_id']").val(user.terminal_id);
			$("input[name='csr_password']").val(user.csr_password);	
		}
	}
	initialize();
}






