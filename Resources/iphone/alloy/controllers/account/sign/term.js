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
    this.__controllerPath = "account/sign/term";
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
        titleid: "terms",
        id: "window"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.__alloyId120 = Ti.UI.createScrollView({
        layout: "vertical",
        id: "__alloyId120"
    });
    $.__views.window.add($.__views.__alloyId120);
    $.__views.__alloyId121 = Ti.UI.createLabel({
        top: "10dp",
        left: "10dp",
        right: "10dp",
        color: "#555",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        textid: "terms_text",
        id: "__alloyId121"
    });
    $.__views.__alloyId120.add($.__views.__alloyId121);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var leftButton = Ti.UI.createButton({
        title: L("back")
    });
    leftButton.addEventListener("click", function() {
        $.window.close();
    });
    $.window.setLeftNavButton(leftButton);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;