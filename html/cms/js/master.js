if (typeof(EP) == "undefined") {
    EP = {};
}

if (typeof(EP.MASTER) == "undefined") {

    EP.MASTER = {        
        getmembers:function(json) {
         // alert(JSON.stringify(json));
       if (json != null && json != "") {
                   var html = "";
                   
                   html += "<table id='example' class='display' cellspacing='0' width='100%'>";
			       html += "<thead>";
				   html += "<tr style='text-align:left'>";
				   html += "<th>Branch Id</th>";
				   html += "<th>Group Name</th>";
				   html += "<th>Member Id</th>";
				   html += "<th>Member Name</th>";
				   html += "<th>Guardian Name</th>";
				   html += "<th>Guardian Relationship</th>";
				   html += "<th>Member Age</th>";
				   html += "<th>VoterId</th>";
				   html += "<th>Rationcard No</th>";
				   html += "<th>Aadhaar No</th>";
				   html += "<th>BankAccount No</th>";
				   html += "<th>Member Phone</th>";
				   html += "<th>Member Address</th>";
				   html += "</tr></thead><tbody>";
                  for (var i=0;i<json.length;i++) {
					   html += "<tr>";
					   	    html += "<td>"+json[i].branch+"</td>";
							html += "<td>"+json[i].groupname+"</td>";
							html += "<td>"+json[i].memberid+"</td>";
							html += "<td>"+json[i].membername+"</td>";
							html += "<td>"+json[i].guardianname+"</td>";
							html += "<td>"+json[i].guardianrelationship+"</td>";
							html += "<td>"+json[i].memberage+"</td>";
							html += "<td>"+json[i].voterid+"</td>";
							html += "<td>"+json[i].rationcard+"</td>";
							html += "<td>"+json[i].aadhaarno+"</td>";
							html += "<td>"+json[i].bankaccountnum+"</td>";
							html += "<td>"+json[i].memberphonenum+"</td>";
							html += "<td>"+json[i].memberaddress+"</td>";							
							html += "</tr>";

				  }
				  html += "</tbody></table>";
				   $('#mytable').html(html);				   
				   $('#example').DataTable( {
				        dom: 'Bfrtip',
				        buttons: [
				            'copy', 'csv', 'excel','print'
				        ]
				    } );
                    //$('#error1').html(JSON.stringify(json.chart)).show();
                    var chart;
            } else {
            	$('#error').show().fadeOut(3000);
                $('html, body').animate({ scrollTop: 0 }, 200);
            }

            EP.API.hideLoading();
        },
        getEmployee:function(json) {
            // alert(JSON.stringify(json));
          if (json != null && json != "") {
              var html = "";
              
               html += "<table id='example' class='display' cellspacing='0' width='100%'>";
		       html += "<thead>";
			   html += "<tr style='text-align:left'>";
			   html += "<th>EMP-ID</th>";
			   html += "<th>Name</th>";
			   html += "<th>Location</th>";
			   html += "<th>Designation</th>";
			   html += "<th>App-Role</th>";
			   html += "<th>Gender</th>";
			   html += "<th>Father-Name</th>";
			   html += "<th>Contact-No</th>";
			   html += "<th>Education</th>";
			   html += "<th>EXP-Starting</th>";
			   html += "<th>DOB</th>";
			   html += "<th>AGE</th>";
			   html += "<th>Group-DOJ</th>";
			   html += "<th>Experience</th>";
			   html += "<th>Varam_DOJ</th>";
			   html += "<th>Tenure</th>";
			   html += "<th>Reporting-To</th>";
			   html += "<th>Confirmation-Date</th>";
			   html += "<th>Address</th>";
			   html += "<th>Personal-ID</th>";
			   html += "<th>Email_Id</th>";
			   html += "<th>Spouse</th>";
			   html += "<th>Personal-Number</th>";
			   html += "<th>Emergency-Number</th>";
			   html += "<th>Office-CUG</th>";
			   html += "<th>Blood-Group</th>";
			   html += "<th>Personal-Number</th>";
			   html += "<th>Office-Email-Id</th>";
			   html += "<th>2_wheeler</th>";
			   html += "<th>Driving-License</th>";
			   html += "<th>Branch</th>";
			   html += "<th>IFSC</th>";
			   html += "<th>Account</th>";
			   html += "<th>PAN</th>";
			   html += "<th>Father</th>";
			   html += "<th>F-DOB</th>";
			   html += "<th>Mother</th>";
			   html += "<th>M-DOB</th>";
			   html += "<th>Spouse</th>";
			   html += "<th>SP-DOB</th>";
			   html += "<th>Child-1</th>";
			   html += "<th>C1-DOB</th>";
			   html += "<th>Child-2</th>";
			   html += "<th>C2-DOB</th>";
			   html += "</tr></thead><tbody>";
			   
			   for (var i=0;i<json.length;i++) {
				   	html += "<tr>";
			   	    html += "<td>"+json[i].id+"</td>";
					html += "<td>"+json[i].name+"</td>";
					html += "<td>"+json[i].location+"</td>";
					html += "<td>"+json[i].designation+"</td>";
					html += "<td>"+json[i].app_role+"</td>";
					html += "<td>"+json[i].gender+"</td>";
					html += "<td>"+json[i].father_name+"</td>";
					html += "<td>"+json[i].contact_no+"</td>";
					html += "<td>"+json[i].education+"</td>";
					html += "<td>"+json[i].EXP_starting+"</td>";
					html += "<td>"+json[i].dob+"</td>";
					html += "<td>"+json[i].age+"</td>";
					html += "<td>"+json[i].group_DOJ+"</td>";
					html += "<td>"+json[i].experience+"</td>";
					html += "<td>"+json[i].varam_DOJ+"</td>";
					html += "<td>"+json[i].tenure+"</td>";
					html += "<td>"+json[i].reporting_to+"</td>";
					html += "<td>"+json[i].confirmation_date+"</td>";
					html += "<td>"+json[i].address+"</td>";
					html += "<td>"+json[i].personal+"</td>";
					html += "<td>"+json[i].email_id+"</td>";
					html += "<td>"+json[i].spouse+"</td>";
					html += "<td>"+json[i].personal_number+"</td>";
					html += "<td>"+json[i].emergency_number+"</td>";
					html += "<td>"+json[i].office_CUG+"</td>";
					html += "<td>"+json[i].blood_group+"</td>";
					html += "<td>"+json[i].office_email_id+"</td>";
					html += "<td>"+json[i].two_Whlr+"</td>";
					html += "<td>"+json[i].driving_licence+"</td>";
					html += "<td>"+json[i].branch+"</td>";
					html += "<td>"+json[i].ifsc+"</td>";
					html += "<td>"+json[i].account+"</td>";
					html += "<td>"+json[i].pan+"</td>";
					html += "<td>"+json[i].father+"</td>";
					html += "<td>"+json[i].f_dob+"</td>";
					html += "<td>"+json[i].mother+"</td>";
					html += "<td>"+json[i].m_dob+"</td>";
					html += "<td>"+json[i].spouse+"</td>";
					html += "<td>"+json[i].sp_dob+"</td>";
					html += "<td>"+json[i].child_1+"</td>";
					html += "<td>"+json[i].c1_dob+"</td>";
					html += "<td>"+json[i].child_2+"</td>";
					html += "<td>"+json[i].c2_dob+"</td>";
					html += "</tr>";

			  }
			   
			   
              
              html += "</tbody></table>";
			   $('#mytable').html(html);				   
			   $('#example').DataTable( {
			        dom: 'Bfrtip',
			        buttons: [
			            'copy', 'csv', 'excel','print'
			        ]
			    } );
          }
        }, gethmmember:function(json) {
            // alert(JSON.stringify(json));
            if (json != null && json != "") {
                       var html = "";
                                              
                       html =  "<script type=\"text/javascript\">"
                    	   
	                    	   +"function selectMember(checkBox, id){"
	                    	   +"		if(checkBox.checked){"
	                    	   +"			memberIDs.push(id);"
	                    	   +"		}else{"
	                    	   +"			removeItem(id);"
	                    	   +"		}"	
	                    	   +"		console.log(memberIDs.join());"
	                    	   +"}"
			                   	
	                    	   +"function removeItem(item){"
	                    	   +"    for(var i in memberIDs){"
	                    	   +"        if(memberIDs[i]==item){"
	                    	   +"            memberIDs.splice(i,1);"
	                    	   +"            break;"
	                    	   +"           }"
	                    	   +"    }"
	                    	   +"}"	                   	
	                    		
	                    	     	
		                        
	                    	   +"</script>";
                        
                        
                       html += "<table id='example' class='display' cellspacing='0' width='100%'>";
     			       html += "<thead>";
     				   html += "<tr style='text-align:left'>";
     				   html += "<th></th>";
     				   html += "<th>Member Id</th>";
     				   html += "<th>Member Name</th>";
     				   html += "<th>Member Age</th>";
     				   html += "<th>VoterId</th>";
     				   html += "<th>Rationcard No</th>";
     				   html += "<th>Aadhaar No</th>";
     				   html += "<th>BankAccount No</th>";
     				   html += "<th>Member Phone</th>";
     				   html += "<th>Member Address</th>";
     				   html += "</tr></thead><tbody>";
                       for (var i=0;i<json.length;i++) {
     					   	html += "<tr >";
     					   	html += "<td><input type=\"checkbox\" onclick=\"selectMember(this,'"+json[i].memberid+"')\"  /></td>";
							html += "<td>"+json[i].memberid+"</td>";
							html += "<td>"+json[i].membername+"</td>";
							html += "<td>"+json[i].memberage+"</td>";
							html += "<td>"+json[i].voterid+"</td>";
							html += "<td>"+json[i].rationcard+"</td>";
							html += "<td>"+json[i].aadhaarno+"</td>";
							html += "<td>"+json[i].bankaccountnum+"</td>";
							html += "<td>"+json[i].memberphonenum+"</td>";
							html += "<td>"+json[i].memberaddress+"</td>";							
							html += "</tr>";

     				  }
     				  html += "</tbody></table>";
     				 
     				   $('#mytable').html(html);				   
     				   $('#example').DataTable( {
     				        dom: 'Bfrtip',
     				        buttons: [
     				            'copy', 'csv', 'excel','print'
     				        ]
     				    } );
                         $('#error1').html(JSON.stringify(json.chart)).show();
                         var chart;
                 } else {
                 	$('#error').show().fadeOut(3000);
                     $('html, body').animate({ scrollTop: 0 }, 200);
                 }

                 EP.API.hideLoading();
             }, getHighMark:function(json) {
                 if (json != null && json != "") {
                       var html = "";
                       
                       html += "<table id='example' class='display' cellspacing='0' width='100%'>";
     			       html += "<thead>";
     				   html += "<tr style='text-align:left'>";
     				   html += "<th>Member Id</th>";
     				   html += "<th>Member Name</th>";
     				   html += "<th>No of Active Accounts"
     				   html += "<th>No of Other MFIS</th>";
     				   html += "<th>No of Own MFIS</th>";
     				   html += "<th>No of Default Accounts</th>";
     				   html += "<th>Total Own Disbursed Amount</th>";
     				   html += "<th>Total Own Current Balance</th>";
     				   html +="<th>Status</th>";
     				   html += "</tr></thead><tbody>";
                       for (var i=0;i<json.length;i++) {
     					   	html += "<tr >";
							html += "<td>"+json[i].memberId+"</td>";
							html += "<td>"+json[i].memberName+"</td>";
							html += "<td>"+json[i].NO_OF_ACTIVE_ACCOUNTS+"</td>";
							html += "<td>"+json[i].NO_OF_OTHER_MFIS+"</td>";
							html += "<td>"+json[i].NO_OF_OWN_MFIS+"</td>";
							html += "<td>"+json[i].NO_OF_DEFAULT_ACCOUNTS+"</td>";
							html += "<td>"+json[i].TOTAL_OWN_DISBURSED_AMOUNT+"</td>";
							html += "<td>"+json[i].TOTAL_OWN_CURRENT_BALANCE+"</td>";
							
							if( (""+json[i].NO_OF_DEFAULT_ACCOUNTS.trim()).length == 0 
								|| (""+json[i].NO_OF_ACTIVE_ACCOUNTS.trim()).length == 0 
								|| (""+json[i].TOTAL_OWN_DISBURSED_AMOUNT.trim()).length == 0 ){
								html += "<td>Processing</td>";
							}else  if(json[i].NO_OF_DEFAULT_ACCOUNTS<=0 && json[i].NO_OF_ACTIVE_ACCOUNTS <=1 && json[i].TOTAL_OWN_DISBURSED_AMOUNT <=6750){
								html += "<td>Success</td>";
							}else{
								html += "<td>Failed</td>";
							}
							html += "</tr>";

     				  }
     				  html += "</tbody></table>";
                       
                       
                       
      				   $('#mytable').html(html);				   
      				   $('#example').DataTable( {
      				        dom: 'Bfrtip',
      				        buttons: [
      				            'copy', 'csv', 'excel','print'
      				        ]
      				    } );
                          $('#error1').html(JSON.stringify(json.chart)).show();
                          var chart;
                      } else {
                      	$('#error').show().fadeOut(3000);
                          $('html, body').animate({ scrollTop: 0 }, 200);
                      }

                  EP.API.hideLoading();
              },
        
    }
}
