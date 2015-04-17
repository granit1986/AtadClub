function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId88(e) {
        if (e && e.fromAdapter) return;
        __alloyId88.opts || {};
        var models = __alloyId87.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId84 = models[i];
            __alloyId84.__transform = transform(__alloyId84);
            var __alloyId86 = Alloy.createController("account/products/rowForUser", {
                $model: __alloyId84,
                __parentSymbol: __parentSymbol
            });
            rows.push(__alloyId86.getViewEx({
                recurse: true
            }));
        }
        $.__views.products.setData(rows);
    }
    function open() {
        indicator.openIndicator();
        Alloy.Collections.supplierProducts.fetch({
            data: {
                id: supplierId
            },
            success: function() {
                indicator.closeIndicator();
            },
            error: function() {
                indicator.closeIndicator();
            }
        });
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.price = transform.currency + " " + transform.price.trim();
        transform.images = transform.images && transform.images.length > 0 ? JSON.parse(transform.images) : [];
        transform.images.length > 0 && (transform.image = "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + transform.images[0] + Alloy.Globals.imageSizes.product.row());
        return transform;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/products/indexForUser";
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
    var __defers = {};
    $.__views.window = Ti.UI.createWindow({
        backgroundImage: "images/background.png",
        layout: "vertical",
        id: "window",
        fullscreen: "true",
        titleid: "my_products"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    $.__views.products = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        id: "products"
    });
    $.__views.window.add($.__views.products);
    var __alloyId87 = Alloy.Collections["supplierProducts"] || supplierProducts;
    __alloyId87.on("fetch destroy change add remove reset", __alloyId88);
    exports.destroy = function() {
        __alloyId87.off("fetch destroy change add remove reset", __alloyId88);
    };
    _.extend($, $.__views);
    var supplierId = arguments[0].supplierId;
    var indicator = Alloy.Globals.indicator;
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;