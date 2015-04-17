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
        Alloy.CFG.tabHome.open(Alloy.createController("home/companies/company", {
            id: e.row.rowid
        }).getView());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/companies/row";
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
    $.__views.rowWrap = Ti.UI.createTableViewRow({
        selectedBackgroundColor: Alloy.Globals.Styles.TableRowOnTapBg,
        id: "rowWrap",
        height: Ti.UI.SIZE,
        hasChild: "true"
    });
    $.__views.rowWrap && $.addTopLevelView($.__views.rowWrap);
    onClick ? $.__views.rowWrap.addEventListener("click", onClick) : __defers["$.__views.rowWrap!click!onClick"] = true;
    $.__views.row_imageWrap = Ti.UI.createView({
        width: "70dp",
        height: "70dp",
        left: Alloy.Globals.Styles.row_imageWrapLeft,
        right: Alloy.Globals.Styles.row_imageWrapRight,
        id: "row_imageWrap",
        layout: "absolute"
    });
    $.__views.rowWrap.add($.__views.row_imageWrap);
    $.__views.companyImg = Ti.UI.createImageView({
        backgroundColor: "#fff",
        id: "companyImg"
    });
    $.__views.row_imageWrap.add($.__views.companyImg);
    $.__views.__alloyId221 = Ti.UI.createView({
        layout: "horizontal",
        height: Ti.UI.SIZE,
        top: "0",
        id: "__alloyId221"
    });
    $.__views.rowWrap.add($.__views.__alloyId221);
    $.__views.__alloyId222 = Ti.UI.createView({
        layout: "absolute",
        height: Ti.UI.SIZE,
        id: "__alloyId222"
    });
    $.__views.__alloyId221.add($.__views.__alloyId222);
    $.__views.titleLbl = Ti.UI.createLabel({
        width: "180dp",
        height: "20dp",
        top: "5dp",
        left: Alloy.Globals.Styles.account_labelLeft,
        right: Alloy.Globals.Styles.account_labelRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "18dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#007aff",
        id: "titleLbl"
    });
    $.__views.__alloyId222.add($.__views.titleLbl);
    $.__views.__alloyId223 = Ti.UI.createView({
        layout: "absolute",
        height: Ti.UI.SIZE,
        id: "__alloyId223"
    });
    $.__views.__alloyId221.add($.__views.__alloyId223);
    $.__views.addressLbl = Ti.UI.createLabel({
        width: "180dp",
        height: Ti.UI.SIZE,
        top: "10dp",
        left: Alloy.Globals.Styles.account_labelLeft,
        right: Alloy.Globals.Styles.account_labelRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "addressLbl"
    });
    $.__views.__alloyId223.add($.__views.addressLbl);
    $.__views.__alloyId224 = Ti.UI.createView({
        layout: "absolute",
        height: Ti.UI.SIZE,
        id: "__alloyId224"
    });
    $.__views.__alloyId221.add($.__views.__alloyId224);
    $.__views.categoriesLbl = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        top: "10dp",
        bottom: "5dp",
        left: Alloy.Globals.Styles.account_labelLeft,
        right: Alloy.Globals.Styles.account_labelRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "13dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "categoriesLbl"
    });
    $.__views.__alloyId224.add($.__views.categoriesLbl);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var model = args.model || false;
    if (model) {
        $.rowWrap.rowid = model.id;
        $.companyImg.image = model.logo;
        $.titleLbl.text = model.name;
        $.addressLbl.text = model.address;
        $.categoriesLbl.text = model.categories;
    }
    __defers["$.__views.rowWrap!click!onClick"] && $.__views.rowWrap.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;