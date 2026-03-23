	var table;
	var today = new Date();
	var users =new Array();
	var loginUser;
	function reloadTable() {
		if(table) {
			table.ajax.reload();	
		} else {
			getIssueTrackerLst();
		}
	}
	
	function getUsers(){
		var params ={};
		params["option"] = "employees";
		showLoader(true);
		doAPIRequestWithLoader(APIHandler.METHOD_GET, APIHandler.user, params, function(json){						
			if(json != null && json.status_code == 200){
				showLoader(false);
				users = json.data;
				for(var i in users){
					var user = users[i];
					if(user.emp_id == localStorage.user_id){
						loginUser = user;
						$("#assigned_user_id").prepend("<option value=\""+ user.emp_id + "\">" + user.emp_name + " ("+user.emp_id+")</option>");
					} else {
						$("#assigned_user_id").append("<option value=\""+user.emp_id+"\">"+user.emp_name+" ("+user.emp_id+")</option>");
					}
				}
				$("#assigned_user_id").prepend("<option value=\"ALL\">ALL</option>");
		        $("#assigned_user_id").val(localStorage.user_id);
		        $('#assigned_user_id').multiselect('rebuild');
			}			
			showLoader(false);
			getIssueTrackerLst();
		});
		
	}
	

	function onDepartChanged(){
		var params ={};
		var department = $('#department option:selected').val();
		
		params["department"] = department;
		params["option"] = "getDepartmentWiseUsers";
		$('#dept_member').multiselect('disable');
		doAPIRequestWithLoader(APIHandler.METHOD_GET, APIHandler.PATH_ISSUE_TRACKER, params, departmentMembers);
	}
	
	function departmentMembers(json){
		showLoader(false);
		if(json != null && json.status_code == 200){
			var users = json.data;
			$('#dept_member').find("option").remove();
			for(var i=0; i < users.length ; i++){
				var user = users[i];
				var empName = user.emp_name;
				var empId = user.emp_id;
				$('#dept_member').append("<option value=\""+empId+"\">"+empName+"</option>");	
				$('#dept_member').multiselect('rebuild');
			}
		}
	}
	
	function createNewIssue(){
		$("#issue_txt").val("");
		$('#description_txt').val("");
		$("#create_issue_type").find("option").remove();
		$('#department').find("option").remove();
		$('#dept_member').find("option").remove();
		
		$('#create_issue_type').append("<option value=\"\">--Select--</option>");
		$('#create_issue_type').append("<option value=\"Enrollment\">Enrollment</option>");
		$('#create_issue_type').append("<option value=\"Disbursement\">Disbursement</option>");
		$('#create_issue_type').append("<option value=\"Collections\">Collections</option>");
		$('#create_issue_type').append("<option value=\"Data Quality\">Data Quality</option>");
		$('#create_issue_type').append("<option value=\"IT Issues\">IT Issues</option>");
		$('#create_issue_type').append("<option value=\"Others\">Others</option>");
		
		
		$('#department').append("<option value=\"\">--Select--</option>");
		$('#department').append("<option value=\"HR\">HR</option>");
		$('#department').append("<option value=\"Management\">MANAGEMENT</option>");
		$('#department').append("<option value=\"Operations\">OPERATIONS</option>");
		$('#department').append("<option value=\"IT\">IT</option>");
		$('#department').append("<option value=\"Internal Audit and Risk\">AUDIT</option>");
		$('#department').append("<option value=\"Accounts\">ACCOUNTS</option>");
		$('#department').append("<option value=\"Product\">PRODUCTS</option>");
		$('#dept_member').append("<option value=\"\">--Select--</option>");
		$('#create_new_issue_modal').modal({show: true});
	}
	
	function postIssue(){
		var params = {};
		var issueType = $("#create_issue_type option:selected").val();
		var issue = $("#issue_txt").val();
		var desc = $('#description_txt').val();
		var department = $('#department option:selected').val();
		var assignedId = $('#dept_member option:selected').val();
		var assignedName = $('#dept_member option:selected').text();
		var date = today.format('dd-mm-yyyy hh:MM');
		
		
		if(!issue){
			swal("Enter Issue Title");
			return false;
		}
		if(!desc){
			swal("Enter Description");
			return false;
		}
		if(department == ""){
			swal("Select Department");
			return false;
		}
		if(assignedName == ""){
			swal("Select User");
			return false;
		}

		params["option"] = "postIssue";
		params["issue_type"] = issueType;
		params["issue"] = issue;
		params["description"] = desc;
		params["department"] = department;
		params["assigned_id"] = assignedId;
		params["assigned_name"] = assignedName;
		params["date"] = date;
		params["user_id"] = loginUser.emp_id;
		params["user_name"]= loginUser.emp_name;
		
		showLoader(true);
		doAPIRequestWithLoader(APIHandler.METHOD_POST, APIHandler.PATH_ISSUE_TRACKER, params,function(json){
			showLoader(false);
			if(json != null && json.status_txt && json.status_code == 200){
				swal("Created Successfully", json.status_text, "success");
				$('#create_new_issue_modal').modal('hide');
				$("#issue_txt").val("");
				$('#description_txt').val("");
				$('#department').val("<option value=\"Select\">--Select--</option>");
				$('#dept_member').val("<option value=\"\">--Select--</option>");
				getIssueTrackerLst();
			} else {
				swal("Field to create", json.status_text, "error");
				showLoader(false);
			}	
		});
	}
	
	function getIssueTrackerLst(){
		var params = function(){	
			let userId = localStorage.user_id;
			let monthYr = $("#issue_month option:selected").val();
			var assignedTo = $("#assigned_user_id option:selected").val();
			var statusSelected = $("#status option:selected").val();
			var issueDepartment = $("#issue_department option:selected").val();
			var issueType = $("#issue_type option:selected").val();
			
			return {
				"option"  : "getIssueTrackerLst",
		        "emp_code" : userId,
		        "month_yr" : monthYr,
		        "assigned_to": assignedTo,
		        "status" : statusSelected,
		        "issue_type" : issueType,
		        "issue_department" :  issueDepartment
			}
		};
		
		table = $('#issue-tracker-tbl').DataTable({
			processing: true,
			destroy: true,
			"language": {
				"processing": "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> please wait...",
		        "emptyTable" : "No issues found!",
		        "infoEmpty" : "No issues matched!"
		    },
	        "ajax": {
	        	"url" :  API.PATH_ISSUE_TRACKER,	
	        	"data" : params,
	        	"deferRender": true
	        },
	        "lengthMenu": [
	           [5, 10, 25, 50, 100],   //values
	           [5, 10, 25, 50, 100] // texts
	        ],
	        "iDisplayLength": 5,
	        "scrollX": true,
	        columns: [
	            {data: 'issue_type'},
				{data: 'created_date', "defaultContent": "" },
				{data: 'issue', "defaultContent": "" },
				{data: 'description', "defaultContent": "" },
				{data: null },
				{data: null },
				{data: 'status', "defaultContent": "" },
				{data: null}
	      	],
	      	"columnDefs": [
		            {
		            	"className":"input-sm",
	               		"targets": 0
	        		},{
	        			"className":"input-sm text-nowrap",
	        			"targets": 1
	        		},{
	        			"className":"input-sm",
	        			"targets": 2
	        		},{
	        			"targets": 3,
	        			"className":"input-sm"
	        		},{
	        			"targets": 4,
	        			"className":"input-sm"
	        			,
	        			render : function ( data, type, full, meta ) {
	        				var html ="";
	        					html += "<span>"+full.user_name+" ("+full.user_id+")</span>";
	        				return html;
						}
	        		},{
	        			"targets": 5,
	        			"className":"input-sm"
	        			,
	        			render : function ( data, type, full, meta ) {
	        				var html ="";
	        					html += "<span>"+full.assigned_name+" ("+full.assigned_id+")</span>";
	        				return html;
						}
	        		},{
	        			"targets": 6,
	        			"className":"input-sm"
	        		},{
	        			"targets": 7,
	        			"className":"input-sm text-nowrap",
	        				render : function ( data, type, full, meta ) {
	        					var actionHtml = "";
	        					var position = meta.row;
	        					var status = full.status;
	        					var assignee = full.user_id;
	        					var assigned = full.assigned_id;
	        					var department = full.department;

	        					actionHtml += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"#\"><span onclick=\"viewModal(this,'"+status+"')\"><i class=\"fa fa-eye\" aria-hidden=\"true\">&nbsp;</i> View Details</span></a> &nbsp;&nbsp;&nbsp;&nbsp;";
	        					if(status == "OPEN"){
	        						actionHtml += "<br>&nbsp;&nbsp;&nbsp;&nbsp; <a href=\"#\"><span onclick=\"showEditIssueModal(this,"+position+",'"+status+"','"+department+"','"+assignee+"','"+assigned+"');\"><i class=\"fa fa-retweet\" aria-hidden=\"true\">&nbsp;</i> Re-Assign</span> </a>";
	        						actionHtml += "<br>&nbsp;&nbsp;&nbsp;&nbsp; <a href=\"#\"><span onclick=\"showOpenIssueModal(this, "+position+",'"+status+"','"+assignee+"','"+assigned+"')\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\">&nbsp;</i> Update Status</span></a>";
	        					} else if(status =="INPROGRESS"){	        						
	        						actionHtml += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"#\"><span onclick=\"showEditIssueModal(this,"+position+",'"+status+"','"+department+"','"+assignee+"','"+assigned+"');\"><i class=\"fa fa-retweet\" aria-hidden=\"true\">&nbsp;</i> Re-Assign</span> </a>";
	        						actionHtml += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"#\"><span onclick=\"showModal(this,"+position+",'"+status+"','"+assignee+"','"+assigned+"')\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\">&nbsp;</i> Update Status</span></a>"
	        					} else if(status == "RESOLVED"){
	        						actionHtml += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"#\"><span onclick=\"showEditIssueModal(this,"+position+",'"+status+"','"+department+"','"+assignee+"','"+assigned+"');\"><i class=\"fa fa-retweet\" aria-hidden=\"true\">&nbsp;</i> Re-Assign</span> </a>";
	        						if(loginUser.emp_id == assigned){
	        							actionHtml += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"#\"><span onclick=\"showModal(this,"+position+",'"+status+"','"+assignee+"','"+assigned+"')\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\">&nbsp;</i> Update Status</span></a>"
	        						}
	        					}	
	        					else if(status == "CLOSED"){
		        						actionHtml += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"#\"><span onclick=\"showEditIssueModal(this,"+position+",'"+status+"','"+department+"','"+assignee+"','"+assigned+"');\"><i class=\"fa fa-retweet\" aria-hidden=\"true\">&nbsp;</i> Re-Open</span> </a>";
		        						
	        					}	
	        				return actionHtml;
						}
	        		}
		        ],                
	      	select: false,
	      	responseive: true,
	      	"order": [],
	        dom: 'Bfrtip',
	        buttons: [
	            'pageLength', 'copy', 'csv', 'excel','print',
	        ]
	    });
	}
	
	
	function showOpenIssueModal(cell, posi,status,assignee,assigned){
		if(status == "OPEN"){
			$("#status_div").show();
			$("#notes_div").show();
			$("#update_btn").show();
			$("#inprogress_status").hide();
			$("#resolved_status").hide();
			$("#cancelled_status").hide();
			$("#open_status_notes").val("");
			$('#open_status').find("option").remove();
			$('#open_status').append("<option value=\"INPROGRESS\">INPROGRESS</option>");			
			$('#open_status').append("<option value=\"RESOLVED\">RESOLVED</option>");
			$('#open_status').append("<option value=\"CANCELLED\">CANCELLED</option>");
		}
		let tblRow = $(cell).closest("tr");
			var data = table.row( tblRow ).data();
			$('#open_status_modal').modal({show: true});
			$("#open_status_issue_type").val(data.issue_type);
			$("#open_status_department").val(data.department);
			$("#open_status_issue").val(data.issue);
			$("#open_status_description").val(data.description);
			$("#open_status_tracker_id").val(data.issue_tracker_id);
			$("#open_status_assignee").val(data.user_name +" ("+ data.user_id+")")
			$("#open_status_assigned").val(data.assigned_name +" ("+ data.assigned_id+")");
			$("#issue_created_date").val(data.created_date);
			$("#issue_from_id").val(data.user_id);
			$("#issue_from_name").val(data.user_name);
			$("#issue_to_id").val(data.assigned_id);
			$("#issue_to_name").val(data.assigned_name);
	}
	
	function showModal(cell, posi,status,assignee,assigned){
		$("#status_div").show();
		$("#notes_div").show();
		$("#update_btn").show();
		$('#open_status').find("option").remove();
		if(status == "INPROGRESS"){
			$("#inprogress_status").show();
			$("#resolved_status").hide();
			$("#cancelled_status").hide();
			$('#open_status').append("<option value=\"RESOLVED\">RESOLVED</option>");
			$('#open_status').append("<option value=\"CANCELLED\">CANCELLED</option>");
		}
		if(status == "RESOLVED"){
			$("#inprogress_status").show();
			$("#resolved_status").show();
			$("#cancelled_status").hide();
			$('#open_status').append("<option value=\"CLOSED\">CLOSED</option>");
		}
		else{
			$("#inprogress_status").hide();
			$("#resolved_status").hide();
			$("#cancelled_status").hide();
		}
		
		let  tblRow = $(cell).closest("tr");
		var data = table.row( tblRow ).data();
		$('#open_status_modal').modal({show: true});
		$("#open_status_issue_type").val(data.issue_type);
		$("#open_status_department").val(data.department);
		$("#open_status_issue").val(data.issue);
		$("#open_status_description").val(data.description);
		$("#open_status_tracker_id").val(data.issue_tracker_id);
		$("#open_status_assignee").val(data.user_name +" ("+ data.user_id+")")
		$("#open_status_assigned").val(data.assigned_name +" ("+ data.assigned_id+")");
		$("#issue_created_date").val(data.created_date);
		$("#issue_from_id").val(data.user_id);
		$("#issue_from_name").val(data.user_name);
		$("#issue_to_id").val(data.assigned_id);
		$("#issue_to_name").val(data.assigned_name);
		
		if(data.inprogress_notes == " " || data.inprogress_notes =="" || data.inprogress_notes == null){
			$("#inprogress_notes").val("NA");
		}else{
			$("#inprogress_notes").val(data.inprogress_notes);
		}
		
		if(data.resolved_notes == " " || data.resolved_notes =="" || data.resolved_notes == null){
			$("#resolved_notes").val("NA");
		}else{
			$("#resolved_notes").val(data.resolved_notes);
		}
	}
	
	function updateIssue(){
		var issueTrackerId = $("#open_status_tracker_id").val();
		var responseStatus = $("#open_status").val();
		var responseNotes = $("#open_status_notes").val();
		var createdDate = $("#issue_created_date").val();
		var department = $("#open_status_department").val();
		var issueType = $("#open_status_issue_type").val();
		
		
		var fromId = loginUser.emp_id;
		var fromName = loginUser.emp_name;
		var toId = $("#issue_to_id").val();
		var toName = $("#issue_to_name").val();

		var params = {};
		params["option"] = "updateStatus";
		params["issue_tracker_id"] = issueTrackerId;
		params["status"] = responseStatus;
		params["issue_created_date"] = createdDate;
		params["from_id"] = fromId;
		params["from_name"] = fromName;
		params["to_id"] = toId;
		params["to_name"] = toName;
		params["department"] = department;
		params["issue_type"] = issueType;
		
		if(responseStatus == "INPROGRESS"){
			params["inprogress_notes"] = responseNotes;
		}else if(responseStatus == "RESOLVED"){
			params["resolved_notes"] = responseNotes;
			params["to_id"] =  $("#issue_from_id").val();
			params["to_name"] = $("#issue_from_name").val();
		}
		else if(responseStatus == "CANCELLED"){
			params["cancelled_notes"] = responseNotes;
		}
		
		else if(responseStatus == "CLOSED"){
			params["closed_notes"] = responseNotes;
		}

		if(responseNotes.length == 0){
			swal("Kindly enter notes!");
			return false;
		}
		
		showLoader(true);
		doAPIRequestWithLoader(APIHandler.METHOD_POST, APIHandler.PATH_ISSUE_TRACKER, params,function(json){
			showLoader(false);
			if(json != null && json.status_txt && json.status_code == 200){
				swal("Updated Successfully", json.status_text, "success");
				$('#open_status_modal').modal('hide');
				$('#open_status_notes').val("");
				
				getIssueTrackerLst();
			} else {
				swal("Field to create", json.status_text, "error");
				showLoader(false);
			}	
		});
	}
	
	function viewModal(cell, status){
		$("#view_summary_modal").modal({show: true});
		var tableSummaryBody = $('#issue_summary > tbody');
		$('#issue_summary > tbody').html('');
		
		let  tblRow = $(cell).closest("tr");
		var data = table.row(tblRow).data();
		
		$("#summary_issue_type").html(data["issue_type"]);
		$("#summary_issue_title").html(data["issue"]);
		$("#summary_issue_desc").html(data["description"]);
		
		var sNo = 1;
		var summary = data["activity_log"];
		for(var position in summary){	
				var activity ={};
				var issuesLog = summary[position];
				var timestamp = issuesLog.timestamp;
				var date = new Date(timestamp);
				var row = "<tr >";
					
				row += "<tr>";
				row += "<td align=\"center\">&nbsp;" + date.format('dd-mm-yyyy hh:MM') + "&nbsp;</td>";
				row += "<td>" + issuesLog.user_name + " ("+ issuesLog.user_id +")</td>";
				row += "<td>" + issuesLog.comments + "</td>";
				row += "<td>" + issuesLog.status + "</td>";
				
				row += "</tr>";
				tableSummaryBody.append(row);
		}
		
	}
	
	function showEditIssueModal(cell, position,status,department,assignee,assigned){
		$('#edit_issue_modal').modal({show: true});
		let  tblRow = $(cell).closest("tr");
			var data = table.row( tblRow ).data();
			$("#edit_issue_department").val(data.department).change();
			//reassignDepartChanged();

			$("#edit_issue_type").val(data.issue_type).change();
			$("#edit_issue_title").val(data.issue);
			$("#edit_issue_description").val(data.description);
			$("#edit_issue_tracker_id").val(data.issue_tracker_id);
			$("#edit_issue_assignee").val(data.user_name +" ("+ data.user_id+")")
			$("#edit_issue_dept_member").val("<option val=\""+data.assigned_id+"\"> "+ data.assigned_nsme+"</option>");
			$("#edit_issue_created_date").val(data.created_date);
	      	
	      	$("#edit_issue_to_id").val(data.assigned_id);
	      	$("#edit_issue_to_name").val(data.assigned_name);
	}
	
	function reassignDepartChanged(){
		var params ={};
		var department = $('#edit_issue_department option:selected').val();
		
		params["department"] = department;
		params["option"] = "getDepartmentWiseUsers";
		$('#edit_issue_dept_member').multiselect('disable');
		doAPIRequestWithLoader(APIHandler.METHOD_GET, APIHandler.PATH_ISSUE_TRACKER, params, reassignDeparmentMembers);
	}
	
	function reassignDeparmentMembers(json){
		showLoader(false);
		if(json != null && json.status_code == 200){
			var users = json.data;
			$('#edit_issue_dept_member').find("option").remove();
			for(var i=0; i < users.length ; i++){
				var user = users[i];
				var empName = user.emp_name;
				var empId = user.emp_id;
				$('#edit_issue_dept_member').append("<option value=\""+empId+"\">"+empName+"</option>");
				$('#edit_issue_dept_member').multiselect('rebuild');
			}
		}
	}
	
	function reassign(){
		var editIssueType = $("#edit_issue_type").val();
		var issueTrackerId = $("#edit_issue_tracker_id").val();
		var responseStatus = $("#edit_issue_status").val();
		var issueCreatedDate = $("#edit_issue_created_date").val();
		var reassignDepartment = $("#edit_issue_department option:selected").val();
		var reassignMemberId = $("#edit_issue_dept_member option:selected").val();
		var reassignMemberName = $("#edit_issue_dept_member option:selected").text();
		var notes = $("#edit_issue_notes").val();
		var fromId = loginUser.emp_id;
		var fromName = loginUser.emp_name;

		if(!notes || notes == " " || notes.length < 1){
			swal("Enter Notes");
			return false;
		}
		
		var params = {};
		params["option"] = "reAssign";
		params["issue_tracker_id"] = issueTrackerId;
		params["status"] = responseStatus;
		params["issue_created_date"] = issueCreatedDate;
		params["from_id"] = fromId;
		params["from_name"] = fromName;
		params["to_id"] = reassignMemberId;
		params["to_name"] = reassignMemberName;
		params["department"] = reassignDepartment;
		params["issue_type"] = editIssueType;
		params["reassign_comments"] = notes;

		showLoader(true);
		doAPIRequestWithLoader(APIHandler.METHOD_POST, APIHandler.PATH_ISSUE_TRACKER, params,function(json){
			showLoader(false);
			if(json != null && json.status_txt && json.status_code == 200){
				swal("Reassigned Successfully", json.status_text, "success");
				$('#edit_issue_modal').modal('hide');
				$("#edit_issue_notes").val("");
				getIssueTrackerLst();
			} else {
				swal("Field to reassign", json.status_text, "error");
				showLoader(false);
			}	
		});
	}
	