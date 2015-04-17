var core = Alloy.Globals.core;

var advert = Alloy.Collections.adverts.where({id: arguments[0].id})[0];

$.window.title		= advert.attributes.name;
$.title.value		= advert.attributes.name;
$.price.value		= advert.attributes.price;
$.description.value = advert.attributes.description;
$.address.value		= advert.attributes.address;
$.imageView.image	= advert.attributes.image + Alloy.Globals.imageSizes.advert.edit();

var errors = Alloy.Globals.errors;
var core = Alloy.Globals.core;

var address	= advert.attributes.address;
var lat		= advert.attributes.address.lat;
var lng		= advert.attributes.address.lng;
var subCategories = [] || JSON.parse(advert.attributes.subCategories);
var image = advert.attributes.image + Alloy.Globals.imageSizes.advert.edit();

for(var idx in subCategories) {
	core.subCategories.select({categoryId: 1, id: subCategories[idx] });
}

function currenLocation() {
	
	var geo = Alloy.Globals.geo;
	geo.checkLocation(function() {
		if(geo.location.status != geo.errors.NONE) {
			Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
			return;
		}
		geo.reverseGeocoding(
			geo.location.latitude,
			geo.location.longitude,
			function(e) {
				if(e.error) {
					Alloy.Globals.core.showErrorDialog(L(e.error));
				}
				else {
					$.address.value = e.response.results[0].formatted_address;
					lat = e.response.results[0].geometry.location.lat;
					lng = e.response.results[0].geometry.location.lng;
				}
			});		
	});
}

function onClick() {
	
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
			Alloy.Globals.core.activeTab("tabAccount");
		});
		alertDialog.show();
		return;
	}

	if(subCategories.length ==0) {
		Alloy.Globals.core.showErrorDialog(L('please_select_category'));
		return;
	}

	var advert = Alloy.createModel(
    	'advert', {
    		name			: $.title.value, 
    		price			: $.price.value,
			description		: $.description.value,
			address			: $.address.value,
			lat				: parseFloat(lat),
			lng				: parseFloat(lng),
			subCategories	: JSON.stringify(subCategories)
		}
	);

	if(advert.localValidate(errorHandler)) {

		if(!lat || !lng || $.address.value !== address) {
			geo.geocoding($.address.value, function(e) {
				if(e.error) {
					Alloy.Globals.core.showErrorDialog(L(e.error));
					return;
				}
				else {
					advert.attributes.lat = parseFloat(e.response.results[0].geometry.location.lat);
					advert.attributes.lng = parseFloat(e.response.results[0].geometry.location.lng);
					
					advert.save({}, {
				        success: function(model, response, options) {
							if (image) {
				        		var upload = Alloy.Globals.upload;
								upload.start({
									type: upload.types.advert,	
									id: response,
									blob: image,
									onerror: function(e){ /*Alloy.Globals.core.showErrorDialog(e);*/ },
									onload: function(e) {
										address	= false;
										subCategories = [];
										image = false;
										$.title.value = ''; 
										$.price.value = '';
										$.description.value = '';
										$.address.value = '';
								$.imageView.image = null;
										var advertWindow = Alloy.createController('add/views/advertAdded').getView();
										Alloy.CFG.tabAdd.open(advertWindow);
									}
								});
							}
							else {
								address	= false;
								subCategories = [];
								image = false;
								$.title.value = ''; 
								$.price.value = '';
								$.description.value = '';
								$.address.value = '';
								$.imageView.image = null;
								var advertWindow = Alloy.createController('add/views/advertAdded').getView();
								Alloy.CFG.tabAdd.open(advertWindow);
							}
				        },
				        error: function(model, xhr, options) {
				        	
				        	/* TODO fix it! */
							var advertWindow = Alloy.createController('add/views/advertAdded').getView();
							Alloy.CFG.tabAdd.open(advertWindow);
				        }
					});					
				}				
			});	
		}
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
	}
	Alloy.Globals.core.showError(err);
}

function categories() {
	Alloy.CFG.tabAdd.open(Alloy.createController(
		'subCategories/index', {
			categoryId:1,
			categoryName:L('categories'),
			closeCallback: function() {
				subCategories = [];
				if(core.selectedCategories['_1'])
					for(var subCategoryKey in core.selectedCategories['_1']) {
						subCategories.push(core.selectedCategories['_1'][subCategoryKey]);
					}
			}
		}).getView()
	);
}

function openGallery() {
	Titanium.Media.openPhotoGallery({
		success: function(e) {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
				image = e.media;
				$.imageView.image = image;
				$.deleteImage.visible = true; 
				$.gallery.visible = false;
				$.camera.visible = false;
			}
		}
	});
}

function showCamera() {
	Titanium.Media.showCamera({
		success: function() {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
				image = e.media;
				$.imageView.image = image;
				$.deleteImage.visible = true;  
				$.gallery.visible = false;
				$.camera.visible = false;
			}				
		},
		cancel: function(e) {
			
		},
		error: function(e) {
			
		}
	});
}

function deleteImage() {
	image = false;
	$.imageView.image = null;
	$.deleteImage.visible = false;  
	$.gallery.visible = true;
	$.camera.visible = true;
}
