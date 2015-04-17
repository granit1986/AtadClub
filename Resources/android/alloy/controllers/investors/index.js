function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "investors/index";
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
    $.__views.window = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "vertical",
        fullscreen: "true",
        titleid: "win_appreciation",
        id: "window"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.__alloyId268 = Ti.UI.createScrollView({
        layout: "vertical",
        id: "__alloyId268"
    });
    $.__views.window.add($.__views.__alloyId268);
    $.__views.__alloyId269 = Ti.UI.createLabel({
        top: "10dp",
        left: Alloy.Globals.Styles.investors_alignLeft,
        right: Alloy.Globals.Styles.investors_alignRight,
        color: "#555",
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        width: "240dp",
        textid: "investors_text",
        id: "__alloyId269"
    });
    $.__views.__alloyId268.add($.__views.__alloyId269);
    $.__views.__alloyId270 = Ti.UI.createView({
        width: "280dp",
        height: "280dp",
        top: "30dp",
        backgroundImage: "images/chart.jpg",
        id: "__alloyId270"
    });
    $.__views.__alloyId268.add($.__views.__alloyId270);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.chat.openChatId = false;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;