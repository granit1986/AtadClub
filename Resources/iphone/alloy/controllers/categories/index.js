function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId166(e) {
        if (e && e.fromAdapter) return;
        __alloyId166.opts || {};
        var models = dataFilter(__alloyId165);
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId162 = models[i];
            __alloyId162.__transform = {};
            var __alloyId164 = Alloy.createController("categories/row", {
                $model: __alloyId162
            });
            rows.push(__alloyId164.getViewEx({
                recurse: true
            }));
        }
        $.__views.categories.setData(rows);
    }
    function onClose() {
        Ti.App.removeEventListener("categoryWindow:showSubCategories", showSubCategories);
        Ti.App.removeEventListener("blockCategories", blockCategories);
        closeCallback && closeCallback();
    }
    function open() {
        indicator.openIndicator();
        Ti.App.addEventListener("blockCategories", blockCategories);
        Alloy.Collections.categories.fetch({
            cache: {
                name: "categories",
                validMinutes: 60
            },
            success: function() {
                Ti.API.info("loaded");
            }
        });
        Ti.App.addEventListener("categoryWindow:showSubCategories", showSubCategories);
        if (Alloy.Collections.categories.length > 0) {
            var rows = $.categories.data[0].rows;
            withblock && rows.length > 0 && blockCategories();
        }
        indicator.closeIndicator();
    }
    function showSubCategories(e) {
        indicator.openIndicator();
        var subCategoriesWindow = Alloy.createController("subCategories/index", {
            closeCallback: function(cid) {
                for (item in core.currentSectionCategories()) 0 == Object.size(core.currentSectionCategories()[item]) && delete core.currentSectionCategories()[item];
                if (cid) {
                    for (var i = 0; i < $.categories.data[0].rows.length; i++) {
                        var row = $.categories.data[0].rows[i];
                        if (row.children[0].categoryId == cid) {
                            var subcategories = Alloy.Collections.subCategories.where({
                                categoryId: cid
                            });
                            var selectedSubcategories = Alloy.Globals.core.currentSectionCategories()["_" + cid];
                            row.item.setIsChecked(selectedSubcategories, subcategories);
                            break;
                        }
                    }
                    withblock && blockCategories();
                }
            },
            categoryId: e.categoryId,
            categoryName: e.categoryName,
            sectionName: sectionName,
            win: win
        }).getView();
        indicator.closeIndicator();
        win.open(subCategoriesWindow);
    }
    function blockCategories() {
        if (!withblock) return;
        var start = 0;
        var hasChild = false;
        if (Alloy.Globals.core.currentSectionCategories()["_1"] && Object.size(Alloy.Globals.core.currentSectionCategories()["_1"]) > 0) {
            start = 1;
            hasChild = false;
        }
        if (!core.currentSectionCategories()["_1"] && 0 == Object.size(core.currentSectionCategories()["_1"]) && Object.size(core.currentSectionCategories()) > 0) {
            start = 1;
            var row = $.categories.data[0].rows[0];
            row.hasChild = false;
            row.children[0].color = "#c7c7c7";
            hasChild = true;
        } else if (0 == Object.size(core.currentSectionCategories())) {
            start = 0;
            hasChild = true;
        }
        for (var i = start; i < $.categories.data[0].rows.length; i++) {
            var row = $.categories.data[0].rows[i];
            row.hasChild = hasChild;
            row.children[0].color = hasChild ? "#007aff" : "#c7c7c7";
        }
    }
    function dataFilter(collection) {
        return forDeals ? collection.where({
            forDeals: true
        }) : forAdverts ? collection.where({
            forDeals: false
        }) : collection.models;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "categories/index";
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
        fullscreen: "true",
        titleid: "choose_category",
        id: "window"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    onClose ? $.__views.window.addEventListener("close", onClose) : __defers["$.__views.window!close!onClose"] = true;
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    $.__views.categories = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        top: "20dp",
        bottom: "20dp",
        id: "categories",
        separatorColor: "transparent"
    });
    $.__views.window.add($.__views.categories);
    var __alloyId165 = Alloy.Collections["categories"] || categories;
    __alloyId165.on("fetch destroy change add remove reset", __alloyId166);
    exports.destroy = function() {
        __alloyId165.off("fetch destroy change add remove reset", __alloyId166);
    };
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var win = args.win;
    var forDeals = args.forDeals || false;
    var forAdverts = args.forAdverts || false;
    var closeCallback = args.closeCallback || false;
    var sectionName = args.sectionName || false;
    var withblock = args.withblock || false;
    Alloy.Globals.core.currentSection = sectionName;
    var core = Alloy.Globals.core;
    var backButton = Ti.UI.createButton({
        title: L("ok")
    });
    backButton.addEventListener("click", function() {
        $.window.close();
    });
    $.window.setLeftNavButton(backButton);
    var indicator = Alloy.Globals.indicator;
    Ti.API.info("category opened");
    __defers["$.__views.window!close!onClose"] && $.__views.window.addEventListener("close", onClose);
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;