function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function blur(e) {
        hideKeyboard(e);
    }
    function hideKeyboard(e) {
        e.source.id !== $.subject.id && $.pickerWrap.removeAllChildren();
        e.source.id !== $.text.id && $.text.blur();
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function sendClick() {
        if (!$.text.value) {
            Alloy.Globals.core.showErrorDialog(L("complaint_requited"));
            return;
        }
        var toSupplierId = deal.supplierId;
        var fromUserId = Alloy.Globals.profile ? Alloy.Globals.profile.id : null;
        var text = $.text.value;
        var subject = $.subject.value;
        var complain = Alloy.createModel("complain", {
            toSupplierId: toSupplierId,
            fromUserId: fromUserId,
            subject: subject,
            DealId: deal.id,
            Text: text
        });
        indicator.openIndicator();
        complain.save({}, {
            success: function() {
                indicator.closeIndicator();
                dealWindow && dealWindow();
                $.complainwin.close();
                Alloy.Globals.core.showErrorDialog(L("complaint_sended"));
            },
            error: function(model, xhr) {
                indicator.closeIndicator();
                Alloy.Globals.core.showErrorDialog(xhr && xhr.Message ? xhr.Message : L("error"));
            }
        });
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        sendClick();
    }
    function clickSubject() {
        var subjectPicker = Alloy.createController("picker/genericPicker", {
            items: subjects,
            rowIndex: subjectRowIndex,
            callback: function(item, close, index) {
                $.subject.value = item.title ? item.title : item;
                index >= 0 && (subjectRowIndex = index);
                close && $.pickerWrap.removeAllChildren();
            }
        }).getView();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(subjectPicker);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "complaints/index";
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
    $.__views.complainwin = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "absolute",
        fullscreen: "true",
        id: "complainwin",
        titleid: "win_add_complaint"
    });
    $.__views.complainwin && $.addTopLevelView($.__views.complainwin);
    blur ? $.__views.complainwin.addEventListener("click", blur) : __defers["$.__views.complainwin!click!blur"] = true;
    $.__views.__alloyId167 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        top: "0",
        id: "__alloyId167"
    });
    $.__views.complainwin.add($.__views.__alloyId167);
    $.__views.__alloyId168 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId168"
    });
    $.__views.__alloyId167.add($.__views.__alloyId168);
    $.__views.subjectLbl = Ti.UI.createLabel({
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
        id: "subjectLbl",
        textid: "subject"
    });
    $.__views.__alloyId167.add($.__views.subjectLbl);
    $.__views.subject = Ti.UI.createTextField({
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
        id: "subject",
        enabled: "false"
    });
    $.__views.__alloyId167.add($.__views.subject);
    clickSubject ? $.__views.subject.addEventListener("click", clickSubject) : __defers["$.__views.subject!click!clickSubject"] = true;
    $.__views.__alloyId169 = Ti.UI.createLabel({
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
        textid: "complaint",
        id: "__alloyId169"
    });
    $.__views.__alloyId167.add($.__views.__alloyId169);
    $.__views.text = Ti.UI.createTextArea(function() {
        var o = {};
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            width: Alloy.Globals.Styles.inputWidth,
            height: Alloy.Globals.Styles.inputAreaHeight,
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
            id: "text"
        });
        return o;
    }());
    $.__views.__alloyId167.add($.__views.text);
    focus ? $.__views.text.addEventListener("focus", focus) : __defers["$.__views.text!focus!focus"] = true;
    $.__views.sendButton = Ti.UI.createButton({
        width: "120dp",
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
        id: "sendButton",
        titleid: "send"
    });
    $.__views.__alloyId167.add($.__views.sendButton);
    buttonTouchStart ? $.__views.sendButton.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.sendButton!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.sendButton.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.sendButton!touchend!buttonTouchEnd"] = true;
    $.__views.pickerWrap = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "pickerWrap"
    });
    $.__views.complainwin.add($.__views.pickerWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var subjects = [ {
        title: L("spam"),
        data: {
            id: 1
        }
    }, {
        title: L("not_relevant"),
        data: {
            id: 2
        }
    }, {
        title: L("misleading"),
        data: {
            id: 3
        }
    }, {
        title: L("not_real"),
        data: {
            id: 4
        }
    }, {
        title: L("other"),
        data: {
            id: 5
        }
    } ];
    $.subject.value = subjects[0].title;
    var dealWindow = arguments[0].dealWindow || false;
    var indicator = Alloy.Globals.indicator;
    var deal;
    try {
        deal = Alloy.Collections.publicDeals.where({
            id: arguments[0].id
        })[0].toJSON();
    } catch (e) {
        try {
            deal = Alloy.Collections.similarDeals.where({
                id: arguments[0].id
            })[0].toJSON();
        } catch (e) {
            deal = Alloy.Collections.homeDeals.where({
                id: arguments[0].id
            })[0].toJSON();
        }
    }
    var subjectRowIndex = 0;
    __defers["$.__views.complainwin!click!blur"] && $.__views.complainwin.addEventListener("click", blur);
    __defers["$.__views.subject!click!clickSubject"] && $.__views.subject.addEventListener("click", clickSubject);
    __defers["$.__views.text!focus!focus"] && $.__views.text.addEventListener("focus", focus);
    __defers["$.__views.sendButton!touchstart!buttonTouchStart"] && $.__views.sendButton.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.sendButton!touchend!buttonTouchEnd"] && $.__views.sendButton.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;