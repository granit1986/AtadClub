// if new

if($.row.toUserId === Alloy.Globals.profile.id && !$.row.isReaded && $.row.state === 1)
	$.row.backgroundColor = "rgba(0,169,157,0.1)";
	
if($.row.toUserId !== Alloy.Globals.profile.id && !$.row.isReaded && ($.row.state === 3 || $.row.state === 4))
	$.row.backgroundColor = "rgba(0,169,157,0.1)";

function onClick(e) {
	var view = false;
	if(e.row.toUserId == Alloy.Globals.profile.id)
		view = Alloy.createController('account/offers/offer', {offerId:e.row.rowId}).getView();
	else
	 	view = Alloy.createController('account/offers/myOffer', {offerId:e.row.rowId}).getView();
	Alloy.CFG.tabAccount.open(view);
}
