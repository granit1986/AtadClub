function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function open() {}
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        switch (e.source.id) {
          case "sms":
            openSms();
            break;

          case "email":
            openEmail();
            break;

          case "twitter":
            twitter();
            break;

          case "facebook":
            facebook();
            break;

          case "google":
            google();
        }
    }
    function openSms() {
        var smsDialog = require("com.omorandi").createSMSDialog({
            messageBody: shareText + "\n" + Alloy.Globals.core.appUrl
        });
        smsDialog.open({
            anumated: true
        });
    }
    function openEmail() {
        var emailDialog = Ti.UI.createEmailDialog();
        emailDialog.subject = "Atad Club Application";
        emailDialog.messageBody = shareText + "\n" + Alloy.Globals.core.appUrl;
        emailDialog.open();
    }
    function twitter() {
        var social = require("alloy/social").create({
            consumerKey: "xtIHOCSPrhXsb1pLni1IyXPzf",
            consumerSecret: "azL5kQRuSaC85RD9cicA0H56IYp109i3OxDv1gx27OYdbDiz4O"
        });
        social.share({
            message: shareText + "\n" + Alloy.Globals.core.appUrl,
            success: function() {
                Alloy.Globals.core.showErrorDialog("Share success");
                social.deauthorize();
            },
            error: function() {
                Alloy.Globals.core.showErrorDialog("You can't share in twitter");
                social.deauthorize();
            }
        });
    }
    function google() {
        var win = Ti.UI.createWindow({
            barColor: "#000",
            navBarHidden: false
        });
        encodeURIComponent("This text will be shared");
        encodeURIComponent("http://www.company.com");
        var webView = Ti.UI.createWebView({
            url: "https://plus.google.com/share?url=" + encodeURIComponent(Alloy.Globals.core.appUrl)
        });
        win.add(webView);
        win.open({
            modal: true
        });
        webView.addEventListener("load", function(e) {
            -1 == e.url.indexOf("https://accounts.google.com") && win.hideNavBar();
            -1 != e.url.indexOf("https://plus.google.com/app/basic/stream") && win.close();
        });
        webView.addEventListener("error", function() {
            win.close();
        });
    }
    function facebook() {
        Ti.Facebook.forceDialogAuth = false;
        Ti.Facebook.appid = "1437623056473639";
        Ti.Facebook.permissions = [ "publish_stream", "offline_access", "email" ];
        Ti.Facebook.addEventListener("login", facebookLogin);
        Ti.Facebook.loggedIn ? postInFacebook() : Ti.Facebook.authorize();
    }
    function postInFacebook() {
        var data = {
            name: shareText,
            link: Alloy.Globals.core.appUrl
        };
        if (!shareOpened) {
            Ti.Facebook.dialog("feed", data, showResults);
        }
        shareOpened = true;
        Ti.Facebook.removeEventListener("login", facebookLogin);
    }
    function facebookLogin(e) {
        if (e.success) {
            e.data.email || (e.data.email = e.data.username + "@facebook.com");
            postInFacebook();
        } else e.error ? Alloy.Globals.core.showErrorDialog(e.error) : e.cancelled && Alloy.Globals.core.showErrorDialog("Canceled");
    }
    function showResults(result) {
        if (result.result) {
            Alloy.Globals.core.showErrorDialog("Share success");
            Ti.Facebook.logout();
            Ti.Facebook.accessToken = null;
        } else if (result.cancelled) {
            Ti.Facebook.logout();
            Ti.Facebook.accessToken = null;
        }
        shareOpened = false;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "share/index";
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
        layout: "vertical",
        titleid: "wib_share",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    open ? $.__views.index.addEventListener("open", open) : __defers["$.__views.index!open!open"] = true;
    $.__views.__alloyId345 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId345"
    });
    $.__views.index.add($.__views.__alloyId345);
    $.__views.sms = Ti.UI.createButton({
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
        id: "sms",
        titleid: "sms"
    });
    $.__views.index.add($.__views.sms);
    buttonTouchStart ? $.__views.sms.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.sms!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.sms.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.sms!touchend!buttonTouchEnd"] = true;
    $.__views.__alloyId346 = Ti.UI.createLabel({
        width: "38dp",
        height: "38dp",
        left: "111dp",
        top: "-60dp",
        bottom: "20dp",
        backgroundImage: "images/icon_social_sms@2x.png",
        text: "",
        id: "__alloyId346"
    });
    $.__views.index.add($.__views.__alloyId346);
    $.__views.email = Ti.UI.createButton({
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
        id: "email",
        titleid: "email_share"
    });
    $.__views.index.add($.__views.email);
    buttonTouchStart ? $.__views.email.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.email!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.email.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.email!touchend!buttonTouchEnd"] = true;
    $.__views.__alloyId347 = Ti.UI.createLabel({
        width: "38dp",
        height: "38dp",
        left: "106dp",
        top: "-60dp",
        bottom: "20dp",
        backgroundImage: "images/icon_social_email@2x.png",
        text: "",
        id: "__alloyId347"
    });
    $.__views.index.add($.__views.__alloyId347);
    $.__views.facebook = Ti.UI.createButton({
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
        id: "facebook",
        titleid: "facebook"
    });
    $.__views.index.add($.__views.facebook);
    buttonTouchStart ? $.__views.facebook.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.facebook!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.facebook.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.facebook!touchend!buttonTouchEnd"] = true;
    $.__views.__alloyId348 = Ti.UI.createLabel({
        width: "38dp",
        height: "38dp",
        left: "94dp",
        top: "-60dp",
        bottom: "20dp",
        backgroundImage: "images/icon_social_facebook@2x.png",
        text: "",
        id: "__alloyId348"
    });
    $.__views.index.add($.__views.__alloyId348);
    $.__views.twitter = Ti.UI.createButton({
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
        id: "twitter",
        titleid: "twitter"
    });
    $.__views.index.add($.__views.twitter);
    buttonTouchStart ? $.__views.twitter.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.twitter!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.twitter.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.twitter!touchend!buttonTouchEnd"] = true;
    $.__views.__alloyId349 = Ti.UI.createLabel({
        width: "38dp",
        height: "38dp",
        left: "103dp",
        top: "-60dp",
        bottom: "20dp",
        backgroundImage: "images/icon_social_twitter@2x.png",
        text: "",
        id: "__alloyId349"
    });
    $.__views.index.add($.__views.__alloyId349);
    $.__views.google = Ti.UI.createButton({
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
        id: "google",
        titleid: "google"
    });
    $.__views.index.add($.__views.google);
    buttonTouchStart ? $.__views.google.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.google!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.google.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.google!touchend!buttonTouchEnd"] = true;
    $.__views.__alloyId350 = Ti.UI.createLabel({
        width: "38dp",
        height: "38dp",
        left: "104dp",
        top: "-60dp",
        bottom: "20dp",
        backgroundImage: "images/icon_social_google@2x.png",
        text: "",
        id: "__alloyId350"
    });
    $.__views.index.add($.__views.__alloyId350);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var shareOpened = false;
    Alloy.Globals.chat.openChatId = false;
    var shareText = L("share_text");
    __defers["$.__views.index!open!open"] && $.__views.index.addEventListener("open", open);
    __defers["$.__views.sms!touchstart!buttonTouchStart"] && $.__views.sms.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.sms!touchend!buttonTouchEnd"] && $.__views.sms.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.email!touchstart!buttonTouchStart"] && $.__views.email.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.email!touchend!buttonTouchEnd"] && $.__views.email.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.facebook!touchstart!buttonTouchStart"] && $.__views.facebook.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.facebook!touchend!buttonTouchEnd"] && $.__views.facebook.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.twitter!touchstart!buttonTouchStart"] && $.__views.twitter.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.twitter!touchend!buttonTouchEnd"] && $.__views.twitter.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.google!touchstart!buttonTouchStart"] && $.__views.google.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.google!touchend!buttonTouchEnd"] && $.__views.google.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;