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
        e.source.id !== $.message.id && $.message.blur();
        e.source.id !== $.contactName.id && $.contactName.blur();
        e.source.id !== $.contactPhone.id && $.contactPhone.blur();
        e.source.id !== $.contactMail.id && $.contactMail.blur();
    }
    function tabOpen() {
        if (Alloy.Globals.profile) {
            var profile = Alloy.Globals.profile;
            var name = "";
            profile.firstName && (name = profile.firstName);
            profile.lastName && (name = name.length > 0 ? name + " " + profile.lastName : profile.lastName);
            $.contactName.value = name;
            $.contactMail.value = profile.email;
            $.contactPhone.value = profile.phone;
        }
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        indicator.openIndicator();
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        e.source.id == $.send.id && send();
    }
    function send() {
        var contactUs = Alloy.createModel("contactUs", {
            subject: $.subject.value,
            message: $.message.value,
            name: $.contactName.value,
            email: $.contactMail.value,
            phone: $.contactPhone.value
        });
        if (contactUs.localValidate(errorHandler)) {
            contactUs.attributes["message"] = "Name: " + contactUs.attributes["name"] + "\nPhone: " + contactUs.attributes["phone"] + "\nEmail: " + contactUs.attributes["email"] + "\nMessage: " + contactUs.attributes["message"] + "\n" + L("version") + ": " + Ti.App.version;
            indicator.openIndicator();
            contactUs.save({}, {
                success: function() {
                    Alloy.Globals.core.showErrorDialog(L("success_contact_us"));
                    $.message.value = "";
                    indicator.closeIndicator();
                },
                error: function() {
                    indicator.closeIndicator();
                }
            });
        }
    }
    function errorHandler(err) {
        switch (err) {
          case errors.NO_MESSAGE:
            $.message.focus();
            break;

          case errors.NO_NAME:
            $.contactName.focus();
            break;

          case errors.NO_PHONE:
            $.contactPhone.focus();
            break;

          case errors.NO_EMAIL:
            $.contactMail.focus();
        }
        indicator.closeIndicator();
        Alloy.Globals.core.showError(err);
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
    this.__controllerPath = "contactUs/index";
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
    $.__views.index = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "absolute",
        fullscreen: "true",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    blur ? $.__views.index.addEventListener("click", blur) : __defers["$.__views.index!click!blur"] = true;
    $.__views.__alloyId170 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        top: "0",
        id: "__alloyId170"
    });
    $.__views.index.add($.__views.__alloyId170);
    $.__views.__alloyId171 = Ti.UI.createLabel({
        height: "80dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "win_contact_us",
        id: "__alloyId171"
    });
    $.__views.__alloyId170.add($.__views.__alloyId171);
    $.__views.contact_nameLbl = Ti.UI.createLabel({
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
        id: "contact_nameLbl",
        textid: "name"
    });
    $.__views.__alloyId170.add($.__views.contact_nameLbl);
    $.__views.contactName = Ti.UI.createTextField({
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
        id: "contactName",
        enabled: "true"
    });
    $.__views.__alloyId170.add($.__views.contactName);
    $.__views.contact_phoneLbl = Ti.UI.createLabel({
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
        id: "contact_phoneLbl",
        textid: "phone"
    });
    $.__views.__alloyId170.add($.__views.contact_phoneLbl);
    $.__views.contactPhone = Ti.UI.createTextField({
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
        id: "contactPhone",
        enabled: "true",
        keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
    });
    $.__views.__alloyId170.add($.__views.contactPhone);
    $.__views.contact_mailLbl = Ti.UI.createLabel({
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
        id: "contact_mailLbl",
        textid: "email"
    });
    $.__views.__alloyId170.add($.__views.contact_mailLbl);
    $.__views.contactMail = Ti.UI.createTextField({
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
        id: "contactMail",
        enabled: "true",
        keyboardType: Ti.UI.KEYBOARD_EMAIL
    });
    $.__views.__alloyId170.add($.__views.contactMail);
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
    $.__views.__alloyId170.add($.__views.subjectLbl);
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
    $.__views.__alloyId170.add($.__views.subject);
    clickSubject ? $.__views.subject.addEventListener("click", clickSubject) : __defers["$.__views.subject!click!clickSubject"] = true;
    $.__views.messageLbl = Ti.UI.createLabel({
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
        id: "messageLbl",
        textid: "message"
    });
    $.__views.__alloyId170.add($.__views.messageLbl);
    $.__views.message = Ti.UI.createTextArea(function() {
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
            id: "message",
            suppressReturn: "false",
            returnKeyType: Ti.UI.RETURNKEY_NEXT
        });
        return o;
    }());
    $.__views.__alloyId170.add($.__views.message);
    focus ? $.__views.message.addEventListener("focus", focus) : __defers["$.__views.message!focus!focus"] = true;
    $.__views.send = Ti.UI.createButton({
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
        id: "send",
        titleid: "send"
    });
    $.__views.__alloyId170.add($.__views.send);
    buttonTouchStart ? $.__views.send.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.send!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.send.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.send!touchend!buttonTouchEnd"] = true;
    $.__views.pickerWrap = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "pickerWrap"
    });
    $.__views.index.add($.__views.pickerWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.chat.openChatId = false;
    var subjects = [ {
        title: L("complaint"),
        data: {
            id: 1
        }
    }, {
        title: L("bug_report"),
        data: {
            id: 2
        }
    }, {
        title: L("investment"),
        data: {
            id: 3
        }
    }, {
        title: L("features_suggestion"),
        data: {
            id: 4
        }
    }, {
        title: L("improvement_suggestion"),
        data: {
            id: 5
        }
    }, {
        title: L("affiliate_request"),
        data: {
            id: 6
        }
    }, {
        title: L("blocked_account"),
        data: {
            id: 7
        }
    }, {
        title: L("other"),
        data: {
            id: 8
        }
    } ];
    $.subject.value = subjects[0].title;
    var blockedUser = false;
    var email;
    var indicator = Alloy.Globals.indicator;
    Ti.App.addEventListener("open:contactus", tabOpen);
    Ti.App.addEventListener("app:userblocked", function(data) {
        email = data.email;
        subjectRowIndex = 6;
        $.subject.value = subjects[6].title;
        blockedUser = true;
    });
    var subjectRowIndex = 0;
    __defers["$.__views.index!click!blur"] && $.__views.index.addEventListener("click", blur);
    __defers["$.__views.subject!click!clickSubject"] && $.__views.subject.addEventListener("click", clickSubject);
    __defers["$.__views.message!focus!focus"] && $.__views.message.addEventListener("focus", focus);
    __defers["$.__views.send!touchstart!buttonTouchStart"] && $.__views.send.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.send!touchend!buttonTouchEnd"] && $.__views.send.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;