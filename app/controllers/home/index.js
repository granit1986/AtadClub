Alloy.Globals.chat.openChatId = false;
var core = Alloy.Globals.core,
	subCategories = [],
	aliments = Alloy.Collections.homeDeals,
	findAdverts = false,
	address		= Ti.App.address || false,
	lat			= Ti.App.lat || false,
	lng			= Ti.App.lng || false;

if(Ti.App.address)
	$.address.value = Ti.App.address;
	
Ti.App.Properties.setString("str", "");


var indicator = Alloy.Globals.indicator;
$.address.setHintText(L("enter_address"));
function clickCategories() {
	indicator.openIndicator();
	var view = Alloy.createController(
		'categories/index', {
			closeCallback: function() {
				subCategories = [];
				var customFindAdvirts = false;
				if(core.selectedHomeCategories['_1']) {
					for(var subCategoryKey in core.selectedHomeCategories['_1']) {
						if(!customFindAdvirts){
							customFindAdvirts = true;
							findAdverts = true;
						}	
						subCategories.push(core.selectedHomeCategories['_1'][subCategoryKey]);
					} 
				}
				if(!customFindAdvirts) {
					findAdverts = false;
					for(var categoryKey in core.selectedHomeCategories) {
						var category = core.selectedHomeCategories[categoryKey];
						for(var subCategoryKey in category) 
							subCategories.push(category[subCategoryKey]);
					}
				}
				$.selectedCategories.text = '';
				for(var categoryKey in core.selectedHomeCategories)
				{
					if(Object.size(core.selectedHomeCategories[categoryKey]) > 0)
					{
						categoryKey = categoryKey.replace('_','');
						var category = Alloy.Collections.categories.get(categoryKey);
						if($.selectedCategories.text == '')
							$.selectedCategories.text += category.attributes['name'];
						else
							$.selectedCategories.text += ', ' + category.attributes['name'];
					}
				}	
			},
			win: Alloy.CFG.tabHome,
			forDeals: false,
			sectionName: "home",
			withblock: true
		}).getView();
	indicator.closeIndicator();
	Alloy.CFG.tabHome.open(view);
}

function selectDistance(distance)
{
	switch(distance)
	{
		case 100:{
			$.scrollView.contentOffset = {x: 0, y:0 };
			break;
		}
		case 250:{
			$.scrollView.contentOffset = {x: 65, y:0 };
			break;
		}
		case 500:{
			$.scrollView.contentOffset = {x: 130, y:0 };
			break;
		}
		case 750:{
			$.scrollView.contentOffset = {x: 195, y:0 };
			break;
		}
		case 1000:{
			$.scrollView.contentOffset = {x: 260, y:0 };
			break;
		}
		case 2000:{
			$.scrollView.contentOffset = {x: 325, y:0 };
			break;
		}
	}
}


function clickFind() {	
	if(core.rxs.empty.test($.address.value)) {
		indicator.closeIndicator();
		Alloy.Globals.core.showErrorDialog(L('no_address'));		
		return;
	}
	if(core.rxs.empty.test(subCategories))
	{
		indicator.closeIndicator();
		Alloy.Globals.core.showErrorDialog(L('please_select_category'));
		return;
	}
		
	if(!lat || !lng || $.address.value !== address) {		
		geo.geocoding($.address.value, function(e) {			
			if(e.error == geo.elementStatuses.ZERO_RESULTS || e.error == geo.elementStatuses.NOT_FOUND)
			{
				indicator.closeIndicator();
				Alloy.Globals.core.showErrorDialog(L("address_not_found"));				
				return;
			}
			if(e.error) {
				Alloy.Globals.core.showErrorDialog(L(e.message));
				$.findBtn.touchEnabled = true;
				return;
			}
			else {
				lat = parseFloat(e.response.results[0].geometry.location.lat);
				lng = parseFloat(e.response.results[0].geometry.location.lng);
				Ti.App.lat = lat;
				Ti.App.lng = lng;

				if(findAdverts) {
					var advertsWindow = Alloy.createController('home/adverts/index',{lat:lat, lng:lng, distance: distance, subCategories:subCategories}).getView();
					indicator.closeIndicator();
					advertsWindow.backButtonTitle = L("back");
					Alloy.CFG.tabHome.open(advertsWindow);
				}
				else {					
					var dealsWindow = Alloy.createController('home/deals/index',{lat:lat, lng:lng, distance: distance, subCategories:subCategories}).getView();
					indicator.closeIndicator();
					dealsWindow.backButtonTitle = L("back");
					Alloy.CFG.tabHome.open(dealsWindow);
				}
			}				
		});	
	}
}

$.scrollView.contentOffset = {x: 45, y:0 };
var distance = 100;
$.scrollView.addEventListener('scroll', function(e) {
	//$.tmp.text = e.x + '|';
	     if(e.x >= 325)	distance = 2000 /*$.tmp.text += 2000*/;
	else if(e.x >= 260)	distance = 1000 /*$.tmp.text += 1000*/;
	else if(e.x >= 195) distance = 750 /*$.tmp.text += 750*/;
	else if(e.x >= 130) distance = 500 /*$.tmp.text += 500*/;
	else if(e.x >= 65)	distance = 250 /*$.tmp.text += 250*/;
	else         /*45*/	distance = 100 /*$.tmp.text += 100*/;
});


function customLocation() {		
	var geo = Alloy.Globals.geo;
	geo.checkLocation(function() {
		if(geo.location.status != geo.errors.NONE) {			
			Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
			indicator.closeIndicator();
			return;
		}
		lat = geo.location.lat;
		lng = geo.location.lng;
		geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
			indicator.closeIndicator();
			if (e && e.error) {
				if (e.message)
					Alloy.Globals.core.showErrorDialog(L(e.message));
				else
					Alloy.Globals.core.showErrorDialog(L(e.error));
			} else if (e && e.response) {
				if(e.response.results && e.response.results[0] && e.response.results[0].formatted_address)
					$.address.value = e.response.results[0].formatted_address;
				else if(e.response.resourceSets && e.response.resourceSets[0] && e.response.resourceSets[0].resources && e.response.resourceSets[0].resources[0] && e.response.resourceSets[0].resources[0].address && e.response.resourceSets[0].resources[0].address.formattedAddress)
					$.address.value = e.response.resourceSets[0].resources[0].address.formattedAddress;
			}
		});		
	});
}

function showBanner()
{
	var geo = Alloy.Globals.geo;
	geo.checkLocation(function() {
		if(geo.location.status != geo.errors.NONE) {			
			Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
			indicator.closeIndicator();
			return;
		}
		
		lat = geo.location.latitude;
		lng = geo.location.longitude;
		indicator.openIndicator();	
		Alloy.Collections.banners.fetch({
			data : {
				lat : lat,
				lng : lng
			},
			success : function() {
				//indicator.closeIndicator();
				var modal = Titanium.UI.createWindow({
					layout : 'absolute',
					height : Ti.UI.FILL,
					width : Ti.UI.FILL,
					top : 10,
					left : 10,
					right : 10,
					bottom : 10,
					backgroundColor : '#f0f0f0',
					zIndex : 1
				});
				var closeBtn = Titanium.UI.createButton({
					id : 'closeBtn',
					title : 'x',
					height : 30,
					width : 30,
					top : 0,
					right : 0,
					backgroundColor: Alloy.Globals.Styles.buttonBg,
					color: '#fff', 					
					zIndex : 10
				});

				var image = Ti.UI.createImageView({
					zIndex : 5,
					image : "http://" + Ti.App.serverDomain + "/images/" + arguments[1]
				});

				function closeModal() {
					modal.close();
				}


				closeBtn.addEventListener('click', closeModal);

				setTimeout(function() {
					modal.add(closeBtn);
				}, 5000);

				modal.add(image);
				modal.open();
			},
			error : function() {
				//indicator.closeIndicator();
			}
		}); 
	});	
	
}
var transformCount = 0;
function transform(model) {
	var transform = model.toJSON();
	transform.price = transform.currency + ' ' + transform.price;
	
	transform.distance = parseFloat(transform.distance).toFixed(2) + " km";
	transform.myLat = lat;
	transform.myLng = lng;
	
	transform.dealtype = Alloy.Globals.core.dealType[transform.dealtype].title;
	if(transform.endTime)
	{
		transform.endTime = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(transform.endTime));
	}
	
	if(transform.images && transform.images.length > 0)
		transform.images = JSON.parse(transform.images);
	else
		transform.images = [];
			
	if(transform.images.length > 0)
		transform.image = 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + transform.images[0] + Alloy.Globals.imageSizes.deal.row(); 
	transformCount++;
	return transform; 
}


 var getHomeDeals = function(){
	var geo = Alloy.Globals.geo;
	
	geo.checkLocation(function() {
		if(geo.location.status != geo.errors.NONE) {
			Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
			indicator.closeIndicator();
			return;
		}				
		lat = geo.location.latitude;
		lng = geo.location.longitude;
		NewFetch();

		geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
			if (e && e.error) {
				if (e.message)
					Alloy.Globals.core.showErrorDialog(L(e.message));
				else
					Alloy.Globals.core.showErrorDialog(L(e.error));
			} else if (e && e.response) {
				if(e.response.results && e.response.results[0] && e.response.results[0].formatted_address)
					$.address.value = e.response.results[0].formatted_address;
				else if(e.response.resourceSets && e.response.resourceSets[0] && e.response.resourceSets[0].resources && e.response.resourceSets[0].resources[0] && e.response.resourceSets[0].resources[0].address && e.response.resourceSets[0].resources[0].address && e.response.resourceSets[0].resources[0].address.formattedAddress)
					$.address.value = e.response.resourceSets[0].resources[0].address.formattedAddress;				
			}
		});

	});
};	


function deviceTokenSuccess(e)
{
	Ti.App.Properties.setString("token", e.deviceToken);
	Alloy.Globals.core.deviceToken = e.deviceToken;
	Ti.API.info('Token - ' + e.deviceToken);
	if (Ti.Platform.name === "iPhone OS") {
		var messages = Ti.App.Properties.getObject("messages");
		messages.push("Register location service, time - " + new Date().toString());
		Ti.App.Properties.setObject("messages", messages);		
		Ti.Geolocation.addEventListener("location", Alloy.Globals.locations.updateLocation);
	}	
	showBanner();
	loadCategories(e.deviceToken);
}


function deviceTokenError(e) {
	Ti.API.error(e);
	indicator.closeIndicator();
	if (Ti.Platform.model == 'Simulator' || Ti.Platform.model === "google_sdk") {
		var deviceToken = 'fake_device_ token';
		loadCategories(deviceToken);
	}
}


var subcats = [];

var newFatch = function(){	
	
	if (!Ti.Network.online) {
		Alloy.Globals.core.showErrorDialog(L('network_off_line'));
		indicator.closeIndicator();
		return;
	}

	if (Ti.Platform.name === "iPhone OS") 
	{
		if(parseInt(Ti.Platform.version.split(".")[0]) >= 8)
		{			
			function registerForPush() {
				Ti.Network.registerForPushNotifications({
					success : deviceTokenSuccess,
					error : deviceTokenError,
					callback : notifyReceive
				});
				Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
			};

			Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);

			Titanium.App.iOS.registerUserNotificationSettings({
				types:[Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
			});
		}
		else
		{
			Ti.Network.registerForPushNotifications({
				types : [Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_SOUND],
				success		: deviceTokenSuccess,
				error		: deviceTokenError,
				callback	: notifyReceive
			});
		}
	}
	else if(Ti.Platform.name === "Android")
	{
		var cloudPush = require("ti.cloudpush");
		cloudPush.retrieveDeviceToken({
			success: deviceTokenSuccess,
			error: deviceTokenError
		});		
	}
};

Ti.App.Properties.setInt("count",0);

function loadCategories(deviceToken)
{
	indicator.openIndicator();	
	Alloy.Collections.categories.fetch({data:{lng: Ti.Platform.locale},
		cache : {
			name : 'categories',
			validMinutes : 60
		},
		success : function() {
			loadSubcategories(deviceToken);
		},
		error : function(model, xhr, options) {
			//Alloy.Globals.core.showErrorDialog(L("internet_weak"));
			loadCategories(deviceToken);
			indicator.closeIndicator();
		}
	}); 
}


function loadSubcategories(deviceToken) {
	indicator.openIndicator();
	Alloy.Collections.subCategories.fetch({data:{lng: Ti.Platform.locale},
		cache : {
			name : 'subCategories',
			validMinutes : 60
		},
		success : function() {
			loadNotifications(deviceToken);
		},
		error : function(model, xhr, options) {
			//Alloy.Globals.core.showErrorDialog(L("internet_weak"));
			loadSubcategories(deviceToken);
			indicator.closeIndicator();
		}
	});
}


function loadNotifications(deviceToken) {
	indicator.openIndicator();
	var notify = Alloy.createModel('notify');
	notify.fetch({
		data : {
			deviceToken : deviceToken,
			appInstallId : Alloy.Globals.core.installId,
			appVersion : Ti.App.version,
			platformModel : Ti.Platform.model,
			platformVersion : Ti.Platform.version,
			platformOSName : Ti.Platform.osname,
			language : Ti.Locale.currentLanguage,
			lat : lat,
			lng : lng,
			offset : new Date().getTimezoneOffset()
		},
		success : function() {
			notify = notify.toJSON();
			Alloy.Globals.notify = {
				id : notify.id,
				subCategories : notify.subcategories,
				period : notify.period,
				for_ : notify.for_,
				from : notify.from,
				to : notify.to,
				deviceToken : notify.devicetoken,
				lat : notify.lat,
				lng : notify.lng,
				distance : notify.distance,
			};
						
			Ti.App.fireEvent("notify:notifyload");
			indicator.closeIndicator();
		},
		error : function(model, xhr, options) {
			loadNotifications(deviceToken);
			//Alloy.Globals.core.showErrorDialog(L("internet_weak"));
			indicator.closeIndicator();
		}
	});
}

Ti.App.addEventListener("resumed", function(e){
	Ti.API.info("resumed!!!!!");	
	if(Alloy.Globals.notify)
	{
		Ti.App.Properties.setObject("notify", Alloy.Globals.notify);
	}
	var token = Alloy.Globals.core.apiToken();
	
	if(!Ti.Network.online)
	{
		if(!Alloy.Globals.core.offlineModal)
			Alloy.Globals.core.createOfflineModal();
		Alloy.Globals.core.offlineModal.show();
		return;
	}
	
	getHomeDeals();
		
	Ti.App.Properties.setObject("messages", []);
	
	Alloy.Globals.core.applicationPaused = false;
	if(!token)
		return;
	if(Alloy.Globals.chat.connected)
		Alloy.Globals.chat.source.close();
	
	Alloy.Globals.chat.openConnect();
	
	if(Alloy.Globals.chat.openChatId > 0)
	{
		var indicator = Alloy.Globals.indicator;
		indicator.openIndicator();
		var messages = Alloy.createCollection('message');
		messages.fetch({
			data:{
					chatId: Alloy.Globals.chat.openChatId,
					offset: 0,
					length: 10
				},
			success: function(response, data)
			{
				Alloy.Globals.chat.items = [];
				var items =	Alloy.Globals.chat.addMessage(data);
				Alloy.Globals.chat.messagesWindow.setData(items);
				if(Alloy.Globals.chat.messagesWindow.data[0]){
					Alloy.Globals.chat.messagesWindow.scrollToIndex(Alloy.Globals.chat.messagesWindow.data[0].rows.length - 1);		
				}
				
			},
			error: function()
			{
				//loading = false;
				indicator.closeIndicator();
				//refreshControl.endRefreshing();
			}
		});
		Alloy.Collections.messages.fetch({data:{chatId: Alloy.Globals.chat.openChatId}, success: function(){ indicator.closeIndicator();}});
	}
});


function notifyReceive(data)
{		
	var view = false;
	var inBackground = data.inBackground;
	data = data.data;
	if(Alloy.Globals.core.applicationPaused && data.newChatMessage && inBackground)
	{
		//Тут должен быть массив значений
		//[0] - MessageId
		//[1] - ChatId
		//[2] - FromUserId
		//[3] - ToUserId
		//[4] - FromUser
		var message = JSON.parse(data.newChatMessage);		
		
		
		if(message[1] != Alloy.Globals.chat.openChatId)
		{
			view = Alloy.createController("account/answers/answer", {newChat: false, id: message[1], toUser: message[2], UserName: message[4]}).getView();
		}				
	}
	else if(data.newChatMessage && !inBackground)
		{
			Ti.API.info("Connected - " + Alloy.Globals.chat.connected);
			var message = JSON.parse(data.newChatMessage);
			if(!Alloy.Globals.chat.connected)
			{
				if(message[1] != Alloy.Globals.chat.openChatId)
				{
					Alloy.Globals.chat.notify(L("chat"), L("new_message"), message, function(d){
						view = Alloy.createController("account/answers/answer", {newChat: false, id: d[1], toUser: d[2], UserName: d[4]}).getView();
						if(Alloy.Globals.tabGroup.activeTab)
							Alloy.Globals.tabGroup.activeTab.open(view);
						else
						{
							Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
							Alloy.Globals.tabGroup.activeTab.open(view);					
						}
					});
				}
				else
				{
					indicator.openIndicator();
					var messages = Alloy.createCollection('message');
					messages.fetch({
						data:{
								chatId: Alloy.Globals.chat.openChatId,
								offset: 0,
								length: 10
							},
						success: function(response, data)
						{
							Alloy.Globals.chat.items = [];
							var items =	Alloy.Globals.chat.addMessage(data);
							Alloy.Globals.chat.messagesWindow.setData(items);
							if(Alloy.Globals.chat.messagesWindow.data[0]){
								Alloy.Globals.chat.messagesWindow.scrollToIndex(Alloy.Globals.chat.messagesWindow.data[0].rows.length - 1);		
							}
							
						},
						error: function()
						{							
							indicator.closeIndicator();							
						}
					});
					Alloy.Collections.messages.fetch({data:{chatId: Alloy.Globals.chat.openChatId}, success: function(){ indicator.closeIndicator();}});
				}
			}			
		}
	else if(data.offer)
	{
		var offerData = JSON.parse(data.offer);
		
		var view = false;
		
		if(Alloy.Globals.core.applicationPaused)
		{
			if(offerData.FromUserId != Alloy.Globals.profile.id)
				view = Alloy.createController('account/offers/offer', {offerId:offerData.Id}).getView();
			else
				view = Alloy.createController('account/offers/myOffer', {offerId:offerData.Id}).getView();
		}
		else
		{
			Alloy.Globals.chat.notify(L("offer"), data.alert, data, function(d){
				if(d.FromUserId != Alloy.Globals.profile.id)
					view = Alloy.createController('account/offers/offer', {offerId:offerData.Id}).getView();
				else
					view = Alloy.createController('account/offers/myOffer', {offerId:offerData.Id}).getView();
				if(Alloy.Globals.tabGroup.activeTab)
					Alloy.Globals.tabGroup.activeTab.open(view);
				else
				{
					Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
					Alloy.Globals.tabGroup.activeTab.open(view);					
				}
			});
		}
	}
	else if(data.newDeals)
	{
		Alloy.Globals.chat.notify(L("new_deals"), data.alert, data);		
	}else if(data.deals)
	{
		Alloy.Globals.chat.notify(L("deals"), data.alert, data);		
	}
	
	if(view)
	{
		if(Alloy.Globals.tabGroup.activeTab)
			Alloy.Globals.tabGroup.activeTab.open(view);
		else
		{
			Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
			Alloy.Globals.tabGroup.activeTab.open(view);
		}
	}
		
}

function findTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function findTouchEnd(e){
	indicator.openIndicator();
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	switch(e.source.id)
	{
		case "findBtn": { clickFind(); break; }
		case "customLocation": { customLocation(); break; }
		case "settings": { goToNotifications(); break; }
	}
}

function goToNotifications()
{
	indicator.closeIndicator();
	var view = Alloy.createController('notifications/index').getView();
	
	// Alloy.CFG.tabNotifications.setWindow(view);
	Alloy.CFG.tabNotifications.setActive(true);
}

var rowIndex;
function search(){	
	geo.geocoding($.address.value, function(geodata) {
		if(geodata.error)
		{
			Alloy.Globals.core.showErrorDialog(L(geodata.message));
			return;
		}
		if(geodata.error == geo.elementStatuses.ZERO_RESULTS || geodata.error == geo.elementStatuses.NOT_FOUND)
		{
			Alloy.Globals.core.showErrorDialog(L("address_not_found"));
			return;
		}
		var items = [];
		for (var i=0; i < geodata.response.results.length; i++) {
		  var result = geodata.response.results[i];
		  items.push({title: result.formatted_address, data:{lat: result.geometry.location.lat, lng:result.geometry.location.lng}});
		  
		};		
		var addressPicker = Alloy.createController('picker/genericPicker', {
			callback: function(item, close, index) {				 
				if(!item.title)				 
					$.address.value = item;
				else
					$.address.value = item.title;
				if(item.data)
				{
					lat = item.data.lat;
					lng = item.data.lng;
				}
				if(index)
					rowIndex = index;
				if(close){
					$.pickerWrap.removeAllChildren();					
				}
			},
			rowIndex: rowIndex,
			items: items
		}).getView();	
		
		closeKeyboard();
		$.pickerWrap.removeAllChildren();
		$.pickerWrap.add(addressPicker);
		
	});
};

function open(e)
{
	indicator.openIndicator();
	selectDistance(2000);
	newFatch();
	if(Ti.Platform.model == 'Simulator')
	{
		if(!lat && !lng)		
		{
			lat = 59, 9885368;
			lng = 30, 2922766;
		}
		loadCategories(Alloy.CFG.deviceToken);
	}	
}

Ti.App.addEventListener("home:defaultsearch", function(){update = false; getHomeDeals();});
function winOnClick(e){
	if(e.source.id != "address") closeKeyboard();
}

function closeKeyboard()
{
	$.address.blur();	
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
	beginUpdate(e);
}

var dataLength = 10;
function beginUpdate() {
    indicator.openIndicator();
    updating = true;
    var token = Alloy.Globals.core.apiToken();
    var time = new Date();
    aliments.fetch({
    	add: true,
    	silent: true,
    	data:{
	    	offset: aliments.length,
			lat: lat,
			lng: lng,
			clientTimeZoneOffset: time.getTimezoneOffset(),
			distance: 2000,
			token: Alloy.Globals.core.apiToken(),
			deviceToken: Alloy.Globals.core.deviceToken,
			subcategoriesOnly: true,
			appInstallId	: Alloy.Globals.core.installId, //Ti.App.installId,
			appVersion		: Ti.App.version,
			platformModel	: Ti.Platform.model,
			platformVersion	: Ti.Platform.version,
			platformOSName	: Ti.Platform.osname,
			language		: Ti.Locale.currentLanguage,
			subcategories: JSON.stringify(subcats)},
		success: function(response, data) {
			Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/defaultSearchRow");
			var rows = $.deals.data[0].rows;
			var height = 0;
			for (var i=0; i < rows.length; i++) {
				var row = rows[i];
				var image = row.toImage();
				height += image.height;
			};
			$.deals.setHeight(height);
			if(data.length < dataLength) 
			{
				$.loadMore.hide();
				$.noLoad.show();
			}
			Ti.API.info(transformCount);
            updating = false;
            indicator.closeIndicator();
            transformCount = 0;
            
        },
        error: function(e) {        	
            updating = false;
            indicator.closeIndicator();
            
        }
	});    
}

function NewFetch()
{
	var time = new Date();
	indicator.openIndicator();
	
	subcats = [];
	if(!Alloy.Globals.notify.subCategories || Alloy.Globals.notify.subCategories.length < 3) 
		return;
	var items = JSON.parse(Alloy.Globals.notify.subCategories);	
	for (var i = 0; i < items.length; i++) {
		var s = items[i];
		if(s.Id)
			subcats.push(s.Id);
		else
			subcats.push(s);
	};

		
	aliments.fetch({
		data:{    	
		lat: lat,
		lng: lng,
		clientTimeZoneOffset: time.getTimezoneOffset(),
		distance: Alloy.Globals.notify.distance,
		token: Alloy.Globals.core.apiToken(),
		subCategoriesOnly: true,
		deviceToken: Alloy.Globals.core.deviceToken,
		appInstallId	: Alloy.Globals.core.installId, //Ti.App.installId,
		appVersion		: Ti.App.version,
		platformModel	: Ti.Platform.model,
		platformVersion	: Ti.Platform.version,
		platformOSName	: Ti.Platform.osname,
		language		: Ti.Locale.currentLanguage,
		subcategories: JSON.stringify(subcats)},		
		success: function(response, data){
			if(aliments.models.length === 0)
			{
				indicator.closeIndicator();
				return;
			}
			Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/defaultSearchRow");
			var rows = $.deals.data[0].rows;
			var height = 0;
			for (var i=0; i < rows.length; i++) {
				var row = rows[i];
				var image = row.toImage();
				height += image.height;
			};
			$.deals.setHeight(height);
			updating = false;
			indicator.closeIndicator();
			if(data.length < dataLength){
				$.loadMore.hide();
				$.noLoad.show();
			}
			else{
				$.loadMore.show();
				$.noLoad.hide();
			}
			Ti.API.info(transformCount);
			transformCount = 0;			   
		},
		error: function(){
			updating = true;
			indicator.closeIndicator();
		}
	});
}

/*$.categoriesBtn.addEventListener('click', function(e) {
	
});*/