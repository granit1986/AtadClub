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
        var advertWindow = Alloy.createController("home/adverts/advert", {
            id: e.row.rowid,
            forEdit: true
        }).getView();
        Alloy.CFG.tabAccount.open(advertWindow);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/adverts/row";
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
    $.__views.dealRow_wrap = Ti.UI.createTableViewRow({
        selectedBackgroundColor: Alloy.Globals.Styles.TableRowOnTapBg,
        selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY,
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
    $.__views.dealImg = Alloy.createWidget("nl.fokkezb.cachedImageView", "widget", {
        width: "60dp",
        height: "60dp",
        backgroundColor: "#fff",
        id: "dealImg",
        __parentSymbol: $.__views.dealImg_wrap
    });
    $.__views.dealImg.setParent($.__views.dealImg_wrap);
    $.__views.__alloyId35 = Ti.UI.createView({
        layout: "horizontal",
        height: Ti.UI.SIZE,
        top: "0",
        id: "__alloyId35"
    });
    $.__views.dealRow_wrap.add($.__views.__alloyId35);
    $.__views.__alloyId36 = Ti.UI.createView({
        layout: "absolute",
        height: Ti.UI.SIZE,
        id: "__alloyId36"
    });
    $.__views.__alloyId35.add($.__views.__alloyId36);
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
        height: Ti.UI.SIZE
    });
    $.__views.__alloyId36.add($.__views.titleLbl);
    $.__views.__alloyId37 = Ti.UI.createView({
        layout: "absolute",
        top: "10dp",
        height: "60dp",
        id: "__alloyId37"
    });
    $.__views.__alloyId35.add($.__views.__alloyId37);
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
        id: "priceLbl"
    });
    $.__views.__alloyId37.add($.__views.priceLbl);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var model = args.model || false;
    if (model) {
        $.dealRow_wrap.rowid = model.id;
        $.dealImg.init({
            image: model.image
        });
        $.titleLbl.text = model.name;
        $.priceLbl.text = model.price;
    }
    __defers["$.__views.dealRow_wrap!click!onClick"] && $.__views.dealRow_wrap.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;