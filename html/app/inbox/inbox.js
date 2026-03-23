var CONFIG = {
	API : {
		V_FILES : '/vengine/web/file'		
	}
};



function getInboxData() {
	alert('');
	try{
		renderInboxItem(JSON.parse(inboxJSInterface.getMessage()));	
	}catch(err){
		alert("Render failed.");
	}
}

function renderInboxItem(json) {
	// $("#inbox_item_view_reply").hide();
	currInboxItem = json;
	 let html = `
	 	<div><h4 class="subject">${json.subject}</h4></div>
	 	${	json.messages.reverse().map((msg, index) => `
	 			<div class="inbox-item ${index == 0 ? '' : 'inbox-item-collapse'} ${json.type.toLowerCase()}">
	 				<div class="inbox-item-header" >
	 					<div class="inbox-item-from-to expand-hover">From: ${json.from.name} (${json.from.code}) <br>To: ${json.to.map((to, index) => `${to.name}(${to.code})`).join("<br>")}</div>
	 					<div class="inbox-item-header-title">${msg.message.replace(/(<([^>]+)>)/g, "")}</div>
	 					<div class="inbox-item-header-timestamp ">${new Date(json.created).formatToString("dd NNN,yy hh:mm a")}</div>
	 				</div>
	 				<div class="inbox-item-body">
	 					<p>${msg.message}</p>
	 				</div>
	 				${renderInboxItemAttachments(msg.attachments)}			
	 			</div>
	 		`).join('')
	 	}
	 	<div>
	 		${renderActions(json.actions ? json.actions.footer : null)}
	 	</div>
	 `;
	document.getElementById("inbox_item_view_body").innerHTML = html;
	$("#inbox_item_view_body").on('click', '.inbox-item .inbox-item-header', function() {
		$('#inbox_item_view_body .inbox-item:not(.inbox-item-collapse)').not($(this).closest('.inbox-item')).addClass('inbox-item-collapse');
		$(this).closest('.inbox-item').toggleClass('inbox-item-collapse');
	});
}

function renderInboxItemAttachments(attachments) {
    if(attachments == null || attachments == "undefined") return "";
    let i = `
        <div class="inbox-item-attachment-list">
			<ul>
				${attachments.map(attachment => 
					`<li class="inbox-item-attachment" >
						<a href="#" onclick="showAttachment('${attachment.file_link || `${CONFIG.API.V_FILES}?option=vcloud&file_name=${encodeURIComponent(attachment.file_id)}`}'" >
							<div>
								<image class="thump" src="${attachment.thump || '/lib/images/icon-attach.png'}" />
								<h6 class="name">${attachment.name}</h6>
							</div>
						</a>
					</li>`
                ).join('')}
            </ul>
        </div>
	`;
	return i;
}

function renderActions(actions) {
    if(actions == null || actions == "undefined") return "";
    return `
		<div class="inbox-item-action-list">
			${actions.map((action, index) => {
				if(!action.expires_on || action.expires_on > new Date().getMilliseconds())
				 	return `<Button class="inbox-item-action ${action.style_class ? action.style_class : ''}" onclick="inboxJSInterface.showActionDialog('${action.actionType}', false, ${index})">${action.name}</Button>`
			}).join('')}
        </div>
    `;
}