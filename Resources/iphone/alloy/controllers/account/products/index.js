function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId81(e) {
        if (e && e.fromAdapter) return;
        __alloyId81.opts || {};
        var models = __alloyId80.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId77 = models[i];
            __alloyId77.__transform = transform(__alloyId77);
            var __alloyId79 = Alloy.createController("account/products/row", {
                $model: __alloyId77
            });
            rows.push(__alloyId79.getViewEx({
                recurse: true
            }));
        }
        $.__views.products.setData(rows);
    }
    function open() {
        showAlert && Alloy.Globals.core.showErrorDialog(L("can_add_product"));
        Ti.App.addEventListener("account:updateProducts", function() {
            productsFetch();
        });
        productsFetch();
    }
    function close() {
        Ti.App.removeEventListener("account:updateProducts", function() {
            productsFetch();
        });
    }
    function productsFetch() {
        if (Alloy.Globals.core.apiToken()) {
            indicator.openIndicator();
            Alloy.Collections.products.fetch({
                success: function() {
                    indicator.closeIndicator();
                },
                error: function() {
                    indicator.closeIndicator();
                }
            });
        }
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.price = transform.currency + " " + transform.price;
        transform.images = transform.images && transform.images.length > 0 ? JSON.parse(transform.images) : [];
        transform.images.length > 0 && (transform.image = "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + transform.images[0] + Alloy.Globals.imageSizes.product.row());
        return transform;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/products/index";
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
        titleid: "my_products"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.products = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        id: "products"
    });
    $.__views.window.add($.__views.products);
    var __alloyId80 = Alloy.Collections["products"] || products;
    __alloyId80.on("fetch destroy change add remove reset", __alloyId81);
    exports.destroy = function() {
        __alloyId80.off("fetch destroy change add remove reset", __alloyId81);
    };
    _.extend($, $.__views);
    var addButton = Ti.UI.createButton({
        titleid: "add"
    });
    addButton.addEventListener("click", function() {
        Alloy.CFG.tabAccount.open(Alloy.createController("account/products/product").getView());
    });
    $.window.setRightNavButton(addButton);
    var showAlert = false;
    arguments[0] && (showAlert = arguments[0].alert || false);
    var indicator = Alloy.Globals.indicator;
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;