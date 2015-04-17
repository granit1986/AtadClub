
var DEBUG =  false;

/* SERVER DOMAIN */
if (DEBUG) {
	//Titanium.App.serverDomain = 'atadclub.local';
	Titanium.App.serverDomain = '192.168.0.188';	
}
else {
	Titanium.App.serverDomain = 'atadclub.slavin.biz';
}

Titanium.App.ApiVersion = 0;

/* COLLECTIONS */

Alloy.Collections.publicAdverts	= Alloy.createCollection('publicAdvert');
Alloy.Collections.adverts		= Alloy.createCollection('advert');
Alloy.Collections.blackList		= Alloy.createCollection('blackList');
Alloy.Collections.publicDeals	= Alloy.createCollection('publicDeal');
Alloy.Collections.banners		= Alloy.createCollection('banner');
Alloy.Collections.similarDeals	= Alloy.createCollection('similarDeal');
Alloy.Collections.homeDeals		= Alloy.createCollection('homeDeal');
Alloy.Collections.companyDeals	= Alloy.createCollection('companyDeal');
Alloy.Collections.deals			= Alloy.createCollection('deal');
Alloy.Collections.products		= Alloy.createCollection('product');
Alloy.Collections.companies		= Alloy.createCollection('publicCompany');
Alloy.Collections.companiesWithDeals		= Alloy.createCollection('companyWithDeals');
Alloy.Collections.offers		= Alloy.createCollection('offer');
Alloy.Collections.chats			= Alloy.createCollection('chat');
Alloy.Collections.messages		= Alloy.createCollection('message');
Alloy.Collections.categories	= Alloy.createCollection('category');
Alloy.Collections.subCategories	= Alloy.createCollection('subCategory');
Alloy.Collections.supplierProducts = Alloy.createCollection('supplierProducts');

//Alloy.Collections.MaxDealRenews = Alloy.createCollection('maxDealRenews');

//Костыль. Потому что после логина УРЛ переопределяется. Не нашел причины
Object.defineProperty(Alloy.Collections.publicDeals.config, "URL", {writable: false});



/* USER INPUT ERRORS */
Titanium.include('lib/errors.js');
Alloy.Globals.errors = errors;

/* CATEGORIES */
Titanium.include('lib/categories.js');
Titanium.include('lib/subCategories.js');

/* GEO */
Titanium.include('lib/geo.js');
Alloy.Globals.geo = geo;

/* UPLOAD */
Titanium.include('lib/upload.js');
Alloy.Globals.upload = upload;

/* UPLOAD */
Titanium.include('lib/imageSizes.js');
Alloy.Globals.imageSizes = imageSizes;

/*ChackBox*/
Titanium.include('lib/checkBox.js');
Alloy.Globals.checkBox = checkBox;

/*Indicator*/
var uie = require('lib/indicator');
Alloy.Globals.indicator = uie.createIndicatorWindow();

/*ProgressBar*/
var prog = require('lib/progress');
Alloy.Globals.progress = prog.createProgressBar();

/*Storekit*/
Titanium.include('lib/store.js');
Alloy.Globals.store = store;


Alloy.Globals.Map = require('ti.map');
if (OS_IOS || OS_ANDROID) {
	Ti.Map = require('ti.map');
}

Alloy.Globals.caches = {};

Alloy.Globals.LATITUDE_BASE = 37.389569;
Alloy.Globals.LONGITUDE_BASE = -122.050212;


Titanium.include('lib/db.js');

var loadingPage = null;



Ti.App.addEventListener("pause", function(e){
	Ti.API.info("pause");
	var messagesArray = Ti.App.Properties.getObject("messages");
	messagesArray.push("Paused app, time - " + new Date().toString());
	Ti.App.Properties.setObject("messages", messagesArray);
	Alloy.Globals.core.applicationPaused = true;
	Alloy.Globals.chat.connecting = false;
	if(Alloy.Globals.chat.source)
	{
		Alloy.Globals.chat.source.close();		
	}
});



Alloy.Globals.core = {
	debug: DEBUG,	
	createRows: function (collection, transformFunction, tableView, rowUrl) {
		var items = [];
		for (var i = 0; i < collection.models.length; i++) {
			var element = collection.models[i];
			items.push(transformFunction(element));
		};

		var data = [];
		for (var i = 0; i < items.length; i++) {
			var model = items[i];
			data.push(Alloy.createController(rowUrl, {
				model : model
			}).getView());
		};
		tableView.setData(data);
	},

	token: false,
	applicationPaused : false,	
	isSupplier: false,
	showHideLoadIndicator: function(event){ 
		
	},
	purchased: {},
	activeTab: function(tabName)
	{
		var tabs = Alloy.Globals.tabGroup.tabs;
		for (var i=0; i < tabs.length; i++) {
		  var tab = tabs[i];
		  if(tab.titleid == tabName)
		  {
		  	tab.setActive(true);
		  	break;
		  }
		};
		
	},
	offlineModal: false,
	createOfflineModal: function(){
		var self = this;
		self.offlineModal = Ti.UI.createAlertDialog({
			message: L("no_connection"),
			buttonNames: [L("try_again")]			
		});
		self.offlineModal.addEventListener('click', function(){
			if(!Ti.Network.online)
				self.offlineModal.show();
			else
				self.offlineModal.hide();
		});
	},
	localTime: function(utcTime) {
		var offset = utcTime.getTimezoneOffset();
	    var localTime = utcTime + offset;
	    return localTime;	
	},
	maxDealRenew: function(callback){
		xhr = Titanium.Network.createHTTPClient();
		var xhr = Ti.Network.createHTTPClient({
	        onload: function(e) {
	           callback(this.responseText);
	        },
	        onerror: function(e) {
	            Ti.API.info(this.responseText);
	        },
	        timeout:10000  
    	});
    	xhr.open('GET','http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/automaticRenew');
    	xhr.send();
	},
	createTime: function(timeSpan) {
    	var date = new Date();
    	return new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),parseInt((parseInt(timeSpan) / 60)),(parseInt(timeSpan) % 60)));
    },
    creatTimeSpan: function(time) {
        return 60 * time.getUTCHours() + time.getUTCMinutes();
    },
    viewTime: function(date){	
		var hours = date.getHours();
		var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		var dayTime = 'AM';
		if(hours >= 12)
		{
			dayTime = 'PM';
			hours = hours - 12;
		}
		return hours + ':' + minutes + ' ' + dayTime;
	},
	currencyItems: [{title: "ILS \u20aa", data:{id: 8362}}, {title: "EUR \u20ac", data:{id: 8364}}, {title: "USD $", data:{id: 36}},  
					{title: "GBP \u00a3", data:{id: 163}}, {title: "JPY \u00a5", data:{id: 165}}, {title: "RUB RUR", data:{id: "RUR"}}, {title: "AUD $", data:{id: 36}},
					{title: "CHF Fr", data:{id: "Fr"}}, {title: "CAD $", data:{id: 36}}, {title: "MXN $", data:{id: 36}}, {title: "CNY \u00a5", data:{id: 165}}, {title: "NZD $", data:{id: 36}},
					{title: "SEK kr", data:{id: "kr"}}, {title: "HKD $", data:{id: 36}}, {title: "SGD $", data:{id: 36}}, {title: "TRY Lr", data:{id: "Lr"}},],
    appUrl: "http://goo.gl/ul5vRk",
	dealType:[{title:"1 + 1", id: '0'}, {title:"-10%", id: '1'}, {title:"-20%", id: '2'}, {title:"-25%", id: '3'}, {title:"-30%", id: '4'}, {title:"-35%", id: '5'}, 
			{title:"-40%", id: '6'}, {title:"-45%", id: '7'}, {title:"-50%", id: '8'}, {title:"-55%", id: '9'}, {title:"-60%", id: '10'}, {title:"-65%", id: '11'}, 
			{title:"-70%", id: '12'}, {title:"-75%", id: '13'}, {title:"-80%", id: '14'}, {title:"-85%", id: '15'}, {title:"-90%", id: '16'}, {title: L("vacancy"), id:'17'}],
	apiToken: function(a) {
		
		
		
		if (a == undefined){
			//Alloy.Globals.core.showErrorDialog(GetApiToken());
			return GetApiToken();	
		} 
		a = SetToken(a);
		return a;	
	},
	
	selectedHomeCategories: {},
	selectedNewAdvertCategories: {},
	selectedNewDealsCategories: {},
	selectedNotificationsCategories: {},	
	selectedCategories: {},
	selectedProducts: {},
	selectedCategoriesInEdit: {},
	currentSection: "",
	currentSectionCategories: function(){
		var section = this.currentSection;
		switch(section){
			case "home":{
				return this.selectedHomeCategories;
				break;
			}
			case "newadvert":{
			 	return this.selectedNewAdvertCategories;
				break;
			}
			case "newdealer":{
				return this.selectedNewDealsCategories;
				break;
			}
			case "notifications":{
				return this.selectedNotificationsCategories;
				break;
			}
			case "products": {
				return this.selectedProducts;				
			}
			default :{
				return this.selectedCategoriesInEdit;
				break;
			}
		}
	},
	categories:categories,
	subCategories:subCategories,

	rxs: {
		email			: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		password		: /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,}/,
		empty			: /^[\s]*$/,
		phone			: /^\+{0,1}\d{6,11}$/,
		number			: /^[\w]{5,}$/,
		isUndefined		: function(e){ return typeof e == "undefined"; }
	},
	showError: function(err) {
		Alloy.Globals.core.showErrorDialog(L(err.error));
	},
	showErrorDialog:function(e) {
		if(e && e !== "")
			var dialog = Titanium.UI.createAlertDialog({
				title:e							
			}).show();
		
	},
	showWaitScreen: function() {
		
	},
	closeWaitScreen: function() {
		
	},	
	S4: function () {
		return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
	},
	guid: function () {
		return 
			Alloy.Globals.core.S4() + Alloy.Globals.core.S4() + "-" + 
			Alloy.Globals.core.S4() + "-" + 
			Alloy.Globals.core.S4() + "-" + 
			Alloy.Globals.core.S4() + "-" + 
			Alloy.Globals.core.S4() + Alloy.Globals.core.S4() + Alloy.Globals.core.S4();
	},
	waitWindow: false,
	waitTimeout: false,
	showWait: function() {
		if(Alloy.Globals.core.waitTimeout)
			return;
		Alloy.Globals.core.waitTimeout = setTimeout(function(){
			if(Alloy.Globals.core.waitWindow)
				return;
			Alloy.Globals.core.waitWindow = Alloy.createController("activity/index").getView();
			Alloy.Globals.core.waitWindow.open(); 
		}, 50);
	},
	deviceToken: false,
	hideWait: function() {
		if(Alloy.Globals.core.waitTimeout)
			clearTimeout(Alloy.Globals.core.waitTimeout);
		if(!Alloy.Globals.core.waitWindow)
			return;
		Alloy.Globals.core.waitWindow.close();
		Alloy.Globals.core.waitWindow = false;
	},	
	DeviceToken: function(){
		
		
			if(!Ti.Network.online) {
				Alloy.Globals.core.showErrorDialog(L('network_off_line'));
				return;
			}
			Titanium.Network.registerForPushNotifications({
				types:[
					Ti.Network.NOTIFICATION_TYPE_ALERT,
					Ti.Network.NOTIFICATION_TYPE_BADGE,					
					Ti.Network.NOTIFICATION_TYPE_SOUND	
				],
				success:function(e) {
					return e.deviceToken; 		
				},
				error:function(e) {  return null;},
				callback:function() { return null;},
			});		
		
	},
		
	//,installId: function() {}
};



Alloy.Globals.chat = {
	source: false,
	connected: false,
	connecting: false,
	openChatId: false,
	indicator: Alloy.Globals.indicator,
	items:[],
	notSendedMessage: false,
	messagesWindow: false,
	url: function(){ return 'ws://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/' + Alloy.Globals.core.apiToken() + '/chat/get';},
	openConnect: function()
	{		
		var self = this;
		
		Ti.API.info("Connecting - " + self.connecting);
		Ti.API.info("Connected - " + self.connected);
		if(self.connecting || self.connected)
		{
			Ti.API.info("Websocket already connected");
			return;
		}
		if(Ti.Platform.name==="android")
			return;
		self.indicator.openIndicator();
		self.source = require('net.iamyellow.tiws').createWS();
			
			
		self.source.addEventListener('message', function (e) {
			if(self.notSendedMessage)
		    	self.notSendedMessage = false;
		    console.log(e.data);
		    var result = JSON.parse(e.data);
		    if(self.openChatId == result.ChatId)
		    {		    	
		    	var row = self.createRow(result);
		    	self.items.push(row);
		    	self.messagesWindow.setData(self.items);
		    	if(self.messagesWindow.data[0]){
					self.messagesWindow.scrollToIndex(self.messagesWindow.data[0].rows.length - 1);		
				}
				var counts = Alloy.createModel('counts', {id: result.MessageId});
				if(result.FromUserId !== Alloy.Globals.profile.id)
					counts.save({},{});
		    }
		    else
		    {		    	
		    	self.notify(result.FromUser, result.Text, result, function(data)
		    	{
		    		var view = Alloy.createController("account/answers/answer", {newChat: false, id: data.ChatId, toUser: data.FromUserId, UserName: data.FromUser}).getView();
		    		if(Alloy.Globals.tabGroup.activeTab)
						Alloy.Globals.tabGroup.activeTab.open(view);
					else
					{
						Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
						Alloy.Globals.tabGroup.activeTab.open(view);
					}
		    	});		    	
		    }
		   
		}, false);
		self.source.addEventListener('open', function (e) {
		    console.log("open!");
		    self.connected = true;
		    self.connecting = false;
		    self.indicator.closeIndicator();
		    if(self.notSendedMessage)
		    	self.source.send(self.notSendedMessage);
		});
		
		
		self.source.addEventListener('close', function (e) {
		    console.log("close!");
		    self.connected = false;
		    self.connecting = false;
		    self.indicator.closeIndicator();
		});
			
		self.source.addEventListener('error', function (e) {
		    if (e.type == "error") {
		        //console.log(e.error);
		    }
		    console.log("error");
		    //Alloy.Globals.core.showErrorDialog(L("chat_server_unavailable"));
		    self.indicator.closeIndicator();
		    self.connected = false;
		    self.connecting = false;	    
		});
			 
		Ti.API.info(self.url());
		
		
		
		self.connecting = true;
		self.source.open(self.url());		
		
	},	
	notify: function(title, mesage, data, clickFunction){
		if(!title,!mesage) return;
		var tStart = Titanium.UI.create2DMatrix().translate(0,-60),
			tShow = Titanium.UI.create2DMatrix().translate(0,0),
			tHide = Titanium.UI.create2DMatrix().translate(0,-60),
			a = Titanium.UI.createAnimation(),
			duration = 200,
			lifeTime = 5000;
	
		var modal = Titanium.UI.createWindow({
			layout	: 'absolute',
			height	:50,
			width	:320,
			top		:0,
			backgroundColor:'#f0f0f0',
			transform:tStart
		});
	
		a.transform = tShow;
		a.duration = duration;
	
		var titleLabel = Titanium.UI.createLabel({
			text	:title,
			height	:20,
			width	:280,
			top		:5,
			left	:10,
			color	:'#555',
			font	: {fontSize: '16dp', fontFamily: 'Avenir Next Condensed', fontWeight: 'Bold'}
		});
		
		var mesageLabel = Titanium.UI.createLabel({
			text	:mesage,
			height	:20,
			width	:280,
			top		:25,
			left	:10,
			color	:'#555',
			font	: {fontSize: '15dp', fontFamily: 'Avenir Next Condensed', fontWeight: 'Regular'}
		});
		
		var line = Titanium.UI.createView({
			height	:1,
			width	:320,
			top		:49,
			left	:0,
			backgroundColor:'#999'
		});
	
		var closeBtn = Titanium.UI.createButton({
			id		:'closeBtn',
			title	:'x',
			height	:30,
			width	:30,
			top		:0,
			right	:0,
			style	:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
			color	:"#555",
			font	: {fontSize: '16dp'}
		});
		
		
		function closeModal(){
			modal.close({transform:tHide,duration:duration});
		}
		setTimeout(closeModal,lifeTime);
		
		modal.addEventListener('click', function(e)
		{
			if(e.source.id != 'closeBtn') {
				if(clickFunction)
					{
						clickFunction(data);
						modal.close();
					}
			}
		});
		closeBtn.addEventListener('click', closeModal);
	
		modal.add(titleLabel);
		modal.add(mesageLabel);
		modal.add(line);
		modal.add(closeBtn);
		modal.open(a);
	},
	addMessage:function(data)
	{
		var self = this;		
		for (var i=0; i < data.length; i++) 
		{
			var item = data[i];
			var row = self.createRow(item);
			self.items.splice(0, 0, row);
		};
		return self.items;
	},
	createRow: function(data)
	{
		var row = Ti.UI.createTableViewRow({
			layout:'absolute',
			height: Ti.UI.SIZE,
			bottom:'5dp',
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		});
		var image = Ti.UI.createImageView({
			id:"arrow",
			width:'10dp',
			heigth:'10dp',
			bottom:'2dp',
			font:{fontSize:'1dp'}
		});
		row.add(image);
		var view = Ti.UI.createView({
			width: '200dp',
			height: Ti.UI.SIZE,
			layout:'vertical'
		});
		var bubbleLabel = Ti.UI.createLabel({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			borderRadius:'15dp',
			borderWidth:'1dp',
			layout:'vertical'
		});
		var messageWrapLabel = Ti.UI.createLabel({
			right:'7dp',
		});
		var messageLabel = Ti.UI.createLabel({
			text: data.Text, 
			height: Ti.UI.SIZE,
			left:'7dp',
			top:'5dp',
			bottom:'5dp',
			font: 	{fontSize: '14dp'}
		});
		var dirLabel = Ti.UI.createLabel({
			visible: false, 
			width:'10dp',
			heigth:'10dp',
			bottom:'3dp',
			font:{fontSize:'1dp'}
		});
		if(data.FromUserId == Alloy.Globals.profile.id){
			// bubbleWrap
			view.right = '12dp';
			// bubble
			bubbleLabel.backgroundColor = '#007aff';
			bubbleLabel.borderColor = '#007aff';
			bubbleLabel.right = "0dp";
			// message
			messageLabel.color = '#fff';
			// arrow
			image.image = 'images/messageOut.png';
			image.right = '8dp';
			
		}else{
			view.left = '12dp';
			// bubble
			bubbleLabel.backgroundColor = '#e7e4eb';
			bubbleLabel.borderColor = '#e7e4eb';
			bubbleLabel.left = "0dp";
			// message
			messageLabel.color = '#1b1b1b';
			// arrow
			image.image = 'images/messageIn.png';
			image.left = '8dp';
			
		}
		
		messageWrapLabel.add(messageLabel);
		bubbleLabel.add(messageWrapLabel);
		view.add(bubbleLabel);
		row.add(view);
		row.add(dirLabel);
		
		
		function showError(){
			var tryAgainWrap1 = Ti.UI.createView({
				width:Ti.UI.SIZE,
				height:Ti.UI.SIZE,
				layout:'vertical',
				right:"7dp",
				top:-8,
				bottom:5
				
			});
			var tryAgainWrap2 = Ti.UI.createView({
				width:Ti.UI.SIZE,
				height:Ti.UI.SIZE,
				layout:'absolute',
				left:"7dp"
				
			});
			var tryAgain = Ti.UI.createLabel({
				textId:"Try again",
				color:"#fff",
				height:"20dp",
				font: 	{fontSize: '12dp'}
			});
			var tryAgainLine = Ti.UI.createView({
				height:"1dp",
				width:"50dp",
				backgroundColor:"#fff",
				top:"18dp"
			});
			tryAgainWrap2.add(tryAgain);
			tryAgainWrap2.add(tryAgainLine);
			tryAgainWrap1.add(tryAgainWrap2);
			bubbleLabel.add(tryAgainWrap1);
		}
		//showError();
		
		
		return row;
	}
};

if(OS_IOS)
	Alloy.Globals.core.installId = 	Ti.App.installId; 
else {
	if(!Ti.App.Properties.hasProperty('installId'))
		Ti.App.Properties.setString('installId', Ti.App.sessionId);
	Alloy.Globals.core.installId = 	Ti.App.Properties.getString('installId'); 
}

var stylesArray;


Alloy.Globals.isHe = false;
if(Titanium.Platform.locale === 'he'){
	Alloy.Globals.isHe = true;
	Titanium.include('lib/stylesRtl.js');
	Alloy.Globals.Styles = stylesRtl;	
}else
{
	Titanium.include('lib/styles.js');
	Alloy.Globals.Styles = styles;
}

Alloy.Globals.isHebrew = (Ti.Platform.locale != "he");

Object.size = function(obj){
	var size = 0, key;
	for(key in obj){
		if(obj.hasOwnProperty(key)) size++;
	}
	return size;
};

function Benchmark(){
	this.beginTime = new Date();
}

Benchmark.prototype = {
	test: function(){
		return (new Date()).getTime() - this.beginTime.getTime();
	}
};

Ti.App.addEventListener('addWindow', function(key, win){
	Ti.API.info("addWindow");
	if(Alloy.Globals.tabs.tabs[key] === undefined)
		Alloy.Globals.tabs.tabs[key] = key;	
	var tab = Alloy.Globals.tabs.tabs[key];
	if(tab.windows === undefined)
		tab.windows = new Array();
	tab.push(win);
});

Ti.App.addEventListener('removeWindows', function(key)
{
	Ti.API.info("removeWindow");
	for (var i=0; i < Alloy.Globals.tabs.tabs[key].windows.length; i++) {
	  var window = Alloy.Globals.tabs.tabs[key].windows[i];
	  window.close();
	};
	Alloy.Globals.tabs.tabs[key].windows = new Array();
});

Alloy.Globals.tabs = {
	tabs:{}
};

Alloy.Globals.notifications = {
  	notifySettings: false,
	startTimer: function(seconds)
	{
		var self = this;
		Ti.API.info("Create notification geoposiotion timer");
		//alert("Create notification geoposiotion timer");
		self.timer = setInterval(function(){
			Ti.API.info("Start notification geoposiotion timer");
			//alert("Start notification geoposiotion timer");
			if(Alloy.Globals.core.applicationPaused && Alloy.Globals.chat.connected)
				Alloy.Globals.chat.source.close();			
			if(self.notifySettings)
			{
				var geo = Alloy.Globals.geo;
				Ti.API.info("Check position");				
				geo.checkLocation(function() {
					if(geo.location.status != geo.errors.NONE) {
						Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
						Ti.API.info(geo.location.status.message);						
						return;
					}
					Ti.API.info("lat="+geo.location.latitude+", lng="+geo.location.longitude + ", notifySettings" + self.notifySettings);					
					var model = Alloy.createModel('tracking', {
						id		: self.notifySettings.id,
						lat		: geo.location.latitude,
						lng		: geo.location.longitude,
						offset	: new Date().getTimezoneOffset()
					});
					model.save({},{
						success	: function(){Ti.API.info("Coordinates saved - " + new Date().toLocaleString()); },
						error	:function(model, xhr, options) {Ti.API.info("error");}
					});	
						
				});
			}
			else
				Ti.API.info("NotifySettings - " + self.notifySettings);
		}, seconds * 1000);
	},
	stopTimer: function(){		
		var self = this;
		clearInterval(self.timer);
		self.timer = false;
		self.notifySettings = false;
		Ti.API.info("Stop geoposition timer");
	},
	timer: false	
};

Ti.App.Properties.setInt("warmgps",0);
Alloy.Globals.locations = {
	updateLocation : function(e) {
		Ti.API.info("enter update location");
		Ti.API.info(JSON.stringify(e));
		var messages = Ti.App.Properties.getObject("messages");
		messages.push("Method - location; time - " + new Date().toString());
		//Ti.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
		if (!Ti.Network.online) {
			messages.push("Network offline; time - " + new Date().toString());
			Ti.App.Properties.setObject("messages", messages);
			return;
		}
		
				
			
		Ti.API.info(Ti.Geolocation.accuracy);
		Ti.API.info(Ti.Geolocation.distanceFilter);
		if (Ti.Geolocation.accuracy != Titanium.Geolocation.ACCURACY_BEST && Ti.Geolocation.distanceFilter != 10) {
			Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.distanceFilter = 10;
		}

		
		if (e && e.coords && e.coords.latitude && e.coords.longitude) {
			var count = Ti.App.Properties.getInt("count");
			Ti.API.info("location");
			var lat = e.coords.latitude;
			var lng = e.coords.longitude;
			count++;
			messages.push("Lat - "+lat+"; Lng - "+lng+"; Count - "+count+"; time - " + new Date().toString());
			if (count >= 5) {
				Alloy.Globals.locations.send(lat, lng, false, messages);
				Ti.App.Properties.setInt("count", 0);
			}
			Ti.App.Properties.setObject("messages", messages);
			Ti.App.Properties.setInt("count", count);
		}
		else{			
			messages.push("No coords;"+JSON.stringify(e)+" time - " + new Date().toString());
			if(e.error)
			{
				messages.push("Error coords;"+JSON.stringify(e.error)+" time - " + new Date().toString());
			}
			Ti.App.Properties.setObject("messages", messages);
		}
	},
	send : function(lat, lng, async, messages) {
		var token = Ti.App.Properties.getString('token');
		if(!token)
			return;		
		var xhr = Ti.Network.createHTTPClient({
			timeout : 1 * 60 * 1000
		});
		var url = "http://" + Ti.App.serverDomain + "/api/0/tracking/Get?token=" + token + "&lat=" + lat + "&lng=" + lng + "&offset=" + new Date().getTimezoneOffset();
		messages.push("url - "+url+"; time - " + new Date().toString());
		xhr.onload = function(e) {
			messages.push("Location saved; time - " + new Date().toString());
			if (e.success) {
				Ti.App.Properties.setInt("count", 0);
				Ti.API.info("Coords saved!!!");
			}
			Ti.App.Properties.setObject("messages", messages);
		};
		xhr.onerror = function(e) {
			messages.push("Save error;Text - "+JSON.stringify(e)+" time - " + new Date().toString());
			Ti.App.Properties.setObject("messages", messages);
			Ti.API.error(e);
			Ti.API.error(e.error);
			Ti.App.Properties.setInt("count", 0);
		};
		Ti.API.info(url);
		xhr.open("GET", url, async);
		xhr.send();
		messages.push("Sended location to server; async - "+async+"; time - " + new Date().toString());
		Ti.App.Properties.setObject("messages", messages);
		Ti.API.info("send");
	}
};

Alloy.Globals.messages = [];
Ti.App.Properties.setObject("messages", Alloy.Globals.messages);