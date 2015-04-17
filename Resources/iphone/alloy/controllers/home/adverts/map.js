function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function setRegion() {
        $.mapView.region = Alloy.Globals.mapRegion;
    }
    function onClick(e) {
        if ("rightButton" == e.clicksource || "rightPane" == e.clicksource || "rightView" == e.clicksource) {
            var advertWindow = Alloy.createController("home/adverts/advert", {
                id: e.annotation.advertId
            }).getView();
            Alloy.CFG.tabHome.open(advertWindow);
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/adverts/map";
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
    $.__views.mapView = Alloy.Globals.Map.createView({
        id: "mapView",
        userLocation: "true",
        mapType: "Alloy.Globals.Map.STANDARD_TYPE"
    });
    $.__views.mapView && $.addTopLevelView($.__views.mapView);
    setRegion ? $.__views.mapView.addEventListener("complete", setRegion) : __defers["$.__views.mapView!complete!setRegion"] = true;
    onClick ? $.__views.mapView.addEventListener("click", onClick) : __defers["$.__views.mapView!click!onClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.mapView!complete!setRegion"] && $.__views.mapView.addEventListener("complete", setRegion);
    __defers["$.__views.mapView!click!onClick"] && $.__views.mapView.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;