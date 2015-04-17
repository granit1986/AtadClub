
var addButton = Ti.UI.createButton({titleid: 'add'});
addButton.addEventListener('click', function() {
	Alloy.CFG.tabAccount.open(Alloy.createController('account/products/product').getView());
});
$.window.setRightNavButton(addButton);
var showAlert = false;
if(arguments[0])
{
	showAlert = arguments[0].alert || false;
}

var indicator = Alloy.Globals.indicator;
function open()
{
	if(showAlert)
	{
		Alloy.Globals.core.showErrorDialog(L("can_add_product"));
	}
	Ti.App.addEventListener("account:updateProducts", function(){productsFetch();});	
	productsFetch();
}

function close()
{
	Ti.App.removeEventListener("account:updateProducts", function(){productsFetch();});
}

function productsFetch()
{	
	if(Alloy.Globals.core.apiToken())
	{
		indicator.openIndicator();
		Alloy.Collections.products.fetch({
			success: function(data) { indicator.closeIndicator();},
			error: function(e) {indicator.closeIndicator();}
		});
	}
}

function transform(model) {
	var transform = model.toJSON();
	transform.price = transform.currency + ' ' + transform.price;
	
	if(transform.images && transform.images.length > 0)
		transform.images = JSON.parse(transform.images);
	else
		transform.images = [];
			
	if(transform.images.length > 0)
		transform.image = 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + transform.images[0] + Alloy.Globals.imageSizes.product.row(); 
	return transform; 
}