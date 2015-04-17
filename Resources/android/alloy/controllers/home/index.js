function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function clickCategories() {
        indicator.openIndicator();
        var view = Alloy.createController("categories/index", {
            closeCallback: function() {
                subCategories = [];
                var customFindAdvirts = false;
                if (core.selectedHomeCategories["_1"]) for (var subCategoryKey in core.selectedHomeCategories["_1"]) {
                    if (!customFindAdvirts) {
                        customFindAdvirts = true;
                        findAdverts = true;
                    }
                    subCategories.push(core.selectedHomeCategories["_1"][subCategoryKey]);
                }
                if (!customFindAdvirts) {
                    findAdverts = false;
                    for (var categoryKey in core.selectedHomeCategories) {
                        var category = core.selectedHomeCategories[categoryKey];
                        for (var subCategoryKey in category) subCategories.push(category[subCategoryKey]);
                    }
                }
                $.selectedCategories.text = "";
                for (var categoryKey in core.selectedHomeCategories) if (Object.size(core.selectedHomeCategories[categoryKey]) > 0) {
                    categoryKey = categoryKey.replace("_", "");
                    var category = Alloy.Collections.categories.get(categoryKey);
                    $.selectedCategories.text += "" == $.selectedCategories.text ? category.attributes["name"] : ", " + category.attributes["name"];
                }
            },
            win: Alloy.CFG.tabHome,
            forDeals: false,
            sectionName: "home",
            withblock: true
        }).getView();
        indicator.closeIndicator();
        Alloy.CFG.tabHome.open(view);
    }
    function selectDistance(distance) {
        switch (distance) {
          case 100:
            $.scrollView.contentOffset = {
                x: 0,
                y: 0
            };
            break;

          case 250:
            $.scrollView.contentOffset = {
                x: 65,
                y: 0
            };
            break;

          case 500:
            $.scrollView.contentOffset = {
                x: 130,
                y: 0
            };
            break;

          case 750:
            $.scrollView.contentOffset = {
                x: 195,
                y: 0
            };
            break;

          case 1e3:
            $.scrollView.contentOffset = {
                x: 260,
                y: 0
            };
            break;

          case 2e3:
            $.scrollView.contentOffset = {
                x: 325,
                y: 0
            };
        }
    }
    function clickFind() {
        if (core.rxs.empty.test($.address.value)) {
            indicator.closeIndicator();
            Alloy.Globals.core.showErrorDialog(L("no_address"));
            return;
        }
        if (core.rxs.empty.test(subCategories)) {
            indicator.closeIndicator();
            Alloy.Globals.core.showErrorDialog(L("please_select_category"));
            return;
        }
        Ti.App.address = $.address.value;
        lat && lng && $.address.value === address || geo.geocoding($.address.value, function(e) {
            if (e.error == geo.elementStatuses.ZERO_RESULTS || e.error == geo.elementStatuses.NOT_FOUND) {
                indicator.closeIndicator();
                Alloy.Globals.core.showErrorDialog(L("address_not_found"));
                return;
            }
            if (e.error) {
                Alloy.Globals.core.showErrorDialog(L(e.message));
                $.findBtn.touchEnabled = true;
                return;
            }
            lat = parseFloat(e.response.results[0].geometry.location.lat);
            lng = parseFloat(e.response.results[0].geometry.location.lng);
            Ti.App.lat = lat;
            Ti.App.lng = lng;
            if (findAdverts) {
                var advertsWindow = Alloy.createController("home/adverts/index", {
                    lat: lat,
                    lng: lng,
                    distance: distance,
                    subCategories: subCategories
                }).getView();
                indicator.closeIndicator();
                advertsWindow.backButtonTitle = L("back");
                Alloy.CFG.tabHome.open(advertsWindow);
            } else {
                var dealsWindow = Alloy.createController("home/deals/index", {
                    lat: lat,
                    lng: lng,
                    distance: distance,
                    subCategories: subCategories
                }).getView();
                indicator.closeIndicator();
                dealsWindow.backButtonTitle = L("back");
                Alloy.CFG.tabHome.open(dealsWindow);
            }
        });
    }
    function customLocation() {
        var geo = Alloy.Globals.geo;
        geo.checkLocation(function() {
            if (geo.location.status != geo.errors.NONE) {
                Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
                indicator.closeIndicator();
                return;
            }
            lat = geo.location.lat;
            lng = geo.location.lng;
            geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
                indicator.closeIndicator();
                e && e.error ? Alloy.Globals.core.showErrorDialog(e.message ? L(e.message) : L(e.error)) : e && e.response && (e.response.results && e.response.results[0] && e.response.results[0].formatted_address ? $.address.value = e.response.results[0].formatted_address : e.response.resourceSets && e.response.resourceSets[0] && e.response.resourceSets[0].resources[0].address.formattedAddress && ($.address.value = e.response.resourceSets[0].resources[0].address.formattedAddress));
            });
        });
    }
    function transform(model) {
        var transform = model.toJSON();
        transform.price = transform.currency + " " + transform.price;
        transform.distance = parseFloat(transform.distance).toFixed(2) + " km";
        transform.myLat = lat;
        transform.myLng = lng;
        transform.dealtype = Alloy.Globals.core.dealType[transform.dealtype].title;
        transform.endTime && (transform.endTime = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(transform.endTime)));
        transform.images = transform.images && transform.images.length > 0 ? JSON.parse(transform.images) : [];
        transform.images.length > 0 && (transform.image = "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + transform.images[0] + Alloy.Globals.imageSizes.deal.row());
        transformCount++;
        return transform;
    }
    function loadCategories(deviceToken) {
        indicator.openIndicator();
        Alloy.Collections.categories.fetch({
            data: {
                lng: Ti.Platform.locale
            },
            cache: {
                name: "categories",
                validMinutes: 60
            },
            success: function() {
                loadSubcategories(deviceToken);
            },
            error: function() {
                loadCategories(deviceToken);
                indicator.closeIndicator();
            }
        });
    }
    function loadSubcategories(deviceToken) {
        indicator.openIndicator();
        Alloy.Collections.subCategories.fetch({
            data: {
                lng: Ti.Platform.locale
            },
            cache: {
                name: "subCategories",
                validMinutes: 60
            },
            success: function() {
                loadNotifications(deviceToken);
            },
            error: function() {
                loadSubcategories(deviceToken);
                indicator.closeIndicator();
            }
        });
    }
    function loadNotifications(deviceToken) {
        indicator.openIndicator();
        var notify = Alloy.createModel("notify");
        notify.fetch({
            data: {
                deviceToken: deviceToken,
                appInstallId: Alloy.Globals.core.installId,
                appVersion: Ti.App.version,
                platformModel: Ti.Platform.model,
                platformVersion: Ti.Platform.version,
                platformOSName: "android",
                language: Ti.Locale.currentLanguage,
                lat: lat,
                lng: lng,
                offset: new Date().getTimezoneOffset()
            },
            success: function() {
                notify = notify.toJSON();
                Alloy.Globals.notify = {
                    id: notify.id,
                    subCategories: notify.subcategories,
                    period: notify.period,
                    for_: notify.for_,
                    from: notify.from,
                    to: notify.to,
                    deviceToken: notify.devicetoken,
                    lat: notify.lat,
                    lng: notify.lng,
                    distance: notify.distance
                };
                Ti.App.fireEvent("notify:notifyload");
                indicator.closeIndicator();
            },
            error: function() {
                loadNotifications(deviceToken);
                indicator.closeIndicator();
            }
        });
    }
    function findTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function findTouchEnd(e) {
        indicator.openIndicator();
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        switch (e.source.id) {
          case "findBtn":
            clickFind();
            break;

          case "customLocation":
            customLocation();
            break;

          case "settings":
            goToNotifications();
        }
    }
    function goToNotifications() {
        indicator.closeIndicator();
        Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabNotifications);
    }
    function search() {
        geo.geocoding($.address.value, function(geodata) {
            if (geodata.error == geo.elementStatuses.ZERO_RESULTS || geodata.error == geo.elementStatuses.NOT_FOUND) {
                Alloy.Globals.core.showErrorDialog(L("address_not_found"));
                return;
            }
            var items = [];
            for (var i = 0; i < geodata.response.results.length; i++) {
                var result = geodata.response.results[i];
                items.push({
                    title: result.formatted_address,
                    data: {
                        lat: result.geometry.location.lat,
                        lng: result.geometry.location.lng
                    }
                });
            }
            var addressPicker = Alloy.createController("picker/genericPicker", {
                callback: function(item, close, index) {
                    $.address.value = item.title ? item.title : item;
                    if (item.data) {
                        lat = item.data.lat;
                        lng = item.data.lng;
                    }
                    index && (rowIndex = index);
                    close && $.pickerWrap.removeAllChildren();
                },
                rowIndex: rowIndex,
                items: items
            }).getView();
            closeKeyboard();
            $.pickerWrap.removeAllChildren();
            $.pickerWrap.add(addressPicker);
        });
    }
    function open() {
        indicator.openIndicator();
        selectDistance(2e3);
        newFatch();
        if ("Simulator" == Ti.Platform.model) {
            if (!lat && !lng) {
                lat = 59, 9885368;
                lng = 30, 2922766;
            }
            loadCategories(Alloy.CFG.deviceToken);
        }
    }
    function winOnClick(e) {
        "address" != e.source.id && closeKeyboard();
    }
    function closeKeyboard() {
        $.address.blur();
    }
    function add(e) {
        beginUpdate(e);
    }
    function beginUpdate() {
        indicator.openIndicator();
        updating = true;
        Alloy.Globals.core.apiToken();
        var time = new Date();
        aliments.fetch({
            add: true,
            silent: true,
            data: {
                offset: aliments.length,
                lat: lat,
                lng: lng,
                clientTimeZoneOffset: time.getTimezoneOffset(),
                distance: 2e3,
                token: Alloy.Globals.core.apiToken(),
                deviceToken: Alloy.Globals.core.deviceToken,
                subcategoriesOnly: true,
                appInstallId: Alloy.Globals.core.installId,
                appVersion: Ti.App.version,
                platformModel: Ti.Platform.model,
                platformVersion: Ti.Platform.version,
                platformOSName: "android",
                language: Ti.Locale.currentLanguage,
                subcategories: JSON.stringify(subcats)
            },
            success: function(response, data) {
                Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/defaultSearchRow");
                var rows = $.deals.data[0].rows;
                var height = 0;
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var image = row.toImage();
                    height += image.height;
                }
                $.deals.setHeight(height);
                if (data.length < dataLength) {
                    $.loadMore.hide();
                    $.noLoad.show();
                }
                Ti.API.info(transformCount);
                updating = false;
                indicator.closeIndicator();
                transformCount = 0;
            },
            error: function() {
                updating = false;
                indicator.closeIndicator();
            }
        });
    }
    function NewFetch() {
        var time = new Date();
        indicator.openIndicator();
        subcats = [];
        var items = JSON.parse(Alloy.Globals.notify.subCategories);
        for (var i = 0; i < items.length; i++) {
            var s = items[i];
            subcats.push(s.Id ? s.Id : s);
        }
        aliments.fetch({
            data: {
                lat: lat,
                lng: lng,
                clientTimeZoneOffset: time.getTimezoneOffset(),
                distance: Alloy.Globals.notify.distance,
                token: Alloy.Globals.core.apiToken(),
                subCategoriesOnly: true,
                deviceToken: Alloy.Globals.core.deviceToken,
                appInstallId: Alloy.Globals.core.installId,
                appVersion: Ti.App.version,
                platformModel: Ti.Platform.model,
                platformVersion: Ti.Platform.version,
                platformOSName: "android",
                language: Ti.Locale.currentLanguage,
                subcategories: JSON.stringify(subcats)
            },
            success: function(response, data) {
                Alloy.Globals.core.createRows(aliments, transform, $.deals, "home/deals/defaultSearchRow");
                var rows = $.deals.data[0].rows;
                var height = 0;
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var image = row.toImage();
                    height += image.height;
                }
                $.deals.setHeight(height);
                updating = false;
                indicator.closeIndicator();
                if (data.length < dataLength) {
                    $.loadMore.hide();
                    $.noLoad.show();
                } else {
                    $.loadMore.show();
                    $.noLoad.hide();
                }
                Ti.API.info(transformCount);
                transformCount = 0;
            },
            error: function() {
                updating = true;
                indicator.closeIndicator();
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/index";
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
    $.__views.mainWindow = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "absolute",
        titleImage: "images/headTitle@2x.png",
        fullscreen: "true",
        id: "mainWindow"
    });
    $.__views.mainWindow && $.addTopLevelView($.__views.mainWindow);
    winOnClick ? $.__views.mainWindow.addEventListener("click", winOnClick) : __defers["$.__views.mainWindow!click!winOnClick"] = true;
    open ? $.__views.mainWindow.addEventListener("open", open) : __defers["$.__views.mainWindow!open!open"] = true;
    $.__views.__alloyId172 = Ti.UI.createScrollView({
        layout: "vertical",
        top: "0",
        id: "__alloyId172"
    });
    $.__views.mainWindow.add($.__views.__alloyId172);
    $.__views.__alloyId173 = Ti.UI.createView({
        left: "20dp",
        right: "20dp",
        layout: "vertical",
        height: Ti.UI.SIZE,
        id: "__alloyId173"
    });
    $.__views.__alloyId172.add($.__views.__alloyId173);
    $.__views.__alloyId174 = Ti.UI.createLabel({
        height: "80dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "what_looking",
        id: "__alloyId174"
    });
    $.__views.__alloyId173.add($.__views.__alloyId174);
    $.__views.scrollView = Ti.UI.createScrollView({
        layout: "horizontal",
        width: "280dp",
        height: Alloy.Globals.Styles.inputHeight,
        top: "-10dp",
        bottom: "20dp",
        left: "0dp",
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        backgroundColor: "#fff",
        backgroundImage: "images/icon_horizontalPicker.png",
        id: "scrollView",
        borderRadius: "10dp"
    });
    $.__views.__alloyId173.add($.__views.scrollView);
    $.__views.__alloyId175 = Ti.UI.createView({
        width: "50dp",
        height: "30dp",
        distance: "0",
        id: "__alloyId175"
    });
    $.__views.scrollView.add($.__views.__alloyId175);
    $.__views.__alloyId176 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "0",
        id: "__alloyId176"
    });
    $.__views.scrollView.add($.__views.__alloyId176);
    $.__views.__alloyId177 = Ti.UI.createLabel({
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "15dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "distance_wheel",
        id: "__alloyId177"
    });
    $.__views.__alloyId176.add($.__views.__alloyId177);
    $.__views.__alloyId178 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "100",
        id: "__alloyId178"
    });
    $.__views.scrollView.add($.__views.__alloyId178);
    $.__views.__alloyId179 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "100 m",
        id: "__alloyId179"
    });
    $.__views.__alloyId178.add($.__views.__alloyId179);
    $.__views.__alloyId180 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "250",
        id: "__alloyId180"
    });
    $.__views.scrollView.add($.__views.__alloyId180);
    $.__views.__alloyId181 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "250 m",
        id: "__alloyId181"
    });
    $.__views.__alloyId180.add($.__views.__alloyId181);
    $.__views.__alloyId182 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "500",
        id: "__alloyId182"
    });
    $.__views.scrollView.add($.__views.__alloyId182);
    $.__views.__alloyId183 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "500 m",
        id: "__alloyId183"
    });
    $.__views.__alloyId182.add($.__views.__alloyId183);
    $.__views.__alloyId184 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "750",
        id: "__alloyId184"
    });
    $.__views.scrollView.add($.__views.__alloyId184);
    $.__views.__alloyId185 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "750 m",
        id: "__alloyId185"
    });
    $.__views.__alloyId184.add($.__views.__alloyId185);
    $.__views.__alloyId186 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "1000",
        id: "__alloyId186"
    });
    $.__views.scrollView.add($.__views.__alloyId186);
    $.__views.__alloyId187 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "1000 m",
        id: "__alloyId187"
    });
    $.__views.__alloyId186.add($.__views.__alloyId187);
    $.__views.__alloyId188 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "2000",
        id: "__alloyId188"
    });
    $.__views.scrollView.add($.__views.__alloyId188);
    $.__views.__alloyId189 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "2000 m",
        id: "__alloyId189"
    });
    $.__views.__alloyId188.add($.__views.__alloyId189);
    $.__views.__alloyId190 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "0",
        id: "__alloyId190"
    });
    $.__views.scrollView.add($.__views.__alloyId190);
    $.__views.__alloyId191 = Ti.UI.createLabel({
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "15dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "distance_wheel",
        id: "__alloyId191"
    });
    $.__views.__alloyId190.add($.__views.__alloyId191);
    $.__views.__alloyId192 = Ti.UI.createView({
        width: "37dp",
        height: "30dp",
        distance: "0",
        id: "__alloyId192"
    });
    $.__views.scrollView.add($.__views.__alloyId192);
    $.__views.categoriesLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "categoriesLbl",
        textid: "categories"
    });
    $.__views.__alloyId173.add($.__views.categoriesLbl);
    $.__views.categoriesBtn = Ti.UI.createButton({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        textAlign: "left",
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        title: "",
        id: "categoriesBtn"
    });
    $.__views.__alloyId173.add($.__views.categoriesBtn);
    clickCategories ? $.__views.categoriesBtn.addEventListener("click", clickCategories) : __defers["$.__views.categoriesBtn!click!clickCategories"] = true;
    $.__views.__alloyId193 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        left: "5dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        textid: "select_category",
        id: "__alloyId193"
    });
    $.__views.categoriesBtn.add($.__views.__alloyId193);
    $.__views.selectedCategories = Ti.UI.createLabel({
        height: "20dp",
        left: "52dp",
        right: "15dp",
        top: "7dp",
        color: "#aaa",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "12dp",
            fontFamily: "Arial"
        },
        id: "selectedCategories"
    });
    $.__views.categoriesBtn.add($.__views.selectedCategories);
    $.__views.__alloyId194 = Ti.UI.createLabel({
        width: "20dp",
        height: "20dp",
        right: "5dp",
        top: "5dp",
        backgroundImage: "images/icon_listItem.png",
        backgroundRepeat: false,
        id: "__alloyId194"
    });
    $.__views.categoriesBtn.add($.__views.__alloyId194);
    $.__views.addressLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "addressLbl",
        textid: "address"
    });
    $.__views.__alloyId173.add($.__views.addressLbl);
    $.__views.__alloyId195 = Ti.UI.createView({
        layout: "absolute",
        width: Alloy.Globals.Styles.inputWidth,
        height: "30dp",
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "__alloyId195"
    });
    $.__views.__alloyId173.add($.__views.__alloyId195);
    $.__views.address = Ti.UI.createTextField({
        width: "160dp",
        height: "30dp",
        top: "0dp",
        left: "2dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        color: Alloy.Globals.Styles.inputColor,
        paddingLeft: "5dp",
        id: "address",
        returnKeyType: Ti.UI.RETURNKEY_SEARCH
    });
    $.__views.__alloyId195.add($.__views.address);
    search ? $.__views.address.addEventListener("return", search) : __defers["$.__views.address!return!search"] = true;
    $.__views.customLocation = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        bottom: "0dp",
        right: "0dp",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "20dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        backgroundImage: "images/icon_location.png",
        backgroundRepeat: false,
        id: "customLocation"
    });
    $.__views.__alloyId195.add($.__views.customLocation);
    findTouchStart ? $.__views.customLocation.addEventListener("touchstart", findTouchStart) : __defers["$.__views.customLocation!touchstart!findTouchStart"] = true;
    findTouchEnd ? $.__views.customLocation.addEventListener("touchend", findTouchEnd) : __defers["$.__views.customLocation!touchend!findTouchEnd"] = true;
    $.__views.findBtn = Ti.UI.createButton({
        width: "120dp",
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
        id: "findBtn",
        titleid: "find_button"
    });
    $.__views.__alloyId173.add($.__views.findBtn);
    findTouchStart ? $.__views.findBtn.addEventListener("touchstart", findTouchStart) : __defers["$.__views.findBtn!touchstart!findTouchStart"] = true;
    findTouchEnd ? $.__views.findBtn.addEventListener("touchend", findTouchEnd) : __defers["$.__views.findBtn!touchend!findTouchEnd"] = true;
    $.__views.__alloyId196 = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        textAlign: "center",
        bottom: "12dp",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "18dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "default_search",
        id: "__alloyId196"
    });
    $.__views.__alloyId172.add($.__views.__alloyId196);
    $.__views.settings = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        top: "-40dp",
        right: "40dp",
        backgroundImage: "images/icon_settings.png",
        id: "settings"
    });
    $.__views.__alloyId172.add($.__views.settings);
    goToNotifications ? $.__views.settings.addEventListener("click", goToNotifications) : __defers["$.__views.settings!click!goToNotifications"] = true;
    $.__views.__alloyId197 = Ti.UI.createButton({
        width: "31dp",
        height: "31dp",
        backgroundColor: "transparent",
        backgroundFocusedColor: "transparent",
        backgroundRepeat: false,
        backgroundImage: "images/ic_action_turn_right.png",
        backgroundSelectedImage: "images/ic_action_turn_right1.png",
        id: "__alloyId197"
    });
    $.__views.__alloyId172.add($.__views.__alloyId197);
    getHomeDeals ? $.__views.__alloyId197.addEventListener("click", getHomeDeals) : __defers["$.__views.__alloyId197!click!getHomeDeals"] = true;
    $.__views.deals = Ti.UI.createTableView({
        backgroundColor: "transparent",
        id: "deals",
        height: Ti.UI.SIZE
    });
    $.__views.__alloyId172.add($.__views.deals);
    $.__views.loadMore = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "15dp",
        top: "5dp",
        textAlign: "center",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "17dp"
        },
        color: "#999",
        textid: "isTap",
        id: "loadMore"
    });
    $.__views.__alloyId172.add($.__views.loadMore);
    add ? $.__views.loadMore.addEventListener("click", add) : __defers["$.__views.loadMore!click!add"] = true;
    $.__views.noLoad = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "15dp",
        top: "5dp",
        textAlign: "center",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "17dp"
        },
        color: "#999",
        textid: "isDone",
        id: "noLoad",
        visible: "false"
    });
    $.__views.__alloyId172.add($.__views.noLoad);
    $.__views.__alloyId198 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId198"
    });
    $.__views.__alloyId172.add($.__views.__alloyId198);
    $.__views.mapView = Ti.UI.createView({
        visible: "false",
        id: "mapView",
        height: "0dp"
    });
    $.__views.__alloyId172.add($.__views.mapView);
    $.__views.pickerWrap = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "pickerWrap"
    });
    $.__views.mainWindow.add($.__views.pickerWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.chat.openChatId = false;
    var core = Alloy.Globals.core, subCategories = [], aliments = Alloy.Collections.homeDeals, findAdverts = false, address = Ti.App.address || false, lat = Ti.App.lat || false, lng = Ti.App.lng || false;
    Ti.App.address && ($.address.value = Ti.App.address);
    Ti.App.Properties.setString("str", "");
    var indicator = Alloy.Globals.indicator;
    $.address.setHintText(L("enter_address"));
    $.scrollView.contentOffset = {
        x: 45,
        y: 0
    };
    var distance = 100;
    $.scrollView.addEventListener("scroll", function(e) {
        distance = e.x >= 325 ? 2e3 : e.x >= 260 ? 1e3 : e.x >= 195 ? 750 : e.x >= 130 ? 500 : e.x >= 65 ? 250 : 100;
    });
    var transformCount = 0;
    var getHomeDeals = function() {
        var geo = Alloy.Globals.geo;
        geo.checkLocation(function() {
            if (geo.location.status != geo.errors.NONE) {
                Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
                indicator.closeIndicator();
                return;
            }
            lat = geo.location.latitude;
            lng = geo.location.longitude;
            NewFetch();
            geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
                e && e.error ? Alloy.Globals.core.showErrorDialog(e.message ? L(e.message) : L(e.error)) : e && e.response && (e.response.results && e.response.results[0] && e.response.results[0].formatted_address ? $.address.value = e.response.results[0].formatted_address : e.response.resourceSets && e.response.resourceSets[0] && e.response.resourceSets[0].resources[0].address.formattedAddress && ($.address.value = e.response.resourceSets[0].resources[0].address.formattedAddress));
            });
        });
    };
    var subcats = [];
    var newFatch = function() {
        if (!Ti.Network.online) {
            Alloy.Globals.core.showErrorDialog(L("network_off_line"));
            indicator.closeIndicator();
            return;
        }
    };
    Ti.App.Properties.setInt("count", 0);
    Ti.App.addEventListener("resumed", function() {
        Ti.API.info("resumed!!!!!");
        Alloy.Globals.notify && Ti.App.Properties.setObject("notify", Alloy.Globals.notify);
        var token = Alloy.Globals.core.apiToken();
        if (!Ti.Network.online) {
            Alloy.Globals.core.offlineModal || Alloy.Globals.core.createOfflineModal();
            Alloy.Globals.core.offlineModal.show();
            return;
        }
        getHomeDeals();
        Ti.App.Properties.setObject("messages", []);
        Alloy.Globals.core.applicationPaused = false;
        if (!token) return;
        Alloy.Globals.chat.connected && Alloy.Globals.chat.source.close();
        Alloy.Globals.chat.openConnect();
        if (Alloy.Globals.chat.openChatId > 0) {
            var indicator = Alloy.Globals.indicator;
            indicator.openIndicator();
            var messages = Alloy.createCollection("message");
            messages.fetch({
                data: {
                    chatId: Alloy.Globals.chat.openChatId,
                    offset: 0,
                    length: 10
                },
                success: function(response, data) {
                    Alloy.Globals.chat.items = [];
                    var items = Alloy.Globals.chat.addMessage(data);
                    Alloy.Globals.chat.messagesWindow.setData(items);
                    Alloy.Globals.chat.messagesWindow.data[0] && Alloy.Globals.chat.messagesWindow.scrollToIndex(Alloy.Globals.chat.messagesWindow.data[0].rows.length - 1);
                },
                error: function() {
                    indicator.closeIndicator();
                }
            });
            Alloy.Collections.messages.fetch({
                data: {
                    chatId: Alloy.Globals.chat.openChatId
                },
                success: function() {
                    indicator.closeIndicator();
                }
            });
        }
    });
    var rowIndex;
    Ti.App.addEventListener("home:defaultsearch", function() {
        update = false;
        getHomeDeals();
    });
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
    __defers["$.__views.mainWindow!click!winOnClick"] && $.__views.mainWindow.addEventListener("click", winOnClick);
    __defers["$.__views.mainWindow!open!open"] && $.__views.mainWindow.addEventListener("open", open);
    __defers["$.__views.categoriesBtn!click!clickCategories"] && $.__views.categoriesBtn.addEventListener("click", clickCategories);
    __defers["$.__views.address!return!search"] && $.__views.address.addEventListener("return", search);
    __defers["$.__views.customLocation!touchstart!findTouchStart"] && $.__views.customLocation.addEventListener("touchstart", findTouchStart);
    __defers["$.__views.customLocation!touchend!findTouchEnd"] && $.__views.customLocation.addEventListener("touchend", findTouchEnd);
    __defers["$.__views.findBtn!touchstart!findTouchStart"] && $.__views.findBtn.addEventListener("touchstart", findTouchStart);
    __defers["$.__views.findBtn!touchend!findTouchEnd"] && $.__views.findBtn.addEventListener("touchend", findTouchEnd);
    __defers["$.__views.settings!click!goToNotifications"] && $.__views.settings.addEventListener("click", goToNotifications);
    __defers["$.__views.__alloyId197!click!getHomeDeals"] && $.__views.__alloyId197.addEventListener("click", getHomeDeals);
    __defers["$.__views.loadMore!click!add"] && $.__views.loadMore.addEventListener("click", add);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;