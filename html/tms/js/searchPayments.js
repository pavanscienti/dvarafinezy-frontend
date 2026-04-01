var currPageNo = 1;


function searchPayments() {
	var findVal = $("#findPaymentQuery").val();
	let findBy = [];
	$("#findPaymentBy input[type=checkbox]:checked").each(function(){
		findBy.push($(this).val());
	});
	
	if(findBy.length == 0){
		alert("select find by options");
		return;
	} else {
		var params = {};
		params['action']='find';
		params['findVal'] = encryptValue(findVal);
		params['findBy'] = findBy;		
		doAPIRequestWithLoader(API.METHOD_POST, API.PATH_PAYMENT_APPROVALS, params, callbackViewSearchPayment);
	}
	
}

function callbackViewSearchPayment(json) {
	var tableBody = $('#findPaymentTable > tbody');
	if(json != null && json.status_code == 200 && json.data){
		tableBody.html('');
		if(json.data.data.length == 0){
			var row = "<tr>";
			row += "<td colspan=\"14\" align=\"center\"><center>No Payments found</center></td>" ;			
			row += "</tr>";			
			tableBody.append(row);
		} else {			
			var totalAmount = 0;
			var sNo = 1;
			for(var position in json.data.data) {
				var data = json.data.data[position];
				var row = "<tr>";
				row += "<td align=\"center\">&nbsp;" + (sNo++) + "&nbsp;</td>" ;				
				row += "<td class=\"text-nowrap text-left\">" + data["Created"] + "</td>" ;	
				row += "<td class=\"text-nowrap text-left\">" + data["Disb Date"] + "</td>" ;
				row += "<td class=\"text-nowrap text-left\">" + data["Branch Name"] + "</td>" ;
				row += "<td class=\"text-nowrap text-left\">" + data["Batch No"] + "</td>" ;
				row += "<td class=\"text-nowrap text-left\">" + data["Payment No"] + "</td>" ;
				row += "<td class=\"text-nowrap text-left\">" + data["Loan Acc No"] + "</td>" ;
				row += "<td class=\"text-nowrap text-left\">" + data["Customer No"] + "</td>" ;
				row += "<td class=\"text-nowrap text-left\">" + data["Name"] + "</td>" ;
				row += "<td class=\"text-nowrap text-left\">" + data["Account No"] + "</td>" ;	
				row += "<td class=\"text-nowrap text-left\">" + data["IFSC Code"] + "</td>" ;				
				row += "<td class=\"text-nowrap text-right\">" + (data["Amount"] ? data["Amount"].toMoney() : "") + "</td>" ;				
				row += "<td class=\"text-nowrap text-left\">" + (data["UTR No"] ? data["UTR No"] : "" ) + "</td>" ;
				row += "<td class=\"text-nowrap text-left\">" + (data["PoNum"] ? data["PoNum"] : "") + "</td>" ;				
				row += "<td class=\"text-nowrap text-left\">" + data["Trxn Time"] + "</td>" ;
				row += "<td class=\"text-nowrap text-left\">" + data["Status"] + "</td>" ;					
				row += "</tr>";			
				tableBody.append(row);
				totalAmount += Number(data.amount);
			}
		}
	}	
	showLoader(false);
	var dialog = document.getElementById('dialogFindPayment').show();
}

function showRecords(moveTo) {	
	if((moveTo==-1 && currPageNo > 1)
			|| (moveTo == 1 && $('#paymentsTable > tbody>tr').length >= 15)) {
		currPageNo += moveTo;
		var params = {};
		params['action']='approved';
		params['page'] = currPageNo;				
		doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PAYMENT_APPROVALS, params, callbackApprovalsList);
	}
}

