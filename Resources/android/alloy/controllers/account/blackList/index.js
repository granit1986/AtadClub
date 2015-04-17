function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId50(e) {
        if (e && e.fromAdapter) return;
        __alloyId50.opts || {};
        var models = __alloyId49.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId46 = models[i];
            __alloyId46.__transform = {};
            var __alloyId48 = Alloy.createController("account/blackList/row", {
                $model: __alloyId46
            });
            rows.push(__alloyId48.getViewEx({
                recurse: true
            }));
        }
        $.__views.blackList.setData(rows);
    }
    function suppliersFetch() {
        blackList.fetch();
    }
    function removeSupplier(e) {
        var id = e.row.rowid;
        var item = blackList.get(id);
        item.destroy({
            success: function() {},
            error: function() {}
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/blackList/index";
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
        titleid: "black_list",
        fullscreen: "true"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.blackList = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        right: "20dp",
        left: "0dp",
        id: "blackList",
        separatorColor: "#ccc",
        editable: "true"
    });
    $.__views.window.add($.__views.blackList);
    var __alloyId49 = Alloy.Collections["blackList"] || blackList;
    __alloyId49.on("fetch destroy change add remove reset", __alloyId50);
    removeSupplier ? $.__views.blackList.addEventListener("delete", removeSupplier) : __defers["$.__views.blackList!delete!removeSupplier"] = true;
    exports.destroy = function() {
        __alloyId49.off("fetch destroy change add remove reset", __alloyId50);
    };
    _.extend($, $.__views);
    var blackList = Alloy.Collections.blackList;
    suppliersFetch();
    __defers["$.__views.blackList!delete!removeSupplier"] && $.__views.blackList.addEventListener("delete", removeSupplier);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;