$(document).ready(function(){

	var branchmanagers = [];
	var leadfulfillmentapidata = null;

	showLoader(false);
	getBranchManagersList();
	getLeadFulfillments();
	
});


function getLeadFulfillments() {

	var fromDate = $("#date_from").val();
	var toDate = $("#date_to").val();
	var allocated=$("#input_filter_allocated_to").val();
	var mobileno=$("#bm_mobile_no").val();
	

	var params = {};
		params["action"] = "getleadfulfilment";		
		params["option"] = "getFulfilment";
		if(fromDate) params["dateFrom"] = fromDate;
		if(toDate) params["dateTo"] = toDate;
		if(allocated) params["allocatedTo"]= allocated;
		if(mobileno) params["mobileNo"]= mobileno;
		
	$('#fulfillmentTable > tbody').html("");
	$("#current_page_no").html(currPageNo);
	
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_LEAD_FULFILLMENTS ,params, function(json){
		if(json != null && json.code == 200 && json.data){		
			if(json.data.length == 0){
				var row = "<tr><td colspan=\"11\" align=\"center\">No Requests found</td></tr>";				
				$('#fulfillmentTable > tbody:last-child').append(row);
			} else {			
				var header = "";
				header += "<tr>";
				header += "<th></th>";
				header += "<th>Lead Id</th>";
				header += "<th>Creation Date</th>";
				header += "<th>Customer Name</th>";
				header += "<th>Mobile No</th>";		
				header += "<th>Product Requested</th>";			
				header += "<th>Pre Product Approved</th>";
				header += "<th>Allocated to</th>";
				header += "<th>Allocate</th>";
				header += "</tr>";				
				$('#fulfillmentTable > thead').html(header);	
				
				console.log(branchmanagers)
				
				leadfulfillmentapidata = json.data	;	
				for(var position in json.data){
					var leadfulfillmentdata = json.data[position];
					var row = "<tr>";
					row += "<td align=\"center\">&nbsp;<input class=\"chk_lead_allocate\" type=\"checkbox\" value=\"" + leadfulfillmentdata.id + "\" onchange=\"selectLead(this,'" + position + "')\"/>&nbsp;</td>" ;
					row += "<td>" + leadfulfillmentdata.lead_id + "</td>" ;
					row += "<td>" + leadfulfillmentdata.created_date.substr(0, 16) + "</td>" ;
					row += "<td>" + leadfulfillmentdata.name + "</td>" ;
					row += "<td>" + leadfulfillmentdata.mobile_no + "</td>";
					row += "<td>" + leadfulfillmentdata.eligible_loan_product_description + "</td>" ; 
					row += "<td>" + leadfulfillmentdata.pre_approved_product_description + "</td>" ;
					row += "<td>" + leadfulfillmentdata.allocated_to + "</td>" ;

					row += "<td align=\"right\">" 
					+ 
						"<div class=\"input-group input-group-sm\" >"
					+
							"<select id=\""+ leadfulfillmentdata.id +"\" class=\"form-control input-sm enb_mgr_list\" style=\"min-width:50px;\" disabled = \"disabled\" >"  // disabled = \"disabled\"
								row += "<option value = select> select </option>";
								// for(var position in branchmanagers){
								// 	var branchmanagersdata = branchmanagers[position];
								// 	row += "<option value=\""+ branchmanagersdata.full_name +"\"> " + branchmanagersdata.full_name + "(" + branchmanagersdata.code + ")"  + "</option>";
								// }
					+
							"</select>"
					+
						"<div"
					+ 
					"</td>" ;

					row += "</tr>";			
					$('#fulfillmentTable > tbody:last-child').append(row);			
				}			
			}
		}	
		showLoader(false);
		
		$("#btn-create").attr('disabled','disabled');

	});

}

function updateLeadFulfilment() {

	var selectedLeadfulfilmentdataid = $('table>tbody .chk_lead_allocate:checkbox:checked').val();
	var index=null
	for(var i=0;i<leadfulfillmentapidata.length;i++){
		if(leadfulfillmentapidata[i].id==selectedLeadfulfilmentdataid){
			index=i
			break;
		}
	}

	var allocatedto = $('#'+selectedLeadfulfilmentdataid.toString()+'').val(); 
	
	var params = {};
		
		params["action"] = "updateleadfulfilment";
		params["option"] = "postFulfilment";
		params["mobileNumber"] = leadfulfillmentapidata[index].mobile_no;
		params["allocatedTo"] = allocatedto;
		if(leadfulfillmentapidata[index].urn) params["urn"] = leadfulfillmentapidata[index].urn;
		if(leadfulfillmentapidata[index].lead_id) params["leadId"] = leadfulfillmentapidata[index].lead_id;

	doAPIRequestWithLoader(API.METHOD_POST, API.PATH_LEAD_FULFILLMENTS , params, function(json){

		if(json != null && json.code == 200 && json.data){	
			
			getLeadFulfillments();
			$("#btn-create").attr('disabled','disabled');

		}	
		showLoader(false);	

	});



}

function getBranchManagersList() {
	
	var params = {};
		params["action"] = "getbranchmanagerslist";		
		params["option"] = "wealthManagerslist";
		params["branch_code"] = "9999";

	$('#fulfillmentTable > tbody').html("");
	$("#current_page_no").html(currPageNo);
	
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_LEAD_FULFILLMENTS, params, function(json){
		
		console.log(json);

		if(json != null && json.code == 200 && json.data){	
			
			branchmanagers = json.data

		}	
		showLoader(false);	

	});

}

function  getBranchManagersList2(branchcode) {
	
	var params = {};
		params["action"] = "getbranchmanagerslist";		
		params["option"] = "wealthManagerslist";
		params["branch_code"] = branchcode;

	var branchmanagers = [];

	$('#fulfillmentTable > tbody').html("");
	$("#current_page_no").html(currPageNo);
	
	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_LEAD_FULFILLMENTS, params, function(json){
		
		console.log(json);

		if(json != null && json.code == 200 && json.data){	
			
			branchmanagers = json.data

		}	
		showLoader(false);	

	});

}


function selectLead(selectedelm,indexval){

	var branchcode = leadfulfillmentapidata[indexval].branch_code
	console.log("branch code ", branchcode )

	$('table>tbody .chk_lead_allocate').each(
		
		function (index, checkbox) {
			if (index == indexval) checkbox.checked = selectedelm.checked;
			else checkbox.checked=false
		});

		$('table>tbody .enb_mgr_list').each(
			
			function (index , selectbox) {
			  if (index == indexval)  {
					selectbox.disabled = !selectedelm.checked;

					console.log("select list " + selectbox.id)

					var row = "<option value = select> select 1" + index + "</option>";

					
					$('#'+selectbox.id).append(row);
				}
			 else {
				selectbox.disabled = true ;

				$('#'+selectbox.id + ">option:last-child").html("")

			 }

		  });

		createBtnEnable();
	
}

function createBtnEnable(){
	var checkedCount = $('table>tbody .chk_lead_allocate:checkbox:checked').length;

	if(checkedCount > 0){		
		$("#btn-create").removeAttr('disabled');
	} else {		
		$("#btn-create").attr('disabled','disabled');
	}
	
}
