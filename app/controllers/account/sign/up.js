$.firstName.focus();
var errors = Alloy.Globals.errors;
var core = Alloy.Globals.core;
var currencyItems = Alloy.Globals.core.currencyItems;
var isAgree = false,
    progress = Alloy.Globals.progress,
    subCategories = [],
    sectionName = "",
    lat = false,
    lng = false,
    address = false;

$.address.setHintText(L("enter_address"));
$.addressProfile.setHintText(L("enter_address"));
function blur(e) {
	hideKeyboard(e);
}

function hideKeyboard(e) {
	if (e.source.id != $.firstName.id)
		$.firstName.blur();
	if (e.source.id != $.lastName.id)
		$.lastName.blur();
	if (e.source.id != $.firstName.id)
		$.firstName.blur();
	if (e.source.id != $.userEmail.id)
		$.userEmail.blur();
	if (e.source.id != $.password.id)
		$.password.blur();
	if (e.source.id != $.confirm.id)
		$.confirm.blur();
	if (e.source.id != $.name.id)
		$.name.blur();
	if (e.source.id != $.number.id)
		$.number.blur();
	if (e.source.id != $.phone.id)
		$.phone.blur();
	if (e.source.id != $.email.id)
		$.email.blur();
	if (e.source.id != $.address.id)
		$.address.blur();
	if (e.source.id != $.about.id)
		$.about.blur();
	if (e.source.id != $.workingHours.id)
		$.workingHours.blur();
	if (e.source.id != $.terms.id)
		$.terms.blur();
	if (e.source.id != $.phoneUser.id)
		$.phoneUser.blur();
	if (e.source.id != $.addressProfile.id)
		$.addressProfile.blur();
	if (e.source.id != $.currency.id)
		$.pickerWrap.removeAllChildren();

}

function focus(e) {
	hideKeyboard(e);
}

var currency = "";

function agreeClick() {
	isAgree = !isAgree;
	if (isAgree) {
		$.iAgree.image = "images/checkbox_check.png";
	} else {
		$.iAgree.image = "images/checkbox.png";
	}
}

var indicator = Alloy.Globals.indicator;
function buttonTouchStart(e) {
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e) {
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	openView(e);
}

function openView(e) {

	switch(e.source.id) {
	case "signUp": {
		doSignUp(e);
		break;
	}
	case "signIn": {
		showSignIn(e);
		break;
	}
	case "customLocation": {
		customLocation($.address);
		break;
	}
	case "customLocationProfile": {
		customLocation($.addressProfile);
		break;
	}
	}

}

function termClick() {
	var view = Alloy.createController("account/sign/term").getView();
	Alloy.CFG.tabAccount.open(view);
}

function doSignUp(e) {

	var signup = Alloy.createModel('signup', {
		firstName : $.firstName.value,
		lastName : $.lastName.value,
		email : $.userEmail.value,
		password : $.password.value,
		confirm : $.confirm.value,
		appInstallId : Alloy.Globals.core.installId, //Ti.App.installId,
		appVersion : Ti.App.version,
		platformModel : Ti.Platform.model,
		platformVersion : Ti.Platform.version,
		platformOSName : Ti.Platform.osname,
		language : Ti.Locale.currentLanguage,
		currency : currency,
		address : $.addressProfile.value,
		phone: $.phoneUser.value
	});

	if (signup.localValidate(errorHandler)) {
		indicator.openIndicator();
		var company = false;
		if ($.company_switch.value) {
			if (subCategories.length == 0) {
				indicator.closeIndicator();
				Alloy.Globals.core.showErrorDialog(L('please_select_category'));
				return;
			}
			var subcategoriesForSave = [];
			for (var i = 0; i < subCategories.length; ++i) {
				var s = subCategories[i];
				if (s.Id)
					subcategoriesForSave.push(s.Id);
				else
					subcategoriesForSave.push(s);
			}
			company = Alloy.createModel('company', {
				name : $.name.value,
				number : $.number.value,
				phone : $.phone.value,
				email : $.email.value,
				address : $.address.value,
				lat : parseFloat(lat),
				lng : parseFloat(lng),
				subCategories : JSON.stringify(subcategoriesForSave),
				about : $.about.value,
				workingHours : $.workingHours.value,
				terms : $.terms.value,
				haveImage : image && imageUpdated
			});
			if (!company.localValidate(errorHandler)) {
				indicator.closeIndicator();
				return;
			}
		}
		if (!isAgree) {
			Alloy.Globals.core.showErrorDialog(L("terms_not_argee"));
			indicator.closeIndicator();
			return;
		}

		if ($.company_switch.value) {
			var alertDialog = Titanium.UI.createAlertDialog({
				message : L('only_register_company'),
				buttonNames : [L('cancel'), L('ok')],
				cancel : 0
			});

			alertDialog.addEventListener('click', function(e) {

				if (e.cancel === e.index || e.cancel === true) {
					indicator.closeIndicator();
					return;
				}
				saveUser(signup, company);
			});
			alertDialog.show();
		} else
			saveUser(signup);
	}
}

function saveUser(signup, company) {
	if (company)
		signup.attributes.isSupplier = true;
	else
		signup.attributes.isSupplier = false;
	signup.save({}, {
		success : function(model, response, options) {
			Alloy.Globals.core.apiToken(response.UUID);

			if ($.company_switch.value) {
				if (company) {
					if (company.localValidate(errorHandler)) {
						if (!lat || !lng || $.address.value !== address) {
							geo.geocoding($.address.value, function(e) {
								if (e.error) {
									Alloy.Globals.core.showErrorDialog(L(e.message));
									return;
								}
								if (e.error == geo.elementStatuses.ZERO_RESULTS || e.error == geo.elementStatuses.NOT_FOUND) {
									indicator.closeIndicator();
									Alloy.Globals.core.showErrorDialog(L("address_not_found"));
									return;
								} else if (e && e.response && e.response.results && e.response.results.length > 0) {

									company.attributes.lat = parseFloat(e.response.results[0].geometry.location.lat);
									company.attributes.lng = parseFloat(e.response.results[0].geometry.location.lng);
									saveCompany(company);
								} else {
									indicator.closeIndicator();
									Alloy.Globals.core.showErrorDialog(L("address_not_found"));
									return;
								}

							});

						} else {
							indicator.closeIndicator();
							saveCompany(company);
						}
					}

				}
			} else {
				saveProfile();
				Alloy.Collections.adverts = Alloy.createCollection('advert');
				indicator.closeIndicator();
				Ti.App.fireEvent('account:showAccount');
			}
		},
		error : function(model, xhr, options) {
			indicator.closeIndicator();
			errorHandler(errors.CAN_NOT_CREATE_ACCOUNT);
		}
	});
}

function saveCompany(company) {
	company.save({}, {
		success : function(model, response, options) {
			Ti.App.fireEvent('account:itIsSupplier');
			if (image && imageUpdated) {
				var upload = Alloy.Globals.upload;
				var images = [];

				var factor = 1;
				var size = 400;
				var height = image.height;
				var width = image.width;
				// Create an ImageView.
				var newImageView = Ti.UI.createImageView({
					image : image,
					width : width,
					height : height
				});
				if (width < height) {
					factor = width / height;
					newImageView.height = size;
					newImageView.width = size * factor;
				} else {
					factor = height / width;
					newImageView.width = size;
					newImageView.height = size * factor;
				}
				image = newImageView.toImage();
				images.push(image);
				progress.openBar();
				upload.start({
					type : upload.types.logo,
					id : response,
					blobs : images,
					onerror : function(e) {/*Alloy.Globals.core.showErrorDialog(e);*/
						progress.closeBar();
						Alloy.Globals.core.showErrorDialog(L("error_loading_image"));
					},
					onload : function(e) {
						progress.setBarValue(1);
						progress.closeBar();
						postUpdate();
					},
					onsendstream : function(e) {
						progress.setBarValue(e.progress);
						Ti.API.info("progress - " + e.progress);
					}
				});
			} else {
				postUpdate();
			}
			indicator.closeIndicator();
		},
		error : function(model, xhr, options) {
			indicator.closeIndicator();
		}
	});
}

function postUpdate() {
	indicator.closeIndicator();
	Alloy.Globals.core.showErrorDialog(L('registration_success'));
	Alloy.Collections.adverts = Alloy.createCollection('advert');
	Ti.App.fireEvent('account:updateProfile', {
		showProducts : true
	});
	Ti.App.fireEvent('account:showAccount');
}

function saveProfile() {
	var profile = Alloy.createModel('profile');
	profile.fetch({
		success : function() {
			Alloy.Globals.profile = profile.toJSON();
			indicator.closeIndicator();
			Alloy.CFG.tabAccount.title = L("tab_account");
			if (Alloy.Globals.profile.supplier)
				Ti.App.fireEvent('account:itIsSupplier');
		}
	});
}

function errorHandler(err) {
	switch(err) {
	case errors.NO_FIRST_NAME:
		$.firstName.focus();
		break;
	case errors.NO_LAST_NAME:
		$.lastName.focus();
		break;
	case errors.NO_EMAIL:
	case errors.INVALID_EMAIL:
	case errors.NOT_SIGNED:
		$.userEmail.focus();
		break;
	case errors.NO_PASSWORD:
	case errors.PASSWORD_IS_TOO_SIMPLE:
		$.password.focus();
		break;
	case errors.NO_CONFIRM:
	case errors.PASSWORDS_NOT_MATCH:
		$.confirm.focus();
		break;
	case errors.NO_COMPANY_NAME:
		$.name.focus();
		break;
	case errors.NO_EMAIL:
		$.email.focus();
		break;
	case errors.INVALID_EMAIL:
		$.email.focus();
		break;
	case errors.NO_PHONE:
		$.phone.focus();
		break;
	case errors.INVALID_PHONE:
		$.phone.focus();
		break;
	case errors.NO_ADDRESS:
		$.address.focus();
		break;
	case errors.NO_NUMBER:
	case errors.INVALID_NUMBER:
		$.number.focus();
		break;
	case errors.NO_ABOUT:
		$.about.focus();
		break;
	case errors.NO_WORKING_HOURS:
		$.workingHours.focus();
		break;
	case errors.NO_TERMS:
		$.terms.focus();
		break;
	case errors.NO_ADDRESSPROFILE:
		$.addressProfile.focus();
		break;
	}
	indicator.closeIndicator();
	Alloy.Globals.core.showError(err);
}

function showSignIn(e) {
	indicator.closeIndicator();
	Ti.App.fireEvent('account:showSignIn');
}

// COMPANY INFO
$.company_switch.addEventListener('change', function(e) {
	if ($.company_switch.value) {
		$.companyForm.height = Ti.UI.SIZE;
		$.companyForm.show();
	} else {
		$.companyForm.height = "0dp";
		$.companyForm.hide();
	}
});

function categories() {
	var view = Alloy.createController('categories/index', {
		win : Alloy.CFG.tabAccount,
		name : L('categories'),
		forDeals : true,
		sectionName : sectionName,
		closeCallback : function() {
			subCategories = [];
			for (var categoryKey in core.currentSectionCategories()) {
				var category = core.currentSectionCategories()[categoryKey];
				for (var subCategoryKey in category)
				subCategories.push(core.currentSectionCategories()[categoryKey][subCategoryKey]);
			}
			showCategories();
		}
	});
	var win = view.getView();
	win.backButtonTitle = L("create_account");
	Alloy.CFG.tabAccount.open(win);
}

function showCategories() {
	$.selectedCategories.text = '';
	for (var categoryKey in core.currentSectionCategories()) {
		if (Object.size(core.currentSectionCategories()[categoryKey]) > 0) {
			categoryKey = categoryKey.replace('_', '');
			var category = Alloy.Collections.categories.get(categoryKey);
			if ($.selectedCategories.text == '')
				$.selectedCategories.text += category.attributes['name'];
			else
				$.selectedCategories.text += ', ' + category.attributes['name'];
		}
	}
}

var image = false,
    imageUpdated = false;

var optionsPhotoDialog = {
	options : ['Make Photo', 'Choose Photo', 'Cancel'],
	cancel : 2
};
var photoDialog = Titanium.UI.createOptionDialog(optionsPhotoDialog);
photoDialog.addEventListener('click', function(e) {
	if (e.index == 0) {
		showCamera();
	}
	if (e.index == 1) {
		openGallery();
	}
});
function addPhoto() {
	photoDialog.show();
}

function openGallery() {
	Titanium.Media.openPhotoGallery({
		success : function(e) {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
				image = e.media;
				$.imageView.image = image;
				$.deleteImage.visible = true;
				$.imageView.height = Ti.UI.SIZE;
				$.imageView.bottom = "10dp";
				$.imageView.visible = true;
				//$.gallery.visible = false;
				//$.camera.visible = false;
				imageUpdated = true;
			}
		}
	});
}

function showCamera() {
	Titanium.Media.showCamera({
		success : function(e) {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
				image = e.media;
				$.imageView.image = image;
				$.deleteImage.visible = true;
				$.imageView.visible = true;
				$.imageView.height = Ti.UI.SIZE;
				$.imageView.bottom = "10dp";
				//$.gallery.visible = false;
				//$.camera.visible = false;
				imageUpdated = true;

			}
		},
		cancel : function(e) {

		},
		error : function(e) {

		}
	});
}

function deleteImage() {
	image = false;
	imageUpdated = false;
	$.imageView.image = null;
	$.imageView.visible = false;
	$.imageView.height = "0";
	$.imageView.bottom = "0";
	$.deleteImage.visible = false;
	//$.gallery.visible = true;
	//$.camera.visible = true;
}

var rowIndex;
function search(e) {
	var address = e.value;
	geo.geocoding(address, function(geodata) {
		if (geodata.error) {
			Alloy.Globals.core.showErrorDialog(L(geodata.message));
			return;
		}
		if (geodata.error == geo.elementStatuses.ZERO_RESULTS || geodata.error == geo.elementStatuses.NOT_FOUND) {
			Alloy.Globals.core.showErrorDialog(L("address_not_found"));
			return;
		}
		var items = [];
		for (var i = 0; i < geodata.response.results.length; i++) {
			var result = geodata.response.results[i];
			items.push({
				title : result.formatted_address,
				data : {
					lat : result.geometry.location.lat,
					lng : result.geometry.location.lng
				}
			});

		};
		var addressPicker = Alloy.createController('picker/genericPicker', {
			callback : function(item, close, index) {
				if (!item.title)
					e.source.value = item;
				else
					e.source.value = item.title;

				if (e.id === $.addressProfile.id) {
					address = e.value;
					if (item.data) {
						lat = item.data.lat;
						lng = item.data.lng;
					}
				}

				if (index)
					rowIndex = index;
				if (close) {
					$.pickerWrap.removeAllChildren();
				}
			},
			rowIndex : rowIndex,
			items : items
		}).getView();

		closeKeyboard();
		$.pickerWrap.removeAllChildren();
		$.pickerWrap.add(addressPicker);

	});
};

function closeKeyboard() {
	$.address.blur();
}

var currencyRowIndex = 0;
function selectCurrency() {
	var currencyPicker = Alloy.createController('picker/genericPicker', {
		items : currencyItems,
		rowIndex : currencyRowIndex,
		callback : function(item, close, index) {
			if (!item.title)
				$.currency.value = item;
			else
				$.currency.value = item.title;
			if (item.data)
				currency = item.data.id;
			if (index >= 0)
				currency = index;
			if (close) {
				$.pickerWrap.removeAllChildren();
			}
		}
	}).getView();

	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(currencyPicker);
}

function customLocation(element) {
	var geo = Alloy.Globals.geo;
	indicator.openIndicator();
	geo.checkLocation(function() {
		if (geo.location.status != geo.errors.NONE) {
			Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
			indicator.closeIndicator();
			return;
		}
		lat = geo.location.lat;
		lng = geo.location.lng;
		geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
			indicator.closeIndicator();
			if (e.error) {
				if (e.message)
					Alloy.Globals.core.showErrorDialog(L(e.message));
				else
					Alloy.Globals.core.showErrorDialog(L(e.error));
			} else {
				if (e && e.response) {
					if (e.response.results && e.response.results[0] && e.response.results[0].formatted_address) {
						element.value = e.response.results[0].formatted_address;
					} else if (e.response.resourceSets && e.response.resourceSets[0] && e.response.resourceSets[0].resources && e.response.resourceSets[0].resources[0] && e.response.resourceSets[0].resources[0].address && e.response.resourceSets[0].resources[0].address.formattedAddress) {
						element.value = e.response.resourceSets[0].resources[0].address.formattedAddress;
					}
					if (element.id === $.address.id) {
						address = $.address.value;
					}
				}
			}
		});
	});
}

$.firstNameLbl.text = $.firstNameLbl.text + '*';
$.lastNameLbl.text = $.lastNameLbl.text + '*';
$.currencyLbl.text = $.currencyLbl.text + '*';
$.emailLbl.text = $.emailLbl.text + '*';
$.passwordLbl.text = $.passwordLbl.text + '*';
$.confirmLbl.text = $.confirmLbl.text + '*';
$.categoriesLbl.text = $.categoriesLbl.text + '*';
$.nameLbl.text = $.nameLbl.text + '*';
$.numberLbl.text = $.numberLbl.text + '*';
$.phoneLbl.text = $.phoneLbl.text + '*';
$.email2Lbl.text = $.email2Lbl.text + '*';
$.addressLbl.text = $.addressLbl.text + '*';
$.imageLbl.text = $.imageLbl.text + '*';
$.aboutLbl.text = $.aboutLbl.text + '*';
$.workingHoursLbl.text = $.workingHoursLbl.text + '*';
$.termsLbl.text = $.termsLbl.text + '*';
$.phoneUserLbl.text = $.phoneUserLbl.text + "*";  
$.addressProfileLbl.text = $.addressProfileLbl.text + '*';
