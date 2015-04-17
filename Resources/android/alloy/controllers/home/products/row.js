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
    this.__controllerPath = "home/products/row";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        var $model = __processArg(arguments[0], "$model");
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.row = Ti.UI.createTableViewRow({
        selectedBackgroundColor: Alloy.Globals.Styles.TableRowOnTapBg,
        rowid: "undefined" != typeof $model.__transform["id"] ? $model.__transform["id"] : $model.get("id"),
        hasChild: "true",
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    onClick ? $.__views.row.addEventListener("click", onClick) : __defers["$.__views.row!click!onClick"] = true;
    $.__views.img = Alloy.createWidget("nl.fokkezb.cachedImageView", "widget", {
        id: "img",
        image: "undefined" != typeof $model.__transform["image"] ? $model.__transform["image"] : $model.get("image"),
        __parentSymbol: $.__views.row
    });
    $.__views.img.setParent($.__views.row);
    $.__views.titleLbl = Ti.UI.createLabel({
        id: "titleLbl",
        text: "undefined" != typeof $model.__transform["name"] ? $model.__transform["name"] : $model.get("name")
    });
    $.__views.row.add($.__views.titleLbl);
    $.__views.priceLbl = Ti.UI.createLabel({
        id: "priceLbl",
        text: "undefined" != typeof $model.__transform["price"] ? $model.__transform["price"] : $model.get("price")
    });
    $.__views.row.add($.__views.priceLbl);
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.row!click!onClick"] && $.__views.row.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;