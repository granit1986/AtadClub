var indicator = Alloy.Globals.indicator;
var chats = Alloy.Collections.chats; 
function fetch() {
	indicator.openIndicator();
	chats.fetch({		
		success:function(response, data) {
			indicator.closeIndicator();
		},
		error:function(model, xhr,options){
			indicator.closeIndicator();
		},
	});	
}

function removeChat(e)
{	
	var item = chats.get(e.row.rowId);
	item.destroy({success: function(){},
		error: function(){}
	});
}

function transform(model) {
	var transform = model.toJSON();
	if(transform.NewMessages > 0)
		transform.NewMessages = "+" + transform.NewMessages;
	return transform; 
}

Ti.App.addEventListener('offers:update', function(e) { fetch(); });

fetch();
