function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId60(e) {
        if (e && e.fromAdapter) return;
        __alloyId60.opts || {};
        var models = __alloyId59.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId56 = models[i];
            __alloyId56.__transform = transform(__alloyId56);
            var __alloyId58 = Alloy.createController("account/offers/row", {
                $model: __alloyId56
            });
            rows.push(__alloyId58.getViewEx({
                recurse: true
            }));
        }
        $.__views.__alloyId55.setData(rows);
    }
    function fetch() {
        offers.fetch({
            success: function() {},
            error: function() {}
        });
    }
    function close() {
        Ti.App.removeEventListener("offers:update", fetch);
    }
    function removeOffer(e) {
        var offer = offers.get(e.row.rowId);
        offer.destroy();
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.price = transform.price ? transform.currency + " " + transform.price : L("barter_offer");
        return transform;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/offers/index";
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
        backgroundImage: "images/background.png",
        layout: "vertical",
        id: "window",
        fullscreen: "true",
        titleid: "my_offers"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.__alloyId55 = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        separatorColor: "transparent",
        editable: "true",
        id: "__alloyId55"
    });
    $.__views.window.add($.__views.__alloyId55);
    var __alloyId59 = Alloy.Collections["offers"] || offers;
    __alloyId59.on("fetch destroy change add remove reset", __alloyId60);
    removeOffer ? $.__views.__alloyId55.addEventListener("delete", removeOffer) : __defers["$.__views.__alloyId55!delete!removeOffer"] = true;
    exports.destroy = function() {
        __alloyId59.off("fetch destroy change add remove reset", __alloyId60);
    };
    _.extend($, $.__views);
    var offers = Alloy.Collections.offers;
    Ti.App.addEventListener("offers:update", fetch);
    fetch();
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    __defers["$.__views.__alloyId55!delete!removeOffer"] && $.__views.__alloyId55.addEventListener("delete", removeOffer);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;