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
        e.source.id !== $.description.id && $.description.blur();
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        "changeImage" == e.source.id ? addPhoto() : "sendOffer" == e.source.id ? send() : "deleteImage" == e.source.id && deleteImage();
    }
    function addPhoto() {
        photoDialog.show();
    }
    function openGallery() {
        Titanium.Media.openPhotoGallery({
            success: function(e) {
                e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO && addImage(e);
            }
        });
    }
    function showCamera() {
        Titanium.Media.showCamera({
            success: function(e) {
                e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO && addImage(e);
            },
            cancel: function() {},
            error: function() {}
        });
    }
    function addImage(e) {
        $.images.children.length > 1 && $.images.remove($.images.children[0]);
        image = e.media;
        $.imageView.image = image;
        $.imageView.height = Ti.UI.SIZE;
        $.imageView.bottom = "10dp";
        $.imageView.visible = true;
        var imageView = Ti.UI.createImageView({
            image: image,
            width: "55dp",
            height: "55dp",
            right: "5dp",
            bottom: "5dp"
        });
        var addImageControl = $.addPhoto;
        $.images.remove($.addPhoto);
        $.images.add(imageView);
        $.images.add(addImageControl);
        imageUpdated = true;
        $.howToDeleteImageLbl.visible = true;
    }
    function onClickImage(e) {
        if ("[object TiUIImageView]" !== e.source.toString()) return;
        $.imageView.image = null;
        $.images.remove(e.source);
        $.imageView.height = 0;
        $.imageView.bottom = 0;
        $.howToDeleteImageLbl.visible = false;
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
    function send() {
        var offer = Alloy.createModel("offer", {
            advertId: advert.id,
            description: $.description.value
        });
        if (Alloy.Globals.core.rxs.empty.test(offer.attributes["description"])) {
            errorHandler(errors.NO_DESCRIPTION);
            return;
        }
        if (!image) {
            errorHandler(errors.NO_IMAGE);
            return;
        }
        offer.save({}, {
            success: function(model, response) {
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
                        type: upload.types.barter,
                        id: response,
                        blobs: images,
                        onerror: function() {
                            Alloy.Globals.core.showErrorDialog(L("error_loading_image"));
                            progress.closeBar();
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
            error: function(model, xhr) {
                indicator.closeIndicator();
                if (xhr && xhr.Message) {
                    var alertDialog = Titanium.UI.createAlertDialog({
                        title: L("upgrade_membership"),
                        message: L(xhr.Message),
                        buttonNames: [ L("upgrade"), L("OK") ]
                    });
                    alertDialog.addEventListener("click", function(e) {
                        if (!e.index) {
                            var view = Alloy.createController("account/upgradeSelect").getView();
                            Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
                            Alloy.Globals.tabGroup.activeTab.open(view);
                        }
                    });
                    alertDialog.show();
                }
            }
        });
    }
    function postUpdate() {
        Alloy.Globals.core.showErrorDialog(L("offer_sent"));
        $.window.close();
    }
    function errorHandler(err) {
        switch (err) {
          case errors.NO_DESCRIPTION:
            $.description.focus();
            break;

          case errors.NO_IMAGE:        }
        var alert = Ti.UI.createAlertDialog({
            title: L(err.error)
        });
        alert.addEventListener("click", function() {
            $.scrollView.setContentOffset({
                x: 0,
                y: 0
            });
        });
        alert.show();
        $.scrollView.setContentOffset({
            x: 0,
            y: 0
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/adverts/barterOffer";
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
        layout: "vertical",
        id: "window",
        fullscreen: "true",
        titleid: "my_barter_offer"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    $.__views.scrollView = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "scrollView",
        scrollType: "vertical",
        contentWidth: "100%"
    });
    $.__views.window.add($.__views.scrollView);
    $.__views.__alloyId206 = Ti.UI.createLabel({
        height: "80dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        text: "Make your Barter offer",
        id: "__alloyId206"
    });
    $.__views.scrollView.add($.__views.__alloyId206);
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
    $.__views.scrollView.add($.__views.descriptionLbl);
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
            id: "description"
        });
        return o;
    }());
    $.__views.scrollView.add($.__views.description);
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
        top: "10dp",
        id: "imageLbl",
        textid: "picture"
    });
    $.__views.scrollView.add($.__views.imageLbl);
    $.__views.imageView = Ti.UI.createImageView({
        width: Alloy.Globals.Styles.inputWidth,
        bottom: "0",
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
        id: "imageView",
        height: "0",
        visible: "false"
    });
    $.__views.scrollView.add($.__views.imageView);
    $.__views.__alloyId207 = Ti.UI.createView({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        backgroundColor: "#fff",
        id: "__alloyId207"
    });
    $.__views.scrollView.add($.__views.__alloyId207);
    $.__views.images = Ti.UI.createView({
        height: Ti.UI.SIZE,
        top: "5dp",
        left: "5dp",
        id: "images",
        layout: "horizontal"
    });
    $.__views.__alloyId207.add($.__views.images);
    onClickImage ? $.__views.images.addEventListener("click", onClickImage) : __defers["$.__views.images!click!onClickImage"] = true;
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
    $.__views.scrollView.add($.__views.howToDeleteImageLbl);
    $.__views.__alloyId208 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId208"
    });
    $.__views.scrollView.add($.__views.__alloyId208);
    $.__views.sendOffer = Ti.UI.createButton({
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
        id: "sendOffer",
        titleid: "send"
    });
    $.__views.scrollView.add($.__views.sendOffer);
    buttonTouchStart ? $.__views.sendOffer.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.sendOffer!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.sendOffer.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.sendOffer!touchend!buttonTouchEnd"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var image = false, imageUpdated = false;
    var optionsPhotoDialog = {
        options: [ "Make Photo", "Choose Photo", "Cancel" ],
        cancel: 2
    };
    var advert = Alloy.Collections.publicAdverts.where({
        id: arguments[0].advertId
    })[0].toJSON();
    var progress = Alloy.Globals.progress;
    var indicator = Alloy.Globals.indicator;
    var photoDialog = Titanium.UI.createOptionDialog(optionsPhotoDialog);
    photoDialog.addEventListener("click", function(e) {
        0 == e.index && showCamera();
        1 == e.index && openGallery();
    });
    __defers["$.__views.window!click!blur"] && $.__views.window.addEventListener("click", blur);
    __defers["$.__views.images!click!onClickImage"] && $.__views.images.addEventListener("click", onClickImage);
    __defers["$.__views.addPhoto!click!addPhoto"] && $.__views.addPhoto.addEventListener("click", addPhoto);
    __defers["$.__views.sendOffer!touchstart!buttonTouchStart"] && $.__views.sendOffer.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.sendOffer!touchend!buttonTouchEnd"] && $.__views.sendOffer.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;