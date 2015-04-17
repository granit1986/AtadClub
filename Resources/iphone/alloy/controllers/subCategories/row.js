function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function onClick() {
        this.hasCheck = !this.hasCheck;
        this.hasCheck ? core.subCategories.select({
            categoryId: this.categoryId,
            id: this.subCategoryId
        }, core.currentSectionCategories()) : core.subCategories.clear({
            categoryId: this.categoryId,
            id: this.subCategoryId
        }, core.currentSectionCategories());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "subCategories/row";
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
        backgroundColor: "#00ffffff",
        id: "row",
        selectionStyle: "none",
        categoryId: "undefined" != typeof $model.__transform["categoryId"] ? $model.__transform["categoryId"] : $model.get("categoryId"),
        subCategoryId: "undefined" != typeof $model.__transform["id"] ? $model.__transform["id"] : $model.get("id")
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    onClick ? $.__views.row.addEventListener("click", onClick) : __defers["$.__views.row!click!onClick"] = true;
    $.__views.label = Ti.UI.createLabel({
        height: "44dp",
        left: "20dp",
        font: {
            fontSize: "18dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#007aff",
        id: "label",
        text: "undefined" != typeof $model.__transform["name"] ? $model.__transform["name"] : $model.get("name")
    });
    $.__views.row.add($.__views.label);
    $.__views.separate = Ti.UI.createView({
        width: "300dp",
        height: "1dp",
        top: "43dp",
        left: "10dp",
        backgroundColor: "#e6e6e6",
        id: "separate"
    });
    $.__views.row.add($.__views.separate);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var core = Alloy.Globals.core;
    var categoryKey = "_" + $.row.categoryId;
    var subCategoryKey = "_" + $.row.subCategoryId;
    categoryKey in core.currentSectionCategories() && subCategoryKey in core.currentSectionCategories()[categoryKey] && ($.row.hasCheck = true);
    __defers["$.__views.row!click!onClick"] && $.__views.row.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;