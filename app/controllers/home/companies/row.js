var args = arguments[0] || {};
var model = args.model || false;
if(model){
	$.rowWrap.rowid = model.id;
	$.companyImg.image = model.logo;
	$.titleLbl.text = model.name;
	$.addressLbl.text = model.address;
	$.categoriesLbl.text = model.categories;
}

function onClick(e) {
	Alloy.CFG.tabHome.open(
		Alloy.createController('home/companies/company', {id : e.row.rowid}).getView()	
	);
}