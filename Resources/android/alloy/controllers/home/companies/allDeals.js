function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function transform(model) {
        var transform = model.toJSON();
        transform.price = transform.currency + " " + transform.price;
        transform.dealtype = Alloy.Globals.core.dealType[transform.dealtype].title;
        transform.images = transform.images && transform.images.length > 0 ? JSON.parse(transform.images) : [];
        transform.myLat = lat;
        transform.myLng = lng;
        transform.endTime && (transform.endTime = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(transform.endTime)));
        transform.images.length > 0 && (transform.image = "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + transform.images[0] + Alloy.Globals.imageSizes.deal.row());
        return transform;
    }
    function add(e) {
        if (updating) {
            e.success();
            return;
        }
        updating = true;
        beginUpdate(e);
    }
    function beginUpdate(dataUpd) {
        indicator.openIndicator();
        updating = true;
        var time = new Date();
        var token = Alloy.Globals.core.apiToken();
        aliments.fetch({
            add: true,
            silent: true,
            data: {
                token: token,
                offset: aliments.length,
                length: dataLength,
                clientTimeZoneOffset: time.getTimezoneOffset(),
                supplierId: supplierId,
                lat: lat,
                lng: lng
            },
            success: function(response, data) {
                updating = false;
                indicator.closeIndicator();
                if (!data.length) {
                    dataUpd.done();
                    return;
                }
                Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/row");
                data.length < dataLength ? dataUpd.done() : dataUpd.success();
            },
            error: function() {
                dataUpd.done();
                updating = false;
                indicator.closeIndicator();
            }
        });
    }
    function NewFetch() {
        var token = Alloy.Globals.core.apiToken();
        var time = new Date();
        indicator.openIndicator();
        aliments.fetch({
            data: {
                token: token,
                length: dataLength,
                clientTimeZoneOffset: time.getTimezoneOffset(),
                supplierId: supplierId,
                lat: lat,
                lng: lng
            },
            success: function() {
                updating = false;
                Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/row");
                indicator.closeIndicator();
            },
            error: function() {
                updating = false;
                indicator.closeIndicator();
            }
        });
    }
    function close() {
        aliments.reset();
    }
    function open() {
        NewFetch();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/companies/allDeals";
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
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
        titleid: "deals"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.is = Alloy.createWidget("nl.fokkezb.infiniteScroll", "widget", {
        id: "is",
        __parentSymbol: __parentSymbol
    });
    add ? $.__views.is.on("end", add) : __defers["$.__views.is!end!add"] = true;
    $.__views.deals = Ti.UI.createTableView({
        backgroundColor: "transparent",
        footerView: $.__views.is.getProxyPropertyEx("footerView", {
            recurse: true
        }),
        id: "deals"
    });
    $.__views.window.add($.__views.deals);
    $.__views.loading = Ti.UI.createLabel({
        text: "Loading",
        id: "loading"
    });
    $.__views.window.add($.__views.loading);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var supplierId = arguments[0].id;
    var supplierName = arguments[0].supplierName;
    var lat = arguments[0].lat || null;
    var lng = arguments[0].lng || null;
    $.window.title = supplierName + "'s deals";
    var Pager = function() {
        var page = 1;
        this.next = function() {
            page++;
            return page;
        };
    };
    {
        var aliments = Alloy.Collections.companyDeals, updating = true;
        new Pager();
    }
    var dataLength = 10;
    var indicator = Alloy.Globals.indicator;
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    __defers["$.__views.is!end!add"] && $.__views.is.on("end", add);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;