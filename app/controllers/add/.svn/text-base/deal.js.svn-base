var maxRenew = 1;
var tab = arguments[0].tab || null;
var callback = arguments[0].callback || false;
var progress = Alloy.Globals.progress;
var maxRenewArray;
var enterFromAccount = arguments[0].enterFromAccount || false;
var pickerOpened = false;
Alloy.Globals.core.maxDealRenew(function(e){
	maxRenewArray = JSON.parse(e);
	maxRenew = maxRenewArray[maxRenewArray.length - 1];	
});
var sectionName;

if(!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
	var alertDialog = Titanium.UI.createAlertDialog({
		title:L('should_be_company_title'),
		message:L('should_be_company_message'),
		buttonNames:[L('no'),L('yes')],
		cancel:0
	});

	alertDialog.addEventListener('click', function(e){

		if(e.cancel === e.index || e.cancel === true) 
		{
			$.window.close();
			return;
		}
		$.window.close();
		if(Alloy.Globals.tabGroup.activeTab.titleid != Alloy.CFG.tabAccount.titleid)
			Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
	});
	alertDialog.show();
}



var dealToEdit = false,
	from = 0,
	to = 0,
	date = 0,
	timeInputHeight = "80dp";
if(arguments[0] && arguments[0].dealId)
	dealToEdit = Alloy.Collections.deals.where({id: arguments[0].dealId})[0].toJSON();

var callback = false;
if(arguments[0] && arguments[0].callback)
	callback = arguments[0].callback;

var errors			= Alloy.Globals.errors,
	core			= Alloy.Globals.core,
	subCategories	= [],
	images			= [],
	imagesToDelete	= [];
dealTypeRowIndex;
var indicator = Alloy.Globals.indicator;

function open()
{	
	if(dealToEdit) 
	{
		indicator.openIndicator();		
		$.title.value			= dealToEdit.name; 
		$.price.value			= dealToEdit.price;
		$.description.value		= dealToEdit.description;
		subCategories			= JSON.parse(dealToEdit.subCategories);
		$.button.title			= L('update_deal_button');
		$.switch_.value			= dealToEdit.active;
		$.renewDeal.value		= dealToEdit.renewDays;
		$.delete_button.visible = true;
		$.vouchers.value = dealToEdit.vouchers;	
		$.dealType.value = Alloy.Globals.core.dealType[dealToEdit.dealtype].title;
		dealTypeRowIndex = dealToEdit.dealtype;
		if (dealToEdit.startTime){
			$.timepicker_switch.value = true;			
			$.startTime.value  = Alloy.Globals.core.createTime(dealToEdit.startTime).toLocaleTimeString();
			from = dealToEdit.startTime;
			$.timeInputs.height = timeInputHeight;
		}
		if (dealToEdit.endTime){
			$.timepicker_switch.value = true;
			$.endTime.value  = Alloy.Globals.core.createTime(dealToEdit.endTime).toLocaleTimeString();
			to = dealToEdit.endTime;
			$.timeInputs.height = timeInputHeight;
		}
		
	    $.startDate.value 		= (dealToEdit.startDate ? new Date(dealToEdit.startDate).toLocaleDateString(): '');
	 	date = dealToEdit.startDate;
	 	
	 	$.dealType.value = Alloy.Globals.core.dealType[dealToEdit.dealtype].title;
		if(dealToEdit.images) {
			dealToEdit.images = JSON.parse(dealToEdit.images);
			for(var i = 0; i < dealToEdit.images.length; i++)
				addImage(
					'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + dealToEdit.images[i] + Alloy.Globals.imageSizes.deal.row(),
					dealToEdit.images[i]
				);
		}
		core.selectedCategoriesInEdit = {};
		for (var i=0; i < subCategories.length; ++i)
		{		
			var s = subCategories[i];
			core.subCategories.select({categoryId: s.CategoryId, id: s.Id }, core.selectedCategoriesInEdit);
		}
		sectionName = "";
		showCategories();
		indicator.closeIndicator();
	}
	else
	{
		sectionName = "newdealer";
		Alloy.Globals.core.selectedNewDealsCategories = {};
	}
}

function blur(e)
{
	hideKeyboard(e);
}

function hideKeyboard(e)
{
	if(e.source.id !== "description")
		$.description.blur();
	if(e.source.id !== "dealType" && e.source.id !== "startDate" && e.source.id !== "startTime" && e.source.id !== "endTime" && e.source.id !== "renewDeal")
		$.pickerWrap.removeAllChildren();
	if(e.source.id !== "title")
		$.title.blur();
	if(e.source.id !== "price")
		$.price.blur();
	if(e.source.id !== "vouchers")
		$.vouchers.blur();
		
}

function focus(e)
{
	hideKeyboard(e);
}
function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){
	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;		
	var id = e.source.id;
	switch(id)
	{
		case "button":{indicator.openIndicator(); onClick(); break;}
		case "delete_button": {indicator.openIndicator(); deleteDeal(); break;}
		case "cancel_button": {cancel(); break;}
	}
}

function cancel()
{
	$.window.close();
}

function onClick() {
	indicator.openIndicator();
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
		indicator.closeIndicator();
		alertDialog.show();
		return;
	}

	if(!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
		var alertDialog = Titanium.UI.createAlertDialog({
			title:L('should_be_company_title'),
			message:L('should_be_company_message'),
			buttonNames:[L('no'),L('yes')],
			cancel:0
		});

		alertDialog.addEventListener('click', function(e){

			if(e.cancel === e.index || e.cancel === true) 
				return;
			Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
		});
		indicator.closeIndicator();
		alertDialog.show();
		return;
	}
	if(subCategories.length == 0) {
		indicator.closeIndicator();
		Alloy.Globals.core.showErrorDialog(L('please_select_category'));
		return;
	}

	var subcategoriesForSave = [];
	for (var i=0; i < subCategories.length; ++i)
	{		
		var s = subCategories[i];
		if(s.Id)
			subcategoriesForSave.push(s.Id);
		else
			subcategoriesForSave.push(s);
	}

	var deal = {
		name			: $.title.value, 
		price			: $.price.value,
		description		: $.description.value,
		subCategories	: JSON.stringify(subcategoriesForSave),
		active			: $.switch_.value,
		renewDays		: $.renewDeal.value,
		dealtype		: dealTypeRowIndex>=0?dealTypeRowIndex:dealToEdit.dealtype,			
	};
	if (date != 0)
		deal.startDate = date;
		
	if ($.voucher_switch.value)
		deal.vouchers = $.vouchers.value;
	else deal.vouchers = 0;
		
	if ($.timepicker_switch.value){	
		if (from != 0){
			deal.starttime = from;
		}
		if (to != 0){

			deal.endtime = to;
		}
	}
	if(dealToEdit) 
	{
		deal.id = dealToEdit.id;
		//deal.startDate = dealToEdit.startDate;
	}
		
	if(maxRenewArray && maxRenewArray.length === 3)
    {
		var status = Alloy.Globals.profile.status != 3 ? Alloy.Globals.profile.status : 0;
		if(status !== 2)
		{	
		    var maxRenewForStatus = maxRenewArray[status];
		    if(deal.renewDays > maxRenewForStatus)
		    {
		    	var messageStatuses = "";
		    	switch(status)
		    	{
		    		case 0:{
		    			var nextMaxRenew = maxRenewArray[1];
		    			if(nextMaxRenew > deal.renewDays)
		    				messageStatuses = messageStatuses + L("silver") + L("maxRenew_separator") + L("gold");
		    			else
		    				messageStatuses = messageStatuses + L("gold");
		    			break;
		    		}
		    		case 1:{
		    			messageStatuses = messageStatuses + L("gold");
		    			break;
		    		}
		    	}
		    	var alertDialog = Titanium.UI.createAlertDialog({
					title:L('upgrade_membership'),
					message:L("maxRenew_part1") + messageStatuses + L("maxRenew_part2"),
					buttonNames:[L('upgrade'),L('OK')],										
				});
				alertDialog.addEventListener('click', function(e){				
					if(!e.index)
					{
						var view = Alloy.createController("account/upgradeSelect").getView();																				
						Alloy.Globals.tabGroup.activeTab.open(view);
					}
				});
				alertDialog.show();
				indicator.closeIndicator();
				return;
		    }
	    } 
    }
		
	var deal = Alloy.createModel('deal',deal);


	if(deal.localValidate(errorHandler)) {
		if($.images.children.length === 1)
		{
			Alloy.Globals.core.showErrorDialog(L('image_require'));
			indicator.closeIndicator();
			return;
		}		
		deal.save({}, {
	        success: function(model, response, options) {
	        	for(var i = 0; i < $.images.children.length; i++) 
	        	{
	        		var image = $.images.children[i].image;
	        		if(image && !image.serverId)
	        		{
	        			if(typeof image != "string")
	        			{
		        			var factor = 1;
		        			var size = 600;
		        			var imageView = $.images.children[i];
		        			var height = image.height;
		        			var width = image.width;
							// Create an ImageView.
							var newImageView = Ti.UI.createImageView({
								image : imageView.image,
								width : width,
								height : height							
							});
													 
		        			if(width < height)
							{
								factor = width / height;
								newImageView.height = size;
								newImageView.width = size * factor;
							}
							else
							{
								factor = height / width;
								newImageView.width = size;
								newImageView.height = size * factor;
							}								
							image = newImageView.toImage();
						}
	        			images.push(image);
	        		}	        		
	        	}
				if (images.length > 0 || imagesToDelete.length > 0) {
	        		var upload = Alloy.Globals.upload;
	        		progress.openBar();
					upload.start({
						type: upload.types.deal,	
						id: response,
						blobs: images,
						delete : JSON.stringify(imagesToDelete),
						onerror: function(e) { Alloy.Globals.core.showErrorDialog(L("error_loading_image")); indicator.closeIndicator(); progress.closeBar();},
						onload: function(e) {
							progress.setBarValue(1);
							progress.closeBar();
							postUpdate();
						},
						onsendstream: function(e) {
							progress.setBarValue(e.progress);
							Ti.API.info("progress - " + e.progress);
						}
					});
				}
				else {
					indicator.closeIndicator();
					postUpdate();
				}
				indicator.closeIndicator();
						
	        },
	        error: function(model, xhr, options) {
	        	if(xhr && xhr.maxDeals)
	        	{
	        		var alertDialog = Titanium.UI.createAlertDialog({
						title:L('upgrade_membership'),
						message:L("limit") + " " + xhr.maxDeals + " " + L("limit_deals"),
						buttonNames:[L('upgrade'),L('OK')],										
					});
					alertDialog.addEventListener('click', function(e){				
						if(!e.index)
						{
							var view = Alloy.createController("account/upgradeSelect").getView();																				
							Alloy.Globals.tabGroup.activeTab.open(view);
						}
					});
					alertDialog.show();
	        	}
	        	else
	        	if(xhr && xhr.Message)
	        		Alloy.Globals.core.showErrorDialog(xhr.Message);
	        	//$.itemIsLoad.visible = false;
	        	indicator.closeIndicator(); 
	        }
		}); 					
	}
	else
		indicator.closeIndicator(); 
}


$.timepicker_switch.addEventListener('change',function(e)
{
	if ($.timepicker_switch.value) {
		$.timeInputs.visible = true;
		$.timeInputs.height = timeInputHeight;
	}else{
		$.timeInputs.visible = false;
		$.timeInputs.height = "0dp";
	}
});
$.voucher_switch.addEventListener('change',function(e)
{	
	if ($.voucher_switch.value) {
		$.voucherInputs.visible = true;
		$.voucherInputs.height = "40dp";
	}else{
		$.voucherInputs.visible = false;
		$.voucherInputs.height = "0dp";
	}
});


if ($.vouchers.value){	
	$.voucher_switch.value = true;
	$.voucherInputs.height = "40dp";
}

	
function postUpdate() {
		if(dealToEdit) {
			indicator.closeIndicator();
			Alloy.Globals.core.showErrorDialog(L('deal_updated_label'));
			Ti.App.fireEvent('account:updateDeals');
			if(callback)
				callback();
			$.window.close();
		}
		else {
			$.itemIsLoad.visible = true;	
			address	= false;
			subCategories = [];
			image = false;
			$.title.value = ''; 
			$.price.value = '';
			$.description.value = '';
			$.switch_.value = true;
			
			var alertDialog = Titanium.UI.createAlertDialog({
				title:L('deal_added_title'),
				message:L('deal_added_label'),
				buttonNames:[L('ok'),L('support')],
				cancel:0
			});
			alertDialog.addEventListener('click', function(e){
	
				if(e.cancel === e.index || e.cancel === true) 
				{
					Alloy.Collections.deals.fetch();
					$.window.close();					
					return;
				}
				//appreciation/index
				if(!enterFromAccount)
					$.window.close();
				Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAppreciation);
			});
			indicator.closeIndicator();
			alertDialog.show();
			
		}	
}

function errorHandler(err) {
	switch(err) {
		case errors.NO_TITLE:
			$.title.focus();
			break;
		case errors.NO_PRICE:
			$.price.focus();
			break;
		case errors.INVALID_PRICE:
			$.price.focus();
			break;
		case errors.MANY_RENEW:
			{
				
				return;
			}
		//case errors.NO_ADDRESS:
		//	$.address.focus();
		//	break;
	}
	Alloy.Globals.core.showError(err);
}

function categories() {
	var categoriesWindow =
		Alloy.createController(
			'categories/index', {
				closeCallback: function() {
					subCategories = [];
					if(core.currentSectionCategories()['_1'] && core.currentSectionCategories()['_1'].lenght) {
						findAdverts = true;
						for(var subCategoryKey in core.currentSectionCategories()['_1']) 
							subCategories.push(core.currentSectionCategories()['_1'][subCategoryKey]);
					}
					else {
						for(var categoryKey in core.currentSectionCategories()) {
							var category = core.currentSectionCategories()[categoryKey];
							for(var subCategoryKey in category) 
								subCategories.push(category[subCategoryKey]);
						}
					}
					showCategories();						
				},
				sectionName: sectionName,
				win: tab,
				forDeals: true
			}).getView();
						
		if(tab)
			tab.open(categoriesWindow);
}

function showCategories()
{
	$.selectedCategories.text = '';
	for(var categoryKey in core.currentSectionCategories())
	{
		if(Object.size(core.currentSectionCategories()[categoryKey]) > 0)
		{
			categoryKey = categoryKey.replace('_','');
			var category = Alloy.Collections.categories.get(categoryKey);
			if($.selectedCategories.text == '')
				$.selectedCategories.text += category.attributes['name'];
			else
				$.selectedCategories.text += ', ' + category.attributes['name'];
		}
	}
}

var optionsPhotoDialog = {
	options:['Make Photo', 'Choose Photo', 'Cancel'],
	cancel:2
};
var photoDialog = Titanium.UI.createOptionDialog(optionsPhotoDialog);

photoDialog.addEventListener('click',function(e)
	{
		if (e.index == 0) {showCamera();}
		if(e.index == 1){openGallery();}
	});
function addPhoto(){
	photoDialog.show();
}

function openGallery() {
	Titanium.Media.openPhotoGallery({
		success: function(e) {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
				var image = e.media;
				
				addImage(image);
			}
		}
	});
}

var imageCount = 0;
function addImage(image, serverId) {
	indicator.openIndicator();
	var imageView = Ti.UI.createImageView({
	    image: image,
	    width:'55dp',
	    height:'55dp',
	    right:'5dp',
	    bottom:'5dp',
	    serverId: serverId || false
	});
	var addImageControl = $.addPhoto;
		//$.addPhoto.remove();
	$.images.remove($.addPhoto);
	$.images.add(imageView);
	$.images.add(addImageControl);
	indicator.closeIndicator();	
		//$.images.add($.addPhoto);
		//var childrenCount = $.images.children.length;
		//if(childrenCount > 3)
		//	$.images.scrollTo((childrenCount -3) * 50, 0);
	$.howToDeleteImageLbl.visible = true;
	imageCount++;
}

function showCamera() {
	Titanium.Media.showCamera({
		success: function(e) {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
				addImage(e.media);
			}				
		},
		cancel: function(e) {
			
		},
		error: function(e) {
			
		}
	});
}

function onClickImages(e) {
	if(e.source.toString() !== "[object TiUIImageView]")
		return; 
	if(e.source.serverId)
		imagesToDelete.push(e.source.serverId);	
	$.images.remove(e.source);
	imageCount--;
	if(imageCount == 0)
		$.howToDeleteImageLbl.visible = false;
}

function deleteImage() {
	image = false;
	$.imageView.image = null;
	$.deleteImage.visible = false;  
	$.gallery.visible = true;
	$.camera.visible = true;
}


function setAutoRenew() {
	
	var datePicker = Alloy.createController('picker/number', {
			callback: function(date,close) {
				$.renewDeal.value = item; 
				if(close){
					$.pickerWrap.removeAllChildren();
					pickerOpened = false;
				}
			},
			maxValue: maxRenew
		}).getView();	
	
	closeKeyBoard();
	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(datePicker);
	pickerOpened = true;
}

function setStartDate() {
	
	var datePicker = Alloy.createController('picker/date', {
			callback: function(datePost,close) {
				date = datePost.toDateString(); 
				
				$.startDate.value = datePost.toLocaleDateString(); 
				if(close){
					$.pickerWrap.removeAllChildren();
					pickerOpened = false;
				}
			},
			
		}).getView();	
	
	closeKeyBoard();
	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(datePicker);
	pickerOpened = true;
	/*
	if(dealToEdit)
		Alloy.CFG.tabAccount.open(datePicker);
	else
		Alloy.CFG.tabAdd.open(datePicker);*/
}

var dealTypeRowIndex;
function setDealType()
{
	var dealTypePicker = Alloy.createController('picker/dealtype', {
			callback: function(dealtype,close, rowIndex) {				 
				$.dealType.value = dealtype;
				if(rowIndex >= 0)
					dealTypeRowIndex = rowIndex;
				if(close){
					$.pickerWrap.removeAllChildren();
					pickerOpened = false;										
				}
			},
			rowIndex: dealTypeRowIndex
		}).getView();	
	
	closeKeyBoard();
	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(dealTypePicker);
	pickerOpened = true;
}

function setStartTime() {
	
	var startTimePicker = Alloy.createController('picker/time', {
			callback: function(e,close) {
				from = e.getUTCHours() * 60 + e.getUTCMinutes();
				$.startTime.value = e.toLocaleTimeString(); 
				Ti.API.info(e.getUTCHours(), e.getUTCMinutes(), from);
				if(close){
					$.pickerWrap.removeAllChildren();
					pickerOpened = false;
				}
			}
		}).getView();
	
	closeKeyBoard();
	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(startTimePicker);
	pickerOpened = true;
	/*if(dealToEdit)
		Alloy.CFG.tabAccount.open(startTimePicker);
	else
		Alloy.CFG.tabAdd.open(startTimePicker);*/
}

function setEndTime() {
	var endTimePicker = Alloy.createController('picker/time', {
			callback: function(e,close) {
				to = e.getUTCHours() * 60 + e.getUTCMinutes(); 
				$.endTime.value = e.toLocaleTimeString(); 
				Ti.API.info(e.getUTCHours(), e.getUTCMinutes(), from);
				if(close){
					$.pickerWrap.removeAllChildren();
					pickerOpened = false;
				}
			}
		}).getView();
		
	closeKeyBoard();
	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(endTimePicker);
	pickerOpened = true;
	/*if(dealToEdit)
		Alloy.CFG.tabAccount.open(endTimePicker);
	else
		Alloy.CFG.tabAdd.open(endTimePicker);*/
		
}

function setVouchers() {
	
}

var textFields = [$.price, $.title, $.description,$.vouchers]; // All inputs with keyboard
function closeKeyBoard(){
	for (var i = 0 ; i < textFields.length; i++) {
	    textFields[i].blur();
	}
};


function showHelpDurning(){
	var alertDialog = Titanium.UI.createAlertDialog({
		message:L('show_help_durning')
	});
	alertDialog.show();
}

function showHelpRenew(){
	var alertDialog = Titanium.UI.createAlertDialog({
		message:L('show_help_renew')
	});
	alertDialog.show();
}

function showHelpVouchers(){
	var alertDialog = Titanium.UI.createAlertDialog({
		message:L('show_help_vouchers')
	});
	alertDialog.show();
}

function deleteDeal() {
	var alertDialog = Titanium.UI.createAlertDialog({
		title:L('delete_deal_title'),
		message:L('delete_deal_message'),
		buttonNames:[L('no'),L('yes')],
		cancel:0
	});

	alertDialog.addEventListener('click', function(e){
		indicator.closeIndicator();
		if(e.index != 1) return;  
		
		Alloy.Collections.deals.where({id: dealToEdit.id})[0]
		.destroy({
			success: function() {
				Ti.App.fireEvent('account:updateDeals');
				$.window.close();
			},
			error:function() { }
		});
	});
	alertDialog.show();
}

function onClose() {
	if (callback) callback();
	indicator.closeIndicator();
}