function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function onClick(e) {
        var productWindow = Alloy.createController("account/products/display", {
            productId: e.row.rowid,
            forEdit: true
        }).getView();
        Alloy.CFG.tabAccount.open(productWindow);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/products/row";
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
    $.__views.dealRow_wrap = Ti.UI.createTableViewRow({
        selectedBackgroundColor: Alloy.Globals.Styles.TableRowOnTapBg,
        selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY,
        rowid: "undefined" != typeof $model.__transform["id"] ? $model.__transform["id"] : $model.get("id"),
        id: "dealRow_wrap",
        height: Ti.UI.SIZE,
        hasChild: "true"
    });
    $.__views.dealRow_wrap && $.addTopLevelView($.__views.dealRow_wrap);
    onClick ? $.__views.dealRow_wrap.addEventListener("click", onClick) : __defers["$.__views.dealRow_wrap!click!onClick"] = true;
    $.__views.dealImg_wrap = Ti.UI.createView({
        height: "60dp",
        width: "60dp",
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        id: "dealImg_wrap",
        layout: "absolute"
    });
    $.__views.dealRow_wrap.add($.__views.dealImg_wrap);
    $.__views.dealImg = Ti.UI.createImageView({
        width: "60dp",
        height: "60dp",
        backgroundColor: "#fff",
        id: "dealImg",
        image: "undefined" != typeof $model.__transform["image"] ? $model.__transform["image"] : $model.get("image")
    });
    $.__views.dealImg_wrap.add($.__views.dealImg);
    $.__views.__alloyId94 = Ti.UI.createView({
        layout: "horizontal",
        height: Ti.UI.SIZE,
        top: "10dp",
        id: "__alloyId94"
    });
    $.__views.dealRow_wrap.add($.__views.__alloyId94);
    $.__views.__alloyId95 = Ti.UI.createView({
        layout: "absolute",
        height: Ti.UI.SIZE,
        id: "__alloyId95"
    });
    $.__views.__alloyId94.add($.__views.__alloyId95);
    $.__views.titleLbl = Ti.UI.createLabel({
        width: "180dp",
        top: "0",
        left: Alloy.Globals.Styles.account_labelLeft,
        right: Alloy.Globals.Styles.account_labelRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#007aff",
        id: "titleLbl",
        text: "undefined" != typeof $model.__transform["name"] ? $model.__transform["name"] : $model.get("name"),
        height: Ti.UI.SIZE
    });
    $.__views.__alloyId95.add($.__views.titleLbl);
    $.__views.__alloyId96 = Ti.UI.createView({
        layout: "absolute",
        top: "10dp",
        height: "60dp",
        id: "__alloyId96"
    });
    $.__views.__alloyId94.add($.__views.__alloyId96);
    $.__views.priceLbl = Ti.UI.createLabel({
        height: "20dp",
        top: "-5dp",
        left: Alloy.Globals.Styles.account_labelLeft,
        right: Alloy.Globals.Styles.account_labelRight,
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#a80062",
        id: "priceLbl",
        text: "undefined" != typeof $model.__transform["price"] ? $model.__transform["price"] : $model.get("price")
    });
    $.__views.__alloyId96.add($.__views.priceLbl);
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.dealRow_wrap!click!onClick"] && $.__views.dealRow_wrap.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;