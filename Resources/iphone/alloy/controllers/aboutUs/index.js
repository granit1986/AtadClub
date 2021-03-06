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
    this.__controllerPath = "aboutUs/index";
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
        titleid: "win_about_us",
        id: "window"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.__alloyId17 = Ti.UI.createLabel({
        top: "10dp",
        left: "10dp",
        right: "10dp",
        color: "#555",
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "about_text",
        id: "__alloyId17"
    });
    $.__views.window.add($.__views.__alloyId17);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.chat.openChatId = false;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;