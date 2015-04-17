function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        "update" == e.source.id ? update() : "customLocation" == e.source.id ? customLocation() : "upgrade" == e.source.id && upgrade();
    }
    function blur(e) {
        hideKeyboard(e);
    }
    function hideKeyboard(e) {
        e.source.id !== $.firstName.id && $.firstName.blur();
        e.source.id !== $.lastName.id && $.lastName.blur();
        e.source.id !== $.email.id && $.email.blur();
        e.source.id !== $.phone.id && $.phone.blur();
        e.source.id !== $.address.id && $.address.blur();
        e.source.id !== $.password.id && $.password.blur();
        e.source.id !== $.confirmPassword.id && $.confirmPassword.blur();
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function upgrade() {
        var view = Alloy.createController("account/upgradeSelect", {
            callback: function() {
                statusUpdate();
            }
        }).getView();
        Alloy.CFG.tabAccount.open(view);
    }
    function open() {
        $.address.setHintText(L("enter_address"));
        Alloy.Globals.profile && Alloy.Globals.profile.endStatusDate && statusUpdate();
    }
    function customLocation() {
        indicator.openIndicator();
        var geo = Alloy.Globals.geo;
        geo.checkLocation(function() {
            if (geo.location.status != geo.errors.NONE) {
                Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
                indicator.closeIndicator();
                return;
            }
            geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
                indicator.closeIndicator();
                e && e.error ? Alloy.Globals.core.showErrorDialog(e.message ? L(e.message) : L(e.error)) : e && e.response && (e.response.results && e.response.results[0] && e.response.results[0].formatted_address ? $.address.value = e.response.results[0].formatted_address : e.response.resourceSets && e.response.resourceSets[0] && e.response.resourceSets[0].resources && e.response.resourceSets[0].resources[0] && e.response.resourceSets[0].resources[0].address && e.response.resourceSets[0].resources[0].address.formattedAddress && ($.address.value = e.response.resourceSets[0].resources[0].address.formattedAddress));
            });
        });
    }
    function search() {
        geo.geocoding($.address.value, function(geodata) {
            if (geodata.error) {
                Alloy.Globals.core.showErrorDialog(L(geodata.message));
                return;
            }
            if (geodata.error == geo.elementStatuses.ZERO_RESULTS || geodata.error == geo.elementStatuses.NOT_FOUND) {
                indicator.closeIndicator();
                Alloy.Globals.core.showErrorDialog(L("address_not_found"));
                correctAddress = false;
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
                    correctAddress = true;
                },
                rowIndex: rowIndex,
                items: items
            }).getView();
            closeKeyboard();
            $.pickerWrap.removeAllChildren();
            $.pickerWrap.add(addressPicker);
        });
    }
    function closeKeyboard() {
        $.address.blur();
    }
    function update() {
        indicator.openIndicator();
        profile.set("firstName", $.firstName.value);
        profile.set("lastName", $.lastName.value);
        profile.set("email", $.email.value);
        profile.set("phone", $.phone.value);
        var address = $.address.value.trim();
        profile.set("address", address);
        profile.set("newPassword", $.password.value);
        profile.set("confirm", $.confirmPassword.value);
        "" != address ? geo.geocoding(address, function(e) {
            if (e.error) {
                Alloy.Globals.core.showErrorDialog(L(e.message));
                return;
            }
            if (e.error == geo.elementStatuses.ZERO_RESULTS || e.error == geo.elementStatuses.NOT_FOUND) {
                indicator.closeIndicator();
                Alloy.Globals.core.showErrorDialog(L("address_not_found"));
                return;
            }
            profile.localValidate(errorHandler) ? profileSave(profile) : indicator.closeIndicator();
        }) : profile.localValidate(errorHandler) ? profileSave(profile) : indicator.closeIndicator();
    }
    function profileSave(profile) {
        profile.save({}, {
            success: function() {
                Ti.App.fireEvent("account:updateProfile");
                Alloy.Globals.core.showErrorDialog(L("profile_save"));
                indicator.closeIndicator();
                $.window.close();
            },
            error: function(model, xhr) {
                indicator.closeIndicator();
                xhr && xhr.Message && Alloy.Globals.core.showErrorDialog(L("server_" + xhr.Message, L("not_updated")));
            }
        });
    }
    function errorHandler(err) {
        switch (err) {
          case errors.NO_FIRST_NAME:
            $.firstName.focus();
            break;

          case errors.NO_EMAIL:
          case errors.INVALID_EMAIL:
          case errors.NOT_SIGNED:
            $.email.focus();
            break;

          case errors.INVALID_PHONE:
            $.phone.focus();
        }
        Alloy.Globals.core.showError(err);
    }
    function statusUpdate() {
        if (0 != Alloy.Globals.profile.status) {
            var status = "";
            switch (Alloy.Globals.profile.status) {
              case 1:
                status = L("silver_business");
                break;

              case 2:
                status = L("gold_business");
                break;

              case 3:
                status = L("gold_private");
            }
            var date = getDate(Alloy.Globals.profile.endStatusDate);
            var endDate = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
            showStaus(status, endDate);
        }
    }
    function getDate(date) {
        var arr = date.split(/[- :T]/);
        return new Date(arr[0], arr[1], arr[2], arr[3], arr[4], 0);
    }
    function showStaus(title, date) {
        var lblAccStatus = Ti.UI.createLabel({
            text: title,
            height: "20dp",
            width: Ti.UI.FILL,
            top: "10dp",
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            color: "#007aff",
            font: {
                fontSize: "20dp",
                fontFamily: "Avenir Next Condensed"
            }
        });
        var lblAccStatusTill = Ti.UI.createLabel({
            text: L("to_DATE") + " " + date,
            height: "20dp",
            width: Ti.UI.FILL,
            top: "40dp",
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            color: "#555",
            font: {
                fontSize: "15dp",
                fontFamily: "Avenir Next Condensed"
            }
        });
        $.accInfo.removeAllChildren();
        $.accInfo.add(lblAccStatus);
        $.accInfo.add(lblAccStatusTill);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/profile";
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
        fullscreen: "true",
        titleid: "profile",
        id: "window"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    $.__views.__alloyId28 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        top: "0",
        id: "__alloyId28"
    });
    $.__views.window.add($.__views.__alloyId28);
    $.__views.accInfo = Ti.UI.createView({
        id: "accInfo",
        height: Ti.UI.SIZE,
        layout: "absolute"
    });
    $.__views.__alloyId28.add($.__views.accInfo);
    $.__views.__alloyId29 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId29"
    });
    $.__views.__alloyId28.add($.__views.__alloyId29);
    $.__views.firstNameLbl = Ti.UI.createLabel({
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
        id: "firstNameLbl",
        textid: "firstname"
    });
    $.__views.__alloyId28.add($.__views.firstNameLbl);
    $.__views.firstName = Ti.UI.createTextField({
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
        id: "firstName"
    });
    $.__views.__alloyId28.add($.__views.firstName);
    focus ? $.__views.firstName.addEventListener("focus", focus) : __defers["$.__views.firstName!focus!focus"] = true;
    $.__views.lastNameLbl = Ti.UI.createLabel({
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
        id: "lastNameLbl",
        textid: "lastname"
    });
    $.__views.__alloyId28.add($.__views.lastNameLbl);
    $.__views.lastName = Ti.UI.createTextField({
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
        id: "lastName"
    });
    $.__views.__alloyId28.add($.__views.lastName);
    focus ? $.__views.lastName.addEventListener("focus", focus) : __defers["$.__views.lastName!focus!focus"] = true;
    $.__views.emailLbl = Ti.UI.createLabel({
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
        id: "emailLbl",
        textid: "email"
    });
    $.__views.__alloyId28.add($.__views.emailLbl);
    $.__views.email = Ti.UI.createTextField({
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
        id: "email"
    });
    $.__views.__alloyId28.add($.__views.email);
    focus ? $.__views.email.addEventListener("focus", focus) : __defers["$.__views.email!focus!focus"] = true;
    $.__views.phoneLbl = Ti.UI.createLabel({
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
        id: "phoneLbl",
        textid: "phone"
    });
    $.__views.__alloyId28.add($.__views.phoneLbl);
    $.__views.phone = Ti.UI.createTextField({
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
        id: "phone",
        keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD
    });
    $.__views.__alloyId28.add($.__views.phone);
    focus ? $.__views.phone.addEventListener("focus", focus) : __defers["$.__views.phone!focus!focus"] = true;
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
    $.__views.__alloyId28.add($.__views.addressLbl);
    $.__views.__alloyId30 = Ti.UI.createView({
        width: Alloy.Globals.Styles.inputWidth,
        height: Alloy.Globals.Styles.inputAreaHeight,
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
        id: "__alloyId30"
    });
    $.__views.__alloyId28.add($.__views.__alloyId30);
    $.__views.address = Ti.UI.createTextArea(function() {
        var o = {};
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            width: "160dp",
            height: Alloy.Globals.Styles.inputAreaHeight,
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
        return o;
    }());
    $.__views.__alloyId30.add($.__views.address);
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
    $.__views.__alloyId30.add($.__views.customLocation);
    buttonTouchStart ? $.__views.customLocation.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.customLocation!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.customLocation.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.customLocation!touchend!buttonTouchEnd"] = true;
    focus ? $.__views.customLocation.addEventListener("focus", focus) : __defers["$.__views.customLocation!focus!focus"] = true;
    $.__views.newPasswordLbl = Ti.UI.createLabel({
        width: "85dp",
        height: Ti.UI.SIZE,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "newPasswordLbl",
        textid: "new_password"
    });
    $.__views.__alloyId28.add($.__views.newPasswordLbl);
    $.__views.password = Ti.UI.createTextField({
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
        id: "password",
        passwordMask: "true"
    });
    $.__views.__alloyId28.add($.__views.password);
    focus ? $.__views.password.addEventListener("focus", focus) : __defers["$.__views.password!focus!focus"] = true;
    $.__views.confirmPasswordLbl = Ti.UI.createLabel({
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
        id: "confirmPasswordLbl",
        textid: "confirm"
    });
    $.__views.__alloyId28.add($.__views.confirmPasswordLbl);
    $.__views.confirmPassword = Ti.UI.createTextField({
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
        id: "confirmPassword",
        passwordMask: "true"
    });
    $.__views.__alloyId28.add($.__views.confirmPassword);
    focus ? $.__views.confirmPassword.addEventListener("focus", focus) : __defers["$.__views.confirmPassword!focus!focus"] = true;
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
        id: "update",
        titleid: "update"
    });
    $.__views.__alloyId28.add($.__views.update);
    buttonTouchStart ? $.__views.update.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.update!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.update.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.update!touchend!buttonTouchEnd"] = true;
    $.__views.upgrade = Ti.UI.createButton({
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
        id: "upgrade",
        titleid: "upgrade"
    });
    $.__views.__alloyId28.add($.__views.upgrade);
    buttonTouchStart ? $.__views.upgrade.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.upgrade!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.upgrade.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.upgrade!touchend!buttonTouchEnd"] = true;
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
    var profile = Alloy.createModel("profile");
    var indicator = Alloy.Globals.indicator;
    profile.fetch({
        success: function() {
            var p = profile.toJSON();
            $.firstName.value = p.firstName;
            $.lastName.value = p.lastName;
            $.email.value = p.email;
            $.phone.value = p.phone;
            $.address.value = p.address;
        },
        error: function() {}
    });
    var rowIndex;
    var correctAddress = false;
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!click!blur"] && $.__views.window.addEventListener("click", blur);
    __defers["$.__views.firstName!focus!focus"] && $.__views.firstName.addEventListener("focus", focus);
    __defers["$.__views.lastName!focus!focus"] && $.__views.lastName.addEventListener("focus", focus);
    __defers["$.__views.email!focus!focus"] && $.__views.email.addEventListener("focus", focus);
    __defers["$.__views.phone!focus!focus"] && $.__views.phone.addEventListener("focus", focus);
    __defers["$.__views.address!return!search"] && $.__views.address.addEventListener("return", search);
    __defers["$.__views.customLocation!touchstart!buttonTouchStart"] && $.__views.customLocation.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.customLocation!touchend!buttonTouchEnd"] && $.__views.customLocation.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.customLocation!focus!focus"] && $.__views.customLocation.addEventListener("focus", focus);
    __defers["$.__views.password!focus!focus"] && $.__views.password.addEventListener("focus", focus);
    __defers["$.__views.confirmPassword!focus!focus"] && $.__views.confirmPassword.addEventListener("focus", focus);
    __defers["$.__views.update!touchstart!buttonTouchStart"] && $.__views.update.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.update!touchend!buttonTouchEnd"] && $.__views.update.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.upgrade!touchstart!buttonTouchStart"] && $.__views.upgrade.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.upgrade!touchend!buttonTouchEnd"] && $.__views.upgrade.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;