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
        $.mapview.region = {
            latitude: advert.lat,
            longitude: advert.lng,
            latitudeDelta: .02,
            longitudeDelta: .02
        };
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/adverts/advertMap";
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
        titleid: "map"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.mapview = Alloy.Globals.Map.createView({
        id: "mapview",
        animate: "true",
        regionFit: "true",
        userLocation: "true",
        mapType: "Alloy.Globals.Map.STANDARD_TYPE"
    });
    $.__views.window.add($.__views.mapview);
    setRegion ? $.__views.mapview.addEventListener("complete", setRegion) : __defers["$.__views.mapview!complete!setRegion"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var advert = arguments[0].advert;
    $.window.title = advert.address;
    var annotation = Alloy.Globals.Map.createAnnotation({
        latitude: advert.lat,
        longitude: advert.lng,
        title: advert.name,
        subtitle: advert.address,
        pincolor: Alloy.Globals.Map.ANNOTATION_RED
    });
    $.mapview.annotations = [ annotation ];
    $.mapview.region = {
        latitude: advert.lat,
        longitude: advert.lng,
        latitudeDelta: .02,
        longitudeDelta: .02
    };
    __defers["$.__views.mapview!complete!setRegion"] && $.__views.mapview.addEventListener("complete", setRegion);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;