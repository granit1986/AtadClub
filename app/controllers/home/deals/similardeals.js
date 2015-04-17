var deal = arguments[0].deal || null;

var elements = Alloy.createCollection('similarDeal');
var indicator = Alloy.Globals.indicator;
function open()
{
	NewFetch();	
}

function transform(model) {
	var transform = model.toJSON();
	transform.price = transform.currency + ' ' + transform.price;

	if(transform.images && transform.images.length > 0)
		transform.images = JSON.parse(transform.images);
	else
		transform.images = [];
	
	transform.distance = parseFloat(transform.distance).toFixed(2);
	transform.dealtype = Alloy.Globals.core.dealType[transform.dealtype].title;
	if(transform.endTime)
	{
		transform.endTime = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(transform.endTime));
	}
			
	if(transform.images.length > 0)
		transform.image = 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + transform.images[0] + Alloy.Globals.imageSizes.deal.row(); 

	return transform; 
}

var Pager = function() {
    var page = 1;
    this.next = function() {
        page++;
        return page;
    };
};


var lastDistance = 0,
updating = true,
//Pager instance
pager = new Pager();

function cleanString(str) {
    var clean = '';
    if (str) {
        clean = str.replace(/<[^>]+>/g, '');
    }
    return clean;
}

function add(e)
{
	if(updating)
	{
		e.success();
		return;
	}
	
	updating = true;
	beginUpdate(e);
}

var dataLength = 10;

function beginUpdate(dataUpd) {
    indicator.openIndicator();
    updating = true;
    var token = Alloy.Globals.core.apiToken();
    var time = new Date();
    elements.fetch({
    	add: true,
    	silent: true,
    	data:{
    	offset: elements.length,
		lat: deal.lat,
		sort: sort,
		length: dataLength,
		lng: deal.lng,
		distance: 2000,
		clientTimeZoneOffset: time.getTimezoneOffset(),
		token: Alloy.Globals.core.apiToken(),
		subcategories: deal.subCategories,
		
		},
		success: function(response, data) {
        	        	
            updating = false;
            indicator.closeIndicator();
            if(!data.length)
            {
            	dataUpd.done();
            	return;
            }
            Alloy.Globals.core.createRows(elements, transform, $.deals, "home/deals/row");
            data.length < dataLength? dataUpd.done():dataUpd.success();
            
        },
        error: function(e) {
        	dataUpd.done();
            updating = false;
            indicator.closeIndicator();
        }
	});    
}


if (OS_IOS)
	$.sorts.labels =[L('rating'), L('price'), L('distance'), L('dealtype')];

var sortType 	= 0,
	sort 		= 1;
function Sort(e) {
	if(sort == e.index + 1) 
		return false;
		
	sort = e.index + 1;
	NewFetch();
}


function NewFetch()
{
	var time = new Date();
	indicator.openIndicator();
	elements.fetch({data:{ 
		sort: sort,   	
		lat: deal.lat,
		lng: deal.lng,
		distance: 2000,
		length: dataLength,
		token: Alloy.Globals.core.apiToken(),
		subcategories: deal.subCategories,
		clientTimeZoneOffset: time.getTimezoneOffset(),
		
		},
		success: function(){
			Alloy.Globals.core.createRows(elements, transform, $.deals, "home/deals/row");
			updating = false;
			indicator.closeIndicator();
		},
		error: function(){
			updating = false;
			indicator.closeIndicator();
		}
	});
}
