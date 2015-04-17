function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        var id = e.source.id;
        switch (id) {
          case "deals":
            openDeals();
            break;

          case "send":
            send();
        }
    }
    function openDeals() {
        var view = Alloy.createController("account/reports/deals", {
            callback: function() {
                var selectedDeals = Alloy.Collections.selectedDeals;
                if (selectedDeals) {
                    $.selectedCategories.text = "";
                    for (var i = 0; i < selectedDeals.length; i++) {
                        var deal = selectedDeals[i];
                        $.selectedCategories.text += "" === $.selectedCategories.text ? deal.title : ", " + deal.title;
                    }
                }
            }
        }).getView();
        Alloy.Globals.tabGroup.activeTab.open(view);
    }
    function send() {
        if (0 == Alloy.Collections.selectedDeals.length) {
            Alloy.Globals.core.showErrorDialog(L("choose_deals"));
            return;
        }
        indicator.openIndicator();
        var items = [];
        for (var i = 0; i < Alloy.Collections.selectedDeals.length; i++) {
            var deal = Alloy.Collections.selectedDeals[i];
            items.push(deal.id);
        }
        var report = Alloy.createModel("report", {
            items: items,
            from: startDate,
            to: endDate
        });
        report.localValidate(errorHandler) ? report.save({}, {
            success: function(model, response) {
                indicator.closeIndicator();
                Alloy.Globals.core.showErrorDialog(L(response));
            },
            error: function(xhr) {
                indicator.closeIndicator();
                xhr && xhr.Message && Alloy.Globals.core.showErrorDialog(L(xhr.Message));
            }
        }) : indicator.closeIndicator();
    }
    function errorHandler(err) {
        Alloy.Globals.core.showError(err);
    }
    function setStartDate() {
        var datePicker = Alloy.createController("picker/date", {
            minDate: new Date(2014, 7, 1, 0, 0, 0, 0),
            callback: function(datePost, close) {
                startDate = datePost;
                $.startDate.value = datePost.toLocaleDateString();
                close && $.pickerWrap.removeAllChildren();
            }
        }).getView();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(datePicker);
    }
    function setEndDate() {
        var datePicker = Alloy.createController("picker/date", {
            minDate: new Date(2014, 7, 1, 0, 0, 0, 0),
            callback: function(datePost, close) {
                endDate = datePost;
                $.endDate.value = datePost.toLocaleDateString();
                close && $.pickerWrap.removeAllChildren();
            }
        }).getView();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(datePicker);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/reports/index";
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
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "absolute",
        id: "window",
        titleid: "best_deals"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.__alloyId107 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "__alloyId107"
    });
    $.__views.window.add($.__views.__alloyId107);
    $.__views.__alloyId108 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId108"
    });
    $.__views.__alloyId107.add($.__views.__alloyId108);
    $.__views.__alloyId109 = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "deals",
        id: "__alloyId109"
    });
    $.__views.__alloyId107.add($.__views.__alloyId109);
    $.__views.deals = Ti.UI.createButton({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        textAlign: "left",
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        title: "",
        id: "deals"
    });
    $.__views.__alloyId107.add($.__views.deals);
    openDeals ? $.__views.deals.addEventListener("click", openDeals) : __defers["$.__views.deals!click!openDeals"] = true;
    $.__views.__alloyId110 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        left: "5dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        textid: "select_category",
        id: "__alloyId110"
    });
    $.__views.deals.add($.__views.__alloyId110);
    $.__views.selectedCategories = Ti.UI.createLabel({
        height: "20dp",
        left: "52dp",
        right: "15dp",
        top: "7dp",
        color: "#aaa",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "12dp",
            fontFamily: "Arial"
        },
        id: "selectedCategories"
    });
    $.__views.deals.add($.__views.selectedCategories);
    $.__views.__alloyId111 = Ti.UI.createLabel({
        width: "20dp",
        height: "20dp",
        right: "5dp",
        top: "5dp",
        backgroundImage: "images/icon_listItem.png",
        backgroundRepeat: false,
        id: "__alloyId111"
    });
    $.__views.deals.add($.__views.__alloyId111);
    $.__views.__alloyId112 = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "start_date",
        id: "__alloyId112"
    });
    $.__views.__alloyId107.add($.__views.__alloyId112);
    $.__views.startDate = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "startDate",
        enabled: "false"
    });
    $.__views.__alloyId107.add($.__views.startDate);
    setStartDate ? $.__views.startDate.addEventListener("click", setStartDate) : __defers["$.__views.startDate!click!setStartDate"] = true;
    $.__views.__alloyId113 = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "finish_date",
        id: "__alloyId113"
    });
    $.__views.__alloyId107.add($.__views.__alloyId113);
    $.__views.endDate = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "endDate",
        enabled: "false"
    });
    $.__views.__alloyId107.add($.__views.endDate);
    setEndDate ? $.__views.endDate.addEventListener("click", setEndDate) : __defers["$.__views.endDate!click!setEndDate"] = true;
    $.__views.__alloyId114 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId114"
    });
    $.__views.__alloyId107.add($.__views.__alloyId114);
    $.__views.send = Ti.UI.createButton({
        width: "180dp",
        height: "40dp",
        bottom: "20dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        id: "send",
        titleid: "send_to_email"
    });
    $.__views.__alloyId107.add($.__views.send);
    buttonTouchStart ? $.__views.send.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.send!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.send.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.send!touchend!buttonTouchEnd"] = true;
    $.__views.pickerWrap = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "pickerWrap"
    });
    $.__views.window.add($.__views.pickerWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var startDate = "", endDate = "";
    Alloy.Collections.selectedDeals = [];
    var indicator = Alloy.Globals.indicator;
    __defers["$.__views.deals!click!openDeals"] && $.__views.deals.addEventListener("click", openDeals);
    __defers["$.__views.startDate!click!setStartDate"] && $.__views.startDate.addEventListener("click", setStartDate);
    __defers["$.__views.endDate!click!setEndDate"] && $.__views.endDate.addEventListener("click", setEndDate);
    __defers["$.__views.send!touchstart!buttonTouchStart"] && $.__views.send.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.send!touchend!buttonTouchEnd"] && $.__views.send.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;