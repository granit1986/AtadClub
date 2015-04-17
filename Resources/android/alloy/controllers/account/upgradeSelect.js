function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function goldPrivateClick() {
        var view = Alloy.createController("account/upgrade", {
            buyAdverts: true
        }).getView();
        Alloy.Globals.tabGroup.activeTab.open(view);
    }
    function silverClick() {
        var view = Alloy.createController("account/upgrade", {
            buySilverDeals: true
        }).getView();
        Alloy.Globals.tabGroup.activeTab.open(view);
    }
    function goldClick() {
        var view = Alloy.createController("account/upgrade", {
            buyGoldDeals: true
        }).getView();
        Alloy.Globals.tabGroup.activeTab.open(view);
    }
    function close() {
        callback && callback();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/upgradeSelect";
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
        titleid: "upgrade_account"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.scroll = Ti.UI.createScrollView({
        layout: "vertical",
        id: "scroll"
    });
    $.__views.window.add($.__views.scroll);
    $.__views.__alloyId31 = Ti.UI.createButton({
        width: " 220dp",
        backgroundImage: "images/membership_gold_p.png",
        height: "56dp",
        top: "30dp",
        id: "__alloyId31"
    });
    $.__views.scroll.add($.__views.__alloyId31);
    goldPrivateClick ? $.__views.__alloyId31.addEventListener("click", goldPrivateClick) : __defers["$.__views.__alloyId31!click!goldPrivateClick"] = true;
    $.__views.__alloyId32 = Ti.UI.createButton({
        width: " 220dp",
        backgroundImage: "images/membership_silver_b.png",
        height: "56dp",
        top: "20dp",
        id: "__alloyId32"
    });
    $.__views.scroll.add($.__views.__alloyId32);
    silverClick ? $.__views.__alloyId32.addEventListener("click", silverClick) : __defers["$.__views.__alloyId32!click!silverClick"] = true;
    $.__views.__alloyId33 = Ti.UI.createButton({
        width: " 220dp",
        backgroundImage: "images/membership_gold_b.png",
        height: "56dp",
        top: "20dp",
        id: "__alloyId33"
    });
    $.__views.scroll.add($.__views.__alloyId33);
    goldClick ? $.__views.__alloyId33.addEventListener("click", goldClick) : __defers["$.__views.__alloyId33!click!goldClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var callback = arguments[0] && arguments[0].callback || false;
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    __defers["$.__views.__alloyId31!click!goldPrivateClick"] && $.__views.__alloyId31.addEventListener("click", goldPrivateClick);
    __defers["$.__views.__alloyId32!click!silverClick"] && $.__views.__alloyId32.addEventListener("click", silverClick);
    __defers["$.__views.__alloyId33!click!goldClick"] && $.__views.__alloyId33.addEventListener("click", goldClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;