var args = arguments[0] || {};
var model = args.model || false;
if(model){
	$.dealRow_wrap.rowid = model.id;
	$.dealImg.init({image: model.image});
	$.titleLbl.text = model.name;
	$.statusLbl.text = model.statusLbl;
	$.priceLbl.text = model.price;
}

function onClick(e) {
	var dealWindow = Alloy.createController('home/deals/deal',	{id : e.row.rowid, accountdeal: true }).getView();
	Alloy.CFG.tabAccount.open(dealWindow);
}

