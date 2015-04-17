var elements = Alloy.Collections.deals;
var indicator = Alloy.Globals.indicator;
var callback = arguments[0].callback || false;
var selectedAll = false;
indicator.openIndicator();
var btn = Ti.UI.createButton({
	title: L('select_all')
});

$.window.setRightNavButton(btn);

function selectAll()
{
	var rows = $.deals.data[0].rows;
	var length = rows.length;	
	for (var i=0; i < length; i++) 
	{
		var row = rows[i];
		if(!selectedAll)
		{
			row.hasCheck = true;
		  	Alloy.Collections.selectedDeals.push({id: row.rowid, title: row.dealTitle});		  	
		}
		else
		{
			row.hasCheck = false;
			if(length-1 === i)
				Alloy.Collections.selectedDeals = [];
		}	
	}
	selectedAll = !selectedAll;
}

elements.fetch({
	success: function(model, xhr, options){		
		setTimeout(function(){
			indicator.closeIndicator();
			selectedAll = elements.length == Alloy.Collections.selectedDeals.length;
			selectDeals();
			btn.addEventListener('click', selectAll);	
		}, 500);
		 
	},
	error: function(xhr, options){ indicator.closeIndicator(); }
});

	
function selectDeals()
{
	var dealsCount = $.deals.data[0].rows.length;
	var selectedDealsCount = Alloy.Collections.selectedDeals.length;
	for (var i=0; i < dealsCount; i++) 
	{
		var row = $.deals.data[0].rows[i];
		for (var j=0; j < selectedDealsCount; j++) 
		{
			var selectedId = Alloy.Collections.selectedDeals[j].id;
			if(selectedId === row.rowid)
			{
				row.hasCheck = true;
				break;
			}
				
		};
	};
}

function transform(model)
{
	var transform = model.toJSON();
	transform.price = transform.currency + ' ' + transform.price;
	
	if(transform.images && transform.images.length > 0)
		transform.images = JSON.parse(transform.images);
	else
		transform.images = [];
			
	if(transform.images.length > 0)
		transform.image = 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + transform.images[0] + Alloy.Globals.imageSizes.deal.row();
	return transform;
}

function close()
{
	if(callback)
		callback();
}
