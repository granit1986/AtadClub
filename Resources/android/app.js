function Benchmark() {
    this.beginTime = new Date();
}

var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var DEBUG = false;

Titanium.App.serverDomain = DEBUG ? "192.168.2.32" : "atadclub.slavin.biz";

Titanium.App.ApiVersion = 0;

Alloy.Collections.publicAdverts = Alloy.createCollection("publicAdvert");

Alloy.Collections.adverts = Alloy.createCollection("advert");

Alloy.Collections.blackList = Alloy.createCollection("blackList");

Alloy.Collections.publicDeals = Alloy.createCollection("publicDeal");

Alloy.Collections.banners = Alloy.createCollection("banner");

Alloy.Collections.similarDeals = Alloy.createCollection("similarDeal");

Alloy.Collections.homeDeals = Alloy.createCollection("homeDeal");

Alloy.Collections.companyDeals = Alloy.createCollection("companyDeal");

Alloy.Collections.deals = Alloy.createCollection("deal");

Alloy.Collections.products = Alloy.createCollection("product");

Alloy.Collections.companies = Alloy.createCollection("publicCompany");

Alloy.Collections.companiesWithDeals = Alloy.createCollection("companyWithDeals");

Alloy.Collections.offers = Alloy.createCollection("offer");

Alloy.Collections.chats = Alloy.createCollection("chat");

Alloy.Collections.messages = Alloy.createCollection("message");

Alloy.Collections.categories = Alloy.createCollection("category");

Alloy.Collections.subCategories = Alloy.createCollection("subCategory");

Alloy.Collections.supplierProducts = Alloy.createCollection("supplierProducts");

Object.defineProperty(Alloy.Collections.publicDeals.config, "URL", {
    writable: false
});

Titanium.include("lib/errors.js");

Alloy.Globals.errors = errors;

Titanium.include("lib/categories.js");

Titanium.include("lib/subCategories.js");

Titanium.include("lib/geo.js");

Alloy.Globals.geo = geo;

Titanium.include("lib/upload.js");

Alloy.Globals.upload = upload;

Titanium.include("lib/imageSizes.js");

Alloy.Globals.imageSizes = imageSizes;

Titanium.include("lib/checkBox.js");

Alloy.Globals.checkBox = checkBox;

var uie = require("lib/indicator");

Alloy.Globals.indicator = uie.createIndicatorWindow();

var prog = require("lib/progress");

Alloy.Globals.progress = prog.createProgressBar();

Titanium.include("lib/store.js");

Alloy.Globals.store = store;

Alloy.Globals.Map = require("ti.map");

Ti.Map = require("ti.map");

Alloy.Globals.caches = {};

Alloy.Globals.LATITUDE_BASE = 37.389569;

Alloy.Globals.LONGITUDE_BASE = -122.050212;

Titanium.include("lib/db.js");

var loadingPage = null;

Ti.App.addEventListener("pause", function() {
    Ti.API.info("pause");
    var messagesArray = Ti.App.Properties.getObject("messages");
    messagesArray.push("Paused app, time - " + new Date().toString());
    Ti.App.Properties.setObject("messages", messagesArray);
    Alloy.Globals.core.applicationPaused = true;
    Alloy.Globals.chat.connecting = false;
    Alloy.Globals.chat.source && Alloy.Globals.chat.source.close();
});

Alloy.Globals.core = {
    debug: DEBUG,
    createRows: function(collection, transformFunction, tableView, rowUrl) {
        var items = [];
        for (var i = 0; i < collection.models.length; i++) {
            var element = collection.models[i];
            items.push(transformFunction(element));
        }
        var data = [];
        for (var i = 0; i < items.length; i++) {
            var model = items[i];
            data.push(Alloy.createController(rowUrl, {
                model: model
            }).getView());
        }
        tableView.setData(data);
    },
    token: false,
    applicationPaused: false,
    isSupplier: false,
    showHideLoadIndicator: function() {},
    purchased: {},
    activeTab: function(tabName) {
        var tabs = Alloy.Globals.tabGroup.tabs;
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            if (tab.titleid == tabName) {
                tab.setActive(true);
                break;
            }
        }
    },
    offlineModal: false,
    createOfflineModal: function() {
        var self = this;
        self.offlineModal = Ti.UI.createAlertDialog({
            message: L("no_connection"),
            buttonNames: [ L("try_again") ]
        });
        self.offlineModal.addEventListener("click", function() {
            Ti.Network.online ? self.offlineModal.hide() : self.offlineModal.show();
        });
    },
    localTime: function(utcTime) {
        var offset = utcTime.getTimezoneOffset();
        var localTime = utcTime + offset;
        return localTime;
    },
    maxDealRenew: function(callback) {
        xhr = Titanium.Network.createHTTPClient();
        var xhr = Ti.Network.createHTTPClient({
            onload: function() {
                callback(this.responseText);
            },
            onerror: function() {
                Ti.API.info(this.responseText);
            },
            timeout: 1e4
        });
        xhr.open("GET", "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/automaticRenew");
        xhr.send();
    },
    createTime: function(timeSpan) {
        var date = new Date();
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(parseInt(timeSpan) / 60), parseInt(timeSpan) % 60));
    },
    creatTimeSpan: function(time) {
        return 60 * time.getUTCHours() + time.getUTCMinutes();
    },
    viewTime: function(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var dayTime = "AM";
        if (hours >= 12) {
            dayTime = "PM";
            hours -= 12;
        }
        return hours + ":" + minutes + " " + dayTime;
    },
    currencyItems: [ {
        title: "ILS ₪",
        data: {
            id: 8362
        }
    }, {
        title: "EUR €",
        data: {
            id: 8364
        }
    }, {
        title: "USD $",
        data: {
            id: 36
        }
    }, {
        title: "GBP £",
        data: {
            id: 163
        }
    }, {
        title: "JPY ¥",
        data: {
            id: 165
        }
    }, {
        title: "RUB RUR",
        data: {
            id: "RUR"
        }
    }, {
        title: "AUD $",
        data: {
            id: 36
        }
    }, {
        title: "CHF Fr",
        data: {
            id: "Fr"
        }
    }, {
        title: "CAD $",
        data: {
            id: 36
        }
    }, {
        title: "MXN $",
        data: {
            id: 36
        }
    }, {
        title: "CNY ¥",
        data: {
            id: 165
        }
    }, {
        title: "NZD $",
        data: {
            id: 36
        }
    }, {
        title: "SEK kr",
        data: {
            id: "kr"
        }
    }, {
        title: "HKD $",
        data: {
            id: 36
        }
    }, {
        title: "SGD $",
        data: {
            id: 36
        }
    }, {
        title: "TRY Lr",
        data: {
            id: "Lr"
        }
    } ],
    appUrl: "http://goo.gl/ul5vRk",
    dealType: [ {
        title: "1 + 1",
        id: "0"
    }, {
        title: "-10%",
        id: "1"
    }, {
        title: "-20%",
        id: "2"
    }, {
        title: "-25%",
        id: "3"
    }, {
        title: "-30%",
        id: "4"
    }, {
        title: "-35%",
        id: "5"
    }, {
        title: "-40%",
        id: "6"
    }, {
        title: "-45%",
        id: "7"
    }, {
        title: "-50%",
        id: "8"
    }, {
        title: "-55%",
        id: "9"
    }, {
        title: "-60%",
        id: "10"
    }, {
        title: "-65%",
        id: "11"
    }, {
        title: "-70%",
        id: "12"
    }, {
        title: "-75%",
        id: "13"
    }, {
        title: "-80%",
        id: "14"
    }, {
        title: "-85%",
        id: "15"
    }, {
        title: "-90%",
        id: "16"
    }, {
        title: L("vacancy"),
        id: "17"
    } ],
    apiToken: function(a) {
        if (void 0 == a) return GetApiToken();
        a = SetToken(a);
        return a;
    },
    selectedHomeCategories: {},
    selectedNewAdvertCategories: {},
    selectedNewDealsCategories: {},
    selectedNotificationsCategories: {},
    selectedCategories: {},
    selectedProducts: {},
    selectedCategoriesInEdit: {},
    currentSection: "",
    currentSectionCategories: function() {
        var section = this.currentSection;
        switch (section) {
          case "home":
            return this.selectedHomeCategories;

          case "newadvert":
            return this.selectedNewAdvertCategories;

          case "newdealer":
            return this.selectedNewDealsCategories;

          case "notifications":
            return this.selectedNotificationsCategories;

          case "products":
            return this.selectedProducts;

          default:
            return this.selectedCategoriesInEdit;
        }
    },
    categories: categories,
    subCategories: subCategories,
    rxs: {
        email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        password: /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,}/,
        empty: /^[\s]*$/,
        phone: /^\+{0,1}\d{6,11}$/,
        number: /^[\w]{5,}$/,
        isUndefined: function(e) {
            return "undefined" == typeof e;
        }
    },
    showError: function(err) {
        Alloy.Globals.core.showErrorDialog(L(err.error));
    },
    showErrorDialog: function(e) {
        if (e && "" !== e) {
            Titanium.UI.createAlertDialog({
                title: e
            }).show();
        }
    },
    showWaitScreen: function() {},
    closeWaitScreen: function() {},
    S4: function() {
        return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
    },
    guid: function() {
        return;
    },
    waitWindow: false,
    waitTimeout: false,
    showWait: function() {
        if (Alloy.Globals.core.waitTimeout) return;
        Alloy.Globals.core.waitTimeout = setTimeout(function() {
            if (Alloy.Globals.core.waitWindow) return;
            Alloy.Globals.core.waitWindow = Alloy.createController("activity/index").getView();
            Alloy.Globals.core.waitWindow.open();
        }, 50);
    },
    deviceToken: false,
    hideWait: function() {
        Alloy.Globals.core.waitTimeout && clearTimeout(Alloy.Globals.core.waitTimeout);
        if (!Alloy.Globals.core.waitWindow) return;
        Alloy.Globals.core.waitWindow.close();
        Alloy.Globals.core.waitWindow = false;
    },
    DeviceToken: function() {
        if (!Ti.Network.online) {
            Alloy.Globals.core.showErrorDialog(L("network_off_line"));
            return;
        }
        Titanium.Network.registerForPushNotifications({
            types: [ Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_SOUND ],
            success: function(e) {
                return e.deviceToken;
            },
            error: function() {
                return null;
            },
            callback: function() {
                return null;
            }
        });
    }
};

Alloy.Globals.chat = {
    source: false,
    connected: false,
    connecting: false,
    openChatId: false,
    indicator: Alloy.Globals.indicator,
    items: [],
    notSendedMessage: false,
    messagesWindow: false,
    url: function() {
        return "ws://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/" + Alloy.Globals.core.apiToken() + "/chat/get";
    },
    openConnect: function() {
        var self = this;
        Ti.API.info("Connecting - " + self.connecting);
        Ti.API.info("Connected - " + self.connected);
        if (self.connecting || self.connected) {
            Ti.API.info("Websocket already connected");
            return;
        }
        return;
    },
    notify: function(title, mesage, data, clickFunction) {
        function closeModal() {
            modal.close({
                transform: tHide,
                duration: duration
            });
        }
        if (!title, !mesage) return;
        var tStart = Titanium.UI.create2DMatrix().translate(0, -60), tShow = Titanium.UI.create2DMatrix().translate(0, 0), tHide = Titanium.UI.create2DMatrix().translate(0, -60), a = Titanium.UI.createAnimation(), duration = 200, lifeTime = 5e3;
        var modal = Titanium.UI.createWindow({
            layout: "absolute",
            height: 50,
            width: 320,
            top: 0,
            backgroundColor: "#f0f0f0",
            transform: tStart
        });
        a.transform = tShow;
        a.duration = duration;
        var titleLabel = Titanium.UI.createLabel({
            text: title,
            height: 20,
            width: 280,
            top: 5,
            left: 10,
            color: "#555",
            font: {
                fontSize: "16dp",
                fontFamily: "Avenir Next Condensed",
                fontWeight: "Bold"
            }
        });
        var mesageLabel = Titanium.UI.createLabel({
            text: mesage,
            height: 20,
            width: 280,
            top: 25,
            left: 10,
            color: "#555",
            font: {
                fontSize: "15dp",
                fontFamily: "Avenir Next Condensed",
                fontWeight: "Regular"
            }
        });
        var line = Titanium.UI.createView({
            height: 1,
            width: 320,
            top: 49,
            left: 0,
            backgroundColor: "#999"
        });
        var closeBtn = Titanium.UI.createButton({
            id: "closeBtn",
            title: "x",
            height: 30,
            width: 30,
            top: 0,
            right: 0,
            style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
            color: "#555",
            font: {
                fontSize: "16dp"
            }
        });
        setTimeout(closeModal, lifeTime);
        modal.addEventListener("click", function(e) {
            if ("closeBtn" != e.source.id && clickFunction) {
                clickFunction(data);
                modal.close();
            }
        });
        closeBtn.addEventListener("click", closeModal);
        modal.add(titleLabel);
        modal.add(mesageLabel);
        modal.add(line);
        modal.add(closeBtn);
        modal.open(a);
    },
    addMessage: function(data) {
        var self = this;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var row = self.createRow(item);
            self.items.splice(0, 0, row);
        }
        return self.items;
    },
    createRow: function(data) {
        var row = Ti.UI.createTableViewRow({
            layout: "absolute",
            height: Ti.UI.SIZE,
            bottom: "5dp",
            selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
        });
        var image = Ti.UI.createImageView({
            id: "arrow",
            width: "10dp",
            heigth: "10dp",
            bottom: "2dp",
            font: {
                fontSize: "1dp"
            }
        });
        row.add(image);
        var view = Ti.UI.createView({
            width: "200dp",
            height: Ti.UI.SIZE,
            layout: "vertical"
        });
        var bubbleLabel = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            borderRadius: "15dp",
            borderWidth: "1dp",
            layout: "vertical"
        });
        var messageWrapLabel = Ti.UI.createLabel({
            right: "7dp"
        });
        var messageLabel = Ti.UI.createLabel({
            text: data.Text,
            height: Ti.UI.SIZE,
            left: "7dp",
            top: "5dp",
            bottom: "5dp",
            font: {
                fontSize: "14dp"
            }
        });
        var dirLabel = Ti.UI.createLabel({
            visible: false,
            width: "10dp",
            heigth: "10dp",
            bottom: "3dp",
            font: {
                fontSize: "1dp"
            }
        });
        if (data.FromUserId == Alloy.Globals.profile.id) {
            view.right = "12dp";
            bubbleLabel.backgroundColor = "#007aff";
            bubbleLabel.borderColor = "#007aff";
            bubbleLabel.right = "0dp";
            messageLabel.color = "#fff";
            image.image = "images/messageOut.png";
            image.right = "8dp";
        } else {
            view.left = "12dp";
            bubbleLabel.backgroundColor = "#e7e4eb";
            bubbleLabel.borderColor = "#e7e4eb";
            bubbleLabel.left = "0dp";
            messageLabel.color = "#1b1b1b";
            image.image = "images/messageIn.png";
            image.left = "8dp";
        }
        messageWrapLabel.add(messageLabel);
        bubbleLabel.add(messageWrapLabel);
        view.add(bubbleLabel);
        row.add(view);
        row.add(dirLabel);
        return row;
    }
};

Ti.App.Properties.hasProperty("installId") || Ti.App.Properties.setString("installId", Ti.App.sessionId);

Alloy.Globals.core.installId = Ti.App.Properties.getString("installId");

var stylesArray;

Alloy.Globals.isHe = false;

if ("he" === Titanium.Platform.locale) {
    Alloy.Globals.isHe = true;
    Titanium.include("lib/stylesRtl.js");
    Alloy.Globals.Styles = stylesRtl;
} else {
    Titanium.include("lib/styles.js");
    Alloy.Globals.Styles = styles;
}

Alloy.Globals.isHebrew = "he" != Ti.Platform.locale;

Object.size = function(obj) {
    var key, size = 0;
    for (key in obj) obj.hasOwnProperty(key) && size++;
    return size;
};

Benchmark.prototype = {
    test: function() {
        return new Date().getTime() - this.beginTime.getTime();
    }
};

Ti.App.addEventListener("addWindow", function(key, win) {
    Ti.API.info("addWindow");
    void 0 === Alloy.Globals.tabs.tabs[key] && (Alloy.Globals.tabs.tabs[key] = key);
    var tab = Alloy.Globals.tabs.tabs[key];
    void 0 === tab.windows && (tab.windows = new Array());
    tab.push(win);
});

Ti.App.addEventListener("removeWindows", function(key) {
    Ti.API.info("removeWindow");
    for (var i = 0; i < Alloy.Globals.tabs.tabs[key].windows.length; i++) {
        var window = Alloy.Globals.tabs.tabs[key].windows[i];
        window.close();
    }
    Alloy.Globals.tabs.tabs[key].windows = new Array();
});

Alloy.Globals.tabs = {
    tabs: {}
};

Alloy.Globals.notifications = {
    notifySettings: false,
    startTimer: function(seconds) {
        var self = this;
        Ti.API.info("Create notification geoposiotion timer");
        self.timer = setInterval(function() {
            Ti.API.info("Start notification geoposiotion timer");
            Alloy.Globals.core.applicationPaused && Alloy.Globals.chat.connected && Alloy.Globals.chat.source.close();
            if (self.notifySettings) {
                var geo = Alloy.Globals.geo;
                Ti.API.info("Check position");
                geo.checkLocation(function() {
                    if (geo.location.status != geo.errors.NONE) {
                        Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
                        Ti.API.info(geo.location.status.message);
                        return;
                    }
                    Ti.API.info("lat=" + geo.location.latitude + ", lng=" + geo.location.longitude + ", notifySettings" + self.notifySettings);
                    var model = Alloy.createModel("tracking", {
                        id: self.notifySettings.id,
                        lat: geo.location.latitude,
                        lng: geo.location.longitude,
                        offset: new Date().getTimezoneOffset()
                    });
                    model.save({}, {
                        success: function() {
                            Ti.API.info("Coordinates saved - " + new Date().toLocaleString());
                        },
                        error: function() {
                            Ti.API.info("error");
                        }
                    });
                });
            } else Ti.API.info("NotifySettings - " + self.notifySettings);
        }, 1e3 * seconds);
    },
    stopTimer: function() {
        var self = this;
        clearInterval(self.timer);
        self.timer = false;
        self.notifySettings = false;
        Ti.API.info("Stop geoposition timer");
    },
    timer: false
};

Ti.App.Properties.setInt("warmgps", 0);

Alloy.Globals.locations = {
    updateLocation: function(e) {
        Ti.API.info("enter update location");
        Ti.API.info(JSON.stringify(e));
        var messages = Ti.App.Properties.getObject("messages");
        messages.push("Method - location; time - " + new Date().toString());
        if (!Ti.Network.online) {
            messages.push("Network offline; time - " + new Date().toString());
            Ti.App.Properties.setObject("messages", messages);
            return;
        }
        Ti.API.info(Ti.Geolocation.accuracy);
        Ti.API.info(Ti.Geolocation.distanceFilter);
        if (Ti.Geolocation.accuracy != Titanium.Geolocation.ACCURACY_BEST && 10 != Ti.Geolocation.distanceFilter) {
            Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
            Ti.Geolocation.distanceFilter = 10;
        }
        if (e && e.coords && e.coords.latitude && e.coords.longitude) {
            var count = Ti.App.Properties.getInt("count");
            Ti.API.info("location");
            var lat = e.coords.latitude;
            var lng = e.coords.longitude;
            count++;
            messages.push("Lat - " + lat + "; Lng - " + lng + "; Count - " + count + "; time - " + new Date().toString());
            if (count >= 5) {
                Alloy.Globals.locations.send(lat, lng, false, messages);
                Ti.App.Properties.setInt("count", 0);
            }
            Ti.App.Properties.setObject("messages", messages);
            Ti.App.Properties.setInt("count", count);
        } else {
            messages.push("No coords;" + JSON.stringify(e) + " time - " + new Date().toString());
            e.error && messages.push("Error coords;" + JSON.stringify(e.error) + " time - " + new Date().toString());
            Ti.App.Properties.setObject("messages", messages);
        }
    },
    send: function(lat, lng, async, messages) {
        var token = Ti.App.Properties.getString("token");
        if (!token) return;
        var xhr = Ti.Network.createHTTPClient({
            timeout: 6e4
        });
        var url = "http://" + Ti.App.serverDomain + "/api/0/tracking/Get?token=" + token + "&lat=" + lat + "&lng=" + lng + "&offset=" + new Date().getTimezoneOffset();
        messages.push("url - " + url + "; time - " + new Date().toString());
        xhr.onload = function(e) {
            messages.push("Location saved; time - " + new Date().toString());
            if (e.success) {
                Ti.App.Properties.setInt("count", 0);
                Ti.API.info("Coords saved!!!");
            }
            Ti.App.Properties.setObject("messages", messages);
        };
        xhr.onerror = function(e) {
            messages.push("Save error;Text - " + JSON.stringify(e) + " time - " + new Date().toString());
            Ti.App.Properties.setObject("messages", messages);
            Ti.API.error(e);
            Ti.API.error(e.error);
            Ti.App.Properties.setInt("count", 0);
        };
        Ti.API.info(url);
        xhr.open("GET", url, async);
        xhr.send();
        messages.push("Sended location to server; async - " + async + "; time - " + new Date().toString());
        Ti.App.Properties.setObject("messages", messages);
        Ti.API.info("send");
    }
};

Alloy.Globals.messages = [];

Ti.App.Properties.setObject("messages", Alloy.Globals.messages);

Alloy.createController("index");