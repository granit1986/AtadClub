var indicator = Alloy.Globals.indicator;
function open()
{	
	Ti.App.addEventListener('account:updateAdverts', advertsFetch);
	advertsFetch();
}

function close()
{
	Ti.App.removeEventListener('account:updateAdverts', advertsFetch);
	Alloy.Collections.adverts.reset();
}

var btnNew = Ti.UI.createButton({
    titleid: 'add'
});
btnNew.addEventListener('click',function(e){
    var advertWindow = Alloy.createController('add/advert', {tab: Alloy.CFG.tabAccount}).getView();
	Alloy.CFG.tabAccount.open(advertWindow);
});
$.window.rightNavButton = btnNew;



function advertsFetch() {
	if(Alloy.Globals.core.apiToken())
	{
		indicator.openIndicator();
		Alloy.Collections.adverts.fetch({
			success: function (response, data) {
				Alloy.Globals.core.createRows(Alloy.Collections.adverts, transform, $.adverts, "account/adverts/row");
				indicator.closeIndicator();
			},
			error: function () {
				indicator.closeIndicator();
			}
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
		transform.image = 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + transform.images[0] + Alloy.Globals.imageSizes.advert.row(); 
			
	return transform; 
}

