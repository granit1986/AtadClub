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
        if (this.hasCheck) Alloy.Collections.selectedDeals.push({
            id: this.rowid,
            title: $.titleLbl.text
        }); else {
            var id = this.rowid;
            Alloy.Collections.selectedDeals = Alloy.Collections.selectedDeals.filter(function(item) {
                return item.id !== id;
            });
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/reports/row";
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
        selectionStyle: "none",
        hasChild: "false",
        dealTitle: "undefined" != typeof $model.__transform["name"] ? $model.__transform["name"] : $model.get("name"),
        rowid: "undefined" != typeof $model.__transform["id"] ? $model.__transform["id"] : $model.get("id"),
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    onClick ? $.__views.row.addEventListener("click", onClick) : __defers["$.__views.row!click!onClick"] = true;
    $.__views.dealImg = Ti.UI.createImageView({
        width: "60dp",
        height: "60dp",
        left: "30dp",
        top: "15dp",
        bottom: "15dp",
        backgroundColor: "#fff",
        id: "dealImg",
        image: "undefined" != typeof $model.__transform["image"] ? $model.__transform["image"] : $model.get("image")
    });
    $.__views.row.add($.__views.dealImg);
    $.__views.titleLbl = Ti.UI.createLabel({
        width: "180dp",
        height: "20dp",
        top: "15dp",
        left: "110dp",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#007aff",
        id: "titleLbl",
        text: "undefined" != typeof $model.__transform["name"] ? $model.__transform["name"] : $model.get("name")
    });
    $.__views.row.add($.__views.titleLbl);
    $.__views.priceLbl = Ti.UI.createLabel({
        height: "20dp",
        top: "50dp",
        left: "110dp",
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#a80062",
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