var args = arguments[0] || {};
var model = args.model || false;
if(model){
	$.rowWrap.rowid = model.id;
	$.rowWrap.lat = model.myLat;
	$.rowWrap.lng = model.myLng;
	$.dealImg.init({
		image: model.image
	});
	$.statusLbl.text = model.status;
	$.raitingLbl.text = model.rating;
	$.titleLbl.text = model.name;
	$.companyLbl.text = model.supplierName;
	$.dealTypeLbl.text = model.dealtype;
	$.distanceVal.text = model.distance;
	$.priceLbl.text = model.price;
	$.endTimeVal.text = model.endTime;
	$.votesLbl.text = model.votes;
}

function dealClick(e) {
		var view =  Alloy.createController('home/deals/deal',{id:e.row.rowid, lat: e.row.lat, lng: e.row.lng, backButtonTitle: "back_to_search_result", callback: function(e){ 
			if(e)
				Ti.App.fireEvent('supplierWindow:blocked'); 
		}}).getView();
				
	//view.backButtonTitle = "back_to_search_result";			
	Alloy.CFG.tabHome.open(view);
}

if($.endTimeVal.text != null && $.endTimeVal.text.length > 0)
	$.endTimeLbl.visible = true;

$.raitingStars.backgroundImage = "images/rate_" + $.raitingLbl.text + ".png";

if($.statusLbl.text > 0){
	var statusLabel = Ti.UI.createLabel({
		height:"25dp",
		left:"0",
		width:Ti.UI.FILL,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		font	: 	{fontSize: '16dp', fontFamily: 'Avenir Next Condensed', fontWeight:"bold"}
	});
	if($.statusLbl.text == 1){
		statusLabel.text = "Silver";
		statusLabel.color = "#c0c0c0";
	}
	if($.statusLbl.text == 2){
		statusLabel.text = "Gold";
		statusLabel.color = "#ffd700";
	}
	$.dealStatusWrap.height = 25;
	$.dealStatusWrap.add(statusLabel);
	$.row_imageWrap.height = 140;
	$.dealImg.top = 20;
}