function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId42(e) {
        if (e && e.fromAdapter) return;
        __alloyId42.opts || {};
        var models = __alloyId41.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId38 = models[i];
            __alloyId38.__transform = transform(__alloyId38);
            var __alloyId40 = Alloy.createController("account/answers/row", {
                $model: __alloyId38
            });
            rows.push(__alloyId40.getViewEx({
                recurse: true
            }));
        }
        $.__views.chats.setData(rows);
    }
    function fetch() {
        indicator.openIndicator();
        chats.fetch({
            success: function() {
                indicator.closeIndicator();
            },
            error: function() {
                indicator.closeIndicator();
            }
        });
    }
    function removeChat(e) {
        var item = chats.get(e.row.rowId);
        item.destroy({
            success: function() {},
            error: function() {}
        });
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.NewMessages > 0 && (transform.NewMessages = "+" + transform.NewMessages);
        return transform;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/answers/index";
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
        titleid: "my_answers"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.chats = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        separatorColor: "transparent",
        editable: "true",
        id: "chats"
    });
    $.__views.window.add($.__views.chats);
    var __alloyId41 = Alloy.Collections["chats"] || chats;
    __alloyId41.on("fetch destroy change add remove reset", __alloyId42);
    removeChat ? $.__views.chats.addEventListener("delete", removeChat) : __defers["$.__views.chats!delete!removeChat"] = true;
    exports.destroy = function() {
        __alloyId41.off("fetch destroy change add remove reset", __alloyId42);
    };
    _.extend($, $.__views);
    var indicator = Alloy.Globals.indicator;
    var chats = Alloy.Collections.chats;
    Ti.App.addEventListener("offers:update", function() {
        fetch();
    });
    fetch();
    __defers["$.__views.chats!delete!removeChat"] && $.__views.chats.addEventListener("delete", removeChat);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;