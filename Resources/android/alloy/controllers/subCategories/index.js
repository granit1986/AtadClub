function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId355(e) {
        if (e && e.fromAdapter) return;
        __alloyId355.opts || {};
        var models = categoryFilter(__alloyId354);
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId351 = models[i];
            __alloyId351.__transform = {};
            var __alloyId353 = Alloy.createController("subCategories/row", {
                $model: __alloyId351
            });
            rows.push(__alloyId353.getViewEx({
                recurse: true
            }));
        }
        $.__views.categories.setData(rows);
    }
    function open() {
        indicator.openIndicator();
        $.window.title = categoryName;
        Alloy.Collections.subCategories.fetch({
            cache: {
                name: "subCategories",
                validMinutes: 60
            },
            success: function() {
                var subcategoriesCount = Alloy.Collections.subCategories.where({
                    categoryId: categoryId
                }).length;
                var category = Alloy.Globals.core.currentSectionCategories()["_" + categoryId];
                category && subcategoriesCount == Object.size(category) && (selectAll = false);
                btnNew.addEventListener("click", function() {
                    if (selectAll) {
                        for (var i = 0; i < _items.length; i++) {
                            var item = _items[i];
                            var row = $.categories.data[0].rows[i];
                            if (!core.subCategories.selected({
                                categoryId: item.attributes["categoryId"],
                                id: item.id
                            }, Alloy.Globals.core.currentSectionCategories())) {
                                core.subCategories.select({
                                    categoryId: item.attributes["categoryId"],
                                    id: item.id
                                }, Alloy.Globals.core.currentSectionCategories());
                                row.hasCheck = true;
                            }
                        }
                        selectAll = false;
                    } else {
                        for (var i = 0; i < _items.length; i++) {
                            var item = _items[i];
                            var row = $.categories.data[0].rows[i];
                            if (core.subCategories.selected({
                                categoryId: item.attributes["categoryId"],
                                id: item.id
                            }, Alloy.Globals.core.currentSectionCategories())) {
                                core.subCategories.clear({
                                    categoryId: item.attributes["categoryId"],
                                    id: item.id
                                }, Alloy.Globals.core.currentSectionCategories());
                                row.hasCheck = false;
                            }
                        }
                        selectAll = true;
                    }
                });
            },
            error: function() {
                indicator.closeIndicator();
                Alloy.Globals.core.showErrorDialog(L("xhr_error"));
            }
        });
    }
    function categoryFilter(collection) {
        _items = collection.where({
            categoryId: categoryId
        });
        indicator.closeIndicator();
        return _items;
    }
    function onClose() {
        closeCallback && closeCallback(categoryId);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "subCategories/index";
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
        fullscreen: "true"
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
    var __alloyId354 = Alloy.Collections["subCategories"] || subCategories;
    __alloyId354.on("fetch destroy change add remove reset", __alloyId355);
    exports.destroy = function() {
        __alloyId354.off("fetch destroy change add remove reset", __alloyId355);
    };
    _.extend($, $.__views);
    var categoryId = arguments[0].categoryId;
    var categoryName = arguments[0].categoryName;
    var closeCallback = arguments[0].closeCallback || null;
    var sectionName = arguments[0].sectionName || null;
    arguments[0].win || null;
    var core = Alloy.Globals.core;
    core.currentSection = sectionName;
    var selectAll = true;
    var btnNew = Ti.UI.createButton({
        titleid: "select_all"
    });
    $.window.setRightNavButton(btnNew);
    var indicator = Alloy.Globals.indicator;
    var _items;
    __defers["$.__views.window!close!onClose"] && $.__views.window.addEventListener("close", onClose);
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;