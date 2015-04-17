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
        transform.distance = parseFloat(transform.distance).toFixed(2);
        transform.dealtype = Alloy.Globals.core.dealType[transform.dealtype].title;
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
        Alloy.Globals.core.apiToken();
        var time = new Date();
        elements.fetch({
            add: true,
            silent: true,
            data: {
                offset: elements.length,
                lat: deal.lat,
                sort: sort,
                length: dataLength,
                lng: deal.lng,
                distance: 2e3,
                clientTimeZoneOffset: time.getTimezoneOffset(),
                token: Alloy.Globals.core.apiToken(),
                subcategories: deal.subCategories
            },
            success: function(response, data) {
                updating = false;
                indicator.closeIndicator();
                if (!data.length) {
                    dataUpd.done();
                    return;
                }
                Alloy.Globals.core.createRows(elements, transform, $.deals, "home/deals/row");
                data.length < dataLength ? dataUpd.done() : dataUpd.success();
            },
            error: function() {
                dataUpd.done();
                updating = false;
                indicator.closeIndicator();
            }
        });
    }
    function Sort(e) {
        if (sort == e.index + 1) return false;
        sort = e.index + 1;
        NewFetch();
    }
    function NewFetch() {
        var time = new Date();
        indicator.openIndicator();
        elements.fetch({
            data: {
                sort: sort,
                lat: deal.lat,
                lng: deal.lng,
                distance: 2e3,
                length: dataLength,
                token: Alloy.Globals.core.apiToken(),
                subcategories: deal.subCategories,
                clientTimeZoneOffset: time.getTimezoneOffset()
            },
            success: function() {
                Alloy.Globals.core.createRows(elements, transform, $.deals, "home/deals/row");
                updating = false;
                indicator.closeIndicator();
            },
            error: function() {
                updating = false;
                indicator.closeIndicator();
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/deals/similardeals";
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
        titleid: "similardeals"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
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
    $.__views.sorts = Ti.UI.iOS.createTabbedBar({
        top: "40dp",
        left: "20dp",
        width: "280dp",
        height: "30dp",
        style: Ti.UI.iPhone.SystemButtonStyle.BAR,
        backgroundColor: "#007aff",
        font: {
            fontSize: "12dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "sorts",
        index: "0"
    });
    $.__views.wrapper.add($.__views.sorts);
    Sort ? $.__views.sorts.addEventListener("click", Sort) : __defers["$.__views.sorts!click!Sort"] = true;
    $.__views.is = Alloy.createWidget("nl.fokkezb.infiniteScroll", "widget", {
        id: "is",
        __parentSymbol: __parentSymbol
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
    var deal = arguments[0].deal || null;
    var elements = Alloy.createCollection("similarDeal");
    var indicator = Alloy.Globals.indicator;
    var Pager = function() {
        var page = 1;
        this.next = function() {
            page++;
            return page;
        };
    };
    {
        var updating = true;
        new Pager();
    }
    var dataLength = 10;
    $.sorts.labels = [ L("rating"), L("price"), L("distance"), L("dealtype") ];
    var sort = 1;
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.sorts!click!Sort"] && $.__views.sorts.addEventListener("click", Sort);
    __defers["$.__views.is!end!add"] && $.__views.is.on("end", add);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;