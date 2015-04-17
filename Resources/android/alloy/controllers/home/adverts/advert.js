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
        indicator.openIndicator();
        try {
            advert = Alloy.Collections.publicAdverts.where({
                id: id
            })[0].toJSON();
        } catch (e) {
            advert = Alloy.Collections.adverts.where({
                id: id
            })[0].toJSON();
        }
        $.window.title = advert.name;
        $.nameVal.text = advert.name;
        if (forEdit) {
            var btn = Ti.UI.createButton({
                title: L("edit")
            });
            $.window.setRightNavButton(btn);
            btn.addEventListener("click", function() {
                var view = Alloy.createController("add/advert", {
                    advertId: advert.id,
                    callback: function() {
                        $.window.close();
                    }
                }).getView();
                Alloy.CFG.tabAccount.open(view);
            });
        }
        if (advert.images) {
            advert.images = JSON.parse(advert.images);
            for (var i = 0; i < advert.images.length; i++) {
                var view = "";
                view = Ti.UI.createImageView(-1 != advert.images[i] ? {
                    image: "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + advert.images[i] + Alloy.Globals.imageSizes.advert.view(),
                    imageOriginal: "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + advert.images[i] + Alloy.Globals.imageSizes.advert.original(),
                    wihth: "180dp",
                    height: "180dp"
                } : {
                    image: "appicon-72.png",
                    wihth: "180dp",
                    height: "180dp"
                });
                view.addEventListener("click", imageClick);
                $.images.addView(view);
            }
            advert.images.length > 0 && imageWindow.createWindow($.images.views);
        }
        $.priceVal.text = advert.price;
        $.descriptionVal.text = advert.description;
        $.user.text = advert.user;
        $.email.text = advert.email;
        $.phone.text = advert.phone;
        $.address.text = advert.address;
        $.mapImage.image = "http://maps.googleapis.com/maps/api/staticmap?center=" + advert.lat.replace(",", ".") + "," + advert.lng.replace(",", ".") + "8&zoom=16&size=280x180&sensor=false&markers=color:red%7Clabel:D%7C" + advert.lat.replace(",", ".") + "," + advert.lng.replace(",", ".") + "%7Csize:tiny";
        if (forEdit) {
            $.scroll.remove($.contactLbl);
            $.scroll.remove($.user);
            $.scroll.remove($.email);
            $.scroll.remove($.phone);
            $.scroll.remove($.priceOffer);
            $.scroll.remove($.barterOffer);
            $.scroll.remove($.emailLbl);
            $.scroll.remove($.phoneLbl);
            $.scroll.remove($.address);
            $.scroll.remove($.addressLbl);
            $.scroll.remove($.mapImage);
        }
        indicator.closeIndicator();
    }
    function imageClick() {
        var currentPage = $.images.getCurrentPage();
        imageWindow.openWindow(currentPage);
    }
    function onClickEmail() {
        var emailDialog = Ti.UI.createEmailDialog();
        emailDialog.subject = L("about_you_advert_subject");
        emailDialog.toRecipients = [ advert.email ];
        emailDialog.messageBody = String.format(L("about_you_advert_message"), advert.user);
        emailDialog.open();
    }
    function onClickAddress() {
        var mapWindow = Alloy.createController("home/adverts/advertMap", {
            advert: advert
        }).getView();
        Alloy.CFG.tabHome.open(mapWindow);
    }
    function phoneCall() {
        Titanium.Platform.openURL("tel:" + advert.phone);
    }
    function onClickPriceOffer() {
        Alloy.CFG.tabHome.open(Alloy.createController("home/adverts/priceOffer", {
            advertId: advert.id
        }).getView());
    }
    function onClickBarterOffer() {
        Alloy.CFG.tabHome.open(Alloy.createController("home/adverts/barterOffer", {
            advertId: advert.id
        }).getView());
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
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
            alertDialog.show();
            indicator.closeIndicator();
            return;
        }
        "priceOffer" == e.source.id ? onClickPriceOffer() : "barterOffer" == e.source.id && onClickBarterOffer();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/adverts/advert";
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
        fullscreen: "true"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    $.__views.scroll = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "scroll"
    });
    $.__views.window.add($.__views.scroll);
    $.__views.nameVal = Ti.UI.createLabel({
        height: "80dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        id: "nameVal",
        textid: "name"
    });
    $.__views.scroll.add($.__views.nameVal);
    var __alloyId199 = [];
    $.__views.images = Ti.UI.createScrollableView({
        width: "280dp",
        height: "180dp",
        left: "0dp",
        bottom: "10dp",
        contenWidth: "180dp",
        borderColor: "#ccc",
        borderWidth: "1dp",
        backgroundColor: "#fff",
        views: __alloyId199,
        id: "images",
        showPagingControl: "true"
    });
    $.__views.scroll.add($.__views.images);
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
        bottom: "0dp",
        id: "priceLbl",
        textid: "price"
    });
    $.__views.scroll.add($.__views.priceLbl);
    $.__views.priceVal = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "priceVal"
    });
    $.__views.scroll.add($.__views.priceVal);
    $.__views.__alloyId200 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId200"
    });
    $.__views.scroll.add($.__views.__alloyId200);
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
        bottom: "0dp",
        id: "descriptionLbl",
        textid: "description"
    });
    $.__views.scroll.add($.__views.descriptionLbl);
    $.__views.descriptionVal = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "descriptionVal"
    });
    $.__views.scroll.add($.__views.descriptionVal);
    $.__views.__alloyId201 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId201"
    });
    $.__views.scroll.add($.__views.__alloyId201);
    $.__views.contactLbl = Ti.UI.createLabel({
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
        bottom: "0dp",
        id: "contactLbl",
        textid: "seller"
    });
    $.__views.scroll.add($.__views.contactLbl);
    $.__views.user = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "user"
    });
    $.__views.scroll.add($.__views.user);
    $.__views.__alloyId202 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId202"
    });
    $.__views.scroll.add($.__views.__alloyId202);
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
        bottom: "0dp",
        id: "emailLbl",
        textid: "email"
    });
    $.__views.scroll.add($.__views.emailLbl);
    $.__views.email = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#00accb",
        id: "email"
    });
    $.__views.scroll.add($.__views.email);
    onClickEmail ? $.__views.email.addEventListener("click", onClickEmail) : __defers["$.__views.email!click!onClickEmail"] = true;
    $.__views.__alloyId203 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId203"
    });
    $.__views.scroll.add($.__views.__alloyId203);
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
        bottom: "0dp",
        id: "phoneLbl",
        textid: "advert_phone"
    });
    $.__views.scroll.add($.__views.phoneLbl);
    $.__views.phone = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#00accb",
        id: "phone"
    });
    $.__views.scroll.add($.__views.phone);
    phoneCall ? $.__views.phone.addEventListener("click", phoneCall) : __defers["$.__views.phone!click!phoneCall"] = true;
    $.__views.__alloyId204 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId204"
    });
    $.__views.scroll.add($.__views.__alloyId204);
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
        bottom: "0dp",
        id: "addressLbl",
        textid: "address"
    });
    $.__views.scroll.add($.__views.addressLbl);
    $.__views.address = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#00accb",
        id: "address"
    });
    $.__views.scroll.add($.__views.address);
    onClickAddress ? $.__views.address.addEventListener("click", onClickAddress) : __defers["$.__views.address!click!onClickAddress"] = true;
    $.__views.mapImage = Ti.UI.createImageView({
        id: "mapImage",
        image: ""
    });
    $.__views.scroll.add($.__views.mapImage);
    onClickAddress ? $.__views.mapImage.addEventListener("click", onClickAddress) : __defers["$.__views.mapImage!click!onClickAddress"] = true;
    $.__views.__alloyId205 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId205"
    });
    $.__views.scroll.add($.__views.__alloyId205);
    $.__views.priceOffer = Ti.UI.createButton({
        width: "180dp",
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
        id: "priceOffer",
        titleid: "send_my_price_offer"
    });
    $.__views.scroll.add($.__views.priceOffer);
    buttonTouchStart ? $.__views.priceOffer.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.priceOffer!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.priceOffer.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.priceOffer!touchend!buttonTouchEnd"] = true;
    $.__views.barterOffer = Ti.UI.createButton({
        width: "180dp",
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
        id: "barterOffer",
        titleid: "send_my_barter_offer"
    });
    $.__views.scroll.add($.__views.barterOffer);
    buttonTouchStart ? $.__views.barterOffer.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.barterOffer!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.barterOffer.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.barterOffer!touchend!buttonTouchEnd"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var forEdit = arguments[0].forEdit || null;
    var id = arguments[0].id || null;
    var advert;
    var indicator = Alloy.Globals.indicator;
    var imageWindow = {
        window: false,
        view: false,
        openWindow: function(page) {
            var self = this;
            self.window.open();
            self.view.setCurrentPage(page);
        },
        createWindow: function(views) {
            var self = this;
            self.window = Ti.UI.createWindow({
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f0f0",
                orientationModes: [ Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]
            });
            var btn = Ti.UI.createButton({
                title: "X",
                width: "30dp",
                height: "30dp",
                right: "5dp",
                top: "5dp",
                zIndex: 10,
                backgroundColor: Alloy.Globals.Styles.buttonBg,
                color: "#fff"
            });
            btn.addEventListener("click", function() {
                self.window.close();
            });
            var newViews = [];
            for (var i = 0; i < views.length; i++) {
                var view = views[i];
                var newView = Ti.UI.createImageView({
                    image: view.imageOriginal
                });
                newViews.push(newView);
            }
            self.view = Ti.UI.createScrollableView({
                showPagingControl: true,
                views: newViews
            });
            self.window.add(self.view);
            self.window.add(btn);
        }
    };
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.email!click!onClickEmail"] && $.__views.email.addEventListener("click", onClickEmail);
    __defers["$.__views.phone!click!phoneCall"] && $.__views.phone.addEventListener("click", phoneCall);
    __defers["$.__views.address!click!onClickAddress"] && $.__views.address.addEventListener("click", onClickAddress);
    __defers["$.__views.mapImage!click!onClickAddress"] && $.__views.mapImage.addEventListener("click", onClickAddress);
    __defers["$.__views.priceOffer!touchstart!buttonTouchStart"] && $.__views.priceOffer.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.priceOffer!touchend!buttonTouchEnd"] && $.__views.priceOffer.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.barterOffer!touchstart!buttonTouchStart"] && $.__views.barterOffer.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.barterOffer!touchend!buttonTouchEnd"] && $.__views.barterOffer.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;