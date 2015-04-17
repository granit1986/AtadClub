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
        e.source.id !== $.about.id && $.about.blur();
        e.source.id !== $.name.id && $.name.blur();
        e.source.id !== $.companyNumber.id && $.companyNumber.blur();
        e.source.id !== $.phone.id && $.phone.blur();
        e.source.id !== $.email.id && $.email.blur();
        e.source.id !== $.address.id && $.address.blur();
        e.source.id !== $.workingHours.id && $.workingHours.blur();
        e.source.id !== $.terms.id && $.terms.blur();
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        indicator.openIndicator();
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        "update" == e.source.id ? onClick() : "customLocation" == e.source.id && customLocation();
    }
    function showCategories() {
        $.selectedCategories.text = "";
        for (var categoryKey in core.currentSectionCategories()) if (Object.size(core.currentSectionCategories()[categoryKey]) > 0) {
            categoryKey = categoryKey.replace("_", "");
            var category = Alloy.Collections.categories.get(categoryKey);
            category && ($.selectedCategories.text += "" == $.selectedCategories.text ? category.attributes["name"] : ", " + category.attributes["name"]);
        }
    }
    function updateCacheProfile() {}
    function onClick() {
        if (!Alloy.Globals.core.apiToken()) {
            var alertDialog = Titanium.UI.createAlertDialog({
                title: L("signup_or_signin_title"),
                message: L("signup_or_signin_message"),
                buttonNames: [ L("no"), L("yes") ],
                cancel: 0
            });
            alertDialog.addEventListener("click", function(e) {
                if (e.cancel === e.index || true === e.cancel) return;
                Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
            });
            indicator.closeIndicator();
            alertDialog.show();
            return;
        }
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
        var company = Alloy.createModel("company", {
            name: $.name.value,
            phone: $.phone.value,
            email: $.email.value,
            address: $.address.value,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            subCategories: JSON.stringify(subcategoriesForSave),
            about: $.about.value,
            workingHours: $.workingHours.value,
            terms: $.terms.value,
            number: $.companyNumber.value,
            haveImage: false !== image,
            language: Ti.Platform.locale
        });
        company.localValidate(errorHandler) ? lat && lng && $.address.value === address || geo.geocoding($.address.value, function(e) {
            if (geodata.error) {
                Alloy.Globals.core.showErrorDialog(L(geodata.message));
                return;
            }
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
            if (Alloy.Globals.profile.supplier) saveSupplier(company); else {
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
                    saveSupplier(company);
                });
                alertDialog.show();
            }
        }) : indicator.closeIndicator();
    }
    function saveSupplier(company) {
        Ti.API.info("Save company start");
        company.save({}, {
            success: function(model, response) {
                Ti.App.fireEvent("account:itIsSupplier");
                Ti.API.info("Company saved");
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
                    Ti.API.info("Save image company start");
                    upload.start({
                        type: upload.types.logo,
                        id: response,
                        blobs: images,
                        onerror: function(e) {
                            progress.closeBar();
                            Ti.API.info("Save image error");
                            Alloy.Globals.core.showErrorDialog(L("error_loading_image"));
                            Ti.API.error(e.source);
                        },
                        onload: function() {
                            progress.setBarValue(1);
                            progress.closeBar();
                            updateCacheProfile();
                            Ti.API.info("Image saved");
                            postUpdate();
                        },
                        onsendstream: function(e) {
                            progress.setBarValue(e.progress);
                            Ti.API.info("progress - " + e.progress);
                        }
                    });
                } else {
                    updateCacheProfile();
                    postUpdate();
                }
                indicator.closeIndicator();
            },
            error: function() {
                indicator.closeIndicator();
            }
        });
    }
    function customLocation() {
        var geo = Alloy.Globals.geo;
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
                e && e.error ? Alloy.Globals.core.showErrorDialog(e.message ? L(e.message) : L(e.error)) : e && e.response && (e.response.results && e.response.results[0] && e.response.results[0].formatted_address ? $.address.value = e.response.results[0].formatted_address : e.response.resourceSets && e.response.resourceSets[0] && e.response.resourceSets[0].resources && e.response.resourceSets[0].resources[0] && e.response.resourceSets[0].resources[0].address && e.response.resourceSets[0].resources[0].address.formattedAddress && ($.address.value = e.response.resourceSets[0].resources[0].address.formattedAddress));
            });
        });
    }
    function search() {
        geo.geocoding($.address.value, function(geodata) {
            if (geodata.error) {
                Alloy.Globals.core.showErrorDialog(L(geodata.message));
                return;
            }
            if (geodata.error == geo.elementStatuses.ZERO_RESULTS || geodata.error == geo.elementStatuses.NOT_FOUND) {
                indicator.closeIndicator();
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
                    $.address.value = item.title ? item.title : item;
                    if (item.data) {
                        lat = item.data.lat;
                        lng = item.data.lng;
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
    function postUpdate() {
        indicator.closeIndicator();
        Alloy.Globals.core.showErrorDialog(L("company_updated_label"));
        Ti.App.fireEvent("account:updateProfile");
        $.window.close();
        companySaved = true;
    }
    function close() {
        callback && companySaved && callback(newSupplier);
    }
    function errorHandler(err) {
        switch (err) {
          case errors.NO_COMPANY_NAME:
            $.name.focus();
            break;

          case errors.NO_EMAIL:
            $.email.focus();
            break;

          case errors.INVALID_EMAIL:
            $.email.focus();
            break;

          case errors.NO_NUMBER:
          case errors.INVALID_NUMBER:
            $.companyNumber.focus();
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

          case errors.NO_ABOUT:
            $.about.focus();
            break;

          case errors.NO_WORKING_HOURS:
            $.workingHours.focus();
            break;

          case errors.NO_TERMS:
            $.terms.focus();
        }
        Alloy.Globals.core.showError(err);
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
    function categories() {
        Alloy.CFG.tabAccount.open(Alloy.createController("categories/index", {
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
        }).getView());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/company";
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
    $.__views.window = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "absolute",
        id: "window",
        fullscreen: "true",
        titleid: "add_company"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.__alloyId23 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        top: "0",
        id: "__alloyId23"
    });
    $.__views.window.add($.__views.__alloyId23);
    $.__views.__alloyId24 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId24"
    });
    $.__views.__alloyId23.add($.__views.__alloyId24);
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
        textid: "categories"
    });
    $.__views.__alloyId23.add($.__views.categoriesLbl);
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
    $.__views.__alloyId23.add($.__views.categories);
    categories ? $.__views.categories.addEventListener("click", categories) : __defers["$.__views.categories!click!categories"] = true;
    $.__views.__alloyId25 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        left: "5dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        textid: "select_category",
        id: "__alloyId25"
    });
    $.__views.categories.add($.__views.__alloyId25);
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
    $.__views.__alloyId26 = Ti.UI.createLabel({
        width: "20dp",
        height: "20dp",
        right: "5dp",
        top: "5dp",
        backgroundImage: "images/icon_listItem.png",
        backgroundRepeat: false,
        id: "__alloyId26"
    });
    $.__views.categories.add($.__views.__alloyId26);
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
    $.__views.__alloyId23.add($.__views.nameLbl);
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
    $.__views.__alloyId23.add($.__views.name);
    focus ? $.__views.name.addEventListener("focus", focus) : __defers["$.__views.name!focus!focus"] = true;
    $.__views.companyNumberLbl = Ti.UI.createLabel({
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
        id: "companyNumberLbl",
        textid: "company_number"
    });
    $.__views.__alloyId23.add($.__views.companyNumberLbl);
    $.__views.companyNumber = Ti.UI.createTextField({
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
        id: "companyNumber"
    });
    $.__views.__alloyId23.add($.__views.companyNumber);
    focus ? $.__views.companyNumber.addEventListener("focus", focus) : __defers["$.__views.companyNumber!focus!focus"] = true;
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
    $.__views.__alloyId23.add($.__views.phoneLbl);
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
    $.__views.__alloyId23.add($.__views.phone);
    focus ? $.__views.phone.addEventListener("focus", focus) : __defers["$.__views.phone!focus!focus"] = true;
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
    $.__views.__alloyId23.add($.__views.emailLbl);
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
    $.__views.__alloyId23.add($.__views.email);
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
    $.__views.__alloyId23.add($.__views.addressLbl);
    $.__views.__alloyId27 = Ti.UI.createView({
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
        id: "__alloyId27"
    });
    $.__views.__alloyId23.add($.__views.__alloyId27);
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
    $.__views.__alloyId27.add($.__views.address);
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
    $.__views.__alloyId27.add($.__views.customLocation);
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
    $.__views.__alloyId23.add($.__views.imageLbl);
    $.__views.imageView = Ti.UI.createImageView({
        width: Alloy.Globals.Styles.inputWidth,
        bottom: "40dp",
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
        id: "imageView",
        height: "0",
        visible: "false"
    });
    $.__views.__alloyId23.add($.__views.imageView);
    $.__views.changeImage = Ti.UI.createButton({
        width: "100dp",
        height: Alloy.Globals.Styles.inputHeight,
        left: Alloy.Globals.Styles.row_statusLbl_right,
        right: Alloy.Globals.Styles.row_statusLbl_left,
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
    $.__views.__alloyId23.add($.__views.changeImage);
    addPhoto ? $.__views.changeImage.addEventListener("click", addPhoto) : __defers["$.__views.changeImage!click!addPhoto"] = true;
    $.__views.deleteImage = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        bottom: "10dp",
        top: Alloy.Globals.Styles.inputUp,
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
        left: Alloy.Globals.Styles.deleteLeft,
        right: Alloy.Globals.Styles.deleteRight,
        id: "deleteImage",
        visible: "false"
    });
    $.__views.__alloyId23.add($.__views.deleteImage);
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
    $.__views.__alloyId23.add($.__views.aboutLbl);
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
    $.__views.__alloyId23.add($.__views.about);
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
    $.__views.__alloyId23.add($.__views.workingHoursLbl);
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
            suppressReturn: "false",
            returnKeyType: Ti.UI.RETURNKEY_NEXT
        });
        return o;
    }());
    $.__views.__alloyId23.add($.__views.workingHours);
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
    $.__views.__alloyId23.add($.__views.termsLbl);
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
            suppressReturn: "false",
            returnKeyType: Ti.UI.RETURNKEY_NEXT
        });
        return o;
    }());
    $.__views.__alloyId23.add($.__views.terms);
    focus ? $.__views.terms.addEventListener("focus", focus) : __defers["$.__views.terms!focus!focus"] = true;
    $.__views.update = Ti.UI.createButton({
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
        id: "update",
        titleid: "add"
    });
    $.__views.__alloyId23.add($.__views.update);
    buttonTouchStart ? $.__views.update.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.update!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.update.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.update!touchend!buttonTouchEnd"] = true;
    $.__views.pickerWrap = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "pickerWrap"
    });
    $.__views.window.add($.__views.pickerWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var errors = Alloy.Globals.errors, core = Alloy.Globals.core;
    address = false, lat = false, lng = false, subCategories = [], image = false, imageUpdated = false, 
    sectionName = "", progress = Alloy.Globals.progress, callback = arguments[0] && arguments[0].callback || false, 
    newSupplier = true;
    var indicator = Alloy.Globals.indicator;
    $.address.setHintText(L("enter_address"));
    if (Alloy.Globals.profile) if (Alloy.Globals.profile.supplier) {
        newSupplier = false;
        $.window.title = L("edit_company");
        $.update.title = L("update");
        subCategories = JSON.parse(Alloy.Globals.profile.supplier.subCategories);
        $.name.value = Alloy.Globals.profile.supplier.name;
        $.phone.value = Alloy.Globals.profile.supplier.phone;
        $.email.value = Alloy.Globals.profile.supplier.email;
        $.address.value = Alloy.Globals.profile.supplier.address;
        $.companyNumber.value = Alloy.Globals.profile.supplier.number;
        lat = parseFloat(Alloy.Globals.profile.supplier.lat);
        lng = parseFloat(Alloy.Globals.profile.supplier.lng);
        $.about.value = Alloy.Globals.profile.supplier.about;
        $.workingHours.value = Alloy.Globals.profile.supplier.workingHours;
        $.terms.value = Alloy.Globals.profile.supplier.terms;
        if (Alloy.Globals.profile.supplier.logo) {
            image = Alloy.Globals.profile.supplier.logoUrl + Alloy.Globals.profile.supplier.logoId + Alloy.Globals.imageSizes.supplier.edit();
            $.imageView.image = image;
            $.imageView.visible = true;
            $.imageView.height = Ti.UI.SIZE;
            $.imageView.bottom = "10dp";
            $.deleteImage.visible = true;
        }
        core.selectedCategoriesInEdit = {};
        for (var i = 0; i < subCategories.length; ++i) {
            var s = subCategories[i];
            core.subCategories.select({
                categoryId: s.CategoryId,
                id: s.Id
            }, core.selectedCategoriesInEdit);
        }
        sectionName = "";
        Alloy.Globals.core.currentSection = sectionName;
        showCategories();
    } else {
        $.phone.value = Alloy.Globals.profile.phone;
        $.email.value = Alloy.Globals.profile.email;
    }
    var rowIndex;
    var companySaved = false;
    var optionsPhotoDialog = {
        options: [ "Make Photo", "Choose Photo", "Cancel" ],
        cancel: 2
    };
    var photoDialog = Titanium.UI.createOptionDialog(optionsPhotoDialog);
    photoDialog.addEventListener("click", function(e) {
        0 == e.index && showCamera();
        1 == e.index && openGallery();
    });
    __defers["$.__views.window!click!blur"] && $.__views.window.addEventListener("click", blur);
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    __defers["$.__views.categories!click!categories"] && $.__views.categories.addEventListener("click", categories);
    __defers["$.__views.name!focus!focus"] && $.__views.name.addEventListener("focus", focus);
    __defers["$.__views.companyNumber!focus!focus"] && $.__views.companyNumber.addEventListener("focus", focus);
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
    __defers["$.__views.update!touchstart!buttonTouchStart"] && $.__views.update.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.update!touchend!buttonTouchEnd"] && $.__views.update.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;