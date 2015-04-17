function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function onClose() {
        $.activityIndicator.hide();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "activity/index";
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
        fullscreen: true,
        backgroundColor: "#000",
        opacity: .2,
        id: "window"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    onClose ? $.__views.window.addEventListener("close", onClose) : __defers["$.__views.window!close!onClose"] = true;
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
        id: "activityIndicator"
    });
    $.__views.window.add($.__views.activityIndicator);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.activityIndicator.show();
    __defers["$.__views.window!close!onClose"] && $.__views.window.addEventListener("close", onClose);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;