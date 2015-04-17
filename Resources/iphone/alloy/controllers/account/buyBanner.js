function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        "changeImage" == e.source.id ? addPhoto() : "sendBtn" == e.source.id ? send() : "deleteImage" == e.source.id && deleteImage();
    }
    function blur(e) {
        hideKeyboard(e);
    }
    function hideKeyboard(e) {
        e.source.id !== $.country.id && $.country.blur();
        e.source.id !== $.city.id && $.city.blur();
        e.source.id !== $.street.id && $.street.blur();
        e.source.id !== $.house.id && $.house.blur();
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function send() {
        if ("" === $.country.value.trim()) {
            Alloy.Globals.core.showErrorDialog(L("country_require"));
            return;
        }
        if ("" === $.city.value.trim()) {
            Alloy.Globals.core.showErrorDialog(L("city_require"));
            return;
        }
        if (!image) {
            Alloy.Globals.core.showErrorDialog(L("image_require"));
            return;
        }
        var message = "Country: " + $.country.value + "\nCity: " + $.city.value + "\n";
        "" !== $.street.value.trim() && (message = message + "Street: " + $.street.value + "\n");
        "" !== $.house.value.trim() && (message = message + "House: " + $.house.value + "\n");
        if (image && imageUpdated) {
            {
                Alloy.Globals.upload;
            }
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
            var xhr = Ti.Network.createHTTPClient({
                timeout: 36e5
            });
            xhr.onsendstream = function(e) {
                progress.setBarValue(e.progress);
                Ti.API.info("progress - " + e.progress);
            };
            xhr.onerror = function() {
                progress.closeBar();
            };
            xhr.onload = function() {
                progress.setBarValue(1);
                progress.closeBar();
                postUpdate();
            };
            xhr.open("POST", "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/" + Alloy.Globals.core.apiToken() + "/banners");
            var model = {
                message: message,
                file_0: image
            };
            xhr.send(model);
        }
    }
    function postUpdate() {
        Alloy.Globals.core.showErrorDialog(L("request_send"));
        $.window.close();
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
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/buyBanner";
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
        titleid: "buy_advertisement"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    $.__views.__alloyId19 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        top: "0",
        id: "__alloyId19"
    });
    $.__views.window.add($.__views.__alloyId19);
    $.__views.__alloyId20 = Ti.UI.createLabel({
        height: "80dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "buyBanner_title",
        id: "__alloyId20"
    });
    $.__views.__alloyId19.add($.__views.__alloyId20);
    $.__views.countryLbl = Ti.UI.createLabel({
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
        id: "countryLbl",
        textid: "country"
    });
    $.__views.__alloyId19.add($.__views.countryLbl);
    $.__views.country = Ti.UI.createTextField({
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
        id: "country"
    });
    $.__views.__alloyId19.add($.__views.country);
    focus ? $.__views.country.addEventListener("focus", focus) : __defers["$.__views.country!focus!focus"] = true;
    $.__views.cityLbl = Ti.UI.createLabel({
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
        id: "cityLbl",
        textid: "city"
    });
    $.__views.__alloyId19.add($.__views.cityLbl);
    $.__views.city = Ti.UI.createTextField({
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
        id: "city"
    });
    $.__views.__alloyId19.add($.__views.city);
    focus ? $.__views.city.addEventListener("focus", focus) : __defers["$.__views.city!focus!focus"] = true;
    $.__views.streetLbl = Ti.UI.createLabel({
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
        id: "streetLbl",
        textid: "street"
    });
    $.__views.__alloyId19.add($.__views.streetLbl);
    $.__views.street = Ti.UI.createTextField({
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
        id: "street"
    });
    $.__views.__alloyId19.add($.__views.street);
    focus ? $.__views.street.addEventListener("focus", focus) : __defers["$.__views.street!focus!focus"] = true;
    $.__views.houseLbl = Ti.UI.createLabel({
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
        id: "houseLbl",
        textid: "house"
    });
    $.__views.__alloyId19.add($.__views.houseLbl);
    $.__views.house = Ti.UI.createTextField({
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
        id: "house"
    });
    $.__views.__alloyId19.add($.__views.house);
    focus ? $.__views.house.addEventListener("focus", focus) : __defers["$.__views.house!focus!focus"] = true;
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
        textid: "image"
    });
    $.__views.__alloyId19.add($.__views.imageLbl);
    $.__views.imageView = Ti.UI.createImageView({
        width: Alloy.Globals.Styles.inputWidth,
        bottom: "0",
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
        id: "imageView",
        height: "0",
        visible: "false"
    });
    $.__views.__alloyId19.add($.__views.imageView);
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
        titleid: "add"
    });
    $.__views.__alloyId19.add($.__views.changeImage);
    buttonTouchStart ? $.__views.changeImage.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.changeImage!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.changeImage.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.changeImage!touchend!buttonTouchEnd"] = true;
    $.__views.deleteImage = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        bottom: "10dp",
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
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
        id: "deleteImage",
        visible: "false"
    });
    $.__views.__alloyId19.add($.__views.deleteImage);
    buttonTouchStart ? $.__views.deleteImage.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.deleteImage!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.deleteImage.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.deleteImage!touchend!buttonTouchEnd"] = true;
    $.__views.sendBtn = Ti.UI.createButton({
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
        id: "sendBtn",
        titleid: "send"
    });
    $.__views.__alloyId19.add($.__views.sendBtn);
    buttonTouchStart ? $.__views.sendBtn.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.sendBtn!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.sendBtn.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.sendBtn!touchend!buttonTouchEnd"] = true;
    $.__views.__alloyId21 = Ti.UI.createLabel({
        top: "0",
        left: "0",
        right: "0",
        color: "#555",
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "buy_banner_text",
        id: "__alloyId21"
    });
    $.__views.__alloyId19.add($.__views.__alloyId21);
    $.__views.__alloyId22 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId22"
    });
    $.__views.__alloyId19.add($.__views.__alloyId22);
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
    {
        var image = false, progress = Alloy.Globals.progress;
        Alloy.Globals.indicator;
    }
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
    __defers["$.__views.country!focus!focus"] && $.__views.country.addEventListener("focus", focus);
    __defers["$.__views.city!focus!focus"] && $.__views.city.addEventListener("focus", focus);
    __defers["$.__views.street!focus!focus"] && $.__views.street.addEventListener("focus", focus);
    __defers["$.__views.house!focus!focus"] && $.__views.house.addEventListener("focus", focus);
    __defers["$.__views.changeImage!touchstart!buttonTouchStart"] && $.__views.changeImage.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.changeImage!touchend!buttonTouchEnd"] && $.__views.changeImage.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.deleteImage!touchstart!buttonTouchStart"] && $.__views.deleteImage.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.deleteImage!touchend!buttonTouchEnd"] && $.__views.deleteImage.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.sendBtn!touchstart!buttonTouchStart"] && $.__views.sendBtn.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.sendBtn!touchend!buttonTouchEnd"] && $.__views.sendBtn.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;