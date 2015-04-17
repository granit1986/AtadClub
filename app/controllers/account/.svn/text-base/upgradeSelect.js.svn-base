var callback = (arguments[0] && arguments[0].callback) || false;
function goldPrivateClick()
{
	var view = Alloy.createController("account/upgrade", {buyAdverts: true}).getView();
	Alloy.Globals.tabGroup.activeTab.open(view);
}

function silverClick()
{
	var view = Alloy.createController("account/upgrade", {buySilverDeals: true}).getView();
	Alloy.Globals.tabGroup.activeTab.open(view);
}

function goldClick()
{
	var view = Alloy.createController("account/upgrade", {buyGoldDeals: true}).getView();
	Alloy.Globals.tabGroup.activeTab.open(view);
}

function close()
{
	if(callback)
		callback();
}
