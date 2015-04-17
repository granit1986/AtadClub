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
    this.__controllerPath = "version/index";
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
    $.__views.index = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "vertical",
        fullscreen: "true",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId356 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId356"
    });
    $.__views.index.add($.__views.__alloyId356);
    $.__views.categoryLbl = Ti.UI.createLabel({
        width: "80dp",
        height: "30dp",
        color: "#007aff",
        left: "30dp",
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "categoryLbl",
        textid: "version"
    });
    $.__views.index.add($.__views.categoryLbl);
    $.__views.version = Ti.UI.createLabel({
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
        id: "version"
    });
    $.__views.index.add($.__views.version);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.version.text = Ti.App.version;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;