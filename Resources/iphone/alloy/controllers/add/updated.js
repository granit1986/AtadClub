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
        $.window.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "add/updated";
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
        fullscreen: "true"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.label = Ti.UI.createLabel({
        top: "10dp",
        left: "10dp",
        right: "10dp",
        color: "#555",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "label"
    });
    $.__views.window.add($.__views.label);
    $.__views.__alloyId150 = Ti.UI.createButton({
        width: "60%",
        height: "40dp",
        top: "20dp",
        left: "20%",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: "#007aff",
        titleid: "ok",
        id: "__alloyId150"
    });
    $.__views.window.add($.__views.__alloyId150);
    close ? $.__views.__alloyId150.addEventListener("click", close) : __defers["$.__views.__alloyId150!click!close"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] && arguments[0].title && ($.window.title = L(arguments[0].title));
    arguments[0] && arguments[0].label && ($.label.text = L(arguments[0].label));
    __defers["$.__views.__alloyId150!click!close"] && $.__views.__alloyId150.addEventListener("click", close);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;