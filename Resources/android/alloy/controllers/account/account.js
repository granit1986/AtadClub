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
        indicator.openIndicator();
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        e.source.id && openView(e.source.id);
    }
    function openView(id) {
        var view;
        switch (id) {
          case "profile":
            view = Alloy.createController("account/profile").getView();
            break;

          case "supplier":
            view = Alloy.createController("account/company", {
                callback: function(showAlert) {
                    showAlert && Alloy.CFG.tabAccount.open(Alloy.createController("account/products/index", {
                        alert: showAlert
                    }).getView());
                }
            }).getView();
            break;

          case "blackList":
            view = Alloy.createController("account/blackList/index").getView();
            break;

          case "adverts":
            view = Alloy.createController("account/adverts/index").getView();
            break;

          case "deals":
            if (!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
                Alloy.Globals.core.showErrorDialog(L("should_be_company_message"));
                indicator.closeIndicator();
                return;
            }
            view = Alloy.createController("account/deals/index").getView();
            break;

          case "products":
            if (!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
                Alloy.Globals.core.showErrorDialog(L("should_be_company_message"));
                indicator.closeIndicator();
                return;
            }
            view = Alloy.createController("account/products/index").getView();
            break;

          case "offers":
            view = Alloy.createController("account/offers/index").getView();
            break;

          case "answers":
            view = Alloy.createController("account/answers/index").getView();
            break;

          case "reports":
            if (!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
                Alloy.Globals.core.showErrorDialog(L("should_be_company_message"));
                indicator.closeIndicator();
                return;
            }
            var report = Alloy.createModel("report");
            report.fetch({
                success: function() {
                    view = Alloy.createController("account/reports/index").getView();
                    Alloy.CFG.tabAccount.open(view);
                },
                error: function(model, xhr) {
                    if (xhr && xhr.Message && xhr.restrict) {
                        var alertDialog = Titanium.UI.createAlertDialog({
                            title: L("upgrade_membership"),
                            message: L(xhr.Message),
                            buttonNames: [ L("upgrade"), L("OK") ]
                        });
                        alertDialog.addEventListener("click", function(e) {
                            if (!e.index) {
                                var view = Alloy.createController("account/upgradeSelect").getView();
                                Alloy.Globals.tabGroup.activeTab.open(view);
                            }
                        });
                        alertDialog.show();
                    }
                }
            });
            break;

          case "buyBanner":
            view = Alloy.createController("account/buyBanner").getView();
        }
        view && Alloy.CFG.tabAccount.open(view);
        indicator.closeIndicator();
    }
    function logout() {
        if (Alloy.Globals.profile) {
            var out = Alloy.createModel("signout", {
                appInstallId: Alloy.Globals.core.installId,
                userId: Alloy.Globals.profile.id
            });
            out.save({
                success: function() {
                    Ti.API.info("destroyed");
                }
            });
        }
        Ti.Facebook.logout();
        Alloy.Globals.profile = null;
        Alloy.Globals.core.apiToken(false);
        Alloy.Globals.chat.source && Alloy.Globals.chat.source.close();
        Ti.App.fireEvent("account:showSignIn");
    }
    function refreshCounts() {
        var counts = Alloy.createModel("counts");
        counts.fetch({
            success: function() {
                counts = counts.toJSON();
                if (counts.MessagesCount > 0) {
                    $.answers_badge.text = counts.MessagesCount;
                    $.answers_badge.visible = true;
                    $.answers_badge.width = counts.MessagesCount < 10 ? 20 : "auto";
                } else if (0 === counts.MessagesCount) {
                    $.answers_badge.text = "";
                    $.answers_badge.visible = false;
                }
                if (counts.OffersCount > 0) {
                    $.offers_badge.text = counts.OffersCount;
                    $.offers_badge.visible = true;
                    $.offers_badge.width = counts.OffersCount < 10 ? 20 : "auto";
                } else if (0 === counts.OffersCount) {
                    $.offers_badge.text = "";
                    $.offers_badge.visible = false;
                }
            }
        });
        Ti.API.info("Counts refreshed");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/account";
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
    $.__views.account = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "account"
    });
    $.__views.account && $.addTopLevelView($.__views.account);
    $.__views.__alloyId18 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId18"
    });
    $.__views.account.add($.__views.__alloyId18);
    $.__views.profile = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "profile",
        titleid: "edit_profile"
    });
    $.__views.account.add($.__views.profile);
    buttonTouchStart ? $.__views.profile.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.profile!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.profile.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.profile!touchend!buttonTouchEnd"] = true;
    $.__views.supplier = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "supplier",
        titleid: "add_company"
    });
    $.__views.account.add($.__views.supplier);
    buttonTouchStart ? $.__views.supplier.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.supplier!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.supplier.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.supplier!touchend!buttonTouchEnd"] = true;
    $.__views.blackList = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "blackList",
        titleid: "my_black_list"
    });
    $.__views.account.add($.__views.blackList);
    buttonTouchStart ? $.__views.blackList.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.blackList!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.blackList.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.blackList!touchend!buttonTouchEnd"] = true;
    $.__views.adverts = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "adverts",
        titleid: "my_adverts"
    });
    $.__views.account.add($.__views.adverts);
    buttonTouchStart ? $.__views.adverts.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.adverts!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.adverts.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.adverts!touchend!buttonTouchEnd"] = true;
    $.__views.deals = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "deals",
        titleid: "my_deals"
    });
    $.__views.account.add($.__views.deals);
    buttonTouchStart ? $.__views.deals.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.deals!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.deals.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.deals!touchend!buttonTouchEnd"] = true;
    $.__views.products = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "products",
        titleid: "my_products"
    });
    $.__views.account.add($.__views.products);
    buttonTouchStart ? $.__views.products.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.products!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.products.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.products!touchend!buttonTouchEnd"] = true;
    $.__views.offers = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "offers",
        titleid: "my_offers"
    });
    $.__views.account.add($.__views.offers);
    buttonTouchStart ? $.__views.offers.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.offers!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.offers.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.offers!touchend!buttonTouchEnd"] = true;
    $.__views.offers_badge = Ti.UI.createLabel({
        right: 10,
        top: 10,
        color: "#FFFFFF",
        textAlign: "center",
        font: {
            fontSize: 14
        },
        backgroundColor: "#e83038",
        borderRadius: 10,
        height: 20,
        width: 20,
        visible: false,
        id: "offers_badge"
    });
    $.__views.offers.add($.__views.offers_badge);
    $.__views.reports = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "reports",
        titleid: "reports"
    });
    $.__views.account.add($.__views.reports);
    buttonTouchStart ? $.__views.reports.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.reports!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.reports.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.reports!touchend!buttonTouchEnd"] = true;
    $.__views.answers = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "answers",
        titleid: "my_answers"
    });
    $.__views.account.add($.__views.answers);
    buttonTouchStart ? $.__views.answers.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.answers!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.answers.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.answers!touchend!buttonTouchEnd"] = true;
    $.__views.answers_badge = Ti.UI.createLabel({
        right: 10,
        top: 10,
        color: "#FFFFFF",
        textAlign: "center",
        font: {
            fontSize: 14
        },
        backgroundColor: "#e83038",
        borderRadius: 10,
        height: 20,
        width: 20,
        visible: false,
        id: "answers_badge"
    });
    $.__views.answers.add($.__views.answers_badge);
    $.__views.buyBanner = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "buyBanner",
        titleid: "buy_banner"
    });
    $.__views.account.add($.__views.buyBanner);
    buttonTouchStart ? $.__views.buyBanner.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.buyBanner!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.buyBanner.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.buyBanner!touchend!buttonTouchEnd"] = true;
    $.__views.logout = Ti.UI.createButton({
        width: Ti.UI.FILL,
        left: "5dp",
        right: "5dp",
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
        id: "logout",
        titleid: "logout"
    });
    $.__views.account.add($.__views.logout);
    logout ? $.__views.logout.addEventListener("click", logout) : __defers["$.__views.logout!click!logout"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.core.profile && Alloy.Globals.core.profile.supplier && ($.supplier.title = L("edit_company"));
    var indicator = Alloy.Globals.indicator;
    Alloy.Globals.chat.openChatId = false;
    Ti.App.addEventListener("account:refreshCounts", refreshCounts);
    Ti.App.addEventListener("account:itIsSupplier", function() {
        $.supplier.title = L("edit_company");
    });
    __defers["$.__views.profile!touchstart!buttonTouchStart"] && $.__views.profile.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.profile!touchend!buttonTouchEnd"] && $.__views.profile.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.supplier!touchstart!buttonTouchStart"] && $.__views.supplier.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.supplier!touchend!buttonTouchEnd"] && $.__views.supplier.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.blackList!touchstart!buttonTouchStart"] && $.__views.blackList.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.blackList!touchend!buttonTouchEnd"] && $.__views.blackList.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.adverts!touchstart!buttonTouchStart"] && $.__views.adverts.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.adverts!touchend!buttonTouchEnd"] && $.__views.adverts.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.deals!touchstart!buttonTouchStart"] && $.__views.deals.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.deals!touchend!buttonTouchEnd"] && $.__views.deals.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.products!touchstart!buttonTouchStart"] && $.__views.products.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.products!touchend!buttonTouchEnd"] && $.__views.products.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.offers!touchstart!buttonTouchStart"] && $.__views.offers.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.offers!touchend!buttonTouchEnd"] && $.__views.offers.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.reports!touchstart!buttonTouchStart"] && $.__views.reports.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.reports!touchend!buttonTouchEnd"] && $.__views.reports.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.answers!touchstart!buttonTouchStart"] && $.__views.answers.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.answers!touchend!buttonTouchEnd"] && $.__views.answers.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.buyBanner!touchstart!buttonTouchStart"] && $.__views.buyBanner.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.buyBanner!touchend!buttonTouchEnd"] && $.__views.buyBanner.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.logout!click!logout"] && $.__views.logout.addEventListener("click", logout);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;