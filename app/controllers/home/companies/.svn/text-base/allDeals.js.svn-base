var supplierId = arguments[0].id;
var supplierName = arguments[0].supplierName;
var lat = arguments[0].lat || null;
var lng = arguments[0].lng || null;

$.window.title = supplierName+"'s deals";
//$.window.setRightNavButton(switchButton);


function transform(model) {
	var transform = model.toJSON();
	transform.price = transform.currency + ' ' + transform.price;
	
	transform.dealtype = Alloy.Globals.core.dealType[transform.dealtype].title;
	if(transform.images && transform.images.length > 0)
		transform.images = JSON.parse(transform.images);
	else
		transform.images = [];
	
	transform.myLat = lat;
	transform.myLng = lng;
	
	if(transform.endTime)
	{
		transform.endTime = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(transform.endTime));
	}
			
	if(transform.images.length > 0)
		transform.image = 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + transform.images[0] + Alloy.Globals.imageSizes.deal.row(); 

	return transform; 
}


//new


var Pager = function() {
    var page = 1;
    this.next = function() {
        page++;
        return page;
    };
};
 
var lastDistance = 0,
//Singleton collection
aliments = Alloy.Collections.companyDeals,
//Updating true in start (inital fetch)
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
    var time = new Date();
    var token = Alloy.Globals.core.apiToken();
    aliments.fetch({
        add: true,
        silent: true,
        data: {
        	token: token,
            offset: aliments.length,
            length: dataLength,
            clientTimeZoneOffset: time.getTimezoneOffset(),
            supplierId: supplierId,
            lat: lat,
	        lng: lng
        },
        success: function(response, data) {
        	        	
            updating = false;
            indicator.closeIndicator();
            if(!data.length)
            {
            	dataUpd.done();
            	return;
            }
            Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/row");
            data.length < dataLength? dataUpd.done():dataUpd.success();
            
        },
        error: function(e) {
        	dataUpd.done();
            updating = false;
            indicator.closeIndicator();
        }
    });
}

var indicator = Alloy.Globals.indicator;
function NewFetch()
{
	var token = Alloy.Globals.core.apiToken();
	var time = new Date();
	indicator.openIndicator();
	aliments.fetch({
		data: {
			token: token,
			length: dataLength,
			clientTimeZoneOffset: time.getTimezoneOffset(),
	        supplierId: supplierId,
	        lat: lat,
	        lng: lng
	    },
	    success: function(e) {
	        updating = false;
	        Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/row");
	        indicator.closeIndicator();
	    },
	    error: function(e) {
	        updating = false;
	        indicator.closeIndicator();
	    }
	});
}

function close(){
	aliments.reset();
}

function open()
{
	
	NewFetch();
}