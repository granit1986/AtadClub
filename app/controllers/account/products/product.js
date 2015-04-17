var productToEdit = false;
if(arguments[0] && arguments[0].productId)
	productToEdit = Alloy.Collections.products.where({id: arguments[0].productId})[0].toJSON();
var indicator = Alloy.Globals.indicator;
var callback = false;
var progress = Alloy.Globals.progress;

if(arguments[0] && arguments[0].callback)
	callback = arguments[0].callback;
var sectionName = "products";	
var errors			= Alloy.Globals.errors,
	core			= Alloy.Globals.core;
	subCategories	= [],
	images			= [],
	imagesToDelete	= [];
	
function blur(e)
{
	hideKeyboard(e);
}

function hideKeyboard(e)
{
	if(e.source.id !== $.title.id)
		$.title.blur();
	if(e.source.id !== $.description.id)
		$.description.blur();
	if(e.source.id !== $.price.id)
		$.price.blur();
}

function focus(e)
{
	hideKeyboard(e);
}

function open() {
	if (productToEdit) {
		$.window.title = productToEdit.name;
		indicator.openIndicator();
		subCategories = JSON.parse(productToEdit.subCategories);
		//	image				= productToEdit.image + Alloy.Globals.imageSizes.product.row();
		$.title.value = productToEdit.name;
		$.price.value = productToEdit.price;
		$.description.value = productToEdit.description;
		//$.address.value		= productToEdit.address;
		$.switch_.value = productToEdit.active;

		$.button.title = L('update');
		$.delete_button.visible = true;

		if (productToEdit.images) {
			productToEdit.images = JSON.parse(productToEdit.images);
			for (var i = 0; i < productToEdit.images.length; i++)
				addImage('http://' + Ti.App.serverDomain + '/api/' + Titanium.App.ApiVersion + '/image/' + productToEdit.images[i] + Alloy.Globals.imageSizes.product.row(), productToEdit.images[i]);
		}
		sectionName = '';
		Alloy.Globals.core.currentSection = sectionName;
		core.selectedCategoriesInEdit = {};
		for (var i = 0; i < subCategories.length; ++i) {
			var s = subCategories[i];
			core.subCategories.select({
				categoryId : s.CategoryId,
				id : s.Id
			}, core.selectedCategoriesInEdit);
		}
		displayCategories();
		indicator.closeIndicator();
	} else
		core.selectedProducts = {};
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
			indicator.closeIndicator();
			if(e.cancel === e.index || e.cancel === true) 
				return;
			Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);			
		});
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

	var product = {
		name			: $.title.value, 
		price			: $.price.value,
		description		: $.description.value,
		subCategories	: JSON.stringify(subcategoriesForSave),
		active			: $.switch_.value
	};
	
	if(productToEdit)
		product.id = productToEdit.id;
		 
	product = Alloy.createModel('product', product);

	
	indicator.closeIndicator();
	if(product.localValidate(errorHandler)) {
		if($.images.children.length === 1)
		{
			Alloy.Globals.core.showErrorDialog(L('image_require'));
			return;
		}
		indicator.openIndicator();
		product.save({}, {
	        success: function(model, response, options) {
	        	indicator.closeIndicator();
	        	for(var i = 0; i < $.images.children.length; i++) {
	        		var image = $.images.children[i].image;
	        		if(image && !image.serverId)
	        		{
	        			if(typeof image != "string")
	        			{
		        			var factor = 1;
		        			var size = 400;
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
						type: upload.types.product,	
						id: response,
						blobs: images,
						delete : JSON.stringify(imagesToDelete),
						onerror: function(e){ /*Alloy.Globals.core.showErrorDialog(e);*/
							indicator.closeIndicator();
							progress.closeBar();
							Alloy.Globals.core.showErrorDialog(L("error_loading_image"));							
						},
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
				}//*/				
	        },
	        error: function(model, xhr, options) {
	        	if(xhr && xhr.maxProducts)
				{
					var alertDialog = Titanium.UI.createAlertDialog({
						title:L('upgrade_membership'),
						message:L("limit") + " " + xhr.maxProducts + " " + L("limit_products"),
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
				indicator.closeIndicator();  
	        }
		});					
	}
	
}

function postUpdate() {
	if(productToEdit) {
		indicator.closeIndicator();		
		imagesToDelete = [];	
		Alloy.Globals.core.showErrorDialog(L('product_updated_label'));	
		Ti.App.fireEvent('account:updateProducts');
		if(callback)
			callback();
		$.window.close();
	}
	else {
		address	= false;
		subCategories = [];
		images = [];
		imagesToDelete = [];
		$.title.value = ''; 
		$.price.value = '';
		$.description.value = '';
		
		$.images.removeAllChildren();
		$.switch_.value = false;
		var dialog = Titanium.UI.createAlertDialog({
			title:L('product_added_label')							
		});
		dialog.addEventListener('click', function(){
			Ti.App.fireEvent('account:updateProducts');
			$.window.close();
		});
		dialog.show();
		indicator.closeIndicator();	
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
		case errors.NO_ADDRESS:
			$.address.focus();
			break;
		case errors.NO_DESCRIPTION:
			$.description.focus();
			break;
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
					displayCategories();						
				},
				win: Alloy.CFG.tabAccount,
				forDeals: true,
				sectionName: sectionName,
			}).getView();	 

		Alloy.CFG.tabAccount.open(categoriesWindow);
}

function displayCategories()
{
	$.selectedCategories.text = '';
	for(var categoryKey in core.currentSectionCategories())
	{
		if(Object.size(core.currentSectionCategories()[categoryKey]) > 0)
		{
			categoryKey = categoryKey.replace('_','');
			var category = Alloy.Collections.categories.get(categoryKey);
			if(category)
			{
				if($.selectedCategories.text == '')
					$.selectedCategories.text += category.attributes['name'];
				else
					$.selectedCategories.text += ', ' + category.attributes['name'];
			}
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
				addImage(e.media);
			}
		}
	});
}


function openGallery() {
	Titanium.Media.openPhotoGallery({
		success: function(e) {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
				addImage(e.media);
			}
		}
	});
}

var imageCount = 0;
function addImage(image, serverId) {
	indicator.openIndicator();
	var imageView = Ti.UI.createImageView({
		image : image,
		width : '55dp',
		height : '55dp',
		right : '5dp',
		bottom : '5dp',
		serverId : serverId || false
	});
	var addImageControl = $.addPhoto;
		//$.addPhoto.remove();
	$.images.remove($.addPhoto);
	$.images.add(imageView);
	$.images.add(addImageControl);
	indicator.closeIndicator();	
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
	//$.imageView.image = null;
	$.deleteImage.visible = false;  
	$.gallery.visible = true;
	$.camera.visible = true;
}

function onClose() {
	if (callback) callback();
}

function deleteProduct() {
	var alertDialog = Titanium.UI.createAlertDialog({
		title:L('delete_product_title'),
		message:L('delete_product_message'),
		buttonNames:[L('no'),L('yes')],
		cancel:0
	});

	alertDialog.addEventListener('click', function(e){
		
		if(e.index != 1) return;  
		
		Alloy.Collections.products.where({id: productToEdit.id})[0]
		.destroy({
			success: function() {
				Ti.App.fireEvent('account:updateProducts');
				if(callback)
					callback();
				$.window.close();
			},
			error:function() { }
		});				
	});
	alertDialog.show();
}