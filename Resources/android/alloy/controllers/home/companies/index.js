function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function fetch() {
        var companies = Alloy.createCollection("companyWithDeals");
        companies.fetch({
            silent: true,
            data: {
                lat: lat,
                lng: lng,
                distance: distance,
                token: token,
                clientTimeZoneOffset: clientTimeZoneOffset,
                subcategories: subcategories,
                getCompanies: true,
                language: Ti.Platform.locale
            },
            success: function() {
                Alloy.Globals.core.createRows(companies, transform, $.companies, "home/companies/row");
                indicator.closeIndicator();
            },
            error: function() {
                indicator.closeIndicator();
            }
        });
    }
    function open() {
        indicator.openIndicator();
        fetch();
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.categories = JSON.parse(transform.categories).join(", ");
        transform.logo = transform.logoUrl + transform.logoId + Alloy.Globals.imageSizes.supplier.row();
        return transform;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/companies/index";
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
        layout: "horizontal",
        titleid: "all_companies_in_location",
        id: "index",
        fullscreen: "true"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    open ? $.__views.index.addEventListener("open", open) : __defers["$.__views.index!open!open"] = true;
    $.__views.__alloyId220 = Ti.UI.createView({
        id: "__alloyId220"
    });
    $.__views.index.add($.__views.__alloyId220);
    $.__views.companies = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        layout: "vertical",
        top: "0dp",
        id: "companies",
        separatorColor: "transparent"
    });
    $.__views.__alloyId220.add($.__views.companies);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var lng = arguments[0].lng || false;
    var lat = arguments[0].lat || false;
    var distance = arguments[0].distance || false;
    var token = arguments[0].token || false;
    var clientTimeZoneOffset = arguments[0].clientTimeZoneOffset || false;
    var subcategories = arguments[0].subcategories || false;
    var indicator = Alloy.Globals.indicator;
    __defers["$.__views.index!open!open"] && $.__views.index.addEventListener("open", open);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;