var args = arguments[0] || {};
var model = args.model || false;
if(model){
	$.row.rowid = model.id;
	$.advImg.init({image: model.image});
	$.titleLbl.text = model.name;
	$.companyLbl.text = model.user;
	$.distanceLbl.text = model.distance;
	$.priceLbl.text = model.price;
	$.statusLbl.text = model.status;
}

function onClick(e) {
	var advertWindow = Alloy.createController('home/adverts/advert', {id : e.row.rowid}).getView();
	Alloy.CFG.tabHome.open(advertWindow);
}

if($.statusLbl.text > 0){
	var statusLabel = Ti.UI.createLabel({
		height:"30dp",
		left:"20dp",
		width:Ti.UI.FILL,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		font	: 	{fontSize: '16dp', fontFamily: 'Avenir Next Condensed', fontWeight:"bold"}
	});
	if($.statusLbl.text == 1){
		statusLabel.text = L("Silver");
		statusLabel.color = "#c0c0c0";
	}
	if($.statusLbl.text == 3){
		statusLabel.text = L("Gold");
		statusLabel.color = "#ffd700";
	}
	$.advStatusWrap.height = 30;
	$.advInfoWrap.top = 5;
	$.advStatusWrap.add(statusLabel);
}