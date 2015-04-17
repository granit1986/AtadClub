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
    this.__controllerPath = "map/index";
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
        layout: "",
        backgroundColor: "#fff",
        fullscreen: "true",
        id: "window"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.search = Ti.UI.createSearchBar({
        height: "40dp",
        top: "5dp",
        left: "5dp",
        right: "50dp",
        font: {
            fontSize: "13dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        zIndex: "10",
        id: "search"
    });
    $.__views.window.add($.__views.search);
    $.__views.send = Ti.UI.createButton({
        top: "5dp",
        height: "40dp",
        width: "40dp",
        right: "5dp",
        zIndex: 10,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: "#007aff",
        id: "send",
        title: "ok"
    });
    $.__views.window.add($.__views.send);
    $.__views.findMe = Ti.UI.createButton({
        bottom: "5dp",
        height: "30dp",
        width: "30dp",
        left: "5dp",
        zIndex: 10,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: "#007aff",
        backgroundImage: "images/icon_location.png",
        backgroundRepeat: false,
        id: "findMe"
    });
    $.__views.window.add($.__views.findMe);
    $.__views.map = Alloy.createController("map/map", {
        id: "map",
        __parentSymbol: $.__views.window
    });
    $.__views.map.setParent($.__views.window);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var callback = arguments[0].callback;
    var address = arguments[0].title;
    $.search.value = address;
    $.window.open();
    var geo = Alloy.Globals.geo;
    $.send.addEventListener("click", function() {
        callback && callback($.search.value);
        $.window.close();
    });
    $.findMe.addEventListener("click", function() {
        var geo = Alloy.Globals.geo;
        geo.checkLocation(function() {
            if (geo.location.status != geo.errors.NONE) {
                Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
                return;
            }
            geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
                if (e.error) Alloy.Globals.core.showErrorDialog(e.message ? L(e.message) : L(e.error)); else {
                    $.search.value = e.response.results[0].formatted_address;
                    var geodata = {
                        title: $.search.value,
                        response: {
                            results: [ {
                                geometry: {
                                    location: {
                                        lat: e.response.results[0].geometry.location.lat,
                                        lng: e.response.results[0].geometry.location.lng
                                    }
                                }
                            } ]
                        }
                    };
                    $.map.addAnnotation(geodata);
                }
            });
        });
    });
    var search = function() {
        $.search.blur();
        geo.geocoding($.search.value, function(geodata) {
            if (geodata.error) {
                Alloy.Globals.core.showErrorDialog(L(geodata.message));
                return;
            }
            $.map.addAnnotation(geodata);
            $.trigger("addAnnotation", {
                geodata: geodata
            });
        });
    };
    search();
    $.search.addEventListener("return", function() {
        search();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;