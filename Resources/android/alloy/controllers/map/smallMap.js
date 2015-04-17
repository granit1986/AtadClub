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
    this.__controllerPath = "map/smallMap";
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __alloyId273 = [];
    $.__views.__alloyId274 = Alloy.createController("map/annotation", {
        title: "Map",
        id: "__alloyId274",
        __parentSymbol: __parentSymbol
    });
    __alloyId273.push($.__views.__alloyId274.getViewEx({
        recurse: true
    }));
    $.__views.map = Ti.Map.createView({
        heigth: 50,
        animate: true,
        regionFit: true,
        userLocation: false,
        region: {
            latitude: Alloy.Globals.LATITUDE_BASE,
            longitude: Alloy.Globals.LONGITUDE_BASE,
            latitudeDelta: .1,
            longitudeDelta: .1
        },
        zIndex: "9",
        annotations: __alloyId273,
        id: "map",
        mapType: Ti.Map.STANDARD_TYPE
    });
    $.__views.map && $.addTopLevelView($.__views.map);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;