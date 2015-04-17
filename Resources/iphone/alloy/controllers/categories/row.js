function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function checkAll() {
        for (var i = 0; i < subcategories.length; i++) {
            var subcategory = subcategories[i];
            core.subCategories.selected({
                categoryId: categoryId,
                id: subcategory.id
            }, core.currentSectionCategories()) || core.subCategories.select({
                categoryId: categoryId,
                id: subcategory.id
            }, core.currentSectionCategories());
        }
    }
    function uncheckAll() {
        for (var i = 0; i < subcategories.length; i++) {
            var subcategory = subcategories[i];
            core.subCategories.selected({
                categoryId: categoryId,
                id: subcategory.id
            }, core.currentSectionCategories()) && core.subCategories.clear({
                categoryId: categoryId,
                id: subcategory.id
            }, core.currentSectionCategories());
        }
    }
    function click(e) {
        if (e.source.id && "checkbox" === e.source.id) return;
        e.row.hasChild && Ti.App.fireEvent("categoryWindow:showSubCategories", {
            categoryId: $.label.categoryId,
            categoryName: $.label.text
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "categories/row";
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
        layout: "absolute",
        selectionStyle: "none",
        hasChild: "true",
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    click ? $.__views.row.addEventListener("click", click) : __defers["$.__views.row!click!click"] = true;
    $.__views.label = Ti.UI.createLabel({
        height: "44dp",
        left: "40dp",
        font: {
            fontSize: "18dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#007aff",
        id: "label",
        text: "undefined" != typeof $model.__transform["name"] ? $model.__transform["name"] : $model.get("name"),
        categoryId: "undefined" != typeof $model.__transform["id"] ? $model.__transform["id"] : $model.get("id")
    });
    $.__views.row.add($.__views.label);
    $.__views.forDeals = Ti.UI.createLabel({
        height: "44dp",
        left: "40dp",
        font: {
            fontSize: "18dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#007aff",
        id: "forDeals",
        text: "undefined" != typeof $model.__transform["forDeals"] ? $model.__transform["forDeals"] : $model.get("forDeals"),
        visible: "false"
    });
    $.__views.row.add($.__views.forDeals);
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
    var categoryId = $.label.categoryId;
    var subcategories = Alloy.Collections.subCategories.where({
        categoryId: categoryId
    });
    var selectedSubcategories = core.currentSectionCategories()["_" + categoryId];
    var item = new Alloy.Globals.checkBox({}, {
        width: 25,
        height: 25,
        left: 10,
        categoryId: $.label.categoryId
    }, {
        uncheck: "images/checkbox.png",
        select: "images/checkbox_check.png",
        undefine: "images/checkbox_half.png"
    }, function(e) {
        if (!e.row.hasChild) return;
        var currentState = item.state();
        currentState === item.checkedAll ? uncheckAll() : currentState === item.uncheckedAll ? checkAll() : currentState === item.undefined && checkAll();
        for (category in core.currentSectionCategories()) 0 == Object.size(core.currentSectionCategories()[category]) && delete core.currentSectionCategories()[category];
        selectedSubcategories = core.currentSectionCategories()["_" + categoryId];
        item.setIsChecked(selectedSubcategories, subcategories);
        Ti.App.fireEvent("blockCategories");
    });
    item.setIsChecked(selectedSubcategories, subcategories);
    $.row.item = item;
    $.row.add(item.outerView());
    $.forDeals.text || ($.separate.height = 3);
    __defers["$.__views.row!click!click"] && $.__views.row.addEventListener("click", click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;