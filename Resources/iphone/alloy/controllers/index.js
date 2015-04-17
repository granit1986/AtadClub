function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function showLogin(e, titleId) {
        if (!Alloy.Globals.core.apiToken()) {
            var alertDialog = Titanium.UI.createAlertDialog({
                title: L("please_login_title"),
                message: L(titleId),
                buttonNames: [ L("cancel"), L("OK") ],
                cancel: 0
            });
            alertDialog.addEventListener("click", function(e) {
                Alloy.Globals.tabGroup.setActiveTab(e.cancel === e.index || true === e.cancel ? Alloy.CFG.tabHome : Alloy.CFG.tabAccount);
            });
            alertDialog.show();
            return;
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
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
    var __alloyId0 = [];
    $.__views.__alloyId1 = Alloy.createController("home/index", {
        id: "__alloyId1"
    });
    $.__views.tabHome = Ti.UI.createTab({
        window: $.__views.__alloyId1.getViewEx({
            recurse: true
        }),
        id: "tabHome",
        titleid: "tab_home",
        icon: "images/icon_tabHome.png"
    });
    __alloyId0.push($.__views.tabHome);
    $.__views.__alloyId2 = Alloy.createController("add/index", {
        id: "__alloyId2"
    });
    $.__views.tabAdd = Ti.UI.createTab({
        window: $.__views.__alloyId2.getViewEx({
            recurse: true
        }),
        id: "tabAdd",
        titleid: "tab_add",
        icon: "images/icon_tabAdd.png"
    });
    __alloyId0.push($.__views.tabAdd);
    $.__views.__alloyId4 = Alloy.createController("account/index", {
        id: "__alloyId4"
    });
    $.__views.tabAccount = Ti.UI.createTab({
        window: $.__views.__alloyId4.getViewEx({
            recurse: true
        }),
        id: "tabAccount",
        titleid: "tab_signin",
        icon: "images/icon_tabAccount.png"
    });
    __alloyId0.push($.__views.tabAccount);
    $.__views.__alloyId6 = Alloy.createController("howToUse/index", {
        id: "__alloyId6"
    });
    $.__views.tabHowToUse = Ti.UI.createTab({
        window: $.__views.__alloyId6.getViewEx({
            recurse: true
        }),
        id: "tabHowToUse",
        titleid: "tab_how_to_use",
        icon: "images/icon_tabHow.png"
    });
    __alloyId0.push($.__views.tabHowToUse);
    $.__views.__alloyId7 = Alloy.createController("share/index", {
        id: "__alloyId7"
    });
    $.__views.tabShare = Ti.UI.createTab({
        window: $.__views.__alloyId7.getViewEx({
            recurse: true
        }),
        id: "tabShare",
        titleid: "tab_share",
        icon: "images/icon_tabShare.png"
    });
    __alloyId0.push($.__views.tabShare);
    $.__views.__alloyId9 = Alloy.createController("aboutUs/index", {
        id: "__alloyId9"
    });
    $.__views.tabAboutUs = Ti.UI.createTab({
        window: $.__views.__alloyId9.getViewEx({
            recurse: true
        }),
        id: "tabAboutUs",
        titleid: "tab_about_us",
        icon: "images/icon_tabAbout.png"
    });
    __alloyId0.push($.__views.tabAboutUs);
    $.__views.__alloyId10 = Alloy.createController("appreciation/index", {
        id: "__alloyId10"
    });
    $.__views.tabAppreciation = Ti.UI.createTab({
        window: $.__views.__alloyId10.getViewEx({
            recurse: true
        }),
        id: "tabAppreciation",
        titleid: "tab_appreciation",
        icon: "images/icon_tabDonate.png"
    });
    __alloyId0.push($.__views.tabAppreciation);
    $.__views.__alloyId11 = Alloy.createController("contactUs/index", {
        id: "__alloyId11"
    });
    $.__views.tabContactUs = Ti.UI.createTab({
        window: $.__views.__alloyId11.getViewEx({
            recurse: true
        }),
        id: "tabContactUs",
        titleid: "tab_contact_us",
        icon: "images/icon_tabContactUs.png"
    });
    __alloyId0.push($.__views.tabContactUs);
    $.__views.__alloyId13 = Alloy.createController("notifications/index", {
        id: "__alloyId13"
    });
    $.__views.tabNotifications = Ti.UI.createTab({
        window: $.__views.__alloyId13.getViewEx({
            recurse: true
        }),
        id: "tabNotifications",
        titleid: "notifications",
        icon: "images/icon_tabNotifications.png"
    });
    __alloyId0.push($.__views.tabNotifications);
    $.__views.__alloyId14 = Alloy.createController("investors/index", {
        id: "__alloyId14"
    });
    $.__views.tabSInvestors = Ti.UI.createTab({
        window: $.__views.__alloyId14.getViewEx({
            recurse: true
        }),
        id: "tabSInvestors",
        titleid: "tab_investors",
        icon: "images/icon_tabInvest.png"
    });
    __alloyId0.push($.__views.tabSInvestors);
    $.__views.__alloyId15 = Alloy.createController("version/index", {
        id: "__alloyId15"
    });
    $.__views.tabVersion = Ti.UI.createTab({
        window: $.__views.__alloyId15.getViewEx({
            recurse: true
        }),
        id: "tabVersion",
        titleid: "version",
        icon: "images/icon_tabVersion.png"
    });
    __alloyId0.push($.__views.tabVersion);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.tabGroup = $.index;
    Alloy.CFG.tabDeals = $.tabDeals;
    Alloy.CFG.tabCompanies = $.tabCompanies;
    Alloy.CFG.tabHome = $.tabHome;
    Alloy.CFG.tabAdd = $.tabAdd;
    Alloy.CFG.tabNotifications = $.tabNotifications;
    Alloy.CFG.tabAccount = $.tabAccount;
    Alloy.CFG.tabMore = $.tabMore;
    Alloy.CFG.tabShare = $.tabShare;
    Alloy.CFG.tabAppreciation = $.tabAppreciation;
    Alloy.CFG.tabContact = $.tabContactUs;
    $.tabContactUs.addEventListener("focus", function() {
        Ti.App.fireEvent("open:contactus");
    });
    $.tabAdd.addEventListener("focus", function(e) {
        showLogin(e, "please_login");
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;