function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId106(e) {
        if (e && e.fromAdapter) return;
        __alloyId106.opts || {};
        var models = __alloyId105.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId102 = models[i];
            __alloyId102.__transform = transform(__alloyId102);
            var __alloyId104 = Alloy.createController("account/reports/row", {
                $model: __alloyId102,
                __parentSymbol: __parentSymbol
            });
            rows.push(__alloyId104.getViewEx({
                recurse: true
            }));
        }
        $.__views.deals.setData(rows);
    }
    function selectAll() {
        var rows = $.deals.data[0].rows;
        var length = rows.length;
        for (var i = 0; length > i; i++) {
            var row = rows[i];
            if (selectedAll) {
                row.hasCheck = false;
                length - 1 === i && (Alloy.Collections.selectedDeals = []);
            } else {
                row.hasCheck = true;
                Alloy.Collections.selectedDeals.push({
                    id: row.rowid,
                    title: row.dealTitle
                });
            }
        }
        selectedAll = !selectedAll;
    }
    function selectDeals() {
        var dealsCount = $.deals.data[0].rows.length;
        var selectedDealsCount = Alloy.Collections.selectedDeals.length;
        for (var i = 0; dealsCount > i; i++) {
            var row = $.deals.data[0].rows[i];
            for (var j = 0; selectedDealsCount > j; j++) {
                var selectedId = Alloy.Collections.selectedDeals[j].id;
                if (selectedId === row.rowid) {
                    row.hasCheck = true;
                    break;
                }
            }
        }
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.price = transform.currency + " " + transform.price;
        transform.images = transform.images && transform.images.length > 0 ? JSON.parse(transform.images) : [];
        transform.images.length > 0 && (transform.image = "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + transform.images[0] + Alloy.Globals.imageSizes.deal.row());
        return transform;
    }
    function close() {
        callback && callback();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/reports/deals";
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
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "vertical",
        id: "window",
        fullscreen: "true",
        titleid: "choose_deals"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.deals = Ti.UI.createTableView({
        backgroundColor: "transparent",
        id: "deals",
        separatorColor: "transparent"
    });
    $.__views.window.add($.__views.deals);
    var __alloyId105 = Alloy.Collections["deals"] || deals;
    __alloyId105.on("fetch destroy change add remove reset", __alloyId106);
    exports.destroy = function() {
        __alloyId105.off("fetch destroy change add remove reset", __alloyId106);
    };
    _.extend($, $.__views);
    var elements = Alloy.Collections.deals;
    var indicator = Alloy.Globals.indicator;
    var callback = arguments[0].callback || false;
    var selectedAll = false;
    indicator.openIndicator();
    var btn = Ti.UI.createButton({
        title: L("select_all")
    });
    $.window.setRightNavButton(btn);
    elements.fetch({
        success: function() {
            setTimeout(function() {
                indicator.closeIndicator();
                selectedAll = elements.length == Alloy.Collections.selectedDeals.length;
                selectDeals();
                btn.addEventListener("click", selectAll);
            }, 500);
        },
        error: function() {
            indicator.closeIndicator();
        }
    });
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;