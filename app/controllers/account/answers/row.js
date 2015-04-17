function onClick(e) {
	Alloy.CFG.tabAccount.open(
		Alloy.createController('account/answers/answer', {newChat: false, id: e.row.rowId, toUser: $.toUserId.text, UserName: $.toUser.text}).getView()	
	);
}

if($.newMessages.text === 0)
	$.newMessages.visible = false;
else if($.newMessages.text >=10 )
	$.newMessages.width = 'auto';
