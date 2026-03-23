[
	{
        "label": "Inbox",
        "href": "#",    
        "attr" : {
        "onClick " : "navigate('/../common/views/inbox/index.html')"
        }
    },{
        "label": "Enrollments",
        "href": "#",
        "attr" : {
        	 "onClick " : ""
        }, 
        "sub_menu": [
	        {
                "label": "Customer Onboarding",
                "href": "#",
                "attr" : {
		        	 "onClick " : ""
		        },
				"sub_menu":[
					{
						"label": "Leads",
						"href": "#",
						"attr"	:{
							"onClick "	: "navigate('/leads.html')"
						}
					},{
						"label": "JLG 1<sup>st</sup> Cycle",
						"href": "#",
						"attr" : {
							 "onClick " : "navigate('/prospects.html')"
						}                
					},{
						"label": "JLG 2<sup>nd</sup>/3<sup>rd</sup> Cycle",
						"href": "#",
						"attr" : {
							 "onClick " : "navigate('/retentions.html')"
						}                
					},{
						"label": "HIL Loans",
						"href": "#",
						"attr" : {
							 "onClick " : "navigate('/individual-loans.html')"
						}                
					},{
						"label": "Asset/Topup Loans",
						"href": "#",
						"attr" : {
							 "onClick " : "navigate('/assetFinance.html')"
						}                
					}
						]				
            },{
                "label": "Loan Origination",
                "href": "#",
                "attr" : {
		        	 "onClick " : ""
		        },
				"sub_menu":[
					{
						"label": "Loan Application",
						"href": "#",
						"attr": {
							"onClick ": "navigate('/views/loan-applications/index.html')"
						}
					},{
						"label": "Loan - Awaiting Credit Sanction",
						"href": "#",
						"attr" : {
							 "onClick " : "navigate('/views/credit/credit.html')"
						}                
					},{
						"label": "Loan - Sanctioned",
						"href": "#",
						"attr" : {
							 "onClick " : "navigate('/loan_sanctioned.html')"
						}                
					},{
						"label": "Loan Disbursement Plan",
						"href": "#",
						"attr" : {
							"onClick " : "window.location.pathname='../../vw/disbursement-plan'"
						}                
					},{
						"label": "Loan Sanction Acknowledgement",
						"href": "#",
						"attr"	:{
							"onClick "	: "navigate('/loan_sanction_ack.html')"
						}
					},{
						"label": "Loan Disbursement Verification",
						"href": "#",
						"attr"	:{
							"onClick "	: "window.location.pathname='../../vw/loandisbverification.html'"
						}
					},{
						"label": "Loan Utilization Check",
						"href": "#",
						"attr" : {
							 "onClick "	: "navigate('/luc.html')"
						}                
					}
						]				
            },{
                "label": "Form Downloads",
                "href": "#",
                "attr" : {
		        	 "onClick " : ""
		        },
				"sub_menu":[
							{
								
								"label" : "VARAM",
								"href" : "#loanAppFormModal",
								"attr" : {
									"data-toggle" : "modal"
								}						
							},{
								"label": "ESAF",
								"href": "#",
								"attr" : {
									 "onClick " : "navigate('/applicationformdownload-esaf.html')"
								}                
							},{
								"label": "MAS",
								"href": "#",
								"attr" : {
									 "onClick " : "navigate('/applicationformdownload-mas.html')"
								}                
							}
						]				
            }
            
        ]
    },{
        "label": "Relationships ",
        "href": "#",         
        "sub_menu": [
           {
                "label": "Meetings",
                "href": "#REGULAR",
                "attr" : {
		        	 "onClick " : "navigate('/collection.html#REGULAR')"
		        }             
           },
           {
                "label": "Other Collections",
                "href": "#",
                "sub_menu": [
					{
					    "label": "Overdue",
					    "href": "#OD",
					    "attr" : {
					    	 "onClick " : "navigate('/collection.html')"
					    }             
					},{
		                "label": "Advance",
		                "href": "#ADVANCE",
		                "attr" : {
				        	 "onClick " : "navigate('/collection.html')"
				        }             
		           },{
		                "label": "Followups",
		                "href": "#REGULAR-FOLLOWUP",
		                "attr" : {
				        	 "onClick " : "navigate('/collection.html')"
				        }             
		           },{
		                "label": "Individual",
		                "href": "#INDIVIDUAL",
		                "attr" : {
				        	 "onClick " : "navigate('/collection.html')"
				        }             
		           }
                ]
           }
        ]
    },{
        "label": "Support",
        "href": "#",    
        "attr" : {
        "onClick " : "navigate('/grievances.html')"
        }
    }
    
]