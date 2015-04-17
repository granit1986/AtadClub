function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function open() {
        $.address.setHintText(L("enter_address"));
        indicator.openIndicator();
        advertId && (advertToEdit = Alloy.Collections.adverts.where({
            id: advertId
        })[0].toJSON());
        if (advertToEdit) {
            address = advertToEdit.address;
            lat = advertToEdit.lat;
            lng = advertToEdit.lng;
            subCategories = JSON.parse(advertToEdit.subCategories);
            $.title.value = advertToEdit.name;
            $.price.value = advertToEdit.price;
            $.description.value = advertToEdit.description;
            $.address.value = advertToEdit.address;
            $.switch_.value = advertToEdit.active;
            $.button.title = L("update_advert_button");
            core.selectedCategoriesInEdit = {};
            for (var i = 0; i < subCategories.length; ++i) {
                var s = subCategories[i];
                core.subCategories.select({
                    categoryId: s.CategoryId,
                    id: s.Id
                }, core.selectedCategoriesInEdit);
            }
            showSubcategories();
            if (advertToEdit.images) {
                advertToEdit.images = JSON.parse(advertToEdit.images);
                for (var i = 0; i < advertToEdit.images.length; i++) addImage("http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + advertToEdit.images[i] + Alloy.Globals.imageSizes.advert.row(), advertToEdit.images[i]);
            }
        } else {
            Alloy.Globals.core.selectedNewAdvertCategories = {};
            $.delete_button.hide();
        }
        indicator.closeIndicator();
    }
    function blur(e) {
        hideKeyboard(e);
    }
    function hideKeyboard(e) {
        "description" !== e.source.id && $.description.blur();
        "title" !== e.source.id && $.title.blur();
        "price" !== e.source.id && $.price.blur();
        "address" !== e.source.id && $.address.blur();
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function currenLocation() {
        var geo = Alloy.Globals.geo;
        geo.checkLocation(function() {
            if (geo.location.status != geo.errors.NONE) {
                Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
                indicator.closeIndicator();
                return;
            }
            geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
                indicator.closeIndicator();
                e && e.error ? Alloy.Globals.core.showErrorDialog(e.message ? L(e.message) : L(e.error)) : e && e.response && (e.response.results && e.response.results[0] && e.response.results[0].formatted_address ? $.address.value = e.response.results[0].formatted_address : e.response.resourceSets && e.response.resourceSets[0] && e.response.resourceSets[0].resources && e.response.resourceSets[0].resources[0] && e.response.resourceSets[0].resources[0].address && e.response.resourceSets[0].resources[0] && e.response.resourceSets[0].resources[0].address.formattedAddress && ($.address.value = e.response.resourceSets[0].resources[0].address.formattedAddress));
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
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        var id = e.source.id;
        switch (id) {
          case "button":
            indicator.openIndicator();
            onClick();
            break;

          case "delete_button":
            indicator.openIndicator();
            deleteAdvert();
            break;

          case "customLocation":
            indicator.openIndicator();
            currenLocation();
            break;

          case "cancel_button":
            cancel();
        }
    }
    function cancel() {
        $.window.close();
    }
    function closeKeyboard() {
        $.address.blur();
    }
    function onClick() {
        if (!Alloy.Globals.core.apiToken()) {
            var alertDialog = Titanium.UI.createAlertDialog({
                title: L("signup_or_signin_title"),
                message: L("signup_or_signin_message"),
                buttonNames: [ L("no"), L("yes") ],
                cancel: 0
            });
            indicator.closeIndicator();
            alertDialog.addEventListener("click", function(e) {
                if (e.cancel === e.index || true === e.cancel) return;
                Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
            });
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
        var advert = {
            name: $.title.value,
            price: $.price.value,
            description: $.description.value,
            address: $.address.value,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            subCategories: JSON.stringify(subcategoriesForSave),
            active: $.switch_.value
        };
        advertToEdit && (advert.id = advertToEdit.id);
        advert.lat = geo.location.latitude;
        advert.lng = geo.location.longitude;
        advert = Alloy.createModel("advert", advert);
        advert.localValidate(errorHandler) ? lat && lng && $.address.value === address ? save(advert) : geo.geocoding($.address.value, function(e) {
            if (e.error) {
                Alloy.Globals.core.showErrorDialog(L(e.message));
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
            advert.attributes.lat = parseFloat(e.response.results[0].geometry.location.lat);
            advert.attributes.lng = parseFloat(e.response.results[0].geometry.location.lng);
            save(advert);
        }) : indicator.closeIndicator();
    }
    function save(advert) {
        advert.save({}, {
            success: function(model, response) {
                for (var i = 0; i < $.images.children.length; i++) {
                    var image = $.images.children[i].image;
                    if (image && !image.serverId) {
                        if ("string" != typeof image) {
                            var factor = 1;
                            var size = 400;
                            var imageView = $.images.children[i];
                            var height = image.height;
                            var width = image.width;
                            var newImageView = Ti.UI.createImageView({
                                image: imageView.image,
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
                        }
                        images.push(image);
                    }
                }
                if (images.length > 0 || imagesToDelete.length > 0) {
                    var upload = Alloy.Globals.upload;
                    progress.openBar();
                    upload.start({
                        type: upload.types.advert,
                        id: response,
                        blobs: images,
                        "delete": JSON.stringify(imagesToDelete),
                        onerror: function() {
                            indicator.closeIndicator();
                            progress.closeBar();
                            Alloy.Globals.core.showErrorDialog(L("error_loading_image"));
                        },
                        onload: function() {
                            progress.setBarValue(1);
                            progress.closeBar();
                            postUpdate();
                            indicator.closeIndicator();
                        },
                        onsendstream: function(e) {
                            progress.setBarValue(e.progress);
                            Ti.API.info("progress - " + e.progress);
                        }
                    });
                } else postUpdate();
                $.itemIsLoad.visible = false;
            },
            error: function(model, xhr) {
                if (xhr && xhr.maxAdverts) {
                    var alertDialog = Titanium.UI.createAlertDialog({
                        title: L("upgrade_membership"),
                        message: L("limit") + " " + xhr.maxAdverts + " " + L("limit_adverts"),
                        buttonNames: [ L("upgrade"), L("OK") ]
                    });
                    alertDialog.addEventListener("click", function(e) {
                        if (!e.index) {
                            var view = Alloy.createController("account/upgradeSelect").getView();
                            Alloy.Globals.tabGroup.activeTab.open(view);
                        }
                    });
                    alertDialog.show();
                } else xhr && xhr.Message && Alloy.Globals.core.showErrorDialog(xhr.Message);
                indicator.closeIndicator();
            }
        });
    }
    function postUpdate() {
        indicator.closeIndicator();
        if (advertToEdit) {
            imagesToDelete = [];
            Alloy.Globals.core.showErrorDialog(L("avdvert_updated_label"));
            Ti.App.fireEvent("account:updateAdverts");
            callback && callback();
            $.window.close();
        } else {
            $.itemIsLoad.visible = true;
            address = false;
            subCategories = [];
            images = [];
            imagesToDelete = [];
            $.title.value = "";
            $.price.value = "";
            $.description.value = "";
            $.address.value = "";
            $.images.removeAllChildren();
            $.switch_.value = false;
            $.itemIsLoad.visible = false;
            var dialog = Titanium.UI.createAlertDialog({
                title: L("avdvert_added_label")
            });
            dialog.addEventListener("click", function() {
                callback && callback();
                Ti.App.fireEvent("account:updateAdverts");
                $.window.close();
            });
            dialog.show();
        }
    }
    function errorHandler(err) {
        switch (err) {
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
        }
        Alloy.Globals.core.showError(err);
    }
    function categories() {
        indicator.openIndicator();
        var categoriesWindow = Alloy.createController("subCategories/index", {
            categoryId: 1,
            categoryName: L("categories"),
            sectionName: advertToEdit ? "" : "newadvert",
            closeCallback: function() {
                subCategories = [];
                if (core.currentSectionCategories()["_1"]) for (var subCategoryKey in core.currentSectionCategories()["_1"]) subCategories.push(core.currentSectionCategories()["_1"][subCategoryKey]);
                showSubcategories();
            }
        }).getView();
        indicator.closeIndicator();
        Alloy.Globals.tabGroup.activeTab.open(categoriesWindow);
    }
    function showSubcategories() {
        $.selectedCategories.text = "";
        subCategories.forEach(function(item) {
            var subcategory;
            subcategory = Alloy.Collections.subCategories.get(item.Id ? item.Id : item);
            $.selectedCategories.text += "" == $.selectedCategories.text ? subcategory.attributes["name"] : ", " + subcategory.attributes["name"];
        });
    }
    function openGallery() {
        Titanium.Media.openPhotoGallery({
            success: function(e) {
                e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO && addImage(e.media);
            }
        });
    }
    function addPhoto() {
        photoDialog.show();
    }
    function addImage(image, serverId) {
        indicator.openIndicator();
        var imageView = Ti.UI.createImageView({
            image: image,
            width: "56dp",
            height: "56dp",
            right: "5dp",
            bottom: "5dp",
            serverId: serverId || false
        });
        var addImageControl = $.addPhoto;
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
                e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO && addImage(e.media);
            },
            cancel: function() {},
            error: function() {}
        });
    }
    function onClickImages(e) {
        if ("[object TiUIImageView]" !== e.source.toString()) return;
        e.source.serverId && imagesToDelete.push(e.source.serverId);
        $.images.remove(e.source);
        imageCount--;
        0 == imageCount && ($.howToDeleteImageLbl.visible = false);
    }
    function onClose() {
        callback && callback();
        indicator.closeIndicator();
    }
    function deleteAdvert() {
        var alertDialog = Titanium.UI.createAlertDialog({
            title: L("delete_advert_title"),
            message: L("delete_advert_message"),
            buttonNames: [ L("no"), L("yes") ],
            cancel: 0
        });
        alertDialog.addEventListener("click", function(e) {
            indicator.closeIndicator();
            if (1 != e.index) return;
            Alloy.Collections.adverts.where({
                id: advertToEdit.id
            })[0].destroy({
                success: function() {
                    Ti.App.fireEvent("account:updateAdverts");
                    $.window.close();
                },
                error: function() {}
            });
        });
        alertDialog.show();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "add/advert";
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
        titleid: "add_new_advert"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    onClose ? $.__views.window.addEventListener("close", onClose) : __defers["$.__views.window!close!onClose"] = true;
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    $.__views.__alloyId133 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        top: "0",
        id: "__alloyId133"
    });
    $.__views.window.add($.__views.__alloyId133);
    $.__views.__alloyId134 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId134"
    });
    $.__views.__alloyId133.add($.__views.__alloyId134);
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
    $.__views.__alloyId133.add($.__views.categoriesLbl);
    $.__views.categories = Ti.UI.createView({
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
        id: "categories"
    });
    $.__views.__alloyId133.add($.__views.categories);
    categories ? $.__views.categories.addEventListener("click", categories) : __defers["$.__views.categories!click!categories"] = true;
    $.__views.__alloyId135 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        left: "5dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        textid: "select_category",
        id: "__alloyId135"
    });
    $.__views.categories.add($.__views.__alloyId135);
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
    $.__views.__alloyId136 = Ti.UI.createLabel({
        width: "20dp",
        height: "20dp",
        right: "5dp",
        top: "5dp",
        backgroundImage: "images/icon_listItem.png",
        backgroundRepeat: false,
        id: "__alloyId136"
    });
    $.__views.categories.add($.__views.__alloyId136);
    $.__views.titleLbl = Ti.UI.createLabel({
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
        id: "titleLbl",
        textid: "title"
    });
    $.__views.__alloyId133.add($.__views.titleLbl);
    $.__views.title = Ti.UI.createTextField({
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
        id: "title"
    });
    $.__views.__alloyId133.add($.__views.title);
    focus ? $.__views.title.addEventListener("focus", focus) : __defers["$.__views.title!focus!focus"] = true;
    $.__views.priceLbl = Ti.UI.createLabel({
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
        id: "priceLbl",
        textid: "price"
    });
    $.__views.__alloyId133.add($.__views.priceLbl);
    $.__views.price = Ti.UI.createTextField({
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
        id: "price",
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD
    });
    $.__views.__alloyId133.add($.__views.price);
    focus ? $.__views.price.addEventListener("focus", focus) : __defers["$.__views.price!focus!focus"] = true;
    $.__views.descriptionLbl = Ti.UI.createLabel({
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
        id: "descriptionLbl",
        textid: "description"
    });
    $.__views.__alloyId133.add($.__views.descriptionLbl);
    $.__views.description = Ti.UI.createTextArea(function() {
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
            id: "description",
            suppressReturn: "false",
            returnKeyType: Ti.UI.RETURNKEY_NEXT
        });
        return o;
    }());
    $.__views.__alloyId133.add($.__views.description);
    focus ? $.__views.description.addEventListener("focus", focus) : __defers["$.__views.description!focus!focus"] = true;
    $.__views.adressLbl = Ti.UI.createLabel({
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
        id: "adressLbl",
        textid: "address"
    });
    $.__views.__alloyId133.add($.__views.adressLbl);
    $.__views.__alloyId137 = Ti.UI.createView({
        layout: "absolute",
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputAreaHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "__alloyId137"
    });
    $.__views.__alloyId133.add($.__views.__alloyId137);
    $.__views.address = Ti.UI.createTextField({
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
    $.__views.__alloyId137.add($.__views.address);
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
    $.__views.__alloyId137.add($.__views.customLocation);
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
        textid: "images"
    });
    $.__views.__alloyId133.add($.__views.imageLbl);
    $.__views.__alloyId138 = Ti.UI.createView({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        backgroundColor: "#fff",
        id: "__alloyId138"
    });
    $.__views.__alloyId133.add($.__views.__alloyId138);
    $.__views.images = Ti.UI.createView({
        height: Ti.UI.SIZE,
        top: "5dp",
        left: "5dp",
        id: "images",
        layout: "horizontal"
    });
    $.__views.__alloyId138.add($.__views.images);
    onClickImages ? $.__views.images.addEventListener("click", onClickImages) : __defers["$.__views.images!click!onClickImages"] = true;
    $.__views.addPhoto = Ti.UI.createButton({
        width: "56dp",
        height: "56dp",
        right: "5dp",
        bottom: "5dp",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        backgroundImage: "images/icon_gallery.png",
        id: "addPhoto"
    });
    $.__views.images.add($.__views.addPhoto);
    addPhoto ? $.__views.addPhoto.addEventListener("click", addPhoto) : __defers["$.__views.addPhoto!click!addPhoto"] = true;
    $.__views.howToDeleteImageLbl = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "20dp",
        bottom: "10dp",
        textAlign: Alloy.Globals.Styles.imageSelectTipTextAlign,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "12dp"
        },
        color: "#555",
        id: "howToDeleteImageLbl",
        textid: "tap_to_delete_image",
        visible: "false"
    });
    $.__views.__alloyId133.add($.__views.howToDeleteImageLbl);
    $.__views.switchLbl = Ti.UI.createLabel({
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
        id: "switchLbl",
        textid: "active"
    });
    $.__views.__alloyId133.add($.__views.switchLbl);
    $.__views.switch_ = Ti.UI.createSwitch({
        height: Alloy.Globals.Styles.inputAreaHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        value: true,
        id: "switch_"
    });
    $.__views.__alloyId133.add($.__views.switch_);
    $.__views.itemIsLoad = Ti.UI.createLabel({
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
        id: "itemIsLoad",
        textid: "itemIsLoad",
        visible: "false"
    });
    $.__views.__alloyId133.add($.__views.itemIsLoad);
    $.__views.button = Ti.UI.createButton({
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
        titleid: "add_advert_button",
        id: "button"
    });
    $.__views.__alloyId133.add($.__views.button);
    buttonTouchStart ? $.__views.button.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.button!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.button.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.button!touchend!buttonTouchEnd"] = true;
    $.__views.cancel_button = Ti.UI.createButton({
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
        titleid: "cancel",
        id: "cancel_button"
    });
    $.__views.__alloyId133.add($.__views.cancel_button);
    buttonTouchStart ? $.__views.cancel_button.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.cancel_button!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.cancel_button.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.cancel_button!touchend!buttonTouchEnd"] = true;
    $.__views.delete_button = Ti.UI.createButton({
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
        titleid: "delete_advert_button",
        id: "delete_button"
    });
    $.__views.__alloyId133.add($.__views.delete_button);
    buttonTouchStart ? $.__views.delete_button.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.delete_button!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.delete_button.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.delete_button!touchend!buttonTouchEnd"] = true;
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
    var advertToEdit = false;
    var advertId = false;
    arguments[0] && arguments[0].advertId && (advertId = arguments[0].advertId);
    var progress = Alloy.Globals.progress;
    var callback = false;
    arguments[0] && arguments[0].callback && (callback = arguments[0].callback);
    var indicator = Alloy.Globals.indicator;
    var errors = Alloy.Globals.errors, core = Alloy.Globals.core;
    address = false, lat = false, lng = false, date = 0, subCategories = [], images = [], 
    imagesToDelete = [];
    var rowIndex;
    var optionsPhotoDialog = {
        options: [ "Make Photo", "Choose Photo", "Cancel" ],
        cancel: 2
    };
    var photoDialog = Titanium.UI.createOptionDialog(optionsPhotoDialog);
    photoDialog.addEventListener("click", function(e) {
        0 == e.index && showCamera();
        1 == e.index && openGallery();
    });
    var imageCount = 0;
    __defers["$.__views.window!close!onClose"] && $.__views.window.addEventListener("close", onClose);
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!click!blur"] && $.__views.window.addEventListener("click", blur);
    __defers["$.__views.categories!click!categories"] && $.__views.categories.addEventListener("click", categories);
    __defers["$.__views.title!focus!focus"] && $.__views.title.addEventListener("focus", focus);
    __defers["$.__views.price!focus!focus"] && $.__views.price.addEventListener("focus", focus);
    __defers["$.__views.description!focus!focus"] && $.__views.description.addEventListener("focus", focus);
    __defers["$.__views.address!return!search"] && $.__views.address.addEventListener("return", search);
    __defers["$.__views.address!focus!focus"] && $.__views.address.addEventListener("focus", focus);
    __defers["$.__views.customLocation!touchstart!buttonTouchStart"] && $.__views.customLocation.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.customLocation!touchend!buttonTouchEnd"] && $.__views.customLocation.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.images!click!onClickImages"] && $.__views.images.addEventListener("click", onClickImages);
    __defers["$.__views.addPhoto!click!addPhoto"] && $.__views.addPhoto.addEventListener("click", addPhoto);
    __defers["$.__views.button!touchstart!buttonTouchStart"] && $.__views.button.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.button!touchend!buttonTouchEnd"] && $.__views.button.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.cancel_button!touchstart!buttonTouchStart"] && $.__views.cancel_button.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.cancel_button!touchend!buttonTouchEnd"] && $.__views.cancel_button.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.delete_button!touchstart!buttonTouchStart"] && $.__views.delete_button.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.delete_button!touchend!buttonTouchEnd"] && $.__views.delete_button.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;