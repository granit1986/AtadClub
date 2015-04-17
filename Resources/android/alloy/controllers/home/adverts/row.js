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
            id: e.row.rowid
        }).getView();
        Alloy.CFG.tabHome.open(advertWindow);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/adverts/row";
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
    $.__views.row = Ti.UI.createTableViewRow({
        selectedBackgroundColor: Alloy.Globals.Styles.TableRowOnTapBg,
        hasChild: "true",
        layout: "absolute",
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    onClick ? $.__views.row.addEventListener("click", onClick) : __defers["$.__views.row!click!onClick"] = true;
    $.__views.advStatusWrap = Ti.UI.createView({
        id: "advStatusWrap",
        height: "0",
        top: "0"
    });
    $.__views.row.add($.__views.advStatusWrap);
    $.__views.advInfoWrap = Ti.UI.createView({
        id: "advInfoWrap",
        layout: "absolute",
        height: Ti.UI.SIZE,
        top: "0"
    });
    $.__views.row.add($.__views.advInfoWrap);
    $.__views.advImg = Alloy.createWidget("nl.fokkezb.cachedImageView", "widget", {
        width: "70dp",
        height: "70dp",
        left: Alloy.Globals.Styles.row_image,
        top: "19dp",
        bottom: "15dp",
        backgroundColor: "#fff",
        id: "advImg",
        __parentSymbol: $.__views.advInfoWrap
    });
    $.__views.advImg.setParent($.__views.advInfoWrap);
    $.__views.titleLbl = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            width: "180dp",
            height: "20dp",
            top: "15dp",
            right: Alloy.Globals.Styles.row_image,
            textAlign: Alloy.Globals.Styles.row_align,
            font: {
                fontSize: "15dp",
                fontFamily: "Avenir Next Condensed"
            },
            color: "#00a99d"
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.advert_row_price,
            right: Alloy.Globals.Styles.labelDefaultRow_right
        });
        _.extend(o, {
            id: "titleLbl"
        });
        return o;
    }());
    $.__views.advInfoWrap.add($.__views.titleLbl);
    $.__views.companyLbl = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            height: "20dp",
            top: "55dp",
            right: Alloy.Globals.Styles.row_image,
            font: {
                fontSize: "12dp",
                fontFamily: "Avenir Next Condensed"
            },
            color: "#555"
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.advert_row_price,
            right: Alloy.Globals.Styles.labelDefaultRow_right
        });
        _.extend(o, {
            id: "companyLbl"
        });
        return o;
    }());
    $.__views.advInfoWrap.add($.__views.companyLbl);
    $.__views.distanceLbl = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            height: "20dp",
            top: "75dp",
            right: Alloy.Globals.Styles.row_image,
            font: {
                fontSize: "12dp",
                fontFamily: "Avenir Next Condensed"
            },
            color: "#555"
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.advert_row_price,
            right: Alloy.Globals.Styles.labelDefaultRow_right
        });
        _.extend(o, {
            id: "distanceLbl"
        });
        return o;
    }());
    $.__views.advInfoWrap.add($.__views.distanceLbl);
    $.__views.priceLbl = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            height: "20dp",
            top: "67dp",
            left: Alloy.Globals.Styles.advert_row_price,
            textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
            font: {
                fontSize: "20dp",
                fontFamily: "Avenir Next Condensed"
            },
            color: "#a80062"
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.priceLbl_left,
            right: Alloy.Globals.Styles.priceLbl_right
        });
        _.extend(o, {
            id: "priceLbl"
        });
        return o;
    }());
    $.__views.advInfoWrap.add($.__views.priceLbl);
    $.__views.statusLbl = Ti.UI.createLabel({
        id: "statusLbl",
        visible: "false"
    });
    $.__views.advInfoWrap.add($.__views.statusLbl);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var model = args.model || false;
    if (model) {
        $.row.rowid = model.id;
        $.advImg.init({
            image: model.image
        });
        $.titleLbl.text = model.name;
        $.companyLbl.text = model.user;
        $.distanceLbl.text = model.distance;
        $.priceLbl.text = model.price;
        $.statusLbl.text = model.status;
    }
    if ($.statusLbl.text > 0) {
        var statusLabel = Ti.UI.createLabel({
            height: "30dp",
            left: "20dp",
            width: Ti.UI.FILL,
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            font: {
                fontSize: "16dp",
                fontFamily: "Avenir Next Condensed",
                fontWeight: "bold"
            }
        });
        if (1 == $.statusLbl.text) {
            statusLabel.text = L("Silver");
            statusLabel.color = "#c0c0c0";
        }
        if (3 == $.statusLbl.text) {
            statusLabel.text = L("Gold");
            statusLabel.color = "#ffd700";
        }
        $.advStatusWrap.height = 30;
        $.advInfoWrap.top = 5;
        $.advStatusWrap.add(statusLabel);
    }
    __defers["$.__views.row!click!onClick"] && $.__views.row.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;