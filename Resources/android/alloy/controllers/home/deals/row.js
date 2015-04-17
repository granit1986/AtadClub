function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function dealClick(e) {
        var view = Alloy.createController("home/deals/deal", {
            id: e.row.rowid,
            lat: e.row.lat,
            lng: e.row.lng,
            backButtonTitle: "back_to_search_result",
            callback: function(e) {
                e && Ti.App.fireEvent("supplierWindow:blocked");
            }
        }).getView();
        Alloy.CFG.tabHome.open(view);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/deals/row";
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
        hasChild: "true",
        className: "rowClassName"
    });
    $.__views.rowWrap && $.addTopLevelView($.__views.rowWrap);
    dealClick ? $.__views.rowWrap.addEventListener("click", dealClick) : __defers["$.__views.rowWrap!click!dealClick"] = true;
    $.__views.row_imageWrap = Ti.UI.createView({
        width: "100dp",
        height: "140dp",
        left: Alloy.Globals.Styles.row_image,
        layout: "absolute",
        id: "row_imageWrap"
    });
    $.__views.rowWrap.add($.__views.row_imageWrap);
    $.__views.dealStatusWrap = Ti.UI.createView({
        width: "90dp",
        id: "dealStatusWrap",
        height: "0",
        top: "0"
    });
    $.__views.row_imageWrap.add($.__views.dealStatusWrap);
    $.__views.dealImg = Alloy.createWidget("nl.fokkezb.cachedImageView", "widget", {
        width: "100dp",
        height: "100dp",
        backgroundColor: "#fff",
        id: "dealImg",
        __parentSymbol: $.__views.row_imageWrap
    });
    $.__views.dealImg.setParent($.__views.row_imageWrap);
    $.__views.raitingStars = Ti.UI.createView({
        width: "70dp",
        height: "13dp",
        left: Alloy.Globals.Styles.row_statusLbl_left,
        right: Alloy.Globals.Styles.row_statusLbl_right,
        backgroundRepear: false,
        id: "raitingStars",
        bottom: "5dp",
        backgroundImage: "images/rate_5.png"
    });
    $.__views.row_imageWrap.add($.__views.raitingStars);
    $.__views.votesLbl = Ti.UI.createLabel({
        height: "20dp",
        left: Alloy.Globals.Styles.tooltipLeft,
        right: Alloy.Globals.Styles.tooltipRight,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "12dp"
        },
        color: "#555",
        id: "votesLbl",
        bottom: "2dp"
    });
    $.__views.row_imageWrap.add($.__views.votesLbl);
    $.__views.__alloyId240 = Ti.UI.createView({
        layout: "absolute",
        height: "30dp",
        id: "__alloyId240"
    });
    $.__views.rowWrap.add($.__views.__alloyId240);
    $.__views.statusLbl = Ti.UI.createLabel({
        id: "statusLbl",
        visible: "false"
    });
    $.__views.__alloyId240.add($.__views.statusLbl);
    $.__views.raitingLbl = Ti.UI.createLabel({
        id: "raitingLbl",
        visible: "false"
    });
    $.__views.__alloyId240.add($.__views.raitingLbl);
    $.__views.dealInfoWrap = Ti.UI.createView({
        id: "dealInfoWrap",
        layout: "horizontal",
        height: Ti.UI.SIZE,
        top: "0"
    });
    $.__views.rowWrap.add($.__views.dealInfoWrap);
    $.__views.__alloyId241 = Ti.UI.createView({
        layout: "absolute",
        height: Ti.UI.SIZE,
        id: "__alloyId241"
    });
    $.__views.dealInfoWrap.add($.__views.__alloyId241);
    $.__views.titleLbl = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            width: "180dp",
            top: "10dp",
            right: Alloy.Globals.Styles.row_image,
            textAlign: Alloy.Globals.Styles.row_align,
            font: {
                fontSize: "15dp",
                fontFamily: "Avenir Next Condensed"
            },
            color: "#007aff"
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.labelDefaultRow_left,
            right: Alloy.Globals.Styles.labelDefaultRow_right
        });
        _.extend(o, {
            id: "titleLbl",
            height: Ti.UI.SIZE
        });
        return o;
    }());
    $.__views.__alloyId241.add($.__views.titleLbl);
    $.__views.__alloyId242 = Ti.UI.createView({
        layout: "absolute",
        height: "30dp",
        id: "__alloyId242"
    });
    $.__views.dealInfoWrap.add($.__views.__alloyId242);
    $.__views.companyLbl = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            width: "auto",
            height: "20dp",
            top: "2dp",
            right: Alloy.Globals.Styles.row_image,
            font: {
                fontSize: "12dp",
                fontFamily: "Avenir Next Condensed"
            },
            color: "#555"
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.labelDefaultRow_left,
            right: Alloy.Globals.Styles.labelDefaultRow_right
        });
        _.extend(o, {
            id: "companyLbl"
        });
        return o;
    }());
    $.__views.__alloyId242.add($.__views.companyLbl);
    $.__views.dealTypeLbl = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            height: "20dp",
            top: "0dp",
            left: Alloy.Globals.Styles.row_price,
            textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
            font: {
                fontSize: "15dp",
                fontFamily: "Avenir Next Condensed"
            },
            color: "#a80062"
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.dealTypeLbl_left,
            right: Alloy.Globals.Styles.dealTypeLbl_right
        });
        _.extend(o, {
            id: "dealTypeLbl"
        });
        return o;
    }());
    $.__views.__alloyId242.add($.__views.dealTypeLbl);
    $.__views.__alloyId243 = Ti.UI.createView({
        layout: "absolute",
        height: "30dp",
        id: "__alloyId243"
    });
    $.__views.dealInfoWrap.add($.__views.__alloyId243);
    $.__views.distanceLbl = Ti.UI.createLabel({
        height: "20dp",
        width: "0",
        top: "10dp",
        font: {
            fontSize: "12dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "distanceLbl",
        textid: "distance"
    });
    $.__views.__alloyId243.add($.__views.distanceLbl);
    $.__views.distanceVal = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            height: "20dp",
            top: "0dp",
            right: Alloy.Globals.Styles.row_image,
            font: {
                fontSize: "12dp",
                fontFamily: "Avenir Next Condensed"
            },
            color: "#555"
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.labelDefaultRow_left,
            right: Alloy.Globals.Styles.labelDefaultRow_right
        });
        _.extend(o, {
            id: "distanceVal"
        });
        return o;
    }());
    $.__views.__alloyId243.add($.__views.distanceVal);
    $.__views.priceLbl = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            height: "20dp",
            top: "-6dp",
            left: Alloy.Globals.Styles.row_price,
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
    $.__views.__alloyId243.add($.__views.priceLbl);
    $.__views.__alloyId244 = Ti.UI.createView({
        height: "30dp",
        top: "-15dp",
        layout: "absolute",
        id: "__alloyId244"
    });
    $.__views.dealInfoWrap.add($.__views.__alloyId244);
    $.__views.endTimeLbl = Ti.UI.createLabel({
        height: "20dp",
        top: "10dp",
        left: Alloy.Globals.Styles.labelDefaultRow_left,
        right: Alloy.Globals.Styles.row_imageWrapRight,
        font: {
            fontSize: "12dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "endTimeLbl",
        textid: "end_time",
        visible: "false"
    });
    $.__views.__alloyId244.add($.__views.endTimeLbl);
    $.__views.endTimeVal = Ti.UI.createLabel({
        height: "20dp",
        top: "10dp",
        left: Alloy.Globals.Styles.endTimeVal_left,
        right: Alloy.Globals.Styles.campaignRating_left,
        font: {
            fontSize: "12dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "endTimeVal"
    });
    $.__views.__alloyId244.add($.__views.endTimeVal);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var model = args.model || false;
    if (model) {
        $.rowWrap.rowid = model.id;
        $.rowWrap.lat = model.myLat;
        $.rowWrap.lng = model.myLng;
        $.dealImg.init({
            image: model.image
        });
        $.statusLbl.text = model.status;
        $.raitingLbl.text = model.rating;
        $.titleLbl.text = model.name;
        $.companyLbl.text = model.supplierName;
        $.dealTypeLbl.text = model.dealtype;
        $.distanceVal.text = model.distance;
        $.priceLbl.text = model.price;
        $.endTimeVal.text = model.endTime;
        $.votesLbl.text = model.votes;
    }
    null != $.endTimeVal.text && $.endTimeVal.text.length > 0 && ($.endTimeLbl.visible = true);
    $.raitingStars.backgroundImage = "images/rate_" + $.raitingLbl.text + ".png";
    if ($.statusLbl.text > 0) {
        var statusLabel = Ti.UI.createLabel({
            height: "25dp",
            left: "0",
            width: Ti.UI.FILL,
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            font: {
                fontSize: "16dp",
                fontFamily: "Avenir Next Condensed",
                fontWeight: "bold"
            }
        });
        if (1 == $.statusLbl.text) {
            statusLabel.text = "Silver";
            statusLabel.color = "#c0c0c0";
        }
        if (2 == $.statusLbl.text) {
            statusLabel.text = "Gold";
            statusLabel.color = "#ffd700";
        }
        $.dealStatusWrap.height = 25;
        $.dealStatusWrap.add(statusLabel);
        $.row_imageWrap.height = 140;
        $.dealImg.top = 20;
    }
    __defers["$.__views.rowWrap!click!dealClick"] && $.__views.rowWrap.addEventListener("click", dealClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;