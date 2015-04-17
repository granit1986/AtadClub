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
        indicator.openIndicator();
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        e.source.id && openView(e.source.id);
    }
    function openView(id) {
        var view = false;
        switch (id) {
          case "advert":
            view = Alloy.createController("add/advert").getView();
            break;

          case "deal":
            if (!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
                Alloy.Globals.core.showErrorDialog(L("should_be_company_message"));
                indicator.closeIndicator();
                return;
            }
            view = Alloy.createController("add/deal", {
                tab: Alloy.CFG.tabAdd
            }).getView();
        }
        view;
        Alloy.CFG.tabAdd.open(view);
        indicator.closeIndicator();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "add/index";
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
    $.__views.index = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "vertical",
        fullscreen: "true",
        titleid: "tab_add",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId149 = Ti.UI.createLabel({
        height: "80dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "what_add",
        id: "__alloyId149"
    });
    $.__views.index.add($.__views.__alloyId149);
    $.__views.advert = Ti.UI.createButton({
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
        id: "advert",
        titleid: "add_advert"
    });
    $.__views.index.add($.__views.advert);
    buttonTouchStart ? $.__views.advert.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.advert!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.advert.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.advert!touchend!buttonTouchEnd"] = true;
    $.__views.deal = Ti.UI.createButton({
        width: "180dp",
        height: Ti.UI.SIZE,
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
        id: "deal",
        titleid: "add_deal"
    });
    $.__views.index.add($.__views.deal);
    buttonTouchStart ? $.__views.deal.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.deal!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.deal.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.deal!touchend!buttonTouchEnd"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.App.addEventListener("add:notLoggin", function() {
        notLoggin();
    });
    Alloy.Globals.chat.openChatId = false;
    var indicator = Alloy.Globals.indicator;
    __defers["$.__views.advert!touchstart!buttonTouchStart"] && $.__views.advert.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.advert!touchend!buttonTouchEnd"] && $.__views.advert.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.deal!touchstart!buttonTouchStart"] && $.__views.deal.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.deal!touchend!buttonTouchEnd"] && $.__views.deal.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;