function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function open() {
        indicator.openIndicator();
        Ti.App.addEventListener("account:updateDeals", delasFetch);
        delasFetch();
    }
    function close() {
        Ti.App.removeEventListener("account:updateDeals", delasFetch);
        Alloy.Collections.deals.reset();
    }
    function delasFetch() {
        if (Alloy.Globals.core.apiToken()) {
            var test = new Benchmark();
            Alloy.Collections.deals.fetch({
                data: {
                    lng: Ti.Platform.locale
                },
                success: function() {
                    Alloy.Globals.core.createRows(Alloy.Collections.deals, transform, $.deals, "account/deals/row");
                    Ti.API.info("Fetch time - " + test.test() + " ms");
                    indicator.closeIndicator();
                },
                error: function() {
                    indicator.closeIndicator();
                }
            });
        }
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.price = transform.currency + " " + transform.price;
        transform.images = transform.images && transform.images.length > 0 ? JSON.parse(transform.images) : [];
        transform.images.length > 0 && (transform.image = "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + transform.images[0] + Alloy.Globals.imageSizes.deal.row());
        transform.statusLbl = L(transform.active ? "active" : "not_active");
        return transform;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/deals/index";
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
        backgroundImage: "images/background.png",
        layout: "vertical",
        id: "window",
        fullscreen: "true",
        titleid: "my_deals"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.deals = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        id: "deals"
    });
    $.__views.window.add($.__views.deals);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var indicator = Alloy.Globals.indicator;
    var btnNew = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.ADD
    });
    btnNew.addEventListener("click", function() {
        var dealWindow = Alloy.createController("add/deal", {
            tab: Alloy.CFG.tabAccount,
            enterFromAccount: true
        }).getView();
        Alloy.CFG.tabAccount.open(dealWindow);
    });
    $.window.rightNavButton = btnNew;
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;