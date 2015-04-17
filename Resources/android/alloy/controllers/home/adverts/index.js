function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function fetch(data) {
        Alloy.Collections.publicAdverts.fetch({
            data: data,
            success: function(response, data) {
                if (Object.size(data) > 0) {
                    var dataArray = new Array();
                    dataArray.push(data);
                    data = dataArray;
                }
                if (data && data.length > 0) {
                    dataOffset = Alloy.Collections.publicAdverts.length;
                    $.window.setRightNavButton(switchButton);
                    setAnnotations();
                    loading = false;
                    Alloy.Globals.core.createRows(Alloy.Collections.publicAdverts, transform, $.adverts, "home/adverts/row");
                    $.adverts.visible = "true";
                }
            },
            error: function(model, xhr) {
                loading = false;
                if (xhr) {
                    var messageId;
                    var notFoundReason;
                    switch (xhr.Message) {
                      case "-1":
                        notFoundReason = -1;
                        messageId = "no_adverts_in_subcategories";
                        break;

                      case "-2":
                        notFoundReason = -2;
                        messageId = "no_adverts_in_you_location";
                    }
                    var alertDialog = Titanium.UI.createAlertDialog({
                        title: L("no_adverts_found"),
                        message: L(messageId),
                        buttonNames: [ L("no"), L("yes") ],
                        cancel: 0
                    });
                    alertDialog.addEventListener("click", function(e) {
                        if (e.cancel === e.index || true === e.cancel) {
                            $.window.close();
                            return;
                        }
                        switch (notFoundReason) {
                          case -1:
                            lastQuery = {
                                length: dataLength,
                                offset: 0,
                                subCategories: "[]",
                                distance: distance,
                                lat: lat,
                                lng: lng
                            };
                            allAdverts = true;
                            fetch(lastQuery);
                            break;

                          case -2:
                            lastQuery = {
                                length: dataLength,
                                offset: 0,
                                subCategories: "[]",
                                distance: -1,
                                lat: lat,
                                lng: lng
                            };
                            fetch(lastQuery);
                            allAdverts = true;
                        }
                    });
                    alertDialog.show();
                }
            }
        });
    }
    function close() {
        Alloy.Collections.publicAdverts.reset();
    }
    function add(e) {
        if (loading) {
            e.success();
            return false;
        }
        loading = true;
        allAdverts ? lastQuery.offset = dataOffset : lastQuery = {
            lng: lng,
            lat: lat,
            length: dataLength,
            offset: dataOffset,
            distance: distance,
            subCategories: JSON.stringify(subCategories),
            sort: sortType
        };
        Alloy.Collections.publicAdverts.fetch({
            silent: true,
            data: lastQuery,
            add: true,
            success: function(response, data) {
                loading = false;
                if (!data.length) {
                    e.done();
                    return;
                }
                Alloy.Globals.core.createRows(Alloy.Collections.publicAdverts, transform, $.adverts, "home/adverts/row");
                dataOffset += data.length;
                data.length < dataLength ? e.done() : e.success();
                setAnnotations();
            },
            error: function() {
                e.done();
                loading = false;
            }
        });
    }
    function setAnnotations() {
        annotations = [];
        var models = Alloy.Collections.publicAdverts.models;
        minLat = 999, maxLat = -999, minLng = 999, maxLng = -999;
        for (var index in models) {
            var model = models[index];
            var lat = parseFloat(model.attributes.lat);
            var lng = parseFloat(model.attributes.lng);
            lat > maxLat && (maxLat = lat);
            minLat > lat && (minLat = lat);
            lng > maxLng && (maxLng = lng);
            minLng > lng && (minLng = lng);
            annotations.push(Map.createAnnotation({
                latitude: lat,
                longitude: lng,
                title: model.attributes.name,
                subtitle: model.attributes.address,
                pincolor: Alloy.Globals.Map.ANNOTATION_RED,
                rightButton: Ti.UI.iPhone.SystemButton.DISCLOSURE,
                advertId: model.attributes.id
            }));
        }
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.distance = -1 == transform.distance ? "--" : transform.distance.toFixed(2) + " km";
        transform.images = transform.images && transform.images.length > 0 ? JSON.parse(transform.images) : [];
        transform.images.length > 0 && (transform.image = -1 != transform.images[0] ? "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + transform.images[0] + Alloy.Globals.imageSizes.advert.row() : "appicon-72.png");
        transform.price = transform.currency + " " + transform.price;
        return transform;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/adverts/index";
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
        layout: "horizontal",
        fullscreen: "true",
        id: "window",
        titleid: "advers"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    $.__views.wrapper = Ti.UI.createView({
        id: "wrapper"
    });
    $.__views.window.add($.__views.wrapper);
    $.__views.sortsLbl = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            width: "80dp",
            height: "30dp",
            color: "#007aff",
            left: Alloy.Globals.Styles.labelLeft,
            right: "60dp",
            textAlign: Alloy.Globals.Styles.labelTextAlign,
            font: {
                fontSize: "15dp",
                fontFamily: "Avenir Next Condensed"
            }
        });
        Alloy.Globals.isHebrew && _.extend(o, {
            left: Alloy.Globals.Styles.row_statusWrapLeft,
            right: Alloy.Globals.Styles.row_statusWrapRight
        });
        _.extend(o, {
            top: "10dp",
            id: "sortsLbl",
            textid: "sort_by",
            visible: "false"
        });
        return o;
    }());
    $.__views.wrapper.add($.__views.sortsLbl);
    $.__views.is = Alloy.createWidget("nl.fokkezb.infiniteScroll", "widget", {
        id: "is"
    });
    add ? $.__views.is.on("end", add) : __defers["$.__views.is!end!add"] = true;
    $.__views.adverts = Ti.UI.createTableView({
        backgroundColor: "#00ffffff",
        layout: "vertical",
        top: "40dp",
        bottom: "5dp",
        footerView: $.__views.is.getProxyPropertyEx("footerView", {
            recurse: true
        }),
        id: "adverts",
        visible: "false"
    });
    $.__views.wrapper.add($.__views.adverts);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var minLat, maxLat, minLng, maxLng, Map = require("ti.map"), dataOffset = (Alloy.Globals.geo, 
    0), dataLength = 10, distance = arguments[0].distance, subCategories = arguments[0].subCategories, loading = false, shownList = true, inProgress = false, switchButton = Ti.UI.createButton({
        titleid: "map"
    }), mapView = Alloy.createController("home/adverts/map").getView(), lat = (Alloy.Globals.geo, 
    arguments[0].lat), lng = arguments[0].lng, annotations = [], lastQuery = {}, allAdverts = false;
    $.window.setTitle(L("adverts"));
    var sortType = 0;
    switchButton.addEventListener("click", function() {
        if (inProgress) return false;
        inProgress = true;
        if (shownList) {
            mapView.annotations = annotations;
            Alloy.Globals.mapRegion = {
                latitude: (minLat + maxLat) / 2,
                longitude: (minLng + maxLng) / 2,
                latitudeDelta: 2 * (maxLat - minLat),
                longitudeDelta: 2 * (maxLng - minLng)
            };
            mapView.region = Alloy.Globals.mapRegion;
            $.wrapper.animate({
                view: mapView,
                transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
            }, function() {
                $.window.setTitle(L("map"));
                switchButton.setTitle(L("list"));
                shownList = false;
                inProgress = false;
            });
        } else $.wrapper.animate({
            view: $.adverts,
            transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
        }, function() {
            $.window.setTitle(L("adverts"));
            switchButton.setTitle(L("map"));
            shownList = true;
            inProgress = false;
        });
    });
    lastQuery = {
        length: dataLength,
        offset: 0,
        distance: distance,
        lat: lat,
        lng: lng,
        subCategories: JSON.stringify(subCategories),
        sort: sortType
    };
    fetch(lastQuery);
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    __defers["$.__views.is!end!add"] && $.__views.is.on("end", add);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;