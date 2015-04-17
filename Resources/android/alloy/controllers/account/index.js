function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function focus() {
        "account" === views.onScreenKey && Ti.App.fireEvent("account:refreshCounts");
    }
    function profileFetch(args) {
        var profile = Alloy.createModel("profile");
        profile.fetch({
            success: function() {
                Alloy.Globals.profile = profile.toJSON();
                if (args.showProducts) {
                    Alloy.CFG.tabAccount.open(Alloy.createController("account/products/index").getView());
                    Alloy.Globals.core.showErrorDialog(L("can_add_product"));
                }
                $.index.title = Alloy.Globals.profile.firstName + " " + Alloy.Globals.profile.lastName;
                Alloy.Globals.profile.supplier && Ti.App.fireEvent("account:itIsSupplier");
                Alloy.Globals.chat.openConnect();
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/index";
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
        var $model = __processArg(arguments[0], "$model");
        var __itemTemplate = __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "vertical",
        backgroundColor: "#fff",
        titleid: "win_account",
        fullscreen: "true",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    focus ? $.__views.index.addEventListener("focus", focus) : __defers["$.__views.index!focus!focus"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var views = {
        signUp: {
            view: Alloy.createController("account/sign/up").getView(),
            title: "",
            rightNavButton: {
                btn: Ti.UI.createButton({
                    title: L("signin")
                }),
                action: "views.show('signIn')"
            }
        },
        signIn: {
            view: Alloy.createController("account/sign/in_").getView(),
            title: "",
            rightNavButton: {
                btn: Ti.UI.createButton({
                    title: L("create_account")
                }),
                action: "views.show('signUp')"
            }
        },
        account: {
            view: Alloy.createController("account/account").getView(),
            title: L("win_account")
        },
        adverts: {
            view: Alloy.createController("account/adverts/index").getView(),
            title: L("adverts")
        },
        onScreenKey: false,
        show: function(key) {
            views.onScreenKey && $.index.remove(views[views.onScreenKey].view);
            $.index.title = L(views[key].title);
            $.index.add(views[key].view);
            if (views[key].rightNavButton) {
                var btn = views[key].rightNavButton.btn;
                btn.addEventListener("click", function(e) {
                    eval(views[key].rightNavButton.action);
                });
            } else var btn = Titanium.UI.createView({});
            $.index.rightNavButton = btn;
            views.onScreenKey = key;
        }
    };
    Ti.App.addEventListener("account:showSignUp", function() {
        views.show("signUp");
    });
    Ti.App.addEventListener("account:showSignIn", function() {
        views.show("signIn");
    });
    Ti.App.addEventListener("account:showAccount", function() {
        views.show("account");
    });
    Ti.App.addEventListener("account:showAdverts", function() {
        views.show("adverts");
    });
    Ti.App.addEventListener("account:updateProfile", function(e) {
        profileFetch(e);
    });
    if (Ti.Network.online) if (Alloy.Globals.core.apiToken()) {
        Ti.App.fireEvent("account:updateProfile");
        views.show("account");
    } else views.show("signIn"); else views.show("signIn");
    __defers["$.__views.index!focus!focus"] && $.__views.index.addEventListener("focus", focus);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;