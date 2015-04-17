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
        Ti.App.addEventListener("account:updateAdverts", advertsFetch);
        advertsFetch();
    }
    function close() {
        Ti.App.removeEventListener("account:updateAdverts", advertsFetch);
        Alloy.Collections.adverts.reset();
    }
    function advertsFetch() {
        if (Alloy.Globals.core.apiToken()) {
            indicator.openIndicator();
            Alloy.Collections.adverts.fetch({
                success: function() {
                    Alloy.Globals.core.createRows(Alloy.Collections.adverts, transform, $.adverts, "account/adverts/row");
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
        transform.images.length > 0 && (transform.image = "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + transform.images[0] + Alloy.Globals.imageSizes.advert.row());
        return transform;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/adverts/index";
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
        titleid: "my_adverts"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.adverts = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        id: "adverts"
    });
    $.__views.window.add($.__views.adverts);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var indicator = Alloy.Globals.indicator;
    var btnNew = Ti.UI.createButton({
        titleid: "add"
    });
    btnNew.addEventListener("click", function() {
        var advertWindow = Alloy.createController("add/advert", {
            tab: Alloy.CFG.tabAccount
        }).getView();
        Alloy.CFG.tabAccount.open(advertWindow);
    });
    $.window.rightNavButton = btnNew;
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;