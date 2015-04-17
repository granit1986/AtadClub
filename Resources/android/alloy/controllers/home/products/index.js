function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId253(e) {
        if (e && e.fromAdapter) return;
        __alloyId253.opts || {};
        var models = __alloyId252.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId249 = models[i];
            __alloyId249.__transform = {};
            var __alloyId251 = Alloy.createController("home/products/row", {
                $model: __alloyId249
            });
            rows.push(__alloyId251.getViewEx({
                recurse: true
            }));
        }
        $.__views.products.setData(rows);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/products/index";
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
        fullscreen: "true",
        titleid: "my_products"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    $.__views.products = Ti.UI.createTableView({
        backgroundColor: "transparent",
        id: "products",
        separatorColor: "transparent"
    });
    $.__views.window.add($.__views.products);
    var __alloyId252 = Alloy.Collections["supplierProducts"] || supplierProducts;
    __alloyId252.on("fetch destroy change add remove reset", __alloyId253);
    exports.destroy = function() {
        __alloyId252.off("fetch destroy change add remove reset", __alloyId253);
    };
    _.extend($, $.__views);
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;