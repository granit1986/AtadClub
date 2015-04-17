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
    this.__controllerPath = "map/map";
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
    var __alloyId271 = [];
    $.__views.__alloyId272 = Alloy.createController("map/annotation", {
        title: "Appcelerator",
        id: "__alloyId272",
        __parentSymbol: __parentSymbol
    });
    __alloyId271.push($.__views.__alloyId272.getViewEx({
        recurse: true
    }));
    $.__views.map = Ti.Map.createView({
        top: "0",
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
        annotations: __alloyId271,
        id: "map",
        mapType: Ti.Map.STANDARD_TYPE
    });
    $.__views.map && $.addTopLevelView($.__views.map);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.map.addEventListener("click", function(e) {
        !e.annotation || "leftButton" !== e.clicksource && "leftPane" != e.clicksource || $.map.removeAnnotation(e.annotation);
    });
    $.search.setHintText(L("enter_address"));
    exports.addAnnotation = function(geodata) {
        if (!geodata.error) {
            var annotation = Alloy.createController("map/annotation", {
                title: geodata.title,
                latitude: parseFloat(geodata.response.results[0].geometry.location.lat),
                longitude: parseFloat(geodata.response.results[0].geometry.location.lng)
            });
            $.map.addAnnotation(annotation.getView());
            $.map.setLocation({
                latitude: parseFloat(geodata.response.results[0].geometry.location.lat),
                longitude: parseFloat(geodata.response.results[0].geometry.location.lng),
                latitudeDelta: 1,
                longitudeDelta: 1
            });
        }
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;