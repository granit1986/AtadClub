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
        e.source.id !== $.login.id && $.login.blur();
        e.source.id !== $.password.id && $.password.blur();
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = "facebookSignIn" === e.source.id ? "#193776" : Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        indicator.openIndicator();
        e.source.backgroundColor = "facebookSignIn" === e.source.id ? "#3b5998" : Alloy.Globals.Styles.buttonBg;
        authorize(e);
    }
    function linkTouchStart(e) {
        e.source.color = "#008aa9";
    }
    function linkTouchEnd(e) {
        indicator.openIndicator();
        e.source.color = "#00accb";
        "resetPassword" == e.source.id && resetPassword();
    }
    function contactClick() {
        var email = $.login.value;
        Ti.App.fireEvent("app:userblocked", {
            email: email
        });
        Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabContact);
        $.sendAdmin.visible = false;
        $.sendAdmin.height = 0;
    }
    function authorize(e) {
        switch (e.source.id) {
          case "facebookSignIn":
            dofacebookSignIn();
            break;

          case "signIn":
            doSignIn(e);
            break;

          case "signUp":
            showSignUp(e);
        }
    }
    function chooseCurrency() {
        var modal = Ti.UI.createWindow({
            top: 0,
            left: 0,
            layout: "absolute",
            backgroundColor: "rgba(255,255,255,0.7)"
        });
        var pickerWrap = Ti.UI.createView({
            layout: "vertical",
            width: Ti.UI.FILL,
            height: Ti.UI.SIZE,
            bottom: "0"
        });
        var currencyItems = Alloy.Globals.core.currencyItems;
        var currencyRowIndex = 0;
        var currencyPicker = Alloy.createController("picker/genericPicker", {
            items: currencyItems,
            rowIndex: currencyRowIndex,
            callback: function(item, close) {
                item.data && (currency = item.data.id);
                if (close) {
                    Alloy.Globals.profile.supplier && Ti.App.fireEvent("account:itIsSupplier");
                    Alloy.Globals.chat.openConnect();
                    modal.close();
                    profile.set("currencyCode", currency);
                    profile.save({}, {});
                }
            }
        }).getView();
        pickerWrap.add(currencyPicker);
        modal.add(pickerWrap);
        modal.open();
    }
    function resetPassword() {
        var reset = Alloy.createModel("reset", {
            email: $.login.value
        });
        reset.localValidate(errorHandler) && reset.save({}, {
            success: function(model, responce) {
                Alloy.Globals.core.showErrorDialog(L(responce));
                indicator.closeIndicator();
                $.resetPasswordWrap.visible = false;
                $.resetPasswordWrap.height = 0;
            },
            error: function(model, xhr) {
                xhr && xhr.Message && Alloy.Globals.core.showErrorDialog(L(xhr.Message));
                indicator.closeIndicator();
            }
        });
    }
    function dofacebookSignIn() {
        Ti.Facebook.appid = "1437623056473639";
        Ti.Facebook.permissions = [ "publish_stream", "offline_access", "email" ];
        Ti.Facebook.addEventListener("login", facebookLogin);
        Ti.Facebook.authorize();
    }
    function facebookLogin(e) {
        if (e.success) {
            e.data.email || (e.data.email = e.data.username + "@facebook.com");
            signFacebook(e.data);
        } else if (e.error) {
            Alloy.Globals.core.showErrorDialog(e.error);
            indicator.closeIndicator();
        } else if (e.cancelled) {
            Alloy.Globals.core.showErrorDialog("Canceled");
            indicator.closeIndicator();
        }
        Ti.Facebook.removeEventListener("login", facebookLogin);
    }
    function doSignIn() {
        var signin = Alloy.createModel("signin", {
            login: $.login.value,
            password: $.password.value,
            appInstallId: Alloy.Globals.core.installId,
            appVersion: Ti.App.version,
            platformModel: Ti.Platform.model,
            platformVersion: Ti.Platform.version,
            platformOSName: "android",
            language: Ti.Locale.currentLanguage
        });
        signin.localValidate(errorHandler) && signin.save({}, {
            success: function(model, response) {
                $.sendAdmin.visible = false;
                $.sendAdmin.height = 0;
                Alloy.Globals.core.apiToken(response.UUID);
                indicator.closeIndicator();
                $.resetPasswordWrap.visible = false;
                $.resetPasswordWrap.height = 0;
                Ti.App.fireEvent("account:updateProfile");
                Alloy.Collections.adverts = Alloy.createCollection("advert");
                Ti.App.fireEvent("account:showAccount");
            },
            error: function(model, xhr) {
                indicator.closeIndicator();
                if (xhr && xhr.Message) {
                    Alloy.Globals.core.showErrorDialog(L(xhr.Message));
                    $.resetPasswordWrap.visible = true;
                    $.resetPasswordWrap.height = Ti.UI.SIZE;
                } else if (xhr && !xhr.blocked) Alloy.Globals.core.showErrorDialog(L("not_signed")); else if (xhr && xhr.blocked) {
                    $.sendAdmin.visible = true;
                    $.sendAdmin.height = Ti.UI.SIZE;
                }
            }
        });
    }
    function errorHandler(err) {
        switch (err) {
          case errors.NO_EMAIL:
          case errors.INVALID_EMAIL:
            $.login.focus();
            break;

          case errors.NO_PASSWORD:
            $.password.focus();
            break;

          case errors.NOT_SIGNED:
            $.login.focus();
        }
        indicator.closeIndicator();
        Alloy.Globals.core.showError(err);
    }
    function showSignUp() {
        Ti.App.fireEvent("account:showSignUp");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/sign/in_";
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
    $.__views.in_ = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "in_"
    });
    $.__views.in_ && $.addTopLevelView($.__views.in_);
    blur ? $.__views.in_.addEventListener("click", blur) : __defers["$.__views.in_!click!blur"] = true;
    $.__views.__alloyId115 = Ti.UI.createLabel({
        height: "80dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "signin",
        id: "__alloyId115"
    });
    $.__views.in_.add($.__views.__alloyId115);
    $.__views.loginLbl = Ti.UI.createLabel({
        width: "95dp",
        height: Ti.UI.SIZE,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "loginLbl",
        textid: "login"
    });
    $.__views.in_.add($.__views.loginLbl);
    $.__views.login = Ti.UI.createTextField({
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
        id: "login",
        keyboardType: Ti.UI.KEYBOARD_EMAIL
    });
    $.__views.in_.add($.__views.login);
    focus ? $.__views.login.addEventListener("focus", focus) : __defers["$.__views.login!focus!focus"] = true;
    $.__views.passwordLbl = Ti.UI.createLabel({
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
        id: "passwordLbl",
        textid: "password"
    });
    $.__views.in_.add($.__views.passwordLbl);
    $.__views.password = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "0",
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
        id: "password",
        passwordMask: "true"
    });
    $.__views.in_.add($.__views.password);
    focus ? $.__views.password.addEventListener("focus", focus) : __defers["$.__views.password!focus!focus"] = true;
    $.__views.resetPasswordWrap = Ti.UI.createView({
        id: "resetPasswordWrap",
        height: "0",
        visible: "false",
        layout: "vertical"
    });
    $.__views.in_.add($.__views.resetPasswordWrap);
    $.__views.__alloyId116 = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "15dp",
        textAlign: Alloy.Globals.Styles.imageSelectTipTextAlign,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#555",
        text: "That's not the right password.",
        textid: "not_right_pass",
        id: "__alloyId116"
    });
    $.__views.resetPasswordWrap.add($.__views.__alloyId116);
    $.__views.resetPassword = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "15dp",
        textAlign: Alloy.Globals.Styles.imageSelectTipTextAlign,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#00accb",
        text: "Please try again or request a new one.",
        id: "resetPassword",
        textid: "try_again_or_rquest"
    });
    $.__views.resetPasswordWrap.add($.__views.resetPassword);
    linkTouchStart ? $.__views.resetPassword.addEventListener("touchstart", linkTouchStart) : __defers["$.__views.resetPassword!touchstart!linkTouchStart"] = true;
    linkTouchEnd ? $.__views.resetPassword.addEventListener("touchend", linkTouchEnd) : __defers["$.__views.resetPassword!touchend!linkTouchEnd"] = true;
    $.__views.sendAdmin = Ti.UI.createView({
        id: "sendAdmin",
        height: "0",
        visible: "false",
        layout: "vertical"
    });
    $.__views.in_.add($.__views.sendAdmin);
    $.__views.__alloyId117 = Ti.UI.createLabel({
        width: "190dp",
        height: Ti.UI.SIZE,
        textAlign: Alloy.Globals.Styles.imageSelectTipTextAlign,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#555",
        textid: "blocked",
        right: "0",
        id: "__alloyId117"
    });
    $.__views.sendAdmin.add($.__views.__alloyId117);
    $.__views.__alloyId118 = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "15dp",
        textAlign: Alloy.Globals.Styles.imageSelectTipTextAlign,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#00accb",
        textid: "contact_administrator",
        id: "__alloyId118"
    });
    $.__views.sendAdmin.add($.__views.__alloyId118);
    contactClick ? $.__views.__alloyId118.addEventListener("click", contactClick) : __defers["$.__views.__alloyId118!click!contactClick"] = true;
    $.__views.__alloyId119 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId119"
    });
    $.__views.in_.add($.__views.__alloyId119);
    $.__views.signIn = Ti.UI.createButton({
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
        id: "signIn",
        titleid: "signin"
    });
    $.__views.in_.add($.__views.signIn);
    buttonTouchStart ? $.__views.signIn.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.signIn!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.signIn.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.signIn!touchend!buttonTouchEnd"] = true;
    $.__views.facebookSignIn = Ti.UI.createButton({
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
        backgroundColor: "#3b5998",
        id: "facebookSignIn",
        titleid: "facebook_signin"
    });
    $.__views.in_.add($.__views.facebookSignIn);
    buttonTouchStart ? $.__views.facebookSignIn.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.facebookSignIn!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.facebookSignIn.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.facebookSignIn!touchend!buttonTouchEnd"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var errors = Alloy.Globals.errors;
    var currency;
    var indicator = Alloy.Globals.indicator;
    var profile;
    var signFacebook = function(data) {
        var signup = Alloy.createModel("facebooklogin", {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            facebookId: data.id,
            appInstallId: Alloy.Globals.core.installId,
            appVersion: Ti.App.version,
            platformModel: Ti.Platform.model,
            platformVersion: Ti.Platform.version,
            platformOSName: "android",
            language: Ti.Locale.currentLanguage,
            currency: currency
        });
        signup.localValidate(errorHandler) && signup.save({}, {
            success: function(model, response) {
                Alloy.Globals.core.apiToken(response.UUID);
                profile = Alloy.createModel("profile");
                profile.fetch({
                    success: function() {
                        $.resetPasswordWrap.visible = false;
                        $.resetPasswordWrap.height = 0;
                        $.sendAdmin.visible = false;
                        $.sendAdmin.height = 0;
                        indicator.closeIndicator();
                        Alloy.Globals.profile = profile.toJSON();
                        Alloy.Globals.profile.supplier && Ti.App.fireEvent("account:itIsSupplier");
                        Alloy.Globals.profile.currency || null !== Alloy.Globals.profile.currency ? Ti.App.fireEvent("account:updateProfile") : chooseCurrency();
                    },
                    error: function() {
                        indicator.closeIndicator();
                    }
                });
                Alloy.Collections.adverts = Alloy.createCollection("advert");
                Ti.App.fireEvent("account:showAccount");
            },
            error: function(model, xhr) {
                indicator.closeIndicator();
                xhr && !xhr.blocked ? errorHandler(errors.CAN_NOT_CREATE_ACCOUNT) : $.sendAdmin.visible = true;
                $.sendAdmin.height = Ti.UI.SIZE;
            }
        });
    };
    __defers["$.__views.in_!click!blur"] && $.__views.in_.addEventListener("click", blur);
    __defers["$.__views.login!focus!focus"] && $.__views.login.addEventListener("focus", focus);
    __defers["$.__views.password!focus!focus"] && $.__views.password.addEventListener("focus", focus);
    __defers["$.__views.resetPassword!touchstart!linkTouchStart"] && $.__views.resetPassword.addEventListener("touchstart", linkTouchStart);
    __defers["$.__views.resetPassword!touchend!linkTouchEnd"] && $.__views.resetPassword.addEventListener("touchend", linkTouchEnd);
    __defers["$.__views.__alloyId118!click!contactClick"] && $.__views.__alloyId118.addEventListener("click", contactClick);
    __defers["$.__views.signIn!touchstart!buttonTouchStart"] && $.__views.signIn.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.signIn!touchend!buttonTouchEnd"] && $.__views.signIn.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.facebookSignIn!touchstart!buttonTouchStart"] && $.__views.facebookSignIn.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.facebookSignIn!touchend!buttonTouchEnd"] && $.__views.facebookSignIn.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;