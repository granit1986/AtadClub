function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function close() {
        Alloy.Collections.offers.fetch({
            success: function() {},
            error: function() {}
        });
    }
    function blur(e) {
        e.source.id !== $.answer.id && $.answer.blur();
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        indicator.openIndicator();
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        "accept" == e.source.id ? onClickAccept() : "decline" == e.source.id && onClickDecline();
    }
    function open() {
        indicator.openIndicator();
        offers.fetch({
            data: {
                id: offerId
            },
            success: function() {
                offer = offers.where({
                    id: offerId
                })[0].toJSON();
                $.advert.text = offer.advert;
                if (offer.imageId) {
                    $.imageLbl.visible = true;
                    image = offer.imageServer + "/" + offer.imageId + Alloy.Globals.imageSizes.supplier.edit();
                    $.imageView.image = image;
                    $.imageView.height = Ti.UI.SIZE;
                    $.imageView.bottom = "10dp";
                    $.scrollView.remove($.price);
                    $.scrollView.remove($.priceLbl);
                }
                $.user.text = offer.user;
                $.email.text = offer.email;
                $.phone.text = offer.phone;
                switch (offer.state) {
                  case 1:
                  default:
                    offer.state = L("new");
                    $.accept.visible = true;
                    $.decline.visible = true;
                    $.answerLbl.visible = true;
                    $.answer.visible = true;
                    break;

                  case 3:
                    offer.state = L("declined");
                    $.answerLbl.visible = true;
                    break;

                  case 4:
                    offer.state = L("accepted");
                    $.answerLbl.visible = true;
                }
                $.state.text = offer.state;
                if (offer.price) {
                    $.price.visible = true;
                    $.priceLbl.visible = true;
                    $.price.text = offer.price;
                    $.scrollView.remove($.imageLbl);
                    $.scrollView.remove($.imageView);
                }
                $.description.text = offer.description;
                if ("" !== offer.answer) {
                    $.answerMsg.text = offer.answer;
                    $.answerMsg.show();
                    $.scrollView.remove($.answer);
                }
                indicator.closeIndicator();
            },
            error: function() {
                indicator.closeIndicator();
            }
        });
    }
    function onClickEmail() {}
    function phoneCall() {
        Titanium.Platform.openURL("tel:" + offer.phone);
    }
    function onClickAccept() {
        var offer_ = Alloy.createModel("offer", {
            id: offer.id,
            answer: $.answer.value,
            state: 4
        });
        offer_.save({}, {
            success: function() {
                indicator.closeIndicator();
                $.accept.visible = false;
                $.decline.visible = false;
                $.answerMsg.text = $.answer.value;
                $.scrollView.remove($.answer);
                $.answerMsg.visible = true;
                $.state.text = L("accepted");
                Ti.App.fireEvent("offers:update");
            },
            error: function() {
                indicator.closeIndicator();
            }
        });
    }
    function onClickDecline() {
        var offer_ = Alloy.createModel("offer", {
            id: offer.id,
            answer: $.answer.value,
            state: 3
        });
        offer_.save({}, {
            success: function() {
                indicator.closeIndicator();
                $.accept.visible = false;
                $.decline.visible = false;
                $.state.text = L("declined");
                $.answerMsg.text = $.answer.value;
                $.scrollView.remove($.answer);
                $.answerMsg.visible = true;
                Ti.App.fireEvent("offers:update");
            },
            error: function() {
                indicator.closeIndicator();
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/offers/offer";
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
        fullscreen: "true",
        id: "window",
        titleid: "offer"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    $.__views.scrollView = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "scrollView"
    });
    $.__views.window.add($.__views.scrollView);
    $.__views.__alloyId66 = Ti.UI.createLabel({
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
        id: "__alloyId66"
    });
    $.__views.scrollView.add($.__views.__alloyId66);
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
    $.__views.fromLbl = Ti.UI.createLabel({
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
        textid: "from",
        id: "fromLbl"
    });
    $.__views.scrollView.add($.__views.fromLbl);
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
    $.__views.__alloyId67 = Ti.UI.createLabel({
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
        id: "__alloyId67"
    });
    $.__views.scrollView.add($.__views.__alloyId67);
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
    $.__views.__alloyId68 = Ti.UI.createLabel({
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
        id: "__alloyId68"
    });
    $.__views.scrollView.add($.__views.__alloyId68);
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
        textid: "barter_image"
    });
    $.__views.scrollView.add($.__views.imageLbl);
    $.__views.imageView = Ti.UI.createImageView({
        width: Alloy.Globals.Styles.inputWidth,
        bottom: "40dp",
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
        id: "imageView"
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
    $.__views.__alloyId69 = Ti.UI.createLabel({
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
        id: "__alloyId69"
    });
    $.__views.scrollView.add($.__views.__alloyId69);
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
    $.__views.__alloyId70 = Ti.UI.createLabel({
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
        id: "__alloyId70"
    });
    $.__views.scrollView.add($.__views.__alloyId70);
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
        _.extend(o, {
            top: "-30dp",
            width: "180dp",
            height: "70dp",
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
    $.__views.accept = Ti.UI.createButton({
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
        id: "accept",
        titleid: "accept",
        visible: "false"
    });
    $.__views.scrollView.add($.__views.accept);
    buttonTouchStart ? $.__views.accept.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.accept!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.accept.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.accept!touchend!buttonTouchEnd"] = true;
    $.__views.decline = Ti.UI.createButton({
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
        id: "decline",
        titleid: "decline",
        visible: "false"
    });
    $.__views.scrollView.add($.__views.decline);
    buttonTouchStart ? $.__views.decline.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.decline!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.decline.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.decline!touchend!buttonTouchEnd"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var offers = Alloy.createCollection("offer");
    var indicator = Alloy.Globals.indicator;
    var offerId = arguments[0].offerId;
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    __defers["$.__views.window!click!blur"] && $.__views.window.addEventListener("click", blur);
    __defers["$.__views.email!click!onClickEmail"] && $.__views.email.addEventListener("click", onClickEmail);
    __defers["$.__views.phone!click!phoneCall"] && $.__views.phone.addEventListener("click", phoneCall);
    __defers["$.__views.accept!touchstart!buttonTouchStart"] && $.__views.accept.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.accept!touchend!buttonTouchEnd"] && $.__views.accept.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.decline!touchstart!buttonTouchStart"] && $.__views.decline.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.decline!touchend!buttonTouchEnd"] && $.__views.decline.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;