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
        e.source.id !== $.price.id && $.price.blur();
        e.source.id !== $.description.id && $.description.blur();
        $.scrollView.setContentOffset({
            x: 0,
            y: 0
        });
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        "sendPriceOffer" == e.source.id && send();
    }
    function send() {
        var offer = Alloy.createModel("priceOffer", {
            advertId: advert.id,
            price: $.price.value,
            description: $.description.value
        });
        offer.localValidate(errorHandler) && offer.save({}, {
            success: function() {
                $.window.close();
                Alloy.Globals.core.showErrorDialog(L("offer_sent"));
            },
            error: function(model, xhr) {
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
    function errorHandler(err) {
        switch (err) {
          case errors.NO_DESCRIPTION:
            $.description.focus();
            break;

          case errors.NO_PRICE:
            $.price.focus();
            break;

          case errors.INVALID_PRICE:
            $.price.focus();
        }
        Alloy.Globals.core.showError(err);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/adverts/priceOffer";
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
        titleid: "my_price_offer"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    focus ? $.__views.window.addEventListener("focus", focus) : __defers["$.__views.window!focus!focus"] = true;
    $.__views.scrollView = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "scrollView",
        scrollingEnabled: "false"
    });
    $.__views.window.add($.__views.scrollView);
    $.__views.__alloyId211 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId211"
    });
    $.__views.scrollView.add($.__views.__alloyId211);
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
    $.__views.scrollView.add($.__views.priceLbl);
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
    $.__views.scrollView.add($.__views.price);
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
    focus ? $.__views.description.addEventListener("focus", focus) : __defers["$.__views.description!focus!focus"] = true;
    $.__views.sendPriceOffer = Ti.UI.createButton({
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
        id: "sendPriceOffer",
        titleid: "send"
    });
    $.__views.scrollView.add($.__views.sendPriceOffer);
    buttonTouchStart ? $.__views.sendPriceOffer.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.sendPriceOffer!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.sendPriceOffer.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.sendPriceOffer!touchend!buttonTouchEnd"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var advert = Alloy.Collections.publicAdverts.where({
        id: arguments[0].advertId
    })[0].toJSON();
    __defers["$.__views.window!click!blur"] && $.__views.window.addEventListener("click", blur);
    __defers["$.__views.window!focus!focus"] && $.__views.window.addEventListener("focus", focus);
    __defers["$.__views.price!focus!focus"] && $.__views.price.addEventListener("focus", focus);
    __defers["$.__views.description!focus!focus"] && $.__views.description.addEventListener("focus", focus);
    __defers["$.__views.sendPriceOffer!touchstart!buttonTouchStart"] && $.__views.sendPriceOffer.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.sendPriceOffer!touchend!buttonTouchEnd"] && $.__views.sendPriceOffer.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;