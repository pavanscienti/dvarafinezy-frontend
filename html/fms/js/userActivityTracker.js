var table;
var today = new Date();
var users =new Array();
var loginUser;
var locations=[];


$(document).ready(function() {
	showLoader(false);
	let fromDate = new Date(new Date().getTime()).format('dd-mm-yyyy');
	let date =  new Date().format('dd-mm-yyyy');
	$("#date_from").val(fromDate);
	$("#date_to").val(date);
});

function reloadTable() {
	if(table) {
		table.ajax.reload();	
	} else {
		getUserActivityTrackerLst();
	}
}

function getUserActivityTrackerLst(){
	locations=[];
	$("#user-tracker-container").show();
	$("#activity-views").show();
	$("#mapview-container").hide();
	var params = function(){	
		var region = $("#region option:selected").val();
		var branch = $("#branch_id option:selected").text();
		var userId = $("#user_id option:selected").val();
		var fromDate = $("#date_from").val();
		var toDate = $("#date_to").val();
		
		return {
			"option"  : "getUserActivityOverview",
	        "user_id" : userId,
	        "from_date" : fromDate,
	        "to_date": toDate
		}
	};
	
	table = $('#user-tracker-tbl').DataTable({
		processing: true,
		destroy: true,
		"language": {
			"processing": "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> please wait...",
	        "emptyTable" : "No user found!",
	        "infoEmpty" : "No users matched!"
	    },
        "ajax": {
        	"url" :  API.PATH_USER_ACTIVITY_TRACKER,	
        	"data" : params,
        	"deferRender": true,
        	"dataSrc": function(json) {     
        		renderLocations(json);
                return json.data;
            },
        },
        "lengthMenu": [
           [5, 10, 25, 50, 100],   //values
           [5, 10, 25, 50, 100] // texts
        ],
        "iDisplayLength": 5,
        "scrollX": true,
        columns: [
                  
            {data: 'datetime'},
            {data:null},
            {data: 'center_name'},
			{data: 'enrolment_type', "defaultContent": "NA" },
			{data: 'coordinates', "defaultContent": "NA" }
      	],
      	"columnDefs": [
	            {
	            	"className":"input-sm",
               		"targets": 0
        		},{
        			"className":"input-sm text-nowrap",
        			"targets": 1,
        			render : function ( data, type, full, meta ) {
        				var foName = full.officer_name;
        				var foId = full.officer_code;
        				if(foName== '' || foId==''){
        					return "<span>NA</span>";
        				}
        				return "<span>"+foName+"("+foId+")</span>";
					}
        		},{
        			"className":"input-sm text-nowrap",
        			"targets": 2,
        			render : function ( data, type, full, meta ) {
        				if(data== ''){
        					return "<span>NA</span>";
        				}
        				return "<span>"+data+"</span>";
					}
        		},{
        			"className":"input-sm text-nowrap",
        			"targets": 3,
        			render : function(data, type, full, meta){
        				if(data == ''){
        					return "<span>NA</span>";
        				}
        				return "<span>"+data+"</span>";
        			}
        		},{
        			"className":"",
        			"targets": 4,
        			render : function ( data, type, full, meta ) {
        				return '<a><i class="fa fa-map-marker" style="font-size:28px;" onclick="showGoogleMap(' + data.latitude + ',' + data.longitude+ ')"></i></a>';
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

function onRegionChanged(){
	$("#user-tracker-container").hide();
	$("#activity-views").hide();
	$("#view-user").hide();
	var regionSelected = $("#region option:selected").val();
	var params={};
	params["option"] = "branchByRegion";
	params["region_name"] = regionSelected;
	showLoader(true);
	doAPIRequestWithLoader(APIHandler.METHOD_GET, APIHandler.branch, params, function(json){						
		if(json != null && json.status_code == 200){
			showLoader(false);
			let branchs = json.data;
			$("#branch_id").find("option").remove();
			$("#user_id").find("option").remove();
			$("#branch_id").append('<option value="Select">Select</option>');
			$("#user_id").append('<option value="Select">Select</option>');
			for(var i in branchs){
				var branch = branchs[i];
				if(branch.branch_name != 'CORPORATE')
					$("#branch_id").append('<option value="' + branch.branch_id + '">' + branch.branch_name + '</option>');
			}
		}			
		showLoader(false);
		
	});
}

function onBranchChanged(){
	$("#user-tracker-container").hide();
	$("#activity-views").hide();
	$("#view-user").hide();
	var regionName = $("#region option:selected").val();
	var branchName = $("#branch_id option:selected").text();
	var params = {};
	params["option"] = "empNamesByBranchName";
	params["region_name"] = regionName;
	params["branch_name"] = branchName;
	params["emp_code"] = localStorage.user_id;
	showLoader(true);
	doAPIRequestWithLoader(APIHandler.METHOD_GET, APIHandler.user, params, function(json){						
		if(json != null && json.status_code == 200){
			showLoader(false);
			let users = json.data;
			
			$("#user_id").find("option").remove();
			$("#user_id").append('<option value="Select">Select</option>');
			for(var i in users){
				var user = users[i];
					$("#user_id").append('<option value="' + user.officer_code + '">' + user.officer_name + '</option>');
			}
		}			
		showLoader(false);
		
	});
}

function getUser(){
	var userSelected = $("#user_id option:selected").val();
	if(userSelected !="Select"){
		$("#view-user").show();
	}else{
		$("#view-user").hide();
		$("#user-tracker-container").hide();
		$("#activity-views").hide();
	}
}

function renderLocations(json){
	var mapdata = json.data;
	for(var i=0; i < mapdata.length; i++){
		var obj = mapdata[i];
		var coordinates = obj.coordinates;
		var newArr = [];
		newArr.push(obj.enrolment_type);
		newArr.push(coordinates.latitude);
		newArr.push(coordinates.longitude);
		newArr.push(obj.center_name);
		newArr.push(obj.officer_name);
		newArr.push(obj.officer_code);
		newArr.push(obj.datetime);
		locations.push(newArr);
	}
	showMapView();
}


function showMapView(){
	$("#mapview-container").show();
	var i,marker,paths = [];
	if(locations.length > 0){
		var infowindow = new google.maps.InfoWindow();
		var mapCanvas = document.getElementById("map");
	    var mapOptions = {center: new google.maps.LatLng(locations[0][1], locations[0][2]), zoom: 10};
	    var map = new google.maps.Map(mapCanvas,mapOptions);
	    for (i = 0; i < locations.length; i++) {  
	        let geoLocation = new google.maps.LatLng(locations[i][1], locations[i][2]);
	        paths.push(geoLocation);
	        marker = new google.maps.Marker({
			            position: geoLocation,
			            map: map
			          	});
	    		
	        google.maps.event.addListener(marker, 'click', (function(marker, i) {
	            return function() {
	              var html = "";
	              		html +="<span>Center Name : </span><b>"+locations[i][3]+"</b><br>";
	              		html +="<span>Event : </span><b>"+locations[i][0]+"</b><br>";
	              		html +="<span>Officer : </span><b>"+locations[i][4]+"("+locations[i][5]+")</b><br>";
	              		html +="<span>Date / Time : </span><b>"+locations[i][6]+"</b>";
	              infowindow.setContent(html);
	              infowindow.open(map, marker);
	            }
	        })(marker, i));
	    }
	    
	    var arrowSymbol = {
			                strokeColor: '#070',
			                scale: 3,
			                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
				            };
	    var polyline = new google.maps.Polyline({
	      path: paths,
	      strokeColor: "#0000FF",
	      strokeOpacity: 0.8,
	      strokeWeight: 4,
          geodesic: true,
          icons: [{
              icon: arrowSymbol,
              //offset: '100%'
          }]
	    });
	    polyline.setMap(map);
	    animateArrow(polyline);
	    showLoader(false);
	}else{
		swal("No activities found!");
		$("#user-tracker-container").hide();
		showLoader(false);
	}
	
    
}

function animateArrow(polyline) {
    var counter = 0;
    var accessVar = window.setInterval(function() {
        counter = (counter + 1) % 250;

        var arrows = polyline.get('icons');
        arrows[0].offset = (counter / 2) + '%';
        polyline.set('icons', arrows);
    }, 50);
}

function showGoogleMap(lati, lngi) {  
	window.open("/cms/viewmap.html?lati=" + lati + "&lngi=" + lngi, "Group Formation Location", "location=no,width=650,height=450,scrollbars=yes,top=100,left=700,resizable = no");
}