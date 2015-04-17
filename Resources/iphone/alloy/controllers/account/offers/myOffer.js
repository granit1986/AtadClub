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
        offer.fetch({
            data: {
                id: offerId
            },
            success: function() {
                offer = offer.toJSON();
                $.advert.text = offer.advert;
                $.user.text = offer.toUser;
                $.email.text = offer.email;
                $.phone.text = offer.phone;
                switch (offer.state) {
                  case 1:
                  default:
                    offer.state = L("new");
                    break;

                  case 3:
                    offer.state = L("declined");
                    if ("" !== offer.answer) {
                        $.answerLbl.show();
                        $.answerMsg.text = offer.answer;
                        $.scrollView.remove($.answer);
                        $.answerMsg.show();
                    }
                    break;

                  case 4:
                    offer.state = L("accepted");
                    if ("" !== offer.answer) {
                        $.answerLbl.show();
                        $.answerMsg.text = offer.answer;
                        $.scrollView.remove($.answer);
                        $.answerMsg.show();
                    }
                }
                $.state.text = offer.state;
                if (offer.price) {
                    $.price.visible = true;
                    $.priceLbl.visible = true;
                    $.price.text = offer.price;
                    $.imageLbl.bottom = 0;
                    $.imageView.bottom = 0;
                }
                if (offer.imageId) {
                    $.imageLbl.visible = true;
                    image = offer.imageServer + "/" + offer.imageId + Alloy.Globals.imageSizes.supplier.edit();
                    $.imageView.image = image;
                    $.imageView.visible = true;
                    $.imageView.height = Ti.UI.SIZE;
                    $.imageView.bottom = "10dp";
                    $.price.bottom = 0;
                    $.priceLbl.bottom = 0;
                }
                $.description.text = offer.description;
                indicator.closeIndicator();
            },
            error: function() {
                indicator.closeIndicator();
            }
        });
    }
    function close() {
        Alloy.Collections.offers.fetch({
            success: function() {},
            error: function() {}
        });
    }
    function onClickEmail() {}
    function phoneCall() {
        Titanium.Platform.openURL("tel:" + offer.phone);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/offers/myOffer";
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
        fullscreen: "true",
        id: "window",
        titleid: "offer"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.scrollView = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "scrollView"
    });
    $.__views.window.add($.__views.scrollView);
    $.__views.__alloyId61 = Ti.UI.createLabel({
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
        textid: "advert",
        id: "__alloyId61"
    });
    $.__views.scrollView.add($.__views.__alloyId61);
    $.__views.advert = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "advert"
    });
    $.__views.scrollView.add($.__views.advert);
    $.__views.toLbl = Ti.UI.createLabel({
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
        textid: "to",
        id: "toLbl"
    });
    $.__views.scrollView.add($.__views.toLbl);
    $.__views.user = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "10dp",
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
    $.__views.scrollView.add($.__views.user);
    $.__views.__alloyId62 = Ti.UI.createLabel({
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
        id: "__alloyId62"
    });
    $.__views.scrollView.add($.__views.__alloyId62);
    $.__views.email = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "email"
    });
    $.__views.scrollView.add($.__views.email);
    onClickEmail ? $.__views.email.addEventListener("click", onClickEmail) : __defers["$.__views.email!click!onClickEmail"] = true;
    $.__views.__alloyId63 = Ti.UI.createLabel({
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
        id: "__alloyId63"
    });
    $.__views.scrollView.add($.__views.__alloyId63);
    $.__views.phone = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "phone"
    });
    $.__views.scrollView.add($.__views.phone);
    phoneCall ? $.__views.phone.addEventListener("click", phoneCall) : __defers["$.__views.phone!click!phoneCall"] = true;
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
        textid: "barter_image",
        visible: "false"
    });
    $.__views.scrollView.add($.__views.imageLbl);
    $.__views.imageView = Ti.UI.createImageView({
        width: Alloy.Globals.Styles.inputWidth,
        bottom: "40dp",
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
        id: "imageView",
        height: "0",
        visible: "false"
    });
    $.__views.scrollView.add($.__views.imageView);
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
        textid: "price",
        visible: "false"
    });
    $.__views.scrollView.add($.__views.priceLbl);
    $.__views.price = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "price",
        visible: "false"
    });
    $.__views.scrollView.add($.__views.price);
    $.__views.__alloyId64 = Ti.UI.createLabel({
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
        textid: "description",
        id: "__alloyId64"
    });
    $.__views.scrollView.add($.__views.__alloyId64);
    $.__views.description = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "description"
    });
    $.__views.scrollView.add($.__views.description);
    $.__views.__alloyId65 = Ti.UI.createLabel({
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
        textid: "state",
        id: "__alloyId65"
    });
    $.__views.scrollView.add($.__views.__alloyId65);
    $.__views.state = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "state"
    });
    $.__views.scrollView.add($.__views.state);
    $.__views.answerLbl = Ti.UI.createLabel({
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
        id: "answerLbl",
        textid: "answer",
        visible: "false"
    });
    $.__views.scrollView.add($.__views.answerLbl);
    $.__views.answer = Ti.UI.createTextArea(function() {
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
            id: "answer",
            visible: "false"
        });
        return o;
    }());
    $.__views.scrollView.add($.__views.answer);
    $.__views.answerMsg = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "answerMsg",
        visible: "false"
    });
    $.__views.scrollView.add($.__views.answerMsg);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var offer = Alloy.createModel("offer");
    var offerId = arguments[0].offerId;
    var indicator = Alloy.Globals.indicator;
    var image = false;
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    __defers["$.__views.email!click!onClickEmail"] && $.__views.email.addEventListener("click", onClickEmail);
    __defers["$.__views.phone!click!phoneCall"] && $.__views.phone.addEventListener("click", phoneCall);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;