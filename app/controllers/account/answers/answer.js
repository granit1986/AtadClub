var newChat = arguments[0].newChat || false;
var chat = false;
var collection = Alloy.createCollection('message');
var chatId = arguments[0].id;
var toUserId = arguments[0].toUser;
var name = arguments[0].UserName;
$.window.title = name;
var formHeight = $.form.size.height;
var indicator = Alloy.Globals.indicator;
var dataOffset		= 0,
	dataLength		= 10,
	loading			= false,
	shownList		= true,
	inProgress		= false,
	refreshControl	= false;


function click(e)
{
	if(e.source.id !== 'answer')
		$.answer.blur();
}

function blur()
{
	Alloy.Globals.chat.openChatId = false;	
}

function focus()
{
	Alloy.Globals.chat.openChatId = chatId;	
}


function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){
	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;		
	var id = e.source.id;
	switch(id)
	{
		case "send":{onClickSend(); break;}		
	}
}


function open()
{
	Alloy.Globals.chat.openChatId = chatId;
	Alloy.Globals.chat.messagesWindow = $.messages;
	Alloy.Globals.chat.items = [];
	if(!newChat)
	{
		refreshControl = Ti.UI.createRefreshControl({			
			style: Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
		});
		refreshControl.addEventListener('refreshstart', add);
		$.messages.refreshControl = refreshControl;
		indicator.openIndicator();
		fetch();
	}
	if(!Alloy.Globals.chat.connected)
	{
		Alloy.Globals.chat.openConnect();		
		Alloy.Globals.core.showErrorDialog(L("chat_server_unavailable"));
	}
}

function fetch()
{
	loading = true;
	collection.fetch({
			data:{
					chatId: chatId,
					offset: dataOffset,
					length: dataLength
				},
			success: function(response, data)
			{
				loading = false;
				addItems(collection.toJSON());
				if(!dataOffset)
					messagesScrollToBottom();
			},
			error: function()
			{
				loading = false;
				indicator.closeIndicator();
				refreshControl.endRefreshing();
			}
		});
}

function addItems(data)
{
	var items = Alloy.Globals.chat.addMessage(data);
	$.messages.setData(items);
	refreshControl.endRefreshing();
}

function add(e)
{
	dataOffset = Alloy.Globals.chat.items.length;
	fetch();
}

function createRow(data)
{
	
}

function onClickSend()
{
	Alloy.Globals.chat.openChatId = chatId;
	var message = {text: $.answer.value, toUserId: toUserId, ChatId: chatId, fromUserId: Alloy.Globals.profile.id};
	
	if(Ti.Network.online)
	{
		if(!Alloy.Globals.chat.connected)
		{
			Alloy.Globals.chat.notSendedMessage = JSON.stringify(message);
			Alloy.Globals.chat.openConnect();
			$.answer.value = '';
			Alloy.Globals.core.showErrorDialog(L("error_send_message"));
		}
		else
		{
			send(message);
		}
	}
	else
	{
		Alloy.Globals.core.showErrorDialog(L('no_connection'));
	}
}

function send(message)
{
	
	Alloy.Globals.chat.source.send(JSON.stringify(message));
	$.answer.value = '';
	$.answer.height = Ti.UI.SIZE;
	formHeight = $.form.size.height;
	$.messages.bottom = formHeight;
    messagesScrollToBottom();
    $.answer.blur();
}

function close()
{
	Alloy.Globals.chat.openChatId = false;
	Alloy.Collections.messages = Alloy.createCollection("message");
	
	Alloy.Collections.chats.fetch({		
		success:function(response, data) {
			
		},
		error:function(model, xhr,options){
			
		},
	});	
}

function transform(data)
{
	var model = data.toJSON();	
	if(model.FromUserId == Alloy.Globals.profile.id){
		model.dir = 'out';
	}else{
		model.dir = 'in';
	}
	return model;
}

$.answer.addEventListener('focus', function() {
	formHeight = $.form.size.height;
    $.form.animate({bottom: 166, duration:500});
    $.messages.animate({bottom: 166 + formHeight, duration:500});
    messagesScrollToBottom();
    
});

$.answer.addEventListener('change', function() {
	if(formHeight != $.form.size.height){
		formHeight = $.form.size.height;
	    $.form.animate({bottom: 166, duration:500});
	    $.messages.bottom = 166 + formHeight;
	    messagesScrollToBottom();
	}
});
 
$.answer.addEventListener('blur', function() {
    $.form.animate({bottom: 0, duration:500});
    $.messages.animate({bottom: formHeight, duration:500});
    messagesScrollToBottom();
});

$.answer.addEventListener('return', function() {
    if ($.answer.size.height > 150) {
        $.answer.height = 150;
    }
    formHeight = $.form.size.height;
    $.messages.animate({bottom: formHeight, duration:500});
    messagesScrollToBottom();
});

function messagesScrollToBottom(){
	if($.messages.data[0]){
		$.messages.scrollToIndex($.messages.data[0].rows.length - 1);		
	}
	indicator.closeIndicator();
}


