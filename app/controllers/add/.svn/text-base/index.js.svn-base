Ti.App.addEventListener('add:notLoggin', function(e) { notLoggin(); });
Alloy.Globals.chat.openChatId = false;
var indicator = Alloy.Globals.indicator;
function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){
	indicator.openIndicator();
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(e.source.id)
		openView(e.source.id);
}

function openView(id)
{
	var view = false;
	switch(id)
	{
		case "advert": {view = Alloy.createController('add/advert').getView(); break;}
		case "deal": {
			if(!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
				Alloy.Globals.core.showErrorDialog(L('should_be_company_message'));
				indicator.closeIndicator();
				return;
			}
			view = Alloy.createController('add/deal', {tab: Alloy.CFG.tabAdd}).getView(); break;
		}
	}
	if(view);
		Alloy.CFG.tabAdd.open(view);
	indicator.closeIndicator();
}


