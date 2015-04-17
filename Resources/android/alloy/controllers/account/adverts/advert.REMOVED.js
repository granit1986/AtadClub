function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function currenLocation() {
        var geo = Alloy.Globals.geo;
        geo.checkLocation(function() {
            if (geo.location.status != geo.errors.NONE) {
                Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
                return;
            }
            geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
                if (e.error) Alloy.Globals.core.showErrorDialog(L(e.error)); else {
                    $.address.value = e.response.results[0].formatted_address;
                    lat = e.response.results[0].geometry.location.lat;
                    lng = e.response.results[0].geometry.location.lng;
                }
            });
        });
    }
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
                Alloy.Globals.core.activeTab("tabAccount");
            });
            alertDialog.show();
            return;
        }
        if (0 == subCategories.length) {
            Alloy.Globals.core.showErrorDialog(L("please_select_category"));
            return;
        }
        var advert = Alloy.createModel("advert", {
            name: $.title.value,
            price: $.price.value,
            description: $.description.value,
            address: $.address.value,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            subCategories: JSON.stringify(subCategories)
        });
        advert.localValidate(errorHandler) && (lat && lng && $.address.value === address || geo.geocoding($.address.value, function(e) {
            if (e.error) {
                Alloy.Globals.core.showErrorDialog(L(e.error));
                return;
            }
            advert.attributes.lat = parseFloat(e.response.results[0].geometry.location.lat);
            advert.attributes.lng = parseFloat(e.response.results[0].geometry.location.lng);
            advert.save({}, {
                success: function(model, response) {
                    if (image) {
                        var upload = Alloy.Globals.upload;
                        upload.start({
                            type: upload.types.advert,
                            id: response,
                            blob: image,
                            onerror: function() {},
                            onload: function() {
                                address = false;
                                subCategories = [];
                                image = false;
                                $.title.value = "";
                                $.price.value = "";
                                $.description.value = "";
                                $.address.value = "";
                                $.imageView.image = null;
                                var advertWindow = Alloy.createController("add/views/advertAdded").getView();
                                Alloy.CFG.tabAdd.open(advertWindow);
                            }
                        });
                    } else {
                        address = false;
                        subCategories = [];
                        image = false;
                        $.title.value = "";
                        $.price.value = "";
                        $.description.value = "";
                        $.address.value = "";
                        $.imageView.image = null;
                        var advertWindow = Alloy.createController("add/views/advertAdded").getView();
                        Alloy.CFG.tabAdd.open(advertWindow);
                    }
                },
                error: function() {
                    var advertWindow = Alloy.createController("add/views/advertAdded").getView();
                    Alloy.CFG.tabAdd.open(advertWindow);
                }
            });
        }));
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
        Alloy.CFG.tabAdd.open(Alloy.createController("subCategories/index", {
            categoryId: 1,
            categoryName: L("categories"),
            closeCallback: function() {
                subCategories = [];
                if (core.selectedCategories["_1"]) for (var subCategoryKey in core.selectedCategories["_1"]) subCategories.push(core.selectedCategories["_1"][subCategoryKey]);
            }
        }).getView());
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
            cancel: function() {},
            error: function() {}
        });
    }
    function deleteImage() {
        image = false;
        $.imageView.image = null;
        $.deleteImage.visible = false;
        $.gallery.visible = true;
        $.camera.visible = true;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/adverts/advert.REMOVED";
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
        backgroundImage: "images/background.png",
        layout: "vertical",
        id: "window",
        fullscreen: "true"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.__alloyId34 = Ti.UI.createScrollView({
        layout: "vertical",
        id: "__alloyId34"
    });
    $.__views.window.add($.__views.__alloyId34);
    $.__views.categoriesLbl = Ti.UI.createLabel({
        width: "80dp",
        height: "30dp",
        color: "#007aff",
        left: "30dp",
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        top: "30dp",
        text: "Category",
        id: "categoriesLbl"
    });
    $.__views.__alloyId34.add($.__views.categoriesLbl);
    $.__views.categories = Ti.UI.createButton({
        width: "180dp",
        height: "30dp",
        right: "30dp",
        top: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: "#007aff",
        id: "categories",
        titleid: "Select"
    });
    $.__views.__alloyId34.add($.__views.categories);
    categories ? $.__views.categories.addEventListener("click", categories) : __defers["$.__views.categories!click!categories"] = true;
    $.__views.titleLbl = Ti.UI.createLabel({
        width: "80dp",
        height: "30dp",
        color: "#007aff",
        left: "30dp",
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        top: "70dp",
        text: "Title",
        id: "titleLbl"
    });
    $.__views.__alloyId34.add($.__views.titleLbl);
    $.__views.title = Ti.UI.createTextField({
        width: "180dp",
        height: "30dp",
        right: "30dp",
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        font: {
            fontSize: "13dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        top: "70dp",
        id: "title"
    });
    $.__views.__alloyId34.add($.__views.title);
    $.__views.priceLbl = Ti.UI.createLabel({
        width: "80dp",
        height: "30dp",
        color: "#007aff",
        left: "30dp",
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        top: "110dp",
        text: "Price",
        id: "priceLbl"
    });
    $.__views.__alloyId34.add($.__views.priceLbl);
    $.__views.price = Ti.UI.createTextField({
        width: "180dp",
        height: "30dp",
        right: "30dp",
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        font: {
            fontSize: "13dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        top: "110dp",
        keyboardType: Titanium.UI.KEYBOARD_DECIMAL_PAD,
        id: "price"
    });
    $.__views.__alloyId34.add($.__views.price);
    $.__views.descriptionLbl = Ti.UI.createLabel({
        width: "80dp",
        height: "30dp",
        color: "#007aff",
        left: "30dp",
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        top: "150dp",
        text: "Description",
        id: "descriptionLbl"
    });
    $.__views.__alloyId34.add($.__views.descriptionLbl);
    $.__views.description = Ti.UI.createTextArea(function() {
        var o = {};
        _.extend(o, {
            width: "180dp",
            height: "70dp",
            right: "30dp",
            borderColor: "#ccc",
            borderStyle: 1,
            borderWidth: "1dp",
            font: {
                fontSize: "13dp",
                fontFamily: "Arial"
            },
            backgroundColor: "#fff"
        });
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            top: "150dp",
            id: "description"
        });
        return o;
    }());
    $.__views.__alloyId34.add($.__views.description);
    $.__views.addressLbl = Ti.UI.createLabel({
        width: "80dp",
        height: "30dp",
        color: "#007aff",
        left: "30dp",
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        top: "230dp",
        text: "Address",
        id: "addressLbl"
    });
    $.__views.__alloyId34.add($.__views.addressLbl);
    $.__views.address = Ti.UI.createTextArea(function() {
        var o = {};
        _.extend(o, {
            width: "180dp",
            height: "70dp",
            right: "30dp",
            borderColor: "#ccc",
            borderStyle: 1,
            borderWidth: "1dp",
            font: {
                fontSize: "13dp",
                fontFamily: "Arial"
            },
            backgroundColor: "#fff"
        });
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            top: "230dp",
            hintText: L("address"),
            id: "address"
        });
        return o;
    }());
    $.__views.__alloyId34.add($.__views.address);
    $.__views.currenLocationLbl = Ti.UI.createLabel({
        width: "150dp",
        height: "30dp",
        right: "60dp",
        top: "300dp",
        titleid: "Use my current location",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "12dp"
        },
        color: "#555",
        id: "currenLocationLbl",
        text: "Use my current location"
    });
    $.__views.__alloyId34.add($.__views.currenLocationLbl);
    $.__views.currenLocation = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        right: "30dp",
        top: "300dp",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: "#007aff",
        backgroundImage: "images/icon_location.png",
        backgroundRepeat: false,
        id: "currenLocation"
    });
    $.__views.__alloyId34.add($.__views.currenLocation);
    currenLocation ? $.__views.currenLocation.addEventListener("click", currenLocation) : __defers["$.__views.currenLocation!click!currenLocation"] = true;
    $.__views.imageLbl = Ti.UI.createLabel({
        width: "80dp",
        height: "30dp",
        color: "#007aff",
        left: "30dp",
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        top: "340dp",
        text: "Image",
        id: "imageLbl"
    });
    $.__views.__alloyId34.add($.__views.imageLbl);
    $.__views.imageView = Ti.UI.createImageView({
        top: "340dp",
        right: "30dp",
        width: "180pd",
        height: "180dp",
        borderColor: "#ccc",
        borderWidth: "1dp",
        backgroundColor: "#fff",
        id: "imageView"
    });
    $.__views.__alloyId34.add($.__views.imageView);
    $.__views.gallery = Ti.UI.createButton({
        width: "40dp",
        height: "40dp",
        right: "125dp",
        top: "410dp",
        zIndex: "10",
        backgroundColor: "#007aff",
        backgroundImage: "images/icon_gallery.png",
        id: "gallery"
    });
    $.__views.__alloyId34.add($.__views.gallery);
    openGallery ? $.__views.gallery.addEventListener("click", openGallery) : __defers["$.__views.gallery!click!openGallery"] = true;
    $.__views.camera = Ti.UI.createButton({
        width: "40dp",
        height: "40dp",
        right: "75dp",
        top: "410dp",
        zIndex: "10",
        backgroundColor: "#007aff",
        backgroundImage: "images/icon_camera.png",
        id: "camera"
    });
    $.__views.__alloyId34.add($.__views.camera);
    showCamera ? $.__views.camera.addEventListener("click", showCamera) : __defers["$.__views.camera!click!showCamera"] = true;
    $.__views.deleteImage = Ti.UI.createButton({
        width: "40dp",
        height: "40dp",
        right: "30dp",
        top: "480dp",
        zIndex: "10",
        backgroundColor: "#007aff",
        backgroundImage: "images/icon_delete.png",
        id: "deleteImage",
        visible: "false"
    });
    $.__views.__alloyId34.add($.__views.deleteImage);
    deleteImage ? $.__views.deleteImage.addEventListener("click", deleteImage) : __defers["$.__views.deleteImage!click!deleteImage"] = true;
    $.__views.button = Ti.UI.createButton({
        width: "100dp",
        height: "40dp",
        top: "530dp",
        bottom: "20dp",
        left: "110dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: "#007aff",
        titleid: "Save",
        id: "button"
    });
    $.__views.__alloyId34.add($.__views.button);
    onClick ? $.__views.button.addEventListener("click", onClick) : __defers["$.__views.button!click!onClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var core = Alloy.Globals.core;
    var advert = Alloy.Collections.adverts.where({
        id: arguments[0].id
    })[0];
    $.window.title = advert.attributes.name;
    $.title.value = advert.attributes.name;
    $.price.value = advert.attributes.price;
    $.description.value = advert.attributes.description;
    $.address.value = advert.attributes.address;
    $.imageView.image = advert.attributes.image + Alloy.Globals.imageSizes.advert.edit();
    var errors = Alloy.Globals.errors;
    var core = Alloy.Globals.core;
    var address = advert.attributes.address;
    var lat = advert.attributes.address.lat;
    var lng = advert.attributes.address.lng;
    var subCategories = [] || JSON.parse(advert.attributes.subCategories);
    var image = advert.attributes.image + Alloy.Globals.imageSizes.advert.edit();
    for (var idx in subCategories) core.subCategories.select({
        categoryId: 1,
        id: subCategories[idx]
    });
    __defers["$.__views.categories!click!categories"] && $.__views.categories.addEventListener("click", categories);
    __defers["$.__views.currenLocation!click!currenLocation"] && $.__views.currenLocation.addEventListener("click", currenLocation);
    __defers["$.__views.gallery!click!openGallery"] && $.__views.gallery.addEventListener("click", openGallery);
    __defers["$.__views.camera!click!showCamera"] && $.__views.camera.addEventListener("click", showCamera);
    __defers["$.__views.deleteImage!click!deleteImage"] && $.__views.deleteImage.addEventListener("click", deleteImage);
    __defers["$.__views.button!click!onClick"] && $.__views.button.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;