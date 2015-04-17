var forEdit = arguments[0].forEdit || null;
var id = arguments[0].id || null;
var advert;

var indicator = Alloy.Globals.indicator;
function open()
{
		
	indicator.openIndicator();
	try
	{advert = Alloy.Collections.publicAdverts.where({id: id})[0].toJSON();}
	catch(e)
	{advert = Alloy.Collections.adverts.where({id: id})[0].toJSON();}
	
	$.window.title = advert.name;
	$.nameVal.text = advert.name;
	if(forEdit)
	{
		var btn = Ti.UI.createButton({title: L('edit')});
		$.window.setRightNavButton(btn);
		btn.addEventListener('click', function(){
			var view = Alloy.createController('add/advert', {advertId: advert.id, callback:function(){$.window.close();}}).getView();
			Alloy.CFG.tabAccount.open(view);
		});
	}
	if(advert.images) {
		advert.images = JSON.parse(advert.images);
		for(var i = 0; i < advert.images.length; i++) {
			
			var view = "";			
			if (advert.images[i] != -1) {
				view = Ti.UI.createImageView({
					image : 'http://' + Ti.App.serverDomain + '/api/' + Titanium.App.ApiVersion + '/image/' + advert.images[i] + Alloy.Globals.imageSizes.advert.view(),
					imageOriginal: 'http://' + Ti.App.serverDomain + '/api/' + Titanium.App.ApiVersion + '/image/' + advert.images[i] + Alloy.Globals.imageSizes.advert.original(),
					wihth : '180dp',
					height : '180dp'
				});
			} else {
				view = Ti.UI.createImageView({
					image : "appicon-72.png",
					wihth : '180dp',
					height : '180dp'
				});
			}

			view.addEventListener('click', imageClick);
			$.images.addView(view);
		}
		if(advert.images.length > 0)
			imageWindow.createWindow($.images.views);
	}
	//$.image.image = advert.image + Alloy.Globals.imageSizes.advert.view();
	
	$.priceVal.text = advert.price;
	$.descriptionVal.text = advert.description;
	$.user.text = advert.user;
	$.email.text = advert.email;
	$.phone.text = advert.phone;
	$.address.text = advert.address;
	$.mapImage.image = 'http://maps.googleapis.com/maps/api/staticmap?center='+advert.lat.replace(',','.')+','+advert.lng.replace(',','.')+'8&zoom=16&size=280x180&sensor=false&markers=color:red%7Clabel:D%7C'+advert.lat.replace(',','.')+','+advert.lng.replace(',','.')+'%7Csize:tiny';
	if(forEdit)
	{
		$.scroll.remove($.contactLbl);
		$.scroll.remove($.user);
		$.scroll.remove($.email);
		$.scroll.remove($.phone);
		$.scroll.remove($.priceOffer);
		$.scroll.remove($.barterOffer);
		$.scroll.remove($.emailLbl);
		$.scroll.remove($.phoneLbl);
		$.scroll.remove($.address);
		$.scroll.remove($.addressLbl);
		$.scroll.remove($.mapImage);
	}
	indicator.closeIndicator();
}

function imageClick(e)
{
	var currentPage = $.images.getCurrentPage();
	imageWindow.openWindow(currentPage);
}

var imageWindow = {
	window: false,
	view: false,
	openWindow: function(page){
		var self = this;
		self.window.open();
		self.view.setCurrentPage(page);
	},
	createWindow: function(views){
		var self = this;
		self.window = Ti.UI.createWindow({
			width: "100%",
			height: "100%",
			backgroundColor:'#f0f0f0',
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
		});
		
		var btn = Ti.UI.createButton({
			title: 'X',
			width: '30dp',
			height: '30dp',
			right: "5dp",
			top: '5dp',
			zIndex: 10,
			backgroundColor: Alloy.Globals.Styles.buttonBg,
			color: '#fff' 	 
		});
		btn.addEventListener('click',function(){
			self.window.close();
		});
		
		var newViews = [];
		for (var i=0; i < views.length; i++) {
		  var view = views[i];
		  var newView = Ti.UI.createImageView({
		  	image: view.imageOriginal,		  	
		  });
		  newViews.push(newView);
		};
		
		self.view = Ti.UI.createScrollableView({
			showPagingControl: true,
			views: newViews,			
		});
		self.window.add(self.view);
		self.window.add(btn);
	} 
};

function onClickEmail() {
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = L('about_you_advert_subject');
	emailDialog.toRecipients = [advert.email];
	emailDialog.messageBody = String.format(L('about_you_advert_message'),advert.user);
	emailDialog.open();	
}

function onClickAddress() {
	var mapWindow = Alloy.createController('home/adverts/advertMap', {advert:advert}).getView();
	Alloy.CFG.tabHome.open(mapWindow);
}

function phoneCall() {
	Titanium.Platform.openURL('tel:' + advert.phone);	
}	
function onClickPriceOffer() {
	Alloy.CFG.tabHome.open(
		Alloy.createController('home/adverts/priceOffer',{advertId:advert.id}).getView()
	);
}
function onClickBarterOffer() {
	Alloy.CFG.tabHome.open(
		Alloy.createController('home/adverts/barterOffer',{advertId:advert.id}).getView()
	);
}

function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(!Alloy.Globals.core.apiToken()) {

		var alertDialog = Titanium.UI.createAlertDialog({
			title:L('signup_or_signin_title'),
			message:L('signup_or_signin_message'),
			buttonNames:[L('no'),L('yes')],
			cancel:0
		});

		alertDialog.addEventListener('click', function(e){

			if(e.cancel === e.index || e.cancel === true) 
				return;
			Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
		});
		alertDialog.show();
		indicator.closeIndicator();
		return;
	}
	if(e.source.id == "priceOffer")
	{		
	 	onClickPriceOffer();
	}
	else if(e.source.id == "barterOffer")
	{
		onClickBarterOffer();
	}
	
}
