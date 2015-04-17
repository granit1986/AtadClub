var callback = arguments[0].callback || null;
var accountdeal = arguments[0].accountdeal || null;
var dealId = arguments[0].id || null;
var lat = arguments[0].lat || null;
var lng = arguments[0].lng || null;
var rateVisible = true,
	complaintVisible = true;
var context = this;
if(accountdeal)
{
	var btn = Ti.UI.createButton({title: L('edit')});
	$.window.setRightNavButton(btn);
	btn.addEventListener('click', function(){
		var view = Alloy.createController('add/deal', {dealId: deal.id, callback: function(){$.window.close();}, tab: Alloy.CFG.tabAccount}).getView();
		Alloy.CFG.tabAccount.open(view);
	});
}

function goToShare()
{
	Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabShare);
}

var deal;
var indicator = Alloy.Globals.indicator;
var privateDeal = false;
function open()
{
	indicator.openIndicator();
	var collection;
	try{
		deal = Alloy.Collections.publicDeals.where({id: dealId})[0].toJSON();		
			
	} catch(e){
		try{
			deal = Alloy.Collections.homeDeals.where({id: dealId})[0].toJSON();
			
		}
	    catch(e){
	    	try
	    	{
	    		deal = Alloy.Collections.companyDeals.where({id: dealId})[0].toJSON();
	    		
	    	}
	    	catch(e)
	    	{
	    		try
	    		{
	    			deal = Alloy.Collections.deals.where({id: dealId})[0].toJSON();
	    			privateDeal = true;
	    		}
	    		catch(e)
	    		{
	    			deal = Alloy.Collections.similarDeals.where({id: dealId})[0].toJSON();
	    			
	    		}
	    	}
	    }	    
	};
	
	if(!privateDeal)
		getDealInfo();
	else
		fillFields();
}

function getDealInfo()
{	
	var item = Alloy.createModel('publicDeal');	
	var userId = 0;
		
	if(Alloy.Globals.profile)
		userId = Alloy.Globals.profile.id;
	else
		removeRateAndComplaint();
	item.fetch({data:{dealId:dealId, installId: Alloy.Globals.core.installId, lat: lat, lng: lng, userId: userId, lang: Ti.Platform.locale},
		success: function(model, xhr, options){
			deal = item.toJSON();
			if(deal.needDeleteComplaint)
				hideComplaint();
			if(deal.needDeleteRate)
				hideRate();
			fillFields();
		},
		error: function(xhr, options){			
			indicator.closeIndicator();
			Alloy.Globals.core.showErrorDialog(L("xhr_error"));
		}		
	});
	
	
}

function removeRateAndComplaint()
{	
	complaintVisible = false;
	rateVisible = false;
}

function hideRate()
{
	$.rateDiealButton.enabled = false;
	rateVisible = false;	
}

function hideComplaint()
{
	$.complaintDiealButton.enabled = false;;
	complaintVisible = false;	
}
function fillFields()
{
	// if(!Alloy.Globals.profile || (deal.supplierId == Alloy.Globals.profile.id))
	// {		
		// $.buttons.remove($.send);		
	// }
	$.window.title = deal.name;
	$.name.text = deal.name; 
	$.price.text = deal.currency + ' ' + deal.price;
	$.supplier.text = deal.supplierName;
	$.address.text = deal.address;
	$.category.text = deal.subCategoriesTitles;
	$.distance.text = parseFloat(deal.distance).toFixed(2);
	$.description.text = deal.description;
	$.dealtype.text = Alloy.Globals.core.dealType[deal.dealtype].title;
	$.complains.text = deal.complainsCount;
	$.mapImage.image = 'http://maps.googleapis.com/maps/api/staticmap?center='+deal.lat.replace(',','.')+','+deal.lng.replace(',','.')+'8&zoom=16&size=280x180&sensor=false&markers=color:red%7Clabel:D%7C'+deal.lat.replace(',','.')+','+deal.lng.replace(',','.')+'%7Csize:tiny'; 
	if (deal.vouchers <= 0){
		$.buttons.remove($.getVauchersButton);		
	}
		
			
	if(deal.endTime && deal.startTime){
		var start = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(deal.startTime));
		var end = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(deal.endTime));
		$.workTime.text = start + ' - ' + end;
				
	}else{
		$.scrollView.remove($.workTime);
		$.scrollView.remove($.workTimeLbl);
	}
			
			
	if(deal.images) {
		deal.images = JSON.parse(deal.images);
		for(var i = 0; i < deal.images.length; i++) {
			var imageView = Ti.UI.createImageView({
				image : 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + deal.images[i] + Alloy.Globals.imageSizes.deal.view(),
				imageOriginal: 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + deal.images[i] + Alloy.Globals.imageSizes.deal.original(),
				wihth:'180dp',
				height:'180dp'
			});						
			imageView.addEventListener('click', imageClick);
			$.images.addView(imageView);			
		}
		if(deal.images.length > 0)
			imageWindow.createWindow($.images.views);
				
	}			
			
	//$.rating.text = deal.rating;	
	switchRating(deal.rating,deal.votes);
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

var ratingImage = "images/rate_0.png";

function switchRating(rating, votes){
	switch(rating){
		case 1:
			ratingImage = "images/rate_0.png";
			break;
		case 2:
			ratingImage = "images/rate_2.png";
			break;
		case 3:
			ratingImage = "images/rate_3.png";
			break;
		case 4:
			ratingImage = "images/rate_4.png";
			break;
		case 5:
			ratingImage = "images/rate_5.png";
			break;
		default:
			break;
	};
	$.rating.backgroundImage = ratingImage;
	$.ratingVoted.text = votes;
}

function onClickSupplier() {
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
		return;
	}
	var view = Alloy.createController('home/companies/company',{id:deal.supplierId, callback:function(e){
			$.window.close();
			if(callback)
				callback(e);
			}}).getView();
	view.backButtonTitle = "Back to deal";
	Alloy.CFG.tabHome.open(view);
}

function onClickGetVaucher(){
	
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
		return;
	}

	
		var voucher = Alloy.createModel(
	    	'getVoucher', {
	    		DealId			: deal.id, 
			}
		);
		indicator.openIndicator();
		voucher.save({}, {
	        success: function(model, response, options) {
	        	indicator.closeIndicator();
	        	var alertDialog = Titanium.UI.createAlertDialog({
					title:L('voucher_successfull_get'),
					message:'#' + response.Id,
					buttonNames:[L('ok'),L('email')],
					cancel:0
				});
				alertDialog.addEventListener('click', function(e){
					if(e.cancel === e.index || e.cancel === true) 
						return;
						
					indicator.openIndicator();
					var profile = Alloy.createModel('profile');
					profile.fetch({
						success: function(data) {
							data = data.toJSON();
							var text = L("name") + ": " + data.firstName + " " + data.lastName;
							if(data.phone)
								text = text + "\n" + L("phone") + ": " + data.phone;
							text = text + "\n" + L('my_voucher_code') + ' ' + response.Id + "\n";
							indicator.closeIndicator();
							var emailDialog = Ti.UI.createEmailDialog();
							emailDialog.subject = L('voucher_code');
							emailDialog.toRecipients = [data.email];
							emailDialog.messageBody = text;
							emailDialog.open();	
							
						}, 
						error: function(data){
							indicator.closeIndicator();						
						}	
					});
				});		
				alertDialog.show();
	        },
	        error: function(model, xhr, options) {
	        	indicator.closeIndicator();
	        	if(xhr.Message)
	        		Alloy.Globals.core.showErrorDialog(xhr.Message);	        	
	        }
		});

	
}

if(accountdeal)
{
	$.scrollView.remove($.buttons);
	$.scrollView.remove($.supplier);
	$.scrollView.remove($.supplierLbl);	
	$.rateDiealButton.hide();
	$.complaintDiealButton.hide();
	$.addClass($.rating, 'ratingCenter');
	$.addClass($.ratingVoted, 'ratingVotedCenter');
	$.addClass($.complains, 'complainsCountCenter');
	$.addClass($.complainsLbl, 'complainsLabelCenter');
}

function close()
{
	
}

function onClickAddress() {
	var mapWindow = Alloy.createController('home/adverts/advertMap', {advert:deal}).getView();
	Alloy.Globals.tabGroup.activeTab.open(mapWindow);	
}



function onCLickRateButton() {
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
	var userId = 0;
	if(Alloy.Globals.profile)
		userId = Alloy.Globals.profile.id;
	var ratePicker = Alloy.createController('picker/rate', {
			callback: function(e) {
				var dealRaiting = Alloy.createModel(
			    	'dealRaiting', {
			    		DealId		: deal.id, 
			    		raiting		: e,
			    		UserId		: userId
					}
				);
				indicator.openIndicator();		
				dealRaiting.save({}, {
					        success: function(model, response, options) {
								Titanium.UI.createAlertDialog({
									title:'Thank you!'
								}).show();
								indicator.closeIndicator();
								switchRating(response.Raiting,deal.votes);								
								deal.rating = response.Raiting;
								try{
									var updatedDeal = Alloy.Collections.publicDeals.where({id: response.DealId})[0];
									updatedDeal.set('rating',response.Raiting);
									updatedDeal.set('votes', response.votes);
								} catch(e){};
								
								try{
									var updatedDeal = Alloy.Collections.homeDeals.where({id: response.DealId})[0];
									updatedDeal.set('rating',response.Raiting);
									updatedDeal.set('votes', response.votes);
								} catch(e){};
								try{
									var updatedDeal = Alloy.Collections.companyDeals.where({id: response.DealId})[0];
									updatedDeal.set('rating',response.Raiting);
									updatedDeal.set('votes', response.votes);
								} catch(e){};
								$.ratingVoted.text = response.votes;
								hideRate();
					        },
					        error: function(model, xhr, options) {
					        	if(xhr && xhr.Message) 
					        		Alloy.Globals.core.showErrorDialog(L('server_' + xhr.Message,L('error')));
					        	else
					        		Alloy.Globals.core.showErrorDialog(L('error'));
	        				}
					});
				
				
			}
		}).getView();
		
	ratePicker.backButtonTitle = L('back');
	return ratePicker;	
	
}



function buttonTouchStart(e){	
	if (e.source.enabled) {
		e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
	}
}

function buttonTouchEnd(e){
	indicator.openIndicator();
	if(!e.source.enabled) return;
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(e.source.id)
		openView(e.source.id);
	
}

function openView(id)
{
	var view = false;
	
	
	switch(id) 
	{
		case "rateDiealButton": {
			view = onCLickRateButton();
			indicator.closeIndicator();
			break;
		}
	
		case "complaintDiealButton": {
	
			if (!Alloy.Globals.core.apiToken()) {
	
				var alertDialog = Titanium.UI.createAlertDialog({
					title : L('signup_or_signin_title'),
					message : L('signup_or_signin_message'),
					buttonNames : [L('no'), L('yes')],
					cancel : 0
				});
	
				alertDialog.addEventListener('click', function(e) {
	
					if (e.cancel === e.index || e.cancel === true)
						return;
					Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
				});
				alertDialog.show();
				indicator.closeIndicator();
				break;
			}
	
			view = Alloy.createController('complaints/index', {
				id : deal.id,
				dealWindow : function() {
					hideComplaint();
				},
				callback : function() {
					Alloy.Globals.core.showErrorDialog(L("thanks"));
				}
			}).getView();
			indicator.closeIndicator();
			break;
		}
	
		case "supplierButton": {
			view = Alloy.createController('home/companies/company', {
				id : deal.supplierId,
				lat : lat,
				lng : lng,
				callback : function(e) {
					$.window.close();
					if (callback)
						callback(e);
				}
			}).getView();
			view.backButtonTitle = "Back to deal";
			indicator.closeIndicator();
			break;
		}
		case "similarDealsButton": {
			view = Alloy.createController('home/deals/similardeals', {
				deal : deal,
				lat : lat,
				lng : lng
			}).getView();
			indicator.closeIndicator();
			break;
		}
		case "allDealsButton": {
			view = Alloy.createController('home/companies/allDeals', {
				id : deal.supplierId,
				supplierName : deal.supplierName,
				lat : lat,
				lng : lng
			}).getView();
			indicator.closeIndicator();
			break;
		}
		case "getVauchersButton": {
			onClickGetVaucher();
			indicator.closeIndicator();
			break;
		}
		case "send" : {
	
			if (!Alloy.Globals.core.apiToken()) {
	
				var alertDialog = Titanium.UI.createAlertDialog({
					title : L('signup_or_signin_title'),
					message : L('signup_or_signin_message'),
					buttonNames : [L('no'), L('yes')],
					cancel : 0
				});
	
				alertDialog.addEventListener('click', function(e) {
	
					if (e.cancel === e.index || e.cancel === true)
						return;
					Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
				});
				alertDialog.show();
				indicator.closeIndicator();
				break;
			}
			
			if(deal.supplierId === Alloy.Globals.profile.id)
			{
				Alloy.Globals.core.showErrorDialog(L("cant_write_themselves"));
				indicator.closeIndicator();
				break;
			}
	
			var chat = null;
			Alloy.Collections.chats.fetch({
				success : function() {
					chat = Alloy.Collections.chats.where({To: deal.supplierId})[0];
					if (chat != null) {
						chat = chat.toJSON();
						view = Alloy.createController('account/answers/answer', {
							id : chat.ChatId,
							toUser : chat.To,
							newChat : false
						}).getView();
						indicator.closeIndicator();
						Alloy.CFG.tabHome.open(view);
					} else {
						Alloy.createModel('chat', {
							from : Alloy.Globals.profile.id,
							to : deal.supplierId
						}).save({}, {
							success : function(e) {
								view = Alloy.createController('account/answers/answer', {
									id : arguments[1],
									newChat : true,
									toUser : deal.supplierId
								}).getView();
								indicator.closeIndicator();
								Alloy.CFG.tabHome.open(view);
							},
							error : function(e) {
								indicator.closeIndicator();
								Alloy.Globals.core.showErrorDialog(L("chat_open_error"));
							}
						});
					}
				},
				error : function() {
					Alloy.Globals.core.showErrorDialog(L("chat_open_error"));
					indicator.closeIndicator();
				}
			});
			break;
		}
		case "share": {
			Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabShare);
			indicator.closeIndicator();
			break;
		}

	}



	if(view)
		Alloy.CFG.tabHome.open(view);	
}
