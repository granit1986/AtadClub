function onClick(e) {
	var productWindow = Alloy.createController('account/products/display',	{productId : e.row.rowid}).getView();
	Alloy.CFG.tabHome.open(productWindow);
}