var supplierId = arguments[0].supplierId;

var indicator = Alloy.Globals.indicator;
function open()
{
	indicator.openIndicator();
	Alloy.Collections.supplierProducts.fetch({
		data: {id: supplierId},
		success: function(data) {indicator.closeIndicator();},
		error: function(e) {indicator.closeIndicator();}
	});
}


function transform(model) {
	var transform = model.toJSON();
	transform.price = transform.currency + ' ' + transform.price.trim();
	
	if(transform.images && transform.images.length > 0)
		transform.images = JSON.parse(transform.images);
	else
		transform.images = [];
			
	if(transform.images.length > 0)
		transform.image = 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + transform.images[0] + Alloy.Globals.imageSizes.product.row(); 
	return transform; 
}