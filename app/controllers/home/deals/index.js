var switchButton = Ti.UI.createButton({titleid: 'all_companies'});
var sort = 1;
var subcategoriesItems = arguments[0].subCategories || false;
var subcategories = false;
if(subcategoriesItems)
	subcategories = JSON.stringify(subcategoriesItems);
var lat = arguments[0].lat;
var lng = arguments[0].lng;
var dataLength = 10;
	distance = arguments[0].distance;
switchButton.addEventListener('click', function(){
	var time = new Date();
	var companies = Alloy.createController('home/companies/index', {
		lat: lat,
	    lng: lng,
	    distance: distance,
	    token: Alloy.Globals.core.apiToken(),	        
	    clientTimeZoneOffset: time.getTimezoneOffset(),
	    subcategories: subcategories}).getView();
	companies.backButtonTitle = 'Back';
	Alloy.CFG.tabHome.open(companies);	
});
$.window.setRightNavButton(switchButton);
var transformCount = 0;

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
		
	transform.distance = parseFloat(transform.distance).toFixed(2) + " km";
	transform.myLat = lat;
	transform.myLng = lng;
	transform.dealtype = Alloy.Globals.core.dealType[transform.dealtype].title;
	if(transform.endTime)
	{
		transform.endTime = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(transform.endTime));
	}
			
	if(transform.images.length > 0)
		transform.image = 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + transform.images[0] + Alloy.Globals.imageSizes.deal.row(); 
	transformCount++;
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

aliments = Alloy.Collections.publicDeals,
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

function beginUpdate(dataUpd) {
	var test = new Benchmark();
    indicator.openIndicator();
    updating = true;
    var token = Alloy.Globals.core.apiToken();
    var time = new Date();
    aliments.fetch({
        add: true,
        silent: true,
        data: {
            offset: aliments.length,
            sort: sort,
	        lat: lat,
	        lng: lng,
	        distance: distance,
	        token: token,	        
	        clientTimeZoneOffset: time.getTimezoneOffset(),
	        subcategories: subcategories
        },
        success: function(response, data) {
        	
        	
            updating = false;
            indicator.closeIndicator();
            if(!data.length)
            {
            	dataUpd.done();
            	Ti.API.info('Update time - ' + test.test() + ' ms');
            	return;
            }
            Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/row");
            Ti.API.info('Update time - ' + test.test() + ' ms');
            Ti.API.info(transformCount);
            transformCount=0;
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


var sortType = 0;
function Sort(e) {

	if(sort == e.index + 1) 
		return false;
	
	$.is.state(1);
	pager = new Pager();
	sort = e.index + 1;
	NewFetch();
	
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

function NewFetch()
{
	var test = new Benchmark();
	indicator.openIndicator();
	var token = Alloy.Globals.core.apiToken();
	var time = new Date();
	aliments.fetch({
		data: {
	        sort: sort,
	        lat: lat,
	        lng: lng,
	        distance: distance,
	        token: token,	        
	        clientTimeZoneOffset: time.getTimezoneOffset(),
	        subcategories: subcategories
	    },
	    success: function(e) {
	    	Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/row");
	    	Ti.API.info('Fetch time - ' + test.test() + ' ms');
	        updating = false;	        
	        indicator.closeIndicator();
	        Ti.API.info(transformCount);
            transformCount=0;
	    },
	    error: function(e) {
	        updating = false;
	        indicator.closeIndicator();
	    }
	});
}


function close()
{
	Ti.App.removeEventListener('supplierWindow:blocked', blocked);
	aliments.reset();
}

Ti.App.addEventListener('supplierWindow:blocked', blocked);

function blocked()
{
	lastDistance = 0;
	aliments = Alloy.Collections.publicDeals;
	updating = true;
	pager = new Pager();
	NewFetch();
}
