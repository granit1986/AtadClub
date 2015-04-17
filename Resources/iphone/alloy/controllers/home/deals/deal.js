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
        indicator.openIndicator();
        try {
            deal = Alloy.Collections.publicDeals.where({
                id: dealId
            })[0].toJSON();
        } catch (e) {
            try {
                deal = Alloy.Collections.homeDeals.where({
                    id: dealId
                })[0].toJSON();
            } catch (e) {
                try {
                    deal = Alloy.Collections.companyDeals.where({
                        id: dealId
                    })[0].toJSON();
                } catch (e) {
                    try {
                        deal = Alloy.Collections.deals.where({
                            id: dealId
                        })[0].toJSON();
                        privateDeal = true;
                    } catch (e) {
                        deal = Alloy.Collections.similarDeals.where({
                            id: dealId
                        })[0].toJSON();
                    }
                }
            }
        }
        privateDeal ? fillFields() : getDealInfo();
    }
    function getDealInfo() {
        var item = Alloy.createModel("publicDeal");
        var userId = 0;
        Alloy.Globals.profile ? userId = Alloy.Globals.profile.id : removeRateAndComplaint();
        item.fetch({
            data: {
                dealId: dealId,
                installId: Alloy.Globals.core.installId,
                lat: lat,
                lng: lng,
                userId: userId,
                lang: Ti.Platform.locale
            },
            success: function() {
                deal = item.toJSON();
                deal.needDeleteComplaint && hideComplaint();
                deal.needDeleteRate && hideRate();
                fillFields();
            },
            error: function() {
                indicator.closeIndicator();
                Alloy.Globals.core.showErrorDialog(L("xhr_error"));
            }
        });
    }
    function removeRateAndComplaint() {
        complaintVisible = false;
        rateVisible = false;
    }
    function hideRate() {
        $.rateDiealButton.enabled = false;
        rateVisible = false;
    }
    function hideComplaint() {
        $.complaintDiealButton.enabled = false;
        complaintVisible = false;
    }
    function fillFields() {
        $.window.title = deal.name;
        $.name.text = deal.name;
        $.price.text = deal.currency + " " + deal.price;
        $.supplier.text = deal.supplierName;
        $.address.text = deal.address;
        $.category.text = deal.subCategoriesTitles;
        $.distance.text = parseFloat(deal.distance).toFixed(2);
        $.description.text = deal.description;
        $.dealtype.text = Alloy.Globals.core.dealType[deal.dealtype].title;
        $.complains.text = deal.complainsCount;
        $.mapImage.image = "http://maps.googleapis.com/maps/api/staticmap?center=" + deal.lat.replace(",", ".") + "," + deal.lng.replace(",", ".") + "8&zoom=16&size=280x180&sensor=false&markers=color:red%7Clabel:D%7C" + deal.lat.replace(",", ".") + "," + deal.lng.replace(",", ".") + "%7Csize:tiny";
        deal.vouchers <= 0 && $.buttons.remove($.getVauchersButton);
        if (deal.endTime && deal.startTime) {
            var start = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(deal.startTime));
            var end = Alloy.Globals.core.viewTime(Alloy.Globals.core.createTime(deal.endTime));
            $.workTime.text = start + " - " + end;
        } else {
            $.scrollView.remove($.workTime);
            $.scrollView.remove($.workTimeLbl);
        }
        if (deal.images) {
            deal.images = JSON.parse(deal.images);
            for (var i = 0; i < deal.images.length; i++) {
                var imageView = Ti.UI.createImageView({
                    image: "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + deal.images[i] + Alloy.Globals.imageSizes.deal.view(),
                    imageOriginal: "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + deal.images[i] + Alloy.Globals.imageSizes.deal.original(),
                    wihth: "180dp",
                    height: "180dp"
                });
                imageView.addEventListener("click", imageClick);
                $.images.addView(imageView);
            }
            deal.images.length > 0 && imageWindow.createWindow($.images.views);
        }
        switchRating(deal.rating, deal.votes);
        indicator.closeIndicator();
    }
    function imageClick() {
        var currentPage = $.images.getCurrentPage();
        imageWindow.openWindow(currentPage);
    }
    function switchRating(rating, votes) {
        switch (rating) {
          case 1:
            ratingImage = "images/rate_0.png";
            break;

          case 2:
            ratingImage = "images/rate_2.png";
            break;

          case 3:
            ratingImage = "images/rate_3.png";
            break;

          case 4:
            ratingImage = "images/rate_4.png";
            break;

          case 5:
            ratingImage = "images/rate_5.png";
        }
        $.rating.backgroundImage = ratingImage;
        $.ratingVoted.text = votes;
    }
    function onClickSupplier() {
        if (!Alloy.Globals.core.apiToken()) {
            var alertDialog = Titanium.UI.createAlertDialog({
                title: L("signup_or_signin_title"),
                message: L("signup_or_signin_message"),
                buttonNames: [ L("no"), L("yes") ],
                cancel: 0
            });
            alertDialog.addEventListener("click", function(e) {
                if (e.cancel === e.index || true === e.cancel) return;
                Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
            });
            alertDialog.show();
            return;
        }
        var view = Alloy.createController("home/companies/company", {
            id: deal.supplierId,
            callback: function(e) {
                $.window.close();
                callback && callback(e);
            }
        }).getView();
        view.backButtonTitle = "Back to deal";
        Alloy.CFG.tabHome.open(view);
    }
    function onClickGetVaucher() {
        if (!Alloy.Globals.core.apiToken()) {
            var alertDialog = Titanium.UI.createAlertDialog({
                title: L("signup_or_signin_title"),
                message: L("signup_or_signin_message"),
                buttonNames: [ L("no"), L("yes") ],
                cancel: 0
            });
            alertDialog.addEventListener("click", function(e) {
                if (e.cancel === e.index || true === e.cancel) return;
                Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
            });
            alertDialog.show();
            return;
        }
        var voucher = Alloy.createModel("getVoucher", {
            DealId: deal.id
        });
        indicator.openIndicator();
        voucher.save({}, {
            success: function(model, response) {
                indicator.closeIndicator();
                var alertDialog = Titanium.UI.createAlertDialog({
                    title: L("voucher_successfull_get"),
                    message: "#" + response.Id,
                    buttonNames: [ L("ok"), L("email") ],
                    cancel: 0
                });
                alertDialog.addEventListener("click", function(e) {
                    if (e.cancel === e.index || true === e.cancel) return;
                    indicator.openIndicator();
                    var profile = Alloy.createModel("profile");
                    profile.fetch({
                        success: function(data) {
                            data = data.toJSON();
                            var text = L("name") + ": " + data.firstName + " " + data.lastName;
                            data.phone && (text = text + "\n" + L("phone") + ": " + data.phone);
                            text = text + "\n" + L("my_voucher_code") + " " + response.Id + "\n";
                            indicator.closeIndicator();
                            var emailDialog = Ti.UI.createEmailDialog();
                            emailDialog.subject = L("voucher_code");
                            emailDialog.toRecipients = [ data.email ];
                            emailDialog.messageBody = text;
                            emailDialog.open();
                        },
                        error: function() {
                            indicator.closeIndicator();
                        }
                    });
                });
                alertDialog.show();
            },
            error: function(model, xhr) {
                indicator.closeIndicator();
                xhr.Message && Alloy.Globals.core.showErrorDialog(xhr.Message);
            }
        });
    }
    function onClickAddress() {
        var mapWindow = Alloy.createController("home/adverts/advertMap", {
            advert: deal
        }).getView();
        Alloy.Globals.tabGroup.activeTab.open(mapWindow);
    }
    function onCLickRateButton() {
        if (!Alloy.Globals.core.apiToken()) {
            var alertDialog = Titanium.UI.createAlertDialog({
                title: L("signup_or_signin_title"),
                message: L("signup_or_signin_message"),
                buttonNames: [ L("no"), L("yes") ],
                cancel: 0
            });
            alertDialog.addEventListener("click", function(e) {
                if (e.cancel === e.index || true === e.cancel) return;
                Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
            });
            alertDialog.show();
            indicator.closeIndicator();
            return;
        }
        var userId = 0;
        Alloy.Globals.profile && (userId = Alloy.Globals.profile.id);
        var ratePicker = Alloy.createController("picker/rate", {
            callback: function(e) {
                var dealRaiting = Alloy.createModel("dealRaiting", {
                    DealId: deal.id,
                    raiting: e,
                    UserId: userId
                });
                indicator.openIndicator();
                dealRaiting.save({}, {
                    success: function(model, response) {
                        Titanium.UI.createAlertDialog({
                            title: "Thank you!"
                        }).show();
                        indicator.closeIndicator();
                        switchRating(response.Raiting, deal.votes);
                        deal.rating = response.Raiting;
                        try {
                            var updatedDeal = Alloy.Collections.publicDeals.where({
                                id: response.DealId
                            })[0];
                            updatedDeal.set("rating", response.Raiting);
                            updatedDeal.set("votes", response.votes);
                        } catch (e) {}
                        try {
                            var updatedDeal = Alloy.Collections.homeDeals.where({
                                id: response.DealId
                            })[0];
                            updatedDeal.set("rating", response.Raiting);
                            updatedDeal.set("votes", response.votes);
                        } catch (e) {}
                        try {
                            var updatedDeal = Alloy.Collections.companyDeals.where({
                                id: response.DealId
                            })[0];
                            updatedDeal.set("rating", response.Raiting);
                            updatedDeal.set("votes", response.votes);
                        } catch (e) {}
                        $.ratingVoted.text = response.votes;
                        hideRate();
                    },
                    error: function(model, xhr) {
                        Alloy.Globals.core.showErrorDialog(xhr && xhr.Message ? L("server_" + xhr.Message, L("error")) : L("error"));
                    }
                });
            }
        }).getView();
        ratePicker.backButtonTitle = L("back");
        return ratePicker;
    }
    function buttonTouchStart(e) {
        e.source.enabled && (e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap);
    }
    function buttonTouchEnd(e) {
        indicator.openIndicator();
        if (!e.source.enabled) return;
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        e.source.id && openView(e.source.id);
    }
    function openView(id) {
        var view = false;
        switch (id) {
          case "rateDiealButton":
            view = onCLickRateButton();
            indicator.closeIndicator();
            break;

          case "complaintDiealButton":
            if (!Alloy.Globals.core.apiToken()) {
                var alertDialog = Titanium.UI.createAlertDialog({
                    title: L("signup_or_signin_title"),
                    message: L("signup_or_signin_message"),
                    buttonNames: [ L("no"), L("yes") ],
                    cancel: 0
                });
                alertDialog.addEventListener("click", function(e) {
                    if (e.cancel === e.index || true === e.cancel) return;
                    Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
                });
                alertDialog.show();
                indicator.closeIndicator();
                break;
            }
            view = Alloy.createController("complaints/index", {
                id: deal.id,
                dealWindow: function() {
                    hideComplaint();
                },
                callback: function() {
                    Alloy.Globals.core.showErrorDialog(L("thanks"));
                }
            }).getView();
            indicator.closeIndicator();
            break;

          case "supplierButton":
            view = Alloy.createController("home/companies/company", {
                id: deal.supplierId,
                lat: lat,
                lng: lng,
                callback: function(e) {
                    $.window.close();
                    callback && callback(e);
                }
            }).getView();
            view.backButtonTitle = "Back to deal";
            indicator.closeIndicator();
            break;

          case "similarDealsButton":
            view = Alloy.createController("home/deals/similardeals", {
                deal: deal,
                lat: lat,
                lng: lng
            }).getView();
            indicator.closeIndicator();
            break;

          case "allDealsButton":
            view = Alloy.createController("home/companies/allDeals", {
                id: deal.supplierId,
                supplierName: deal.supplierName,
                lat: lat,
                lng: lng
            }).getView();
            indicator.closeIndicator();
            break;

          case "getVauchersButton":
            onClickGetVaucher();
            indicator.closeIndicator();
            break;

          case "send":
            if (!Alloy.Globals.core.apiToken()) {
                var alertDialog = Titanium.UI.createAlertDialog({
                    title: L("signup_or_signin_title"),
                    message: L("signup_or_signin_message"),
                    buttonNames: [ L("no"), L("yes") ],
                    cancel: 0
                });
                alertDialog.addEventListener("click", function(e) {
                    if (e.cancel === e.index || true === e.cancel) return;
                    Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
                });
                alertDialog.show();
                indicator.closeIndicator();
                break;
            }
            if (deal.supplierId === Alloy.Globals.profile.id) {
                Alloy.Globals.core.showErrorDialog(L("cant_write_themselves"));
                indicator.closeIndicator();
                break;
            }
            var chat = null;
            Alloy.Collections.chats.fetch({
                success: function() {
                    chat = Alloy.Collections.chats.where({
                        To: deal.supplierId
                    })[0];
                    if (null != chat) {
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
                        to: deal.supplierId
                    }).save({}, {
                        success: function() {
                            view = Alloy.createController("account/answers/answer", {
                                id: arguments[1],
                                newChat: true,
                                toUser: deal.supplierId
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
            break;

          case "share":
            Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabShare);
            indicator.closeIndicator();
        }
        view && Alloy.CFG.tabHome.open(view);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/deals/deal";
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
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    $.__views.scrollView = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "scrollView"
    });
    $.__views.window.add($.__views.scrollView);
    $.__views.name = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        textAlign: "center",
        color: Alloy.Globals.Styles.titleColor,
        font: {
            fontSize: "25dp",
            fontFamily: "OleoScriptSwashCaps-Regular"
        },
        id: "name"
    });
    $.__views.scrollView.add($.__views.name);
    $.__views.category = Ti.UI.createLabel({
        color: "#a1a1a1",
        width: "280dp",
        height: Ti.UI.SIZE,
        bottom: "10dp",
        left: "0dp",
        textAlign: "center",
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "category"
    });
    $.__views.scrollView.add($.__views.category);
    var __alloyId225 = [];
    $.__views.images = Ti.UI.createScrollableView({
        width: "280dp",
        height: "180dp",
        left: "0dp",
        bottom: "10dp",
        contenWidth: "180dp",
        borderColor: "#ccc",
        borderWidth: "1dp",
        backgroundColor: "#fff",
        views: __alloyId225,
        id: "images",
        showPagingControl: "true"
    });
    $.__views.scrollView.add($.__views.images);
    $.__views.buttonsView = Ti.UI.createView({
        layout: "horizontal",
        width: "280dp",
        height: Ti.UI.SIZE,
        textAlign: "center",
        bottom: "5dp",
        id: "buttonsView"
    });
    $.__views.scrollView.add($.__views.buttonsView);
    $.__views.campaignRatingWrap = Ti.UI.createView({
        layout: "absolute",
        height: "30dp",
        bottom: "10dp",
        id: "campaignRatingWrap"
    });
    $.__views.buttonsView.add($.__views.campaignRatingWrap);
    $.__views.rateDiealButton = Ti.UI.createButton({
        width: "90dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        left: Alloy.Globals.Styles.smallHorButton_Left,
        right: Alloy.Globals.Styles.smallHorButton_Right,
        backgroundDisabledImage: "images/gray_fill.png",
        disabledColor: "#ccc",
        id: "rateDiealButton",
        titleid: "rateDeal"
    });
    $.__views.campaignRatingWrap.add($.__views.rateDiealButton);
    buttonTouchStart ? $.__views.rateDiealButton.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.rateDiealButton!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.rateDiealButton.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.rateDiealButton!touchend!buttonTouchEnd"] = true;
    $.__views.rating = Ti.UI.createView({
        width: "125dp",
        height: "23dp",
        left: Alloy.Globals.Styles.campaingRating_left,
        right: Alloy.Globals.Styles.campaingRating_right,
        top: "2dp",
        backgroundRepeat: false,
        id: "rating"
    });
    $.__views.campaignRatingWrap.add($.__views.rating);
    $.__views.ratingVoted = Ti.UI.createLabel({
        top: "7dp",
        left: Alloy.Globals.Styles.campaingRatingVoted_left,
        right: Alloy.Globals.Styles.campaingRatingVoted_right,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "13dp"
        },
        color: "#a1a1a1",
        id: "ratingVoted"
    });
    $.__views.campaignRatingWrap.add($.__views.ratingVoted);
    $.__views.__alloyId226 = Ti.UI.createView({
        layout: "absolute",
        height: "30dp",
        id: "__alloyId226"
    });
    $.__views.buttonsView.add($.__views.__alloyId226);
    $.__views.complaintDiealButton = Ti.UI.createButton({
        width: "90dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        left: Alloy.Globals.Styles.smallHorButton_Left,
        right: Alloy.Globals.Styles.smallHorButton_Right,
        backgroundDisabledImage: "images/gray_fill.png",
        disabledColor: "#ccc",
        id: "complaintDiealButton",
        titleid: "complain"
    });
    $.__views.__alloyId226.add($.__views.complaintDiealButton);
    buttonTouchStart ? $.__views.complaintDiealButton.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.complaintDiealButton!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.complaintDiealButton.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.complaintDiealButton!touchend!buttonTouchEnd"] = true;
    $.__views.complains = Ti.UI.createLabel({
        width: "20dp",
        height: "30dp",
        top: Alloy.Globals.Styles.complainLabelTop,
        bottom: "0dp",
        left: Alloy.Globals.Styles.complainCountLeft,
        right: Alloy.Globals.Styles.complainCountRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#303030",
        id: "complains"
    });
    $.__views.__alloyId226.add($.__views.complains);
    $.__views.complainsLbl = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: "30dp",
        color: "#a1a1a1",
        left: Alloy.Globals.Styles.complainLabelLeft,
        right: Alloy.Globals.Styles.complainLabelRight,
        textAlign: "left",
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        bottom: "0dp",
        id: "complainsLbl",
        textid: "complains"
    });
    $.__views.__alloyId226.add($.__views.complainsLbl);
    $.__views.priceLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: "#a1a1a1",
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        bottom: "0dp",
        id: "priceLbl",
        textid: "price"
    });
    $.__views.scrollView.add($.__views.priceLbl);
    $.__views.price = Ti.UI.createLabel({
        width: "100dp",
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.priceLeft,
        right: Alloy.Globals.Styles.priceRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#a80062",
        layout: "horisontal",
        id: "price"
    });
    $.__views.scrollView.add($.__views.price);
    $.__views.__alloyId227 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId227"
    });
    $.__views.scrollView.add($.__views.__alloyId227);
    $.__views.dealtypeLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: "#a1a1a1",
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        bottom: "0dp",
        id: "dealtypeLbl",
        textid: "dealtype"
    });
    $.__views.scrollView.add($.__views.dealtypeLbl);
    $.__views.dealtype = Ti.UI.createLabel({
        width: "100dp",
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.priceLeft,
        right: Alloy.Globals.Styles.priceRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#a80062",
        layout: "horisontal",
        id: "dealtype"
    });
    $.__views.scrollView.add($.__views.dealtype);
    $.__views.__alloyId228 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId228"
    });
    $.__views.scrollView.add($.__views.__alloyId228);
    $.__views.descriptionLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: "#a1a1a1",
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        bottom: "0dp",
        id: "descriptionLbl",
        textid: "about_the_deal"
    });
    $.__views.scrollView.add($.__views.descriptionLbl);
    $.__views.description = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.priceLeft,
        right: Alloy.Globals.Styles.priceRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "description"
    });
    $.__views.scrollView.add($.__views.description);
    $.__views.__alloyId229 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId229"
    });
    $.__views.scrollView.add($.__views.__alloyId229);
    $.__views.supplierLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: "#a1a1a1",
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        bottom: "0dp",
        id: "supplierLbl",
        textid: "supplier"
    });
    $.__views.scrollView.add($.__views.supplierLbl);
    $.__views.supplier = Ti.UI.createLabel({
        width: "100dp",
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.priceLeft,
        right: Alloy.Globals.Styles.priceRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#00accb",
        layout: "horisontal",
        id: "supplier"
    });
    $.__views.scrollView.add($.__views.supplier);
    onClickSupplier ? $.__views.supplier.addEventListener("click", onClickSupplier) : __defers["$.__views.supplier!click!onClickSupplier"] = true;
    $.__views.__alloyId230 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId230"
    });
    $.__views.scrollView.add($.__views.__alloyId230);
    $.__views.addressLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: "#a1a1a1",
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        bottom: "0dp",
        id: "addressLbl",
        textid: "address"
    });
    $.__views.scrollView.add($.__views.addressLbl);
    $.__views.address = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.priceLeft,
        right: Alloy.Globals.Styles.priceRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#00accb",
        id: "address"
    });
    $.__views.scrollView.add($.__views.address);
    onClickAddress ? $.__views.address.addEventListener("click", onClickAddress) : __defers["$.__views.address!click!onClickAddress"] = true;
    $.__views.__alloyId231 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId231"
    });
    $.__views.scrollView.add($.__views.__alloyId231);
    $.__views.distanceLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: "#a1a1a1",
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        bottom: "0dp",
        id: "distanceLbl",
        textid: "distance"
    });
    $.__views.scrollView.add($.__views.distanceLbl);
    $.__views.distance = Ti.UI.createLabel({
        width: "100dp",
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.priceLeft,
        right: Alloy.Globals.Styles.priceRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#a80062",
        layout: "horisontal",
        id: "distance"
    });
    $.__views.scrollView.add($.__views.distance);
    $.__views.mapImage = Ti.UI.createImageView({
        bottom: "10dp",
        width: "280dp",
        id: "mapImage",
        image: ""
    });
    $.__views.scrollView.add($.__views.mapImage);
    onClickAddress ? $.__views.mapImage.addEventListener("click", onClickAddress) : __defers["$.__views.mapImage!click!onClickAddress"] = true;
    $.__views.workTimeLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Alloy.Globals.Styles.labelHeight,
        color: "#a1a1a1",
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        bottom: "0dp",
        id: "workTimeLbl",
        textid: "work_time"
    });
    $.__views.scrollView.add($.__views.workTimeLbl);
    $.__views.workTime = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.priceLeft,
        right: Alloy.Globals.Styles.priceRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "workTime"
    });
    $.__views.scrollView.add($.__views.workTime);
    $.__views.buttons = Ti.UI.createView({
        layout: "horizontal",
        width: "280dp",
        height: Ti.UI.SIZE,
        textAlign: "center",
        bottom: "5dp",
        id: "buttons"
    });
    $.__views.scrollView.add($.__views.buttons);
    $.__views.supplierButton = Ti.UI.createButton({
        width: "135dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        left: Alloy.Globals.Styles.smallHorButton_Left,
        right: "10dp",
        id: "supplierButton",
        titleid: "supplier"
    });
    $.__views.buttons.add($.__views.supplierButton);
    buttonTouchStart ? $.__views.supplierButton.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.supplierButton!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.supplierButton.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.supplierButton!touchend!buttonTouchEnd"] = true;
    $.__views.similarDealsButton = Ti.UI.createButton({
        width: "135dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        left: Alloy.Globals.Styles.smallHorButton_Left,
        right: Alloy.Globals.Styles.smallHorButton_Right,
        id: "similarDealsButton",
        titleid: "similardeals"
    });
    $.__views.buttons.add($.__views.similarDealsButton);
    buttonTouchStart ? $.__views.similarDealsButton.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.similarDealsButton!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.similarDealsButton.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.similarDealsButton!touchend!buttonTouchEnd"] = true;
    $.__views.allDealsButton = Ti.UI.createButton({
        width: "280dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        left: Alloy.Globals.Styles.smallHorButton_Left,
        right: Alloy.Globals.Styles.smallHorButton_Right,
        top: "10dp",
        id: "allDealsButton",
        titleid: "allDealsFromSupplier"
    });
    $.__views.buttons.add($.__views.allDealsButton);
    buttonTouchStart ? $.__views.allDealsButton.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.allDealsButton!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.allDealsButton.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.allDealsButton!touchend!buttonTouchEnd"] = true;
    $.__views.getVauchersButton = Ti.UI.createButton({
        width: "280dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        left: Alloy.Globals.Styles.smallHorButton_Left,
        right: Alloy.Globals.Styles.smallHorButton_Right,
        top: "10dp",
        id: "getVauchersButton",
        titleid: "getVauchers"
    });
    $.__views.buttons.add($.__views.getVauchersButton);
    buttonTouchStart ? $.__views.getVauchersButton.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.getVauchersButton!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.getVauchersButton.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.getVauchersButton!touchend!buttonTouchEnd"] = true;
    $.__views.send = Ti.UI.createButton({
        width: "280dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        left: Alloy.Globals.Styles.smallHorButton_Left,
        right: Alloy.Globals.Styles.smallHorButton_Right,
        top: "10dp",
        id: "send",
        titleid: "contact_supplier"
    });
    $.__views.buttons.add($.__views.send);
    buttonTouchStart ? $.__views.send.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.send!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.send.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.send!touchend!buttonTouchEnd"] = true;
    $.__views.share = Ti.UI.createButton({
        width: "280dp",
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "16dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        left: Alloy.Globals.Styles.smallHorButton_Left,
        right: Alloy.Globals.Styles.smallHorButton_Right,
        top: "10dp",
        id: "share",
        titleid: "tab_share"
    });
    $.__views.buttons.add($.__views.share);
    buttonTouchStart ? $.__views.share.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.share!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.share.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.share!touchend!buttonTouchEnd"] = true;
    $.__views.__alloyId232 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId232"
    });
    $.__views.scrollView.add($.__views.__alloyId232);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var callback = arguments[0].callback || null;
    var accountdeal = arguments[0].accountdeal || null;
    var dealId = arguments[0].id || null;
    var lat = arguments[0].lat || null;
    var lng = arguments[0].lng || null;
    var rateVisible = true, complaintVisible = true;
    if (accountdeal) {
        var btn = Ti.UI.createButton({
            title: L("edit")
        });
        $.window.setRightNavButton(btn);
        btn.addEventListener("click", function() {
            var view = Alloy.createController("add/deal", {
                dealId: deal.id,
                callback: function() {
                    $.window.close();
                },
                tab: Alloy.CFG.tabAccount
            }).getView();
            Alloy.CFG.tabAccount.open(view);
        });
    }
    var deal;
    var indicator = Alloy.Globals.indicator;
    var privateDeal = false;
    var imageWindow = {
        window: false,
        view: false,
        openWindow: function(page) {
            var self = this;
            self.window.open();
            self.view.setCurrentPage(page);
        },
        createWindow: function(views) {
            var self = this;
            self.window = Ti.UI.createWindow({
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f0f0",
                orientationModes: [ Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]
            });
            var btn = Ti.UI.createButton({
                title: "X",
                width: "30dp",
                height: "30dp",
                right: "5dp",
                top: "5dp",
                zIndex: 10,
                backgroundColor: Alloy.Globals.Styles.buttonBg,
                color: "#fff"
            });
            btn.addEventListener("click", function() {
                self.window.close();
            });
            var newViews = [];
            for (var i = 0; i < views.length; i++) {
                var view = views[i];
                var newView = Ti.UI.createImageView({
                    image: view.imageOriginal
                });
                newViews.push(newView);
            }
            self.view = Ti.UI.createScrollableView({
                showPagingControl: true,
                views: newViews
            });
            self.window.add(self.view);
            self.window.add(btn);
        }
    };
    var ratingImage = "images/rate_0.png";
    if (accountdeal) {
        $.scrollView.remove($.buttons);
        $.scrollView.remove($.supplier);
        $.scrollView.remove($.supplierLbl);
        $.rateDiealButton.hide();
        $.complaintDiealButton.hide();
        $.addClass($.rating, "ratingCenter");
        $.addClass($.ratingVoted, "ratingVotedCenter");
        $.addClass($.complains, "complainsCountCenter");
        $.addClass($.complainsLbl, "complainsLabelCenter");
    }
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.rateDiealButton!touchstart!buttonTouchStart"] && $.__views.rateDiealButton.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.rateDiealButton!touchend!buttonTouchEnd"] && $.__views.rateDiealButton.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.complaintDiealButton!touchstart!buttonTouchStart"] && $.__views.complaintDiealButton.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.complaintDiealButton!touchend!buttonTouchEnd"] && $.__views.complaintDiealButton.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.supplier!click!onClickSupplier"] && $.__views.supplier.addEventListener("click", onClickSupplier);
    __defers["$.__views.address!click!onClickAddress"] && $.__views.address.addEventListener("click", onClickAddress);
    __defers["$.__views.mapImage!click!onClickAddress"] && $.__views.mapImage.addEventListener("click", onClickAddress);
    __defers["$.__views.supplierButton!touchstart!buttonTouchStart"] && $.__views.supplierButton.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.supplierButton!touchend!buttonTouchEnd"] && $.__views.supplierButton.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.similarDealsButton!touchstart!buttonTouchStart"] && $.__views.similarDealsButton.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.similarDealsButton!touchend!buttonTouchEnd"] && $.__views.similarDealsButton.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.allDealsButton!touchstart!buttonTouchStart"] && $.__views.allDealsButton.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.allDealsButton!touchend!buttonTouchEnd"] && $.__views.allDealsButton.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.getVauchersButton!touchstart!buttonTouchStart"] && $.__views.getVauchersButton.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.getVauchersButton!touchend!buttonTouchEnd"] && $.__views.getVauchersButton.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.send!touchstart!buttonTouchStart"] && $.__views.send.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.send!touchend!buttonTouchEnd"] && $.__views.send.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.share!touchstart!buttonTouchStart"] && $.__views.share.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.share!touchend!buttonTouchEnd"] && $.__views.share.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;