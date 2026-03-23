var url = decodeURIComponent(window.location.search);
var regex = /[?&]([^=#]+)=([^&#]*)/g;
var parameters = {};
var match;
var status = "";
var userId="";
var userName ="";
var objectId ="";
while(match = regex.exec(url)) {
	parameters[match[1]] = match[2];
}



function addActivities(obj){
	$(obj).closest("#activities").append(
	'<div class="row">'		
	+'<div class="col-sm-6 form-group"> '
	+'<input type="text" name="activity" '
	+'placeholder="Enter Name Here.." ' 
	+'class="form-control input-sm" ' 
	+'id="sub_process_activities" '
	+'required>'
	+'</div>'
	+'<div class="col-sm-4 form-group"> '
	+'<label class="labelstyle">Description</label> '
	+'<textarea placeholder="Enter Here.." rows="3" class="form-control input-sm" id="sub_process_activities_desc"></textarea>'
	+'</div>'	
	+'<button type="button" class="btn btn-primary btn-sm" onclick="removeActivities(this)">&times;</button>'
	+'</div>'		
	);
}


function removeActivities(obj){
	$(obj).closest(".row").remove();
}


function addRisk(obj){
	$(obj).closest("#risk").append(
		'<div class="row">'
		+'<div class="col-sm-6 form-group">'
		+'<select id="sub_process_risk_category" class="form-control input-sm" required>'
		+'<option>--Select--</option>'
		+'<option>Credit Risk</option>'
		+'<option>Officer Risk</option>'
		+'<option>IT Risk</option>'
		+'</select>'
		+'</div>'
		+'<div class="col-sm-4 form-group">'
		+'<input type="text" placeholder="Enter Name Here.." class="form-control input-sm" id="sub_process_risk" required>'
		+'</div>'
		+'<button type="button" class="btn btn-primary btn-sm" onclick="removeRisk(this)">&times;</button>'
		+'</div>'
			
	);
			
}

function removeRisk(obj){
	$(obj).closest(".row").remove();
}

function addAuditQue(obj){
	$(obj).closest("#audit_question").append(
	'<div class="row">'		
	+'<div class="col-sm-6 form-group"> '
	+'<input type="text" name="audit_que" '
	+'placeholder="Enter Name Here.." ' 
	+'class="form-control input-sm" ' 
	+'id="sub_process_audit_question" '
	+'required>'
		+'</div>'
	+'<button type="button" class="btn btn-primary btn-sm" onclick="removeAuditQue(this)">&times;</button>'
	+'</div>'		
			
	);
}

function removeAuditQue(obj){
	$(obj).closest(".row").remove();
}


function addSubProcess(){
	var	i=$('#sub_process >div').length + 1;
	$('#sub_process').append(
		'<div>'	
		+'	<div class="row">'
		+'<div class="col-sm-6 form-group">'
		+'<h4>'+(i++)+' -  Sub Process <a onclick="addSubProcess()">Add Sub Process</a></h4>' 
		+'</div>'
		+'</div>'
		+'	<div class="row">'
		+'<div class="col-sm-6 form-group">'
		+'<label class="labelstyle">Sub Process Illustration</label>'
		+'<div id="sub_image-gallery" class="cf">'
		+'<img src="../images/no_image_available.jpg" id="sub_process_image_view'+(i-2)+'" alt="" style="height: 2cm;"width="150cm;">'
		+'<input type=\'hidden\' id=\"sub_process_image'+(i-2)+'\" ><br>'
		+'<input type=\'file\' id="sub_process_image_file'+(i-2)+'" accept=\'image/*\' onchange=\"'
		+'	var input = event.target;'
		+'	var reader = new FileReader();'
		+'	reader.onload = function() {'
		+'		document.getElementById(\'sub_process_image'+(i-2)+'\').value = reader.result.substr(reader.result.indexOf(\',\') + 1);;'
		+'		document.getElementById(\'sub_process_image_view'+(i-2)+'\').src = reader.result;'			
		+'	};'
		+'	reader.readAsDataURL(input.files[0]);'
		+'\"><br>'
		+'<img id=\'sub_process_image_view\' width="100">'
		+'</div>'
		+'</div>'
		+'</div>'
		+'<div class="row">'
		+'<div class="col-sm-6 form-group">'
		+'<label class="labelstyle">Sub Process Name</label>'
		+'<input type="text" placeholder="Enter Name Here.." class="form-control input-sm" id="sub_process_name" required>'
		+'</div>'
		+'</div>'
		+'<div class="row">'
		+'<div class="col-sm-6 form-group">'
		+'<label class="labelstyle">Description</label>'
		+'<textarea placeholder="Enter Here.." rows="4" class="form-control input-sm" id="sub_process_desc"></textarea>'
		+'</div>'
		+'</div>'
		+'<div class="row" id = "sub_process_activity">'
		+'<div class="col-xs-12 col-sm-12 col-md-12" id="activities">'
		+'<div class="row">'
		+'<div class="col-sm-6 form-group">'								
		+'<label class="labelstyle">Activities <a onclick="addActivities(this)">Add Activity</a></label>'
		+'<input type="text" placeholder="Enter Name Here.." name="activity" class="form-control input-sm" id="sub_process_activities" required>'
		+'</div>'
		+'<div class="col-sm-4 form-group"> '
		+'<label class="labelstyle">Description</label> '
		+'<textarea placeholder="Enter Here.." rows="3" class="form-control input-sm" id="sub_process_activities_desc"></textarea>'
		+'</div>'
		+'</div>'
		+'</div>'														
		+'</div>'
		+'<div class= "row">'
		+'<div class="col-xs-12 col-sm-12 col-md-12" id="risk">'
		+'<div class="row" >'
		+'<div class="col-sm-6 form-group">'
		+'<label class="labelstyle">Risk Category <a onclick="addRisk(this)">Add Risk</a></label>'
		+'<select id="sub_process_risk_category" class="form-control input-sm" required>'
		+'<option>--Select--</option>'
		+'<option>Credit Risk</option>'
		+'<option>Officer Risk</option>'
		+'<option>IT Risk</option>'
		+'</select>'
		+'</div>'
		+'<div class="col-sm-4 form-group">'
		+'<label class="labelstyle">Risk</label>'
		+'<input type="text" placeholder="Enter Name Here.." class="form-control input-sm" id="sub_process_risk" required>'
		+'</div>'
		+'</div>'
		+'</div>'
		+'</div>'
		+'<div class="row" id="sub_pro_aud_que">'
		+'	<div class="col-xs-12 col-sm-12 col-md-12" id="audit_question">'
		+'		<div class="row">'
		+'			<div class="col-sm-6 form-group">'
		+'				<label class="labelstyle">Audit Question<a onclick="addAuditQue(this)">Add Audit Question</a></label>'
		+'				<input type="text" placeholder="Enter Name Here.." name="audit_que" class="form-control input-sm" id="sub_process_audit_question" required>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'</div>'	
		+'</div>'
		/*+'<button type="button" class="btn btn-primary btn-sm" onclick="removeSubProcess(this)">&times;</button>'*/
		+'<hr />'	
	);
}


function removeSubProcess(obj){
	$(obj).closest(".row").remove();
}

function save(){
	var data ={};
	var stakeholder = [];
	data["process_name"]=$("#process_name").val();
	data["process_owner"]=$("#process_owner").val();
	data["process_description"]=$("#process_description").val();
	data["process_illustration"]=$("#process_image").val();
	$("#stake_holder input[type='checkbox']:checked").each(function(){
		stakeholder.push($(this).val());
	});
	
	data["process_stakeholder"]=stakeholder;
	
	var subArr = [];
	
     $("#sub_process >div").each(function(i){
    	 var subObj ={};
    	 subObj["sub_process_name"]= $("#sub_process_name", this).val();
    	 subObj["sub_process_desc"]= $("#sub_process_desc", this).val();
    	 subObj["sub_process_illustration"]=$("#sub_process_image"+i, this).val();

    	 var subProcessActArray = [];
    	 $("#activities >div",this).each(function(){
    	 	var subProcessActObj = {};
    	 	subProcessActObj["name"] = $("#sub_process_activities",this).val();
    	 	subProcessActObj["description"] = $("#sub_process_activities_desc",this).val();
    		//subProcessActObj[$("#sub_process_activities",this).val()]=$("#sub_process_activities_desc",this).val();
    		subProcessActArray.push(subProcessActObj);
    	 });
    	 
    	 var subProcessRiskArr=[];
    	 $("#risk >div",this).each(function(){
    		 var subProcessRiskObj={};
    		 subProcessRiskObj["sub_process_risk_category"]=$("#sub_process_risk_category",this).val();
    		 subProcessRiskObj["sub_process_risk"]=$("#sub_process_risk",this).val();
    		 subProcessRiskArr.push(subProcessRiskObj);
    	 });
    	 
    	 var subProcessAudQueArr = [];
    	 $("#sub_pro_aud_que input[name='audit_que']",this).each(function(){
    		 var subProcessAudQueObj ={};
    		 subProcessAudQueObj["sub_process_audit_question"]=$(this).val();
    		 subProcessAudQueArr.push(subProcessAudQueObj);
    	 });

    	 
    	 subObj["activity"]=subProcessActArray;
    	 subObj["risk"]=subProcessRiskArr;
    	 subObj["audit_question"]=subProcessAudQueArr;
    	 subArr.push(subObj);
     });
     
     
     data["sub_process"]=subArr;
     
    //console.log(JSON.stringify(data));
     
    var params={};
   	params["option"]="updateProcess";
   	params["process_name"]=$("#process_name").val();
   	params["owner"]=$("#process_owner").val();
   	params["data"]=JSON.stringify(data);
   	params["object_id"]=objectId;
 	doAPIRequestWithLoader(API.METHOD_POST, API.PATH_PROCESS, params, function(json){
 		showLoader(false);
 		if(json != null && json.status && json.status_code == 200){
 			swal("Success", json.status_txt, "success");
 		} else {
 			swal("Error", json.status_txt, "error");
 		}
 	}
 );
	
}

function getProcessData(){
	
	
	
	var processName = parameters["process_name"];
	var owner = parameters["owner"];
	var params={};
	params["option"]=parameters["option"];
  	params["process_name"]=processName;
  	params["owner"]=owner;
  	
  
  	doAPIRequestWithLoader(API.METHOD_GET, API.PATH_PROCESS, params, function(json){
  		if(json != null){
  			showLoader(false);
  			objectId = json["_id"]["$oid"];
  			
  			$("#process_name").val(json.process_name);
  			$("#process_owner").val(json.owner);
  			$("#process_description").val(json.process_desc);
  			$("#process_image").val(json.process_illustration);
  			if(json.process_illustration !=null && json.process_illustration.length>10){
  				$("#process_image_view").attr("src","data:image/jpg;base64,"+json.process_illustration);
  			}
  			
  			$("#process_stakeholder").val(json.process_stakeholder);
  			
  			for(var i in json.process_stakeholder){
  				var stakeName = json.process_stakeholder[i];
  				$("#stake_holder input[value='"+stakeName+"']").prop('checked',"checked");
  				$("#button_stakeholder").val(stakeName);
  				
  			}
	  			
	  			
  			for(var j=0;j<json.sub_process.length;j++){
  				var subProData = json.sub_process[j];
  				addSubProcess();
  	  			var subProcessHtmlNode = $('#sub_process >div')[j];
  	  			$("#sub_process_name", subProcessHtmlNode).val(subProData.sub_process_name);
  	  			$("#sub_process_desc", subProcessHtmlNode).val(subProData.sub_process_desc);
  	  			if(subProData.sub_process_illustration!=null){
  	  	  			$("#sub_process_image_view"+j).attr("src","data:image/jpg;base64,"+subProData.sub_process_illustration);

  	  			}else{
  	  			$("#sub_process_image_view"+j).attr("src","../images/no_image_available.jpg");
					

  	  			}
  	  			var actArr = subProData["activity"];
  	  			
  	  			
  	  			for(var k=1;k<actArr.length;k++){
	  				addActivities($("#activities",subProcessHtmlNode));
	  				
	  			}
  	  			
	  	  		 $("#activities >div",subProcessHtmlNode).each(function(index){
	  	  			var actObj = actArr[index];
	  	    	 	
	  	    	 	$("#sub_process_activities",this).val(actObj.name);
	  	    	 	$("#sub_process_activities_desc",this).val(actObj.description);
	  	    		
	  	    	 });
	  	  		 
	  	  		 var riskArr = subProData["risk"];
	  	  		 
	  	  		 for(var l=1;l<riskArr.length;l++){
	  	  			 addRisk($("#risk",subProcessHtmlNode));
	  	  			 
	  	  		 }
	  	  		 
	  	  		$("#risk >div",subProcessHtmlNode).each(function(index){
	  	  			var riskObj = riskArr[index];
	  	    	 	$("#sub_process_risk_category",this).val(riskObj.sub_process_risk_category);
	  	    	 	$("#sub_process_risk",this).val(riskObj.sub_process_risk);
	  	    		
	  	    	 });
	  	  		
	  	  		
	  	  		var auditQueArr = subProData["audit_question"];
		  	  	for(var m=1;m<auditQueArr.length;m++){
		  	  		addAuditQue($("#audit_question",subProcessHtmlNode));
	 	  			 
	 	  		 }
		  	  	
		  	  	$("#audit_question >div" ,subProcessHtmlNode).each(function(index){
		  	  		var auditQue = auditQueArr[index];
		    		 $("#sub_process_audit_question",this).val(auditQue.sub_process_audit_question);
		    	 });
	  	  		
  	  			
  	  			
  			}
  			
  			
  		}
  	})
}



