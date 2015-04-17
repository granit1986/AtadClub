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
        NewFetch();
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.price = transform.currency + " " + transform.price;
        transform.images = transform.images && transform.images.length > 0 ? JSON.parse(transform.images) : [];
        transform.distance = parseFloat(transform.distance).toFixed(2) + " km";
        transform.myLat = lat;
        transform.myLng = lng;
        transform.dealtype = Alloy.Globals.core.dealType[transform.dealtype].title;
        transform.endTime && (transform.endTime = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(transform.endTime)));
        transform.images.length > 0 && (transform.image = "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + transform.images[0] + Alloy.Globals.imageSizes.deal.row());
        transformCount++;
        return transform;
    }
    function beginUpdate(dataUpd) {
        var test = new Benchmark();
        indicator.openIndicator();
        updating = true;
        var token = Alloy.Globals.core.apiToken();
        var time = new Date();
        aliments.fetch({
            add: true,
            silent: true,
            data: {
                offset: aliments.length,
                sort: sort,
                lat: lat,
                lng: lng,
                distance: distance,
                token: token,
                clientTimeZoneOffset: time.getTimezoneOffset(),
                subcategories: subcategories
            },
            success: function(response, data) {
                updating = false;
                indicator.closeIndicator();
                if (!data.length) {
                    dataUpd.done();
                    Ti.API.info("Update time - " + test.test() + " ms");
                    return;
                }
                Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/row");
                Ti.API.info("Update time - " + test.test() + " ms");
                Ti.API.info(transformCount);
                transformCount = 0;
                data.length < dataLength ? dataUpd.done() : dataUpd.success();
            },
            error: function() {
                dataUpd.done();
                updating = false;
                indicator.closeIndicator();
            }
        });
    }
    function add(e) {
        if (updating) {
            e.success();
            return;
        }
        updating = true;
        beginUpdate(e);
    }
    function NewFetch() {
        var test = new Benchmark();
        indicator.openIndicator();
        var token = Alloy.Globals.core.apiToken();
        var time = new Date();
        aliments.fetch({
            data: {
                sort: sort,
                lat: lat,
                lng: lng,
                distance: distance,
                token: token,
                clientTimeZoneOffset: time.getTimezoneOffset(),
                subcategories: subcategories
            },
            success: function() {
                Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/row");
                Ti.API.info("Fetch time - " + test.test() + " ms");
                updating = false;
                indicator.closeIndicator();
                Ti.API.info(transformCount);
                transformCount = 0;
            },
            error: function() {
                updating = false;
                indicator.closeIndicator();
            }
        });
    }
    function close() {
        Ti.App.removeEventListener("supplierWindow:blocked", blocked);
        aliments.reset();
    }
    function blocked() {
        lastDistance = 0;
        aliments = Alloy.Collections.publicDeals;
        updating = true;
        pager = new Pager();
        NewFetch();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/deals/index";
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
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "vertical",
        id: "window",
        fullscreen: "true",
        titleid: "search_result"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    $.__views.wrapper = Ti.UI.createView({
        id: "wrapper"
    });
    $.__views.window.add($.__views.wrapper);
    $.__views.sortsLbl = Ti.UI.createLabel({
        width: "280dp",
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: "20dp",
        right: Alloy.Globals.Styles.labelRight,
        textAlign: "center",
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        top: "10dp",
        id: "sortsLbl",
        textid: "sort_by"
    });
    $.__views.wrapper.add($.__views.sortsLbl);
    $.__views.is = Alloy.createWidget("nl.fokkezb.infiniteScroll", "widget", {
        id: "is"
    });
    add ? $.__views.is.on("end", add) : __defers["$.__views.is!end!add"] = true;
    $.__views.deals = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        layout: "vertical",
        top: "70dp",
        bottom: "5dp",
        footerView: $.__views.is.getProxyPropertyEx("footerView", {
            recurse: true
        }),
        id: "deals"
    });
    $.__views.wrapper.add($.__views.deals);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var switchButton = Ti.UI.createButton({
        titleid: "all_companies"
    });
    var sort = 1;
    var subcategoriesItems = arguments[0].subCategories || false;
    var subcategories = false;
    subcategoriesItems && (subcategories = JSON.stringify(subcategoriesItems));
    var lat = arguments[0].lat;
    var lng = arguments[0].lng;
    var dataLength = 10;
    distance = arguments[0].distance;
    switchButton.addEventListener("click", function() {
        var time = new Date();
        var companies = Alloy.createController("home/companies/index", {
            lat: lat,
            lng: lng,
            distance: distance,
            token: Alloy.Globals.core.apiToken(),
            clientTimeZoneOffset: time.getTimezoneOffset(),
            subcategories: subcategories
        }).getView();
        companies.backButtonTitle = "Back";
        Alloy.CFG.tabHome.open(companies);
    });
    $.window.setRightNavButton(switchButton);
    var transformCount = 0;
    var indicator = Alloy.Globals.indicator;
    var Pager = function() {
        var page = 1;
        this.next = function() {
            page++;
            return page;
        };
    };
    var lastDistance = 0, aliments = Alloy.Collections.publicDeals, updating = true, pager = new Pager();
    Ti.App.addEventListener("supplierWindow:blocked", blocked);
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.is!end!add"] && $.__views.is.on("end", add);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;