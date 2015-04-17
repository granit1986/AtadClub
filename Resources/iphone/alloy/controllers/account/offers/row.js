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
        var view = false;
        view = e.row.toUserId == Alloy.Globals.profile.id ? Alloy.createController("account/offers/offer", {
            offerId: e.row.rowId
        }).getView() : Alloy.createController("account/offers/myOffer", {
            offerId: e.row.rowId
        }).getView();
        Alloy.CFG.tabAccount.open(view);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/offers/row";
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
        selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY,
        toUserId: "undefined" != typeof $model.__transform["toUserId"] ? $model.__transform["toUserId"] : $model.get("toUserId"),
        rowId: "undefined" != typeof $model.__transform["id"] ? $model.__transform["id"] : $model.get("id"),
        hasChild: "true",
        id: "row",
        isReaded: "undefined" != typeof $model.__transform["isReaded"] ? $model.__transform["isReaded"] : $model.get("isReaded"),
        state: "undefined" != typeof $model.__transform["state"] ? $model.__transform["state"] : $model.get("state")
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    onClick ? $.__views.row.addEventListener("click", onClick) : __defers["$.__views.row!click!onClick"] = true;
    $.__views.advert = Ti.UI.createLabel({
        width: "180dp",
        height: "20dp",
        top: "15dp",
        left: Alloy.Globals.Styles.row_statusWrapLeft,
        right: Alloy.Globals.Styles.row_statusWrapRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#007aff",
        id: "advert",
        text: "undefined" != typeof $model.__transform["advert"] ? $model.__transform["advert"] : $model.get("advert")
    });
    $.__views.row.add($.__views.advert);
    $.__views.price = Ti.UI.createLabel({
        height: "20dp",
        top: "50dp",
        left: Alloy.Globals.Styles.row_statusWrapLeft,
        right: Alloy.Globals.Styles.row_statusWrapRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#a80062",
        id: "price",
        text: "undefined" != typeof $model.__transform["price"] ? $model.__transform["price"] : $model.get("price")
    });
    $.__views.row.add($.__views.price);
    $.__views.date = Ti.UI.createLabel({
        height: "20dp",
        top: "35dp",
        left: Alloy.Globals.Styles.row_statusWrapLeft,
        right: Alloy.Globals.Styles.row_statusWrapRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "14dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "date",
        text: "undefined" != typeof $model.__transform["date"] ? $model.__transform["date"] : $model.get("date")
    });
    $.__views.row.add($.__views.date);
    $.__views.img = Ti.UI.createImageView({
        width: "60dp",
        height: "60dp",
        right: "340dp",
        top: "15dp",
        bottom: "15dp",
        borderRadius: "30dp",
        id: "img",
        image: "undefined" != typeof $model.__transform["image"] ? $model.__transform["image"] : $model.get("image")
    });
    $.__views.row.add($.__views.img);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.row.toUserId !== Alloy.Globals.profile.id || $.row.isReaded || 1 !== $.row.state || ($.row.backgroundColor = "rgba(0,169,157,0.1)");
    $.row.toUserId === Alloy.Globals.profile.id || $.row.isReaded || 3 !== $.row.state && 4 !== $.row.state || ($.row.backgroundColor = "rgba(0,169,157,0.1)");
    __defers["$.__views.row!click!onClick"] && $.__views.row.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;