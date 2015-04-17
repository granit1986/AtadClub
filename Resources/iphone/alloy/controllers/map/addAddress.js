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
    this.__controllerPath = "map/addAddress";
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
    $.__views.addAddress = Ti.UI.createView({
        backgroundColor: "#800",
        height: "150dp",
        top: 0,
        id: "addAddress"
    });
    $.__views.addAddress && $.addTopLevelView($.__views.addAddress);
    $.__views.search = Ti.UI.createSearchBar({
        height: "40dp",
        top: "5dp",
        left: "5dp",
        right: "50dp",
        style: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        backgroundColor: "#fff",
        paddingLeft: "5dp",
        id: "search"
    });
    $.__views.addAddress.add($.__views.search);
    $.__views.button = Ti.UI.createButton({
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        top: "5dp",
        height: "40dp",
        width: "40dp",
        right: "5dp",
        id: "button",
        title: "Submit"
    });
    $.__views.addAddress.add($.__views.button);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var geo = require("lib/geoMap");
    var callback = arguments[0].callback;
    $.button.addEventListener("click", function() {
        callback && callback($.search.value);
        $.close();
    });
    $.search.setHintText(L("enter_address"));
    $.search.addEventListener("return", function() {
        $.search.blur();
        geo.forwardGeocode($.search.value, function(geodata) {
            $.trigger("addAnnotation", {
                geodata: geodata
            });
        });
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;