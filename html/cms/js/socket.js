function initSocket() {
	return;
	try{
		if(window.socket) {
			window.socket.connect();
		} else {
			window.socket = io.connect(window.location.hostname + ':8082?suid=' + window.user.user_id, {
			// window.socket = io.connect('http://45.114.141.2:8082?suid=' + window.user.user_id, {
			// window.socket = io.connect('https://digital.varam.org:8082?suid=' + window.user.user_id, {
			// window.socket = io.connect('http://192.168.1.32:8082?suid=' + window.user.user_id, {
					transports: ['websocket'],
					upgrade: false
	        });
	        window.socket.on('connect', function(data) {				
	        	window.socket.emit('join', {'user_id' : window.user.user_id});
			});

	        window.socket.on('message', function(data) {
	        	if(data.typ == 'OTP') {
	        		showOTP(data);      			  
	        	} else if(data.typ == 'MSG'){
	        		showMessage(data);
	        	} else {
					//if(data.typ == "INBOX" && data.sender != window.user.user_id) showInboxMessage(data)
					if(window.messageListener){
						window.messageListener();
					}
				}
			});
	    }
	} catch(err) {
		console.log('Failed to connect socket server'  +err);
	}	    
}

function showInboxMessage(data) {
	$.notice({
        title: data.title + " ",
        content: data.msg
    },{
        noticeType: 'info',
        noticePosition: 'bottomRight'
    });
}

function showMessage(data) {
	$.notice({
        title: data.title + " ",
        content: data.desc
    },{
        noticeType: 'info',
        noticePosition: 'bottomRight'
    });
}

function showOTP(data) {
	$.notice({
        title: data.title + "  ",
        content: data.desc
    },{
        noticeType: 'error',
        noticePosition: 'bottomRight'
    });	
}

(function(c){var a={themePath:"/tms/theme/notification/",themeName:"DefaultTheme",themeMinification:true,isRtl:false,noticeClose:true,noticePosition:"topRight",defaultNoticePosition:{topRight:{top:"10px",right:"10px"},topCenter:{top:"10px",left:"50%",transform:"translate(-50%, 0)"},topLeft:{top:"10px",left:"10px"},middleRight:{right:"10px",top:"50%",right:"10px",transform:"translate(0px, -50%)",},middleCenter:{top:"50%",left:"50%",transform:"translate(-50%, -50%)",},middleLeft:{left:"10px",top:"50%",right:"10px",transform:"translate(0px, -50%)",},bottomRight:{bottom:"10px",right:"10px"},bottomCenter:{bottom:"10px",left:"50%",transform:"translate(-50%, 0)"},bottomLeft:{bottom:"10px",left:"10px"}},html:{container:'<div class="noticejs"></div>',notice:'<div class="notice"></div>',header:'<div class="notice-header"></div>',title:'<div class="notice-title"></div>',close:'<div class="notice-close"> &times;</div>',body:'<div class="notice-body"></div>',footer:'<div class="notice-footer"></div>'},defaultNoticeType:{},noticeType:""};var b=function(f){var g='<link rel="stylesheet" href="'+f+'">';c("head").append(g)};var e=function(f){return c.extend(a,f)};var d=function(g){if(!g){throw"Missing theme definition"}if(!g.themeName){throw"Missing theme name"}e(g);var f=(a.themeMinification)?".min.css":".css";b(a.themePath+a.themeName+f);if(a.isRtl){b(a.themePath+a.themeName+"-rtl"+f)}};c.notice=function(l,j){console.log(l);var k,h,i,g="";if(!l){throw"Missing data definition"}if(!l.content){throw"Missing Notice content definition"}e(j);if(c(".nj_"+a.noticePosition).length<=0){var f='<div class="noticejs nj_'+a.noticePosition+'"></div>';if(a.noticePosition&&a.noticePosition!=""){var m=a.defaultNoticePosition[a.noticePosition];Object.keys(m).map(function(n){f=c(f).css(n,m[n])[0]})}c("body").append(f)}if(l.title){h=c(a.html.title).html(l.title)[0];if(a.noticeClose===true){h=c(h).add(a.html.close)}h=c(a.html.header).html(h)[0];k=c(a.html.notice).append(h)[0]}else{if(a.noticeClose===true){k=c(a.html.notice).append(a.html.close)[0]}else{k=a.html.notice}}i=c(a.html.body).html(l.content)[0];k=c(k).append(i)[0];if(l.footer){g=c(a.html.footer).html(l.footer)[0];k=c(k).append(g)[0]}if(a.noticeType!==""){if(a.defaultNoticeType[a.noticeType].className){c(k).addClass(a.defaultNoticeType[a.noticeType].className)}if(a.defaultNoticeType[a.noticeType].attributes){var m=a.defaultNoticeType[a.noticeType].attributes;Object.keys(m).map(function(n){c(k).attr(n,m[n])})}}c(".nj_"+a.noticePosition).append(k)};c.extend(c.notice,{addTheme:d,});c(document).on("click",".notice-close",function(){c(this).closest(".notice").remove()})}(jQuery));
$.notice.addTheme({themePath:"/tms/theme/notification/",themeName:"bootstrap",themeMinification:true,isRtl:false,html:{container:'<div class="noticejs"></div>',notice:'<div class="notice alert"></div>',header:'<div class="notice-header"></div>',title:'<div class="notice-title"></div>',close:'<div class="notice-close"> &times;</div>',body:'<div class="notice-body"></div>',footer:'<div class="notice-footer"></div>'},defaultNoticeType:{error:{className:"alert-danger",attributes:{}},warning:{className:"alert-warning",attributes:{}},info:{className:"alert-info",attributes:{}},success:{className:"alert-success",attributes:{}}},noticeType:"error"});
