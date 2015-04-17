function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function blur(e) {
        hideKeyboard(e);
    }
    function hideKeyboard(e) {
        e.source.id != $.firstName.id && $.firstName.blur();
        e.source.id != $.lastName.id && $.lastName.blur();
        e.source.id != $.firstName.id && $.firstName.blur();
        e.source.id != $.userEmail.id && $.userEmail.blur();
        e.source.id != $.password.id && $.password.blur();
        e.source.id != $.confirm.id && $.confirm.blur();
        e.source.id != $.name.id && $.name.blur();
        e.source.id != $.number.id && $.number.blur();
        e.source.id != $.phone.id && $.phone.blur();
        e.source.id != $.email.id && $.email.blur();
        e.source.id != $.address.id && $.address.blur();
        e.source.id != $.about.id && $.about.blur();
        e.source.id != $.workingHours.id && $.workingHours.blur();
        e.source.id != $.terms.id && $.terms.blur();
        e.source.id != $.addressProfile.id && $.addressProfile.blur();
        e.source.id != $.currency.id && $.pickerWrap.removeAllChildren();
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function agreeClick() {
        isAgree = !isAgree;
        $.iAgree.image = isAgree ? "images/checkbox_check.png" : "images/checkbox.png";
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        openView(e);
    }
    function openView(e) {
        switch (e.source.id) {
          case "signUp":
            doSignUp(e);
            break;

          case "signIn":
            showSignIn(e);
            break;

          case "customLocation":
            customLocation($.address);
            break;

          case "customLocationProfile":
            customLocation($.addressProfile);
        }
    }
    function termClick() {
        var view = Alloy.createController("account/sign/term").getView();
        Alloy.CFG.tabAccount.open(view);
    }
    function doSignUp() {
        var signup = Alloy.createModel("signup", {
            firstName: $.firstName.value,
            lastName: $.lastName.value,
            email: $.userEmail.value,
            password: $.password.value,
            confirm: $.confirm.value,
            appInstallId: Alloy.Globals.core.installId,
            appVersion: Ti.App.version,
            platformModel: Ti.Platform.model,
            platformVersion: Ti.Platform.version,
            platformOSName: "android",
            language: Ti.Locale.currentLanguage,
            currency: currency,
            address: $.addressProfile.value
        });
        if (signup.localValidate(errorHandler)) {
            indicator.openIndicator();
            var company = false;
            if ($.company_switch.value) {
                if (0 == subCategories.length) {
                    indicator.closeIndicator();
                    Alloy.Globals.core.showErrorDialog(L("please_select_category"));
                    return;
                }
                var subcategoriesForSave = [];
                for (var i = 0; i < subCategories.length; ++i) {
                    var s = subCategories[i];
                    subcategoriesForSave.push(s.Id ? s.Id : s);
                }
                company = Alloy.createModel("company", {
                    name: $.name.value,
                    number: $.number.value,
                    phone: $.phone.value,
                    email: $.email.value,
                    address: $.address.value,
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                    subCategories: JSON.stringify(subcategoriesForSave),
                    about: $.about.value,
                    workingHours: $.workingHours.value,
                    terms: $.terms.value,
                    haveImage: image && imageUpdated
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
                    message: L("only_register_company"),
                    buttonNames: [ L("cancel"), L("ok") ],
                    cancel: 0
                });
                alertDialog.addEventListener("click", function(e) {
                    if (e.cancel === e.index || true === e.cancel) {
                        indicator.closeIndicator();
                        return;
                    }
                    saveUser(signup, company);
                });
                alertDialog.show();
            } else saveUser(signup);
        }
    }
    function saveUser(signup, company) {
        signup.attributes.isSupplier = company ? true : false;
        signup.save({}, {
            success: function(model, response) {
                Alloy.Globals.core.apiToken(response.UUID);
                if ($.company_switch.value) {
                    if (company && company.localValidate(errorHandler)) if (lat && lng && $.address.value === address) {
                        indicator.closeIndicator();
                        saveCompany(company);
                    } else geo.geocoding($.address.value, function(e) {
                        if (e.error == geo.elementStatuses.ZERO_RESULTS || e.error == geo.elementStatuses.NOT_FOUND) {
                            indicator.closeIndicator();
                            Alloy.Globals.core.showErrorDialog(L("address_not_found"));
                            return;
                        }
                        if (!(e && e.response && e.response.results && e.response.results.length > 0)) {
                            indicator.closeIndicator();
                            Alloy.Globals.core.showErrorDialog(L("address_not_found"));
                            return;
                        }
                        company.attributes.lat = parseFloat(e.response.results[0].geometry.location.lat);
                        company.attributes.lng = parseFloat(e.response.results[0].geometry.location.lng);
                        saveCompany(company);
                    });
                } else {
                    saveProfile();
                    Alloy.Collections.adverts = Alloy.createCollection("advert");
                    indicator.closeIndicator();
                    Ti.App.fireEvent("account:showAccount");
                }
            },
            error: function() {
                indicator.closeIndicator();
                errorHandler(errors.CAN_NOT_CREATE_ACCOUNT);
            }
        });
    }
    function saveCompany(company) {
        company.save({}, {
            success: function(model, response) {
                Ti.App.fireEvent("account:itIsSupplier");
                if (image && imageUpdated) {
                    var upload = Alloy.Globals.upload;
                    var images = [];
                    var factor = 1;
                    var size = 400;
                    var height = image.height;
                    var width = image.width;
                    var newImageView = Ti.UI.createImageView({
                        image: image,
                        width: width,
                        height: height
                    });
                    if (height > width) {
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
                        type: upload.types.logo,
                        id: response,
                        blobs: images,
                        onerror: function() {
                            progress.closeBar();
                            Alloy.Globals.core.showErrorDialog(L("error_loading_image"));
                        },
                        onload: function() {
                            progress.setBarValue(1);
                            progress.closeBar();
                            postUpdate();
                        },
                        onsendstream: function(e) {
                            progress.setBarValue(e.progress);
                            Ti.API.info("progress - " + e.progress);
                        }
                    });
                } else postUpdate();
                indicator.closeIndicator();
            },
            error: function() {
                indicator.closeIndicator();
            }
        });
    }
    function postUpdate() {
        indicator.closeIndicator();
        Alloy.Globals.core.showErrorDialog(L("registration_success"));
        Alloy.Collections.adverts = Alloy.createCollection("advert");
        Ti.App.fireEvent("account:updateProfile", {
            showProducts: true
        });
        Ti.App.fireEvent("account:showAccount");
    }
    function saveProfile() {
        var profile = Alloy.createModel("profile");
        profile.fetch({
            success: function() {
                Alloy.Globals.profile = profile.toJSON();
                indicator.closeIndicator();
                Alloy.Globals.profile.supplier && Ti.App.fireEvent("account:itIsSupplier");
            }
        });
    }
    function errorHandler(err) {
        switch (err) {
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
        }
        indicator.closeIndicator();
        Alloy.Globals.core.showError(err);
    }
    function showSignIn() {
        indicator.closeIndicator();
        Ti.App.fireEvent("account:showSignIn");
    }
    function categories() {
        var view = Alloy.createController("categories/index", {
            win: Alloy.CFG.tabAccount,
            name: L("categories"),
            forDeals: true,
            sectionName: sectionName,
            closeCallback: function() {
                subCategories = [];
                for (var categoryKey in core.currentSectionCategories()) {
                    var category = core.currentSectionCategories()[categoryKey];
                    for (var subCategoryKey in category) subCategories.push(core.currentSectionCategories()[categoryKey][subCategoryKey]);
                }
                showCategories();
            }
        });
        var win = view.getView();
        win.backButtonTitle = L("create_account");
        Alloy.CFG.tabAccount.open(win);
    }
    function showCategories() {
        $.selectedCategories.text = "";
        for (var categoryKey in core.currentSectionCategories()) if (Object.size(core.currentSectionCategories()[categoryKey]) > 0) {
            categoryKey = categoryKey.replace("_", "");
            var category = Alloy.Collections.categories.get(categoryKey);
            $.selectedCategories.text += "" == $.selectedCategories.text ? category.attributes["name"] : ", " + category.attributes["name"];
        }
    }
    function addPhoto() {
        photoDialog.show();
    }
    function openGallery() {
        Titanium.Media.openPhotoGallery({
            success: function(e) {
                if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
                    image = e.media;
                    $.imageView.image = image;
                    $.deleteImage.visible = true;
                    $.imageView.height = Ti.UI.SIZE;
                    $.imageView.bottom = "10dp";
                    $.imageView.visible = true;
                    imageUpdated = true;
                }
            }
        });
    }
    function showCamera() {
        Titanium.Media.showCamera({
            success: function(e) {
                if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
                    image = e.media;
                    $.imageView.image = image;
                    $.deleteImage.visible = true;
                    $.imageView.visible = true;
                    $.imageView.height = Ti.UI.SIZE;
                    $.imageView.bottom = "10dp";
                    imageUpdated = true;
                }
            },
            cancel: function() {},
            error: function() {}
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
    }
    function search(e) {
        var address = e.value;
        geo.geocoding(address, function(geodata) {
            if (geodata.error == geo.elementStatuses.ZERO_RESULTS || geodata.error == geo.elementStatuses.NOT_FOUND) {
                Alloy.Globals.core.showErrorDialog(L("address_not_found"));
                return;
            }
            var items = [];
            for (var i = 0; i < geodata.response.results.length; i++) {
                var result = geodata.response.results[i];
                items.push({
                    title: result.formatted_address,
                    data: {
                        lat: result.geometry.location.lat,
                        lng: result.geometry.location.lng
                    }
                });
            }
            var addressPicker = Alloy.createController("picker/genericPicker", {
                callback: function(item, close, index) {
                    e.source.value = item.title ? item.title : item;
                    if (e.id === $.addressProfile.id) {
                        address = e.value;
                        if (item.data) {
                            lat = item.data.lat;
                            lng = item.data.lng;
                        }
                    }
                    index && (rowIndex = index);
                    close && $.pickerWrap.removeAllChildren();
                },
                rowIndex: rowIndex,
                items: items
            }).getView();
            closeKeyboard();
            $.pickerWrap.removeAllChildren();
            $.pickerWrap.add(addressPicker);
        });
    }
    function closeKeyboard() {
        $.address.blur();
    }
    function selectCurrency() {
        var currencyPicker = Alloy.createController("picker/genericPicker", {
            items: currencyItems,
            rowIndex: currencyRowIndex,
            callback: function(item, close, index) {
                $.currency.value = item.title ? item.title : item;
                item.data && (currency = item.data.id);
                index >= 0 && (currency = index);
                close && $.pickerWrap.removeAllChildren();
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
                if (e.error) Alloy.Globals.core.showErrorDialog(e.message ? L(e.message) : L(e.error)); else if (e && e.response) {
                    e.response.results && e.response.results[0] && e.response.results[0].formatted_address ? element.value = e.response.results[0].formatted_address : e.response.resourceSets && e.response.resourceSets[0] && e.response.resourceSets[0].resources[0].address.formattedAddress && (element.value = e.response.resourceSets[0].resources[0].address.formattedAddress);
                    element.id === $.address.id && (address = $.address.value);
                }
            });
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/sign/up";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.up = Ti.UI.createView({
        layout: "absolute",
        id: "up"
    });
    $.__views.up && $.addTopLevelView($.__views.up);
    $.__views.__alloyId122 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        top: "0",
        id: "__alloyId122"
    });
    $.__views.up.add($.__views.__alloyId122);
    blur ? $.__views.__alloyId122.addEventListener("click", blur) : __defers["$.__views.__alloyId122!click!blur"] = true;
    $.__views.__alloyId123 = Ti.UI.createLabel({
        height: "80dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "signup",
        id: "__alloyId123"
    });
    $.__views.__alloyId122.add($.__views.__alloyId123);
    $.__views.firstNameLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "firstNameLbl",
        textid: "firstname"
    });
    $.__views.__alloyId122.add($.__views.firstNameLbl);
    $.__views.firstName = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "firstName"
    });
    $.__views.__alloyId122.add($.__views.firstName);
    focus ? $.__views.firstName.addEventListener("focus", focus) : __defers["$.__views.firstName!focus!focus"] = true;
    $.__views.lastNameLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Ti.UI.SIZE,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "lastNameLbl",
        textid: "lastname"
    });
    $.__views.__alloyId122.add($.__views.lastNameLbl);
    $.__views.lastName = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "lastName"
    });
    $.__views.__alloyId122.add($.__views.lastName);
    focus ? $.__views.lastName.addEventListener("focus", focus) : __defers["$.__views.lastName!focus!focus"] = true;
    $.__views.currencyLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "currencyLbl",
        textid: "currency"
    });
    $.__views.__alloyId122.add($.__views.currencyLbl);
    $.__views.currency = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "currency",
        enabled: "false"
    });
    $.__views.__alloyId122.add($.__views.currency);
    selectCurrency ? $.__views.currency.addEventListener("click", selectCurrency) : __defers["$.__views.currency!click!selectCurrency"] = true;
    $.__views.emailLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "emailLbl",
        textid: "email"
    });
    $.__views.__alloyId122.add($.__views.emailLbl);
    $.__views.userEmail = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "userEmail",
        keyboardType: Titanium.UI.KEYBOARD_EMAIL
    });
    $.__views.__alloyId122.add($.__views.userEmail);
    focus ? $.__views.userEmail.addEventListener("focus", focus) : __defers["$.__views.userEmail!focus!focus"] = true;
    $.__views.addressProfileLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "addressProfileLbl",
        textid: "address"
    });
    $.__views.__alloyId122.add($.__views.addressProfileLbl);
    $.__views.__alloyId124 = Ti.UI.createView({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputAreaHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "__alloyId124"
    });
    $.__views.__alloyId122.add($.__views.__alloyId124);
    $.__views.addressProfile = Ti.UI.createTextArea(function() {
        var o = {};
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            width: "160dp",
            height: Alloy.Globals.Styles.inputAreaHeight,
            top: "0dp",
            left: "2dp",
            textAlign: Alloy.Globals.Styles.inputTextAlign,
            font: {
                fontSize: "15dp",
                fontFamily: "Arial"
            },
            color: Alloy.Globals.Styles.inputColor,
            paddingLeft: "5dp",
            id: "addressProfile",
            returnKeyType: Ti.UI.RETURNKEY_SEARCH
        });
        return o;
    }());
    $.__views.__alloyId124.add($.__views.addressProfile);
    search ? $.__views.addressProfile.addEventListener("return", search) : __defers["$.__views.addressProfile!return!search"] = true;
    $.__views.customLocationProfile = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        bottom: "0dp",
        right: "0dp",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        backgroundImage: "images/icon_location.png",
        backgroundRepeat: false,
        id: "customLocationProfile"
    });
    $.__views.__alloyId124.add($.__views.customLocationProfile);
    buttonTouchStart ? $.__views.customLocationProfile.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.customLocationProfile!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.customLocationProfile.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.customLocationProfile!touchend!buttonTouchEnd"] = true;
    focus ? $.__views.customLocationProfile.addEventListener("focus", focus) : __defers["$.__views.customLocationProfile!focus!focus"] = true;
    $.__views.passwordLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "passwordLbl",
        textid: "password"
    });
    $.__views.__alloyId122.add($.__views.passwordLbl);
    $.__views.password = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "password",
        passwordMask: "true"
    });
    $.__views.__alloyId122.add($.__views.password);
    focus ? $.__views.password.addEventListener("focus", focus) : __defers["$.__views.password!focus!focus"] = true;
    $.__views.confirmLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "confirmLbl",
        textid: "confirm"
    });
    $.__views.__alloyId122.add($.__views.confirmLbl);
    $.__views.confirm = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "confirm",
        passwordMask: "true"
    });
    $.__views.__alloyId122.add($.__views.confirm);
    focus ? $.__views.confirm.addEventListener("focus", focus) : __defers["$.__views.confirm!focus!focus"] = true;
    $.__views.__alloyId125 = Ti.UI.createLabel({
        width: "140dp",
        height: Ti.UI.SIZE,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "up_click_for_company",
        id: "__alloyId125"
    });
    $.__views.__alloyId122.add($.__views.__alloyId125);
    $.__views.company_switch = Ti.UI.createSwitch({
        height: Alloy.Globals.Styles.inputAreaHeight,
        width: "20dp",
        top: "-35dp",
        bottom: "10dp",
        right: Alloy.Globals.Styles.formSwitchFloat_right,
        left: Alloy.Globals.Styles.formSwitchFloat_left,
        value: false,
        id: "company_switch"
    });
    $.__views.__alloyId122.add($.__views.company_switch);
    $.__views.companyForm = Ti.UI.createView({
        id: "companyForm",
        height: "0",
        layout: "vertical",
        top: "0",
        visible: "false"
    });
    $.__views.__alloyId122.add($.__views.companyForm);
    $.__views.categoriesLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "categoriesLbl",
        textid: "categories",
        top: "0"
    });
    $.__views.companyForm.add($.__views.categoriesLbl);
    $.__views.categories = Ti.UI.createButton({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        textAlign: "left",
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        title: "",
        id: "categories"
    });
    $.__views.companyForm.add($.__views.categories);
    categories ? $.__views.categories.addEventListener("click", categories) : __defers["$.__views.categories!click!categories"] = true;
    $.__views.__alloyId126 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        left: "5dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        textid: "select_category",
        id: "__alloyId126"
    });
    $.__views.categories.add($.__views.__alloyId126);
    $.__views.selectedCategories = Ti.UI.createLabel({
        height: "20dp",
        left: "52dp",
        right: "15dp",
        top: "7dp",
        color: "#aaa",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "12dp",
            fontFamily: "Arial"
        },
        id: "selectedCategories"
    });
    $.__views.categories.add($.__views.selectedCategories);
    $.__views.__alloyId127 = Ti.UI.createLabel({
        width: "20dp",
        height: "20dp",
        right: "5dp",
        top: "5dp",
        backgroundImage: "images/icon_listItem.png",
        backgroundRepeat: false,
        id: "__alloyId127"
    });
    $.__views.categories.add($.__views.__alloyId127);
    $.__views.nameLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "nameLbl",
        textid: "name"
    });
    $.__views.companyForm.add($.__views.nameLbl);
    $.__views.name = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "name"
    });
    $.__views.companyForm.add($.__views.name);
    focus ? $.__views.name.addEventListener("focus", focus) : __defers["$.__views.name!focus!focus"] = true;
    $.__views.numberLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "numberLbl",
        textid: "company_number"
    });
    $.__views.companyForm.add($.__views.numberLbl);
    $.__views.number = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "number"
    });
    $.__views.companyForm.add($.__views.number);
    focus ? $.__views.number.addEventListener("focus", focus) : __defers["$.__views.number!focus!focus"] = true;
    $.__views.phoneLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "phoneLbl",
        textid: "phone"
    });
    $.__views.companyForm.add($.__views.phoneLbl);
    $.__views.phone = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "phone",
        keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD
    });
    $.__views.companyForm.add($.__views.phone);
    focus ? $.__views.phone.addEventListener("focus", focus) : __defers["$.__views.phone!focus!focus"] = true;
    $.__views.email2Lbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "email2Lbl",
        textid: "email"
    });
    $.__views.companyForm.add($.__views.email2Lbl);
    $.__views.email = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "email",
        keyboardType: Titanium.UI.KEYBOARD_EMAIL
    });
    $.__views.companyForm.add($.__views.email);
    focus ? $.__views.email.addEventListener("focus", focus) : __defers["$.__views.email!focus!focus"] = true;
    $.__views.addressLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "addressLbl",
        textid: "address"
    });
    $.__views.companyForm.add($.__views.addressLbl);
    $.__views.__alloyId128 = Ti.UI.createView({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputAreaHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "__alloyId128"
    });
    $.__views.companyForm.add($.__views.__alloyId128);
    $.__views.address = Ti.UI.createTextArea(function() {
        var o = {};
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            width: "160dp",
            height: Alloy.Globals.Styles.inputAreaHeight,
            top: "0dp",
            left: "2dp",
            textAlign: Alloy.Globals.Styles.inputTextAlign,
            font: {
                fontSize: "15dp",
                fontFamily: "Arial"
            },
            color: Alloy.Globals.Styles.inputColor,
            paddingLeft: "5dp",
            id: "address",
            returnKeyType: Ti.UI.RETURNKEY_SEARCH
        });
        return o;
    }());
    $.__views.__alloyId128.add($.__views.address);
    search ? $.__views.address.addEventListener("return", search) : __defers["$.__views.address!return!search"] = true;
    focus ? $.__views.address.addEventListener("focus", focus) : __defers["$.__views.address!focus!focus"] = true;
    $.__views.customLocation = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        bottom: "0dp",
        right: "0dp",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        backgroundImage: "images/icon_location.png",
        backgroundRepeat: false,
        id: "customLocation"
    });
    $.__views.__alloyId128.add($.__views.customLocation);
    buttonTouchStart ? $.__views.customLocation.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.customLocation!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.customLocation.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.customLocation!touchend!buttonTouchEnd"] = true;
    $.__views.imageLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "imageLbl",
        textid: "company_logo"
    });
    $.__views.companyForm.add($.__views.imageLbl);
    $.__views.imageView = Ti.UI.createImageView({
        width: Alloy.Globals.Styles.inputWidth,
        bottom: "0",
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
        id: "imageView",
        height: "0",
        visible: "false"
    });
    $.__views.companyForm.add($.__views.imageView);
    $.__views.changeImage = Ti.UI.createButton({
        width: "100dp",
        height: Alloy.Globals.Styles.inputHeight,
        left: Alloy.Globals.Styles.inputLeft,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "17dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        id: "changeImage",
        titleid: "photo"
    });
    $.__views.companyForm.add($.__views.changeImage);
    addPhoto ? $.__views.changeImage.addEventListener("click", addPhoto) : __defers["$.__views.changeImage!click!addPhoto"] = true;
    $.__views.deleteImage = Ti.UI.createButton(function() {
        var o = {};
        _.extend(o, {
            width: "30dp",
            height: "30dp",
            bottom: "10dp",
            top: Alloy.Globals.Styles.inputUp,
            left: Alloy.Globals.Styles.labelLeft,
            style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
            font: {
                fontFamily: "Avenir Next Condensed",
                fontSize: "20dp"
            },
            color: "#fff",
            textAlign: "center",
            verticalAlign: "center",
            backgroundColor: Alloy.Globals.Styles.buttonBg,
            backgroundImage: "images/icon_delete.png",
            backgroundRepeat: false,
            right: Alloy.Globals.Styles.deleteRight
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.row_statusLbl_right,
            right: Alloy.Globals.Styles.row_statusLbl_left
        });
        _.extend(o, {
            id: "deleteImage",
            visible: "false"
        });
        return o;
    }());
    $.__views.companyForm.add($.__views.deleteImage);
    deleteImage ? $.__views.deleteImage.addEventListener("click", deleteImage) : __defers["$.__views.deleteImage!click!deleteImage"] = true;
    $.__views.aboutLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "aboutLbl",
        textid: "about_company"
    });
    $.__views.companyForm.add($.__views.aboutLbl);
    $.__views.about = Ti.UI.createTextArea(function() {
        var o = {};
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            width: Alloy.Globals.Styles.inputWidth,
            height: Alloy.Globals.Styles.inputAreaHeight,
            top: Alloy.Globals.Styles.inputUp,
            bottom: "10dp",
            left: Alloy.Globals.Styles.inputLeft,
            borderColor: "#ccc",
            borderStyle: 1,
            borderWidth: "1dp",
            textAlign: Alloy.Globals.Styles.inputTextAlign,
            font: {
                fontSize: "15dp",
                fontFamily: "Arial"
            },
            backgroundColor: "#fff",
            color: Alloy.Globals.Styles.inputColor,
            id: "about",
            suppressReturn: "false",
            returnKeyType: Ti.UI.RETURNKEY_NEXT
        });
        return o;
    }());
    $.__views.companyForm.add($.__views.about);
    focus ? $.__views.about.addEventListener("focus", focus) : __defers["$.__views.about!focus!focus"] = true;
    $.__views.workingHoursLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: "50",
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "workingHoursLbl",
        textid: "working_hours"
    });
    $.__views.companyForm.add($.__views.workingHoursLbl);
    $.__views.workingHours = Ti.UI.createTextArea(function() {
        var o = {};
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            width: Alloy.Globals.Styles.inputWidth,
            height: Alloy.Globals.Styles.inputAreaHeight,
            top: "-50",
            bottom: "10dp",
            left: Alloy.Globals.Styles.inputLeft,
            borderColor: "#ccc",
            borderStyle: 1,
            borderWidth: "1dp",
            textAlign: Alloy.Globals.Styles.inputTextAlign,
            font: {
                fontSize: "15dp",
                fontFamily: "Arial"
            },
            backgroundColor: "#fff",
            color: Alloy.Globals.Styles.inputColor,
            id: "workingHours",
            returnKeyType: Ti.UI.RETURNKEY_NEXT,
            suppressReturn: "false"
        });
        return o;
    }());
    $.__views.companyForm.add($.__views.workingHours);
    focus ? $.__views.workingHours.addEventListener("focus", focus) : __defers["$.__views.workingHours!focus!focus"] = true;
    $.__views.termsLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "termsLbl",
        textid: "terms_company"
    });
    $.__views.companyForm.add($.__views.termsLbl);
    $.__views.terms = Ti.UI.createTextArea(function() {
        var o = {};
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            width: Alloy.Globals.Styles.inputWidth,
            height: Alloy.Globals.Styles.inputAreaHeight,
            top: Alloy.Globals.Styles.inputUp,
            bottom: "10dp",
            left: Alloy.Globals.Styles.inputLeft,
            borderColor: "#ccc",
            borderStyle: 1,
            borderWidth: "1dp",
            textAlign: Alloy.Globals.Styles.inputTextAlign,
            font: {
                fontSize: "15dp",
                fontFamily: "Arial"
            },
            backgroundColor: "#fff",
            color: Alloy.Globals.Styles.inputColor,
            id: "terms",
            returnKeyType: Ti.UI.RETURNKEY_NEXT,
            suppressReturn: "false"
        });
        return o;
    }());
    $.__views.companyForm.add($.__views.terms);
    focus ? $.__views.terms.addEventListener("focus", focus) : __defers["$.__views.terms!focus!focus"] = true;
    $.__views.__alloyId129 = Ti.UI.createView({
        height: "25dp",
        bottom: "20dp",
        top: "10dp",
        layout: "absolute",
        id: "__alloyId129"
    });
    $.__views.__alloyId122.add($.__views.__alloyId129);
    $.__views.iAgree = Ti.UI.createImageView({
        left: Alloy.Globals.Styles.row_statusLbl_left,
        right: Alloy.Globals.Styles.row_statusLbl_right,
        image: "images/checkbox.png",
        id: "iAgree"
    });
    $.__views.__alloyId129.add($.__views.iAgree);
    agreeClick ? $.__views.iAgree.addEventListener("click", agreeClick) : __defers["$.__views.iAgree!click!agreeClick"] = true;
    $.__views.__alloyId130 = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.agreeLabelLeft,
        right: Alloy.Globals.Styles.agreeLabelRight,
        color: "#555",
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "I_agree_with",
        id: "__alloyId130"
    });
    $.__views.__alloyId129.add($.__views.__alloyId130);
    $.__views.__alloyId131 = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.agreeLinkLeft,
        right: Alloy.Globals.Styles.agreeLinkRight,
        color: "#00accb",
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "terms_of_use",
        id: "__alloyId131"
    });
    $.__views.__alloyId129.add($.__views.__alloyId131);
    termClick ? $.__views.__alloyId131.addEventListener("click", termClick) : __defers["$.__views.__alloyId131!click!termClick"] = true;
    $.__views.__alloyId132 = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.agreeSymbolLeft,
        right: Alloy.Globals.Styles.agreeSymbolRight,
        color: "#555",
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        text: " *",
        id: "__alloyId132"
    });
    $.__views.__alloyId129.add($.__views.__alloyId132);
    $.__views.signUp = Ti.UI.createButton({
        width: "120dp",
        height: "40dp",
        bottom: "20dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        id: "signUp",
        titleid: "signup"
    });
    $.__views.__alloyId122.add($.__views.signUp);
    buttonTouchStart ? $.__views.signUp.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.signUp!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.signUp.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.signUp!touchend!buttonTouchEnd"] = true;
    $.__views.pickerWrap = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "pickerWrap"
    });
    $.__views.up.add($.__views.pickerWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.firstName.focus();
    var errors = Alloy.Globals.errors;
    var core = Alloy.Globals.core;
    var currencyItems = Alloy.Globals.core.currencyItems;
    var isAgree = false, progress = Alloy.Globals.progress, subCategories = [], sectionName = "", lat = false, lng = false, address = false;
    $.address.setHintText(L("enter_address"));
    $.addressProfile.setHintText(L("enter_address"));
    var currency = "";
    var indicator = Alloy.Globals.indicator;
    $.company_switch.addEventListener("change", function() {
        if ($.company_switch.value) {
            $.companyForm.height = Ti.UI.SIZE;
            $.companyForm.show();
        } else {
            $.companyForm.height = "0dp";
            $.companyForm.hide();
        }
    });
    var image = false, imageUpdated = false;
    var optionsPhotoDialog = {
        options: [ "Make Photo", "Choose Photo", "Cancel" ],
        cancel: 2
    };
    var photoDialog = Titanium.UI.createOptionDialog(optionsPhotoDialog);
    photoDialog.addEventListener("click", function(e) {
        0 == e.index && showCamera();
        1 == e.index && openGallery();
    });
    var rowIndex;
    var currencyRowIndex = 0;
    $.firstNameLbl.text = $.firstNameLbl.text + "*";
    $.lastNameLbl.text = $.lastNameLbl.text + "*";
    $.currencyLbl.text = $.currencyLbl.text + "*";
    $.emailLbl.text = $.emailLbl.text + "*";
    $.passwordLbl.text = $.passwordLbl.text + "*";
    $.confirmLbl.text = $.confirmLbl.text + "*";
    $.categoriesLbl.text = $.categoriesLbl.text + "*";
    $.nameLbl.text = $.nameLbl.text + "*";
    $.numberLbl.text = $.numberLbl.text + "*";
    $.phoneLbl.text = $.phoneLbl.text + "*";
    $.email2Lbl.text = $.email2Lbl.text + "*";
    $.addressLbl.text = $.addressLbl.text + "*";
    $.imageLbl.text = $.imageLbl.text + "*";
    $.aboutLbl.text = $.aboutLbl.text + "*";
    $.workingHoursLbl.text = $.workingHoursLbl.text + "*";
    $.termsLbl.text = $.termsLbl.text + "*";
    $.addressProfileLbl.text = $.addressProfileLbl.text + "*";
    __defers["$.__views.__alloyId122!click!blur"] && $.__views.__alloyId122.addEventListener("click", blur);
    __defers["$.__views.firstName!focus!focus"] && $.__views.firstName.addEventListener("focus", focus);
    __defers["$.__views.lastName!focus!focus"] && $.__views.lastName.addEventListener("focus", focus);
    __defers["$.__views.currency!click!selectCurrency"] && $.__views.currency.addEventListener("click", selectCurrency);
    __defers["$.__views.userEmail!focus!focus"] && $.__views.userEmail.addEventListener("focus", focus);
    __defers["$.__views.addressProfile!return!search"] && $.__views.addressProfile.addEventListener("return", search);
    __defers["$.__views.customLocationProfile!touchstart!buttonTouchStart"] && $.__views.customLocationProfile.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.customLocationProfile!touchend!buttonTouchEnd"] && $.__views.customLocationProfile.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.customLocationProfile!focus!focus"] && $.__views.customLocationProfile.addEventListener("focus", focus);
    __defers["$.__views.password!focus!focus"] && $.__views.password.addEventListener("focus", focus);
    __defers["$.__views.confirm!focus!focus"] && $.__views.confirm.addEventListener("focus", focus);
    __defers["$.__views.categories!click!categories"] && $.__views.categories.addEventListener("click", categories);
    __defers["$.__views.name!focus!focus"] && $.__views.name.addEventListener("focus", focus);
    __defers["$.__views.number!focus!focus"] && $.__views.number.addEventListener("focus", focus);
    __defers["$.__views.phone!focus!focus"] && $.__views.phone.addEventListener("focus", focus);
    __defers["$.__views.email!focus!focus"] && $.__views.email.addEventListener("focus", focus);
    __defers["$.__views.address!return!search"] && $.__views.address.addEventListener("return", search);
    __defers["$.__views.address!focus!focus"] && $.__views.address.addEventListener("focus", focus);
    __defers["$.__views.customLocation!touchstart!buttonTouchStart"] && $.__views.customLocation.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.customLocation!touchend!buttonTouchEnd"] && $.__views.customLocation.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.changeImage!click!addPhoto"] && $.__views.changeImage.addEventListener("click", addPhoto);
    __defers["$.__views.deleteImage!click!deleteImage"] && $.__views.deleteImage.addEventListener("click", deleteImage);
    __defers["$.__views.about!focus!focus"] && $.__views.about.addEventListener("focus", focus);
    __defers["$.__views.workingHours!focus!focus"] && $.__views.workingHours.addEventListener("focus", focus);
    __defers["$.__views.terms!focus!focus"] && $.__views.terms.addEventListener("focus", focus);
    __defers["$.__views.iAgree!click!agreeClick"] && $.__views.iAgree.addEventListener("click", agreeClick);
    __defers["$.__views.__alloyId131!click!termClick"] && $.__views.__alloyId131.addEventListener("click", termClick);
    __defers["$.__views.signUp!touchstart!buttonTouchStart"] && $.__views.signUp.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.signUp!touchend!buttonTouchEnd"] && $.__views.signUp.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;