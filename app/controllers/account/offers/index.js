var offers = Alloy.Collections.offers;
function fetch() {
	offers.fetch({
		success:function(data) {
		},
		error:function(model, xhr,options){},
	});
	
}

function close()
{
	Ti.App.removeEventListener('offers:update', fetch);
}

function removeOffer(e)
{
	var offer = offers.get(e.row.rowId);
	offer.destroy();
}

function transform(model) {
	var transform = model.toJSON();
	if(transform.price)
		transform.price = transform.currency + ' ' + transform.price;
	else
		transform.price = L("barter_offer");
	
	// switch(transform.state) {
		// case 1:
		// default:
			// transform.state = L('new');
			// break;
		// case 3:
			// transform.state = L('declined');
			// break;
		// case 4:
			// transform.state = L('accepted');
			// break;
// 		
	// }
	return transform; 
}

Ti.App.addEventListener('offers:update', fetch);

fetch();
