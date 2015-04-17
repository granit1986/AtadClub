var args = arguments[0] || {};
var model = args.model || false;
if(model){
	$.dealRow_wrap.rowid = model.id;
	$.dealImg.init({image: model.image});
	$.titleLbl.text = model.name;
	$.priceLbl.text = model.price;
}

function onClick(e) {
	var advertWindow = Alloy.createController('home/adverts/advert',	{id : e.row.rowid,forEdit: true}).getView();
	Alloy.CFG.tabAccount.open(advertWindow);
}


