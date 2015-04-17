var lng = arguments[0].lng || false;
var lat = arguments[0].lat || false;
var distance = arguments[0].distance || false;
var token = arguments[0].token || false;
var clientTimeZoneOffset = arguments[0].clientTimeZoneOffset || false;
var subcategories = arguments[0].subcategories || false;
function fetch() {
	var companies = Alloy.createCollection('companyWithDeals');
	companies.fetch({
		silent: true,
		data:{
			lat: lat,
		    lng: lng,
		    distance: distance,
		    token: token,	        
		    clientTimeZoneOffset: clientTimeZoneOffset,
		    subcategories: subcategories,
		    getCompanies: true,
		    language: Ti.Platform.locale
		},
		success: function() {
			Alloy.Globals.core.createRows(companies, transform, $.companies, "home/companies/row");
			indicator.closeIndicator();
		},
		error: function() {
			indicator.closeIndicator();
		}
	});
}

var indicator = Alloy.Globals.indicator;
function open()
{
	indicator.openIndicator();
	fetch();
}

function transform(model)
{
	var transform = model.toJSON();	
	transform.categories = JSON.parse(transform.categories).join(', ');
	
	transform.logo = transform.logoUrl + transform.logoId + Alloy.Globals.imageSizes.supplier.row(); 
	return transform;
}
