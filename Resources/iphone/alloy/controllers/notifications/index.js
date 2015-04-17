function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function blur(e) {
        e.source.id !== $.period.id && e.source.id !== $.for_.id && e.source.id !== $.start.id && e.source.id !== $.end.id && $.pickerWrap.removeAllChildren();
    }
    function newNotifySave() {
        newNotify = true;
        var periodCount = 0;
        for (var i = 0; i < periodItems.length; i++) {
            var periodItem = periodItems[i];
            if (periodItem.data.id == period) break;
            periodCount++;
        }
        periodRowIndex = periodCount;
        $.period.value = periodItems[periodRowIndex].title;
        var dateNow = new Date();
        var startDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 9, 0, 0);
        selectedStartDate = startDate;
        $.start.value = startDate.toLocaleTimeString();
        from = 60 * startDate.getUTCHours() + startDate.getUTCMinutes();
        var endDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 19, 0, 0);
        selectedEndDate = endDate;
        $.end.value = endDate.toLocaleTimeString();
        to = 60 * endDate.getUTCHours() + endDate.getUTCMinutes();
        selectDistance(distance);
        core.selectedNotificationsCategories = {};
        for_ > 0 && (forRowIndex = for_ - 1);
        $.for_.value = forItems[forRowIndex].title;
        save();
    }
    function notifyLoad() {
        notifyToEdit = Alloy.Globals.notify;
        if (notifyToEdit) {
            subCategories = JSON.parse(notifyToEdit.subCategories);
            core.currentSection = sectionName;
            core.selectedNotificationsCategories = {};
            for (var i = 0; i < subCategories.length; ++i) {
                var s = subCategories[i];
                core.subCategories.select({
                    categoryId: s.CategoryId,
                    id: s.Id
                }, core.selectedNotificationsCategories);
            }
            displayCategories();
            period = notifyToEdit.period;
            for_ = notifyToEdit.for_;
            from = notifyToEdit.from;
            to = notifyToEdit.to;
            distance = notifyToEdit.distance;
            for_ > 0 && (forRowIndex = for_ - 1);
            $.for_.value = forItems[forRowIndex].title;
            var periodCount = 0;
            for (var i = 0; i < periodItems.length; i++) {
                var periodItem = periodItems[i];
                if (periodItem.data.id == period) break;
                periodCount++;
            }
            periodRowIndex = periodCount;
            $.period.value = periodItems[periodRowIndex].title;
            if (from > 0) {
                var time = Alloy.Globals.core.createTime(from);
                $.start.value = time.toLocaleTimeString();
                selectedStartDate = time;
            }
            if (to > 0) {
                var time = Alloy.Globals.core.createTime(to);
                $.end.value = time.toLocaleTimeString();
                selectedEndDate = time;
            }
            selectDistance(distance);
            Ti.App.fireEvent("home:defaultsearch");
        }
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
    function clickCategories() {
        var view = Alloy.createController("categories/index", {
            closeCallback: function() {
                subCategories = [];
                for (var categoryKey in core.selectedNotificationsCategories) {
                    var category = core.selectedNotificationsCategories[categoryKey];
                    for (var subCategoryKey in category) subCategories.push(category[subCategoryKey]);
                }
                displayCategories();
            },
            sectionName: sectionName,
            win: Alloy.CFG.tabNotifications,
            forDeals: true
        }).getView();
        Ti.API.info("view created");
        Alloy.CFG.tabNotifications.open(view);
    }
    function displayCategories() {
        $.selectedCategories.text = "";
        for (var categoryKey in core.currentSectionCategories()) if (Object.size(core.currentSectionCategories()[categoryKey]) > 0) {
            categoryKey = categoryKey.replace("_", "");
            var category = Alloy.Collections.categories.get(categoryKey);
            category && ($.selectedCategories.text += "" == $.selectedCategories.text ? category.attributes["name"] : ", " + category.attributes["name"]);
        }
    }
    function clickPeriod() {
        var periodPicker = Alloy.createController("picker/genericPicker", {
            items: periodItems,
            rowIndex: periodRowIndex,
            callback: function(item, close, index) {
                $.period.value = item.title ? item.title : item;
                item.data && (period = item.data.id);
                index >= 0 && (periodRowIndex = index);
                close && $.pickerWrap.removeAllChildren();
            }
        }).getView();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(periodPicker);
    }
    function clickFor() {
        var startForPicker = Alloy.createController("picker/genericPicker", {
            items: forItems,
            rowIndex: forRowIndex,
            callback: function(item, close, index) {
                $.for_.value = item.title ? item.title : item;
                item.data && (for_ = item.data.id);
                index >= 0 && (forRowIndex = index);
                close && $.pickerWrap.removeAllChildren();
            }
        }).getView();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(startForPicker);
    }
    function clickStart() {
        var startTimePicker = Alloy.createController("picker/time", {
            maxTime: selectedEndDate,
            callback: function(e, close) {
                selectedStartDate = e;
                from = 60 * e.getUTCHours() + e.getUTCMinutes();
                $.start.value = e.toLocaleTimeString();
                Ti.API.info(e.getUTCHours(), e.getUTCMinutes(), from);
                close && $.pickerWrap.removeAllChildren();
            }
        }).getView();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(startTimePicker);
    }
    function clickEnd() {
        var endTimePicker = Alloy.createController("picker/time", {
            minTime: selectedStartDate,
            callback: function(e, close) {
                selectedEndDate = e;
                to = 60 * e.getUTCHours() + e.getUTCMinutes();
                $.end.value = e.toLocaleTimeString();
                Ti.API.info(e.getUTCHours(), e.getUTCMinutes(), from);
                close && $.pickerWrap.removeAllChildren();
            }
        }).getView();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(endTimePicker);
    }
    function post() {
        indicator.openIndicator();
        var subcategoriesForSave = [];
        for (var i = 0; i < subCategories.length; ++i) {
            var s = subCategories[i];
            subcategoriesForSave.push(s.Id ? s.Id : s);
        }
        var deviceToken = Alloy.Globals.core.deviceToken;
        "Simulator" == Ti.Platform.model && (deviceToken = "fake_device_ token");
        var notify = Alloy.createModel("notify", {
            deviceToken: deviceToken,
            subCategories: JSON.stringify(subcategoriesForSave),
            period: period,
            for_: for_,
            from: from,
            to: to,
            distance: distance,
            appInstallId: Alloy.Globals.core.installId,
            appVersion: Ti.App.version,
            platformModel: Ti.Platform.model,
            platformVersion: Ti.Platform.version,
            platformOSName: Ti.Platform.osname,
            language: Ti.Locale.currentLanguage,
            offset: new Date().getTimezoneOffset()
        });
        var geo = Alloy.Globals.geo;
        geo.checkLocation(function() {
            notify.attributes.lat = geo.location.latitude;
            notify.attributes.lng = geo.location.longitude;
            notify.save({}, {
                success: function() {
                    indicator.closeIndicator();
                    Ti.API.info(newNotify);
                    if (!newNotify) {
                        var dialog = Titanium.UI.createAlertDialog({
                            title: L("notyfication_settings_updated")
                        });
                        dialog.addEventListener("click", function() {
                            Ti.App.fireEvent("home:defaultsearch");
                            Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabHome);
                        });
                        dialog.show();
                    }
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
                    Alloy.Collections.homeDeals.reset();
                    newNotify = false;
                    Alloy.Globals.notify = notify;
                    Ti.App.Properties.setObject("notify", Alloy.Globals.notify);
                },
                error: function(model, xhr) {
                    Ti.API.info(xhr.status);
                    indicator.closeIndicator();
                }
            });
        });
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        indicator.openIndicator();
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        switch (e.source.id) {
          case "update":
            save();
            break;

          case "cancel":
            notifyLoad();
        }
    }
    function save() {
        if (!Ti.Network.online) {
            indicator.closeIndicator();
            Alloy.Globals.core.showErrorDialog(L("network_off_line"));
            return;
        }
        indicator.closeIndicator();
        post();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "notifications/index";
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
        layout: "absolute",
        id: "window",
        fullscreen: "true",
        titleid: "notifications",
        height: Ti.UI.FILL
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    $.__views.__alloyId282 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        top: "0",
        id: "__alloyId282"
    });
    $.__views.window.add($.__views.__alloyId282);
    $.__views.__alloyId283 = Ti.UI.createLabel({
        height: "80dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "notifications",
        id: "__alloyId283"
    });
    $.__views.__alloyId282.add($.__views.__alloyId283);
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
    $.__views.__alloyId282.add($.__views.categoriesLbl);
    $.__views.categories = Ti.UI.createView({
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
        id: "categories"
    });
    $.__views.__alloyId282.add($.__views.categories);
    clickCategories ? $.__views.categories.addEventListener("click", clickCategories) : __defers["$.__views.categories!click!clickCategories"] = true;
    $.__views.__alloyId284 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        left: "5dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        textid: "select_category",
        id: "__alloyId284"
    });
    $.__views.categories.add($.__views.__alloyId284);
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
    $.__views.categories.add($.__views.selectedCategories);
    $.__views.__alloyId285 = Ti.UI.createLabel({
        width: "20dp",
        height: "20dp",
        right: "5dp",
        top: "5dp",
        backgroundImage: "images/icon_listItem.png",
        backgroundRepeat: false,
        id: "__alloyId285"
    });
    $.__views.categories.add($.__views.__alloyId285);
    $.__views.periodLbl = Ti.UI.createLabel({
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
        id: "periodLbl",
        textid: "period"
    });
    $.__views.__alloyId282.add($.__views.periodLbl);
    $.__views.period = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "period",
        enabled: "false",
        value: L("_15_min")
    });
    $.__views.__alloyId282.add($.__views.period);
    clickPeriod ? $.__views.period.addEventListener("click", clickPeriod) : __defers["$.__views.period!click!clickPeriod"] = true;
    $.__views.forLbl = Ti.UI.createLabel({
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
        id: "forLbl",
        textid: "for_"
    });
    $.__views.__alloyId282.add($.__views.forLbl);
    $.__views.for_ = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "for_",
        enabled: "false",
        value: L("new_deals")
    });
    $.__views.__alloyId282.add($.__views.for_);
    clickFor ? $.__views.for_.addEventListener("click", clickFor) : __defers["$.__views.for_!click!clickFor"] = true;
    $.__views.hoursLbl = Ti.UI.createLabel({
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
        id: "hoursLbl",
        textid: "hours_start"
    });
    $.__views.__alloyId282.add($.__views.hoursLbl);
    $.__views.start = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "start",
        enabled: "false",
        value: "00:00"
    });
    $.__views.__alloyId282.add($.__views.start);
    clickStart ? $.__views.start.addEventListener("click", clickStart) : __defers["$.__views.start!click!clickStart"] = true;
    $.__views.__alloyId286 = Ti.UI.createLabel({
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
        textid: "hours_finish",
        id: "__alloyId286"
    });
    $.__views.__alloyId282.add($.__views.__alloyId286);
    $.__views.end = Ti.UI.createTextField({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        backgroundColor: "#fff",
        color: Alloy.Globals.Styles.inputColor,
        id: "end",
        enabled: "false",
        value: "00:00"
    });
    $.__views.__alloyId282.add($.__views.end);
    clickEnd ? $.__views.end.addEventListener("click", clickEnd) : __defers["$.__views.end!click!clickEnd"] = true;
    $.__views.scrollView = Ti.UI.createScrollView({
        layout: "horizontal",
        width: "280dp",
        height: Alloy.Globals.Styles.inputHeight,
        top: "10dp",
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
    $.__views.__alloyId282.add($.__views.scrollView);
    $.__views.__alloyId287 = Ti.UI.createView({
        width: "50dp",
        height: "30dp",
        distance: "0",
        id: "__alloyId287"
    });
    $.__views.scrollView.add($.__views.__alloyId287);
    $.__views.__alloyId288 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "0",
        id: "__alloyId288"
    });
    $.__views.scrollView.add($.__views.__alloyId288);
    $.__views.__alloyId289 = Ti.UI.createLabel({
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "15dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "distance_wheel",
        id: "__alloyId289"
    });
    $.__views.__alloyId288.add($.__views.__alloyId289);
    $.__views.__alloyId290 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "100",
        id: "__alloyId290"
    });
    $.__views.scrollView.add($.__views.__alloyId290);
    $.__views.__alloyId291 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "100 m",
        id: "__alloyId291"
    });
    $.__views.__alloyId290.add($.__views.__alloyId291);
    $.__views.__alloyId292 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "250",
        id: "__alloyId292"
    });
    $.__views.scrollView.add($.__views.__alloyId292);
    $.__views.__alloyId293 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "250 m",
        id: "__alloyId293"
    });
    $.__views.__alloyId292.add($.__views.__alloyId293);
    $.__views.__alloyId294 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "500",
        id: "__alloyId294"
    });
    $.__views.scrollView.add($.__views.__alloyId294);
    $.__views.__alloyId295 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "500 m",
        id: "__alloyId295"
    });
    $.__views.__alloyId294.add($.__views.__alloyId295);
    $.__views.__alloyId296 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "750",
        id: "__alloyId296"
    });
    $.__views.scrollView.add($.__views.__alloyId296);
    $.__views.__alloyId297 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "750 m",
        id: "__alloyId297"
    });
    $.__views.__alloyId296.add($.__views.__alloyId297);
    $.__views.__alloyId298 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "1000",
        id: "__alloyId298"
    });
    $.__views.scrollView.add($.__views.__alloyId298);
    $.__views.__alloyId299 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "1000 m",
        id: "__alloyId299"
    });
    $.__views.__alloyId298.add($.__views.__alloyId299);
    $.__views.__alloyId300 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "2000",
        id: "__alloyId300"
    });
    $.__views.scrollView.add($.__views.__alloyId300);
    $.__views.__alloyId301 = Ti.UI.createLabel({
        height: Alloy.Globals.Styles.inputHeight,
        textAlign: "center",
        color: "#000",
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        text: "2000 m",
        id: "__alloyId301"
    });
    $.__views.__alloyId300.add($.__views.__alloyId301);
    $.__views.__alloyId302 = Ti.UI.createView({
        width: "65dp",
        height: "30dp",
        distance: "0",
        id: "__alloyId302"
    });
    $.__views.scrollView.add($.__views.__alloyId302);
    $.__views.__alloyId303 = Ti.UI.createLabel({
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "15dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        textid: "distance_wheel",
        id: "__alloyId303"
    });
    $.__views.__alloyId302.add($.__views.__alloyId303);
    $.__views.__alloyId304 = Ti.UI.createView({
        width: "37dp",
        height: "30dp",
        distance: "0",
        id: "__alloyId304"
    });
    $.__views.scrollView.add($.__views.__alloyId304);
    $.__views.update = Ti.UI.createButton({
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
        titleid: "update",
        id: "update"
    });
    $.__views.__alloyId282.add($.__views.update);
    buttonTouchStart ? $.__views.update.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.update!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.update.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.update!touchend!buttonTouchEnd"] = true;
    $.__views.cancel = Ti.UI.createButton({
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
        titleid: "cancel",
        id: "cancel"
    });
    $.__views.__alloyId282.add($.__views.cancel);
    buttonTouchStart ? $.__views.cancel.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.cancel!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.cancel.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.cancel!touchend!buttonTouchEnd"] = true;
    $.__views.pickerWrap = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "pickerWrap"
    });
    $.__views.window.add($.__views.pickerWrap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var core = Alloy.Globals.core;
    var subCategories = [], period = 240, for_ = 1, from = 0, to = 0, distance = 500, forItems = [ {
        title: L("new_deals"),
        data: {
            id: 1
        }
    }, {
        title: L("all_deals"),
        data: {
            id: 2
        }
    } ], periodItems = [ {
        title: L("_1_hour"),
        data: {
            id: 60
        }
    }, {
        title: L("_2_hour"),
        data: {
            id: 120
        }
    }, {
        title: L("_3_hour"),
        data: {
            id: 180
        }
    }, {
        title: L("_4_hour"),
        data: {
            id: 240
        }
    }, {
        title: L("_5_hour"),
        data: {
            id: 300
        }
    } ], sectionName = "notifications", newNotify = false, indicator = Alloy.Globals.indicator;
    Ti.App.addEventListener("notify:notifyload", function() {
        notifyLoad();
    });
    Ti.App.addEventListener("notify:newnotify", function() {
        newNotifySave();
    });
    var notifyToEdit = false;
    "Simulator" == Ti.Platform.model && (Alloy.CFG.deviceToken = "fake_device_ token");
    $.scrollView.addEventListener("scroll", function(e) {
        distance = e.x >= 325 ? 2e3 : e.x >= 260 ? 1e3 : e.x >= 195 ? 750 : e.x >= 130 ? 500 : e.x >= 65 ? 250 : 100;
    });
    var periodRowIndex = 3;
    var forRowIndex = 0;
    var selectedStartDate = false;
    var selectedEndDate = false;
    var indicator = Alloy.Globals.indicator;
    __defers["$.__views.window!click!blur"] && $.__views.window.addEventListener("click", blur);
    __defers["$.__views.categories!click!clickCategories"] && $.__views.categories.addEventListener("click", clickCategories);
    __defers["$.__views.period!click!clickPeriod"] && $.__views.period.addEventListener("click", clickPeriod);
    __defers["$.__views.for_!click!clickFor"] && $.__views.for_.addEventListener("click", clickFor);
    __defers["$.__views.start!click!clickStart"] && $.__views.start.addEventListener("click", clickStart);
    __defers["$.__views.end!click!clickEnd"] && $.__views.end.addEventListener("click", clickEnd);
    __defers["$.__views.update!touchstart!buttonTouchStart"] && $.__views.update.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.update!touchend!buttonTouchEnd"] && $.__views.update.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.cancel!touchstart!buttonTouchStart"] && $.__views.cancel.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.cancel!touchend!buttonTouchEnd"] && $.__views.cancel.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;