function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function fill(company) {
        $.image.image = company.logo + company.logoId + "/_100_100";
        $.nameVal.text = company.name;
        $.addressVal.text = company.address;
        $.emailVal.text = company.email;
        $.phoneVal.text = company.phone;
        $.aboutVal.text = company.about;
        $.hoursVal.text = company.workingHours;
        $.termsVal.text = company.terms;
        $.window.title = company.name;
        $.companyNumber.text = company.number;
    }
    function onClickEmail() {
        emailDialog.show();
    }
    function writeEmail() {
        var emailDialog = Ti.UI.createEmailDialog();
        emailDialog.toRecipients = [ company.email ];
        emailDialog.open();
    }
    function onClickAddress() {
        var mapWindow = Alloy.createController("home/companies/companyMap", {
            company: company
        }).getView();
        Alloy.CFG.tabHome.open(mapWindow);
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        indicator.openIndicator();
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        e.source && e.source.id && openView(e.source.id);
    }
    function openView(controlId) {
        var view = false;
        switch (controlId) {
          case "products":
            view = Alloy.createController("account/products/indexForUser", {
                supplierId: company.id
            }).getView();
            break;

          case "deals":
            view = Alloy.createController("home/companies/allDeals", {
                id: company.id,
                supplierName: company.name,
                lat: lat,
                lng: lng
            }).getView();
            break;

          case "send":
            var chat;
            Alloy.Collections.chats.fetch({
                success: function() {
                    chat = Alloy.Collections.chats.where({
                        To: id
                    })[0];
                    if ("undefined" != typeof chat) {
                        chat = chat.toJSON();
                        view = Alloy.createController("account/answers/answer", {
                            id: chat.ChatId,
                            toUser: chat.To,
                            newChat: false
                        }).getView();
                        indicator.closeIndicator();
                        Alloy.CFG.tabHome.open(view);
                    } else Alloy.createModel("chat", {
                        from: Alloy.Globals.profile.id,
                        to: id
                    }).save({}, {
                        success: function() {
                            view = Alloy.createController("account/answers/answer", {
                                id: arguments[1],
                                newChat: true,
                                toUser: id
                            }).getView();
                            indicator.closeIndicator();
                            Alloy.CFG.tabHome.open(view);
                        },
                        error: function() {
                            indicator.closeIndicator();
                            Alloy.Globals.core.showErrorDialog(L("chat_open_error"));
                        }
                    });
                },
                error: function() {
                    Alloy.Globals.core.showErrorDialog(L("chat_open_error"));
                    indicator.closeIndicator();
                }
            });
        }
        view && Alloy.CFG.tabHome.open(view);
        indicator.openIndicator();
    }
    function onClickPhone() {
        phoneDialog.show();
    }
    function phoneCall() {
        Titanium.Platform.openURL("tel:" + company.phone);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/companies/company";
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
        fullscreen: "true",
        id: "window"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.__alloyId214 = Ti.UI.createScrollView({
        layout: "vertical",
        id: "__alloyId214"
    });
    $.__views.window.add($.__views.__alloyId214);
    $.__views.image = Ti.UI.createImageView({
        width: "80dp",
        height: "80dp",
        top: "20dp",
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        borderColor: "#ccc",
        borderWidth: "1dp",
        backgroundColor: "#fff",
        id: "image"
    });
    $.__views.__alloyId214.add($.__views.image);
    $.__views.nameVal = Ti.UI.createLabel({
        height: "80dp",
        top: "-80dp",
        left: Alloy.Globals.Styles.titleLbl_left,
        right: Alloy.Globals.Styles.titleLbl_right,
        textAlign: "center",
        color: "#a80062",
        verticalAlign: "center",
        font: {
            fontSize: "20dp",
            fontFamily: "Georgia"
        },
        id: "nameVal"
    });
    $.__views.__alloyId214.add($.__views.nameVal);
    $.__views.addressLbl = Ti.UI.createLabel({
        top: "20dp",
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#007aff",
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "addressLbl",
        textid: "address"
    });
    $.__views.__alloyId214.add($.__views.addressLbl);
    $.__views.addressVal = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#00accb",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "addressVal"
    });
    $.__views.__alloyId214.add($.__views.addressVal);
    onClickAddress ? $.__views.addressVal.addEventListener("click", onClickAddress) : __defers["$.__views.addressVal!click!onClickAddress"] = true;
    $.__views.emailLbl = Ti.UI.createLabel({
        top: "20dp",
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#007aff",
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "emailLbl",
        textid: "email"
    });
    $.__views.__alloyId214.add($.__views.emailLbl);
    $.__views.emailVal = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#00accb",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "emailVal"
    });
    $.__views.__alloyId214.add($.__views.emailVal);
    onClickEmail ? $.__views.emailVal.addEventListener("click", onClickEmail) : __defers["$.__views.emailVal!click!onClickEmail"] = true;
    $.__views.companyNumberLbl = Ti.UI.createLabel({
        top: "20dp",
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#007aff",
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "companyNumberLbl",
        textid: "company_number"
    });
    $.__views.__alloyId214.add($.__views.companyNumberLbl);
    $.__views.companyNumber = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#555",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "companyNumber"
    });
    $.__views.__alloyId214.add($.__views.companyNumber);
    $.__views.phoneLbl = Ti.UI.createLabel({
        top: "20dp",
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#007aff",
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "phoneLbl",
        textid: "phone"
    });
    $.__views.__alloyId214.add($.__views.phoneLbl);
    $.__views.phoneVal = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#00accb",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "phoneVal"
    });
    $.__views.__alloyId214.add($.__views.phoneVal);
    onClickPhone ? $.__views.phoneVal.addEventListener("click", onClickPhone) : __defers["$.__views.phoneVal!click!onClickPhone"] = true;
    $.__views.aboutLbl = Ti.UI.createLabel({
        top: "20dp",
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#007aff",
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "aboutLbl",
        textid: "about_company"
    });
    $.__views.__alloyId214.add($.__views.aboutLbl);
    $.__views.aboutVal = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#555",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "aboutVal"
    });
    $.__views.__alloyId214.add($.__views.aboutVal);
    $.__views.hoursLbl = Ti.UI.createLabel({
        top: "20dp",
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#007aff",
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "hoursLbl",
        textid: "working_hours"
    });
    $.__views.__alloyId214.add($.__views.hoursLbl);
    $.__views.hoursVal = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#555",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "hoursVal"
    });
    $.__views.__alloyId214.add($.__views.hoursVal);
    $.__views.termsLbl = Ti.UI.createLabel({
        top: "20dp",
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#007aff",
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "termsLbl",
        textid: "terms_company"
    });
    $.__views.__alloyId214.add($.__views.termsLbl);
    $.__views.termsVal = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.account_imageLeft,
        right: Alloy.Globals.Styles.account_imageRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        color: "#555",
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "termsVal"
    });
    $.__views.__alloyId214.add($.__views.termsVal);
    $.__views.__alloyId215 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId215"
    });
    $.__views.__alloyId214.add($.__views.__alloyId215);
    $.__views.products = Ti.UI.createButton({
        width: "180dp",
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
        id: "products",
        titleid: "products"
    });
    $.__views.__alloyId214.add($.__views.products);
    buttonTouchStart ? $.__views.products.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.products!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.products.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.products!touchend!buttonTouchEnd"] = true;
    $.__views.deals = Ti.UI.createButton({
        width: "180dp",
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
        id: "deals",
        titleid: "deals"
    });
    $.__views.__alloyId214.add($.__views.deals);
    buttonTouchStart ? $.__views.deals.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.deals!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.deals.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.deals!touchend!buttonTouchEnd"] = true;
    $.__views.send = Ti.UI.createButton({
        width: "180dp",
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
        id: "send",
        titleid: "contact_supplier"
    });
    $.__views.__alloyId214.add($.__views.send);
    buttonTouchStart ? $.__views.send.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.send!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.send.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.send!touchend!buttonTouchEnd"] = true;
    var __alloyId217 = [];
    __alloyId217.push("Ok");
    __alloyId217.push("Cancel");
    $.__views.dialog = Ti.UI.createAlertDialog({
        buttonNames: __alloyId217,
        id: "dialog",
        titleid: "Block",
        messageid: "block_supplier",
        cancel: "1"
    });
    exports.destroy = function() {};
    _.extend($, $.__views);
    var id = arguments[0].id || null;
    var callback = arguments[0].callback || null;
    var company = false;
    var lat = arguments[0].lat || false;
    var lng = arguments[0].lng || false;
    var dialog = Ti.UI.createAlertDialog({
        title: L("block"),
        message: L("block_supplier"),
        cancel: 1,
        buttonNames: [ L("ok"), L("cancel") ]
    });
    if (Alloy.Globals.profile) {
        var blockBtn = Ti.UI.createButton({
            title: L("block")
        });
        blockBtn.addEventListener("click", function() {
            dialog.show();
        });
        $.window.setRightNavButton(blockBtn);
    }
    dialog.addEventListener("click", function(e) {
        switch (e.index) {
          case 0:
            var item = Alloy.createModel("blackList", {
                id: id
            });
            item.save({}, {
                success: function() {
                    $.window.close();
                    callback && callback(true);
                },
                error: function(model, xhr) {
                    xhr.Message && Titanium.UI.createAlertDialog({
                        title: xhr.Message
                    }).show();
                }
            });
            break;

          case 1:        }
    });
    if (id) {
        Alloy.Globals.profile && id != Alloy.Globals.profile.id || ($.send.visible = false);
        {
            Alloy.createModel("publicCompany", {
                id: id
            }).fetch({
                success: function(data) {
                    company = data.toJSON();
                    fill(company);
                }
            });
        }
    }
    var optionsEmailDialog = {
        options: [ "Write the company", "Cancel" ],
        cancel: 1
    };
    var emailDialog = Titanium.UI.createOptionDialog(optionsEmailDialog);
    emailDialog.addEventListener("click", function(e) {
        0 == e.index && writeEmail();
    });
    var indicator = Alloy.Globals.indicator;
    var optionsPhoneDialog = {
        options: [ "Call the company", "Cancel" ],
        cancel: 1
    };
    var phoneDialog = Titanium.UI.createOptionDialog(optionsPhoneDialog);
    phoneDialog.addEventListener("click", function(e) {
        0 == e.index && phoneCall();
    });
    __defers["$.__views.addressVal!click!onClickAddress"] && $.__views.addressVal.addEventListener("click", onClickAddress);
    __defers["$.__views.emailVal!click!onClickEmail"] && $.__views.emailVal.addEventListener("click", onClickEmail);
    __defers["$.__views.phoneVal!click!onClickPhone"] && $.__views.phoneVal.addEventListener("click", onClickPhone);
    __defers["$.__views.products!touchstart!buttonTouchStart"] && $.__views.products.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.products!touchend!buttonTouchEnd"] && $.__views.products.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.deals!touchstart!buttonTouchStart"] && $.__views.deals.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.deals!touchend!buttonTouchEnd"] && $.__views.deals.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.send!touchstart!buttonTouchStart"] && $.__views.send.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.send!touchend!buttonTouchEnd"] && $.__views.send.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;