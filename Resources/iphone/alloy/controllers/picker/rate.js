function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function onRate(e) {
        rating = e.source.id;
        rating = parseInt(rating.replace("rate", ""));
        switch (rating) {
          case 1:
            $.rating.backgroundImage = "images/rate_1.png";
            break;

          case 2:
            $.rating.backgroundImage = "images/rate_2.png";
            break;

          case 3:
            $.rating.backgroundImage = "images/rate_3.png";
            break;

          case 4:
            $.rating.backgroundImage = "images/rate_4.png";
            break;

          case 5:
            $.rating.backgroundImage = "images/rate_5.png";
        }
    }
    function send() {
        $.ratewin.close();
        callback && callback(rating);
    }
    function onClose() {
        return 0;
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        send();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "picker/rate";
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
    $.__views.ratewin = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "vertical",
        fullscreen: "true",
        id: "ratewin",
        titleid: "deal_rating"
    });
    $.__views.ratewin && $.addTopLevelView($.__views.ratewin);
    onClose ? $.__views.ratewin.addEventListener("close", onClose) : __defers["$.__views.ratewin!close!onClose"] = true;
    $.__views.__alloyId339 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "__alloyId339"
    });
    $.__views.ratewin.add($.__views.__alloyId339);
    $.__views.__alloyId340 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId340"
    });
    $.__views.__alloyId339.add($.__views.__alloyId340);
    $.__views.ratingLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: "30dp",
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "ratingLbl",
        textid: "rating"
    });
    $.__views.__alloyId339.add($.__views.ratingLbl);
    $.__views.rating = Ti.UI.createView({
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
        id: "rating"
    });
    $.__views.__alloyId339.add($.__views.rating);
    $.__views.__alloyId341 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "30dp",
        id: "__alloyId341"
    });
    $.__views.rating.add($.__views.__alloyId341);
    $.__views.rating = Ti.UI.createView({
        layout: "horizontal",
        width: "190dp",
        height: "30dp",
        left: "0",
        top: "0",
        backgroundRepear: false,
        id: "rating"
    });
    $.__views.__alloyId341.add($.__views.rating);
    $.__views.rate1 = Ti.UI.createButton({
        width: "38dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        id: "rate1"
    });
    $.__views.rating.add($.__views.rate1);
    onRate ? $.__views.rate1.addEventListener("click", onRate) : __defers["$.__views.rate1!click!onRate"] = true;
    $.__views.rate2 = Ti.UI.createButton({
        width: "38dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        id: "rate2"
    });
    $.__views.rating.add($.__views.rate2);
    onRate ? $.__views.rate2.addEventListener("click", onRate) : __defers["$.__views.rate2!click!onRate"] = true;
    $.__views.rate3 = Ti.UI.createButton({
        width: "38dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        id: "rate3"
    });
    $.__views.rating.add($.__views.rate3);
    onRate ? $.__views.rate3.addEventListener("click", onRate) : __defers["$.__views.rate3!click!onRate"] = true;
    $.__views.rate4 = Ti.UI.createButton({
        width: "38dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        id: "rate4"
    });
    $.__views.rating.add($.__views.rate4);
    onRate ? $.__views.rate4.addEventListener("click", onRate) : __defers["$.__views.rate4!click!onRate"] = true;
    $.__views.rate5 = Ti.UI.createButton({
        width: "38dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        id: "rate5"
    });
    $.__views.rating.add($.__views.rate5);
    onRate ? $.__views.rate5.addEventListener("click", onRate) : __defers["$.__views.rate5!click!onRate"] = true;
    $.__views.__alloyId342 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId342"
    });
    $.__views.__alloyId339.add($.__views.__alloyId342);
    $.__views.goRate = Ti.UI.createButton({
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
        id: "goRate",
        titleid: "send"
    });
    $.__views.__alloyId339.add($.__views.goRate);
    buttonTouchStart ? $.__views.goRate.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.goRate!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.goRate.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.goRate!touchend!buttonTouchEnd"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var callback = arguments[0].callback;
    $.rating.backgroundImage = "images/rate_0.png";
    var rating = 0;
    __defers["$.__views.ratewin!close!onClose"] && $.__views.ratewin.addEventListener("close", onClose);
    __defers["$.__views.rate1!click!onRate"] && $.__views.rate1.addEventListener("click", onRate);
    __defers["$.__views.rate2!click!onRate"] && $.__views.rate2.addEventListener("click", onRate);
    __defers["$.__views.rate3!click!onRate"] && $.__views.rate3.addEventListener("click", onRate);
    __defers["$.__views.rate4!click!onRate"] && $.__views.rate4.addEventListener("click", onRate);
    __defers["$.__views.rate5!click!onRate"] && $.__views.rate5.addEventListener("click", onRate);
    __defers["$.__views.goRate!touchstart!buttonTouchStart"] && $.__views.goRate.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.goRate!touchend!buttonTouchEnd"] && $.__views.goRate.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;