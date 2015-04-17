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
        if (dealToEdit) {
            indicator.openIndicator();
            $.title.value = dealToEdit.name;
            $.price.value = dealToEdit.price;
            $.description.value = dealToEdit.description;
            subCategories = JSON.parse(dealToEdit.subCategories);
            $.button.title = L("update_deal_button");
            $.switch_.value = dealToEdit.active;
            $.renewDeal.value = dealToEdit.renewDays;
            $.delete_button.visible = true;
            $.vouchers.value = dealToEdit.vouchers;
            $.dealType.value = Alloy.Globals.core.dealType[dealToEdit.dealtype].title;
            dealTypeRowIndex = dealToEdit.dealtype;
            if (dealToEdit.startTime) {
                $.timepicker_switch.value = true;
                $.startTime.value = Alloy.Globals.core.createTime(dealToEdit.startTime).toLocaleTimeString();
                from = dealToEdit.startTime;
                $.timeInputs.height = timeInputHeight;
            }
            if (dealToEdit.endTime) {
                $.timepicker_switch.value = true;
                $.endTime.value = Alloy.Globals.core.createTime(dealToEdit.endTime).toLocaleTimeString();
                to = dealToEdit.endTime;
                $.timeInputs.height = timeInputHeight;
            }
            $.startDate.value = dealToEdit.startDate ? new Date(dealToEdit.startDate).toLocaleDateString() : "";
            date = dealToEdit.startDate;
            $.dealType.value = Alloy.Globals.core.dealType[dealToEdit.dealtype].title;
            if (dealToEdit.images) {
                dealToEdit.images = JSON.parse(dealToEdit.images);
                for (var i = 0; i < dealToEdit.images.length; i++) addImage("http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + dealToEdit.images[i] + Alloy.Globals.imageSizes.deal.row(), dealToEdit.images[i]);
            }
            core.selectedCategoriesInEdit = {};
            for (var i = 0; i < subCategories.length; ++i) {
                var s = subCategories[i];
                core.subCategories.select({
                    categoryId: s.CategoryId,
                    id: s.Id
                }, core.selectedCategoriesInEdit);
            }
            sectionName = "";
            showCategories();
            indicator.closeIndicator();
        } else {
            sectionName = "newdealer";
            Alloy.Globals.core.selectedNewDealsCategories = {};
        }
    }
    function blur(e) {
        hideKeyboard(e);
    }
    function hideKeyboard(e) {
        "description" !== e.source.id && $.description.blur();
        "dealType" !== e.source.id && "startDate" !== e.source.id && "startTime" !== e.source.id && "endTime" !== e.source.id && "renewDeal" !== e.source.id && $.pickerWrap.removeAllChildren();
        "title" !== e.source.id && $.title.blur();
        "price" !== e.source.id && $.price.blur();
        "vouchers" !== e.source.id && $.vouchers.blur();
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        var id = e.source.id;
        switch (id) {
          case "button":
            indicator.openIndicator();
            onClick();
            break;

          case "delete_button":
            indicator.openIndicator();
            deleteDeal();
            break;

          case "cancel_button":
            cancel();
        }
    }
    function cancel() {
        $.window.close();
    }
    function onClick() {
        indicator.openIndicator();
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
            indicator.closeIndicator();
            alertDialog.show();
            return;
        }
        if (!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
            var alertDialog = Titanium.UI.createAlertDialog({
                title: L("should_be_company_title"),
                message: L("should_be_company_message"),
                buttonNames: [ L("no"), L("yes") ],
                cancel: 0
            });
            alertDialog.addEventListener("click", function(e) {
                if (e.cancel === e.index || true === e.cancel) return;
                Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
            });
            indicator.closeIndicator();
            alertDialog.show();
            return;
        }
        if (0 == subCategories.length) {
            indicator.closeIndicator();
            Alloy.Globals.core.showErrorDialog(L("please_select_category"));
            return;
        }
        var subcategoriesForSave = [];
        for (var i = 0; i < subCategories.length; ++i) {
            var s = subCategories[i];
            subcategoriesForSave.push(s.Id ? s.Id : s);
        }
        var deal = {
            name: $.title.value,
            price: $.price.value,
            description: $.description.value,
            subCategories: JSON.stringify(subcategoriesForSave),
            active: $.switch_.value,
            renewDays: $.renewDeal.value,
            dealtype: dealTypeRowIndex >= 0 ? dealTypeRowIndex : dealToEdit.dealtype
        };
        0 != date && (deal.startDate = date);
        deal.vouchers = $.voucher_switch.value ? $.vouchers.value : 0;
        if ($.timepicker_switch.value) {
            0 != from && (deal.starttime = from);
            0 != to && (deal.endtime = to);
        }
        dealToEdit && (deal.id = dealToEdit.id);
        if (maxRenewArray && 3 === maxRenewArray.length) {
            var status = 3 != Alloy.Globals.profile.status ? Alloy.Globals.profile.status : 0;
            if (2 !== status) {
                var maxRenewForStatus = maxRenewArray[status];
                if (deal.renewDays > maxRenewForStatus) {
                    var messageStatuses = "";
                    switch (status) {
                      case 0:
                        var nextMaxRenew = maxRenewArray[1];
                        nextMaxRenew > deal.renewDays ? messageStatuses = messageStatuses + L("silver") + L("maxRenew_separator") + L("gold") : messageStatuses += L("gold");
                        break;

                      case 1:
                        messageStatuses += L("gold");
                    }
                    var alertDialog = Titanium.UI.createAlertDialog({
                        title: L("upgrade_membership"),
                        message: L("maxRenew_part1") + messageStatuses + L("maxRenew_part2"),
                        buttonNames: [ L("upgrade"), L("OK") ]
                    });
                    alertDialog.addEventListener("click", function(e) {
                        if (!e.index) {
                            var view = Alloy.createController("account/upgradeSelect").getView();
                            Alloy.Globals.tabGroup.activeTab.open(view);
                        }
                    });
                    alertDialog.show();
                    indicator.closeIndicator();
                    return;
                }
            }
        }
        var deal = Alloy.createModel("deal", deal);
        if (deal.localValidate(errorHandler)) {
            if (1 === $.images.children.length) {
                Alloy.Globals.core.showErrorDialog(L("image_require"));
                indicator.closeIndicator();
                return;
            }
            deal.save({}, {
                success: function(model, response) {
                    for (var i = 0; i < $.images.children.length; i++) {
                        var image = $.images.children[i].image;
                        if (image && !image.serverId) {
                            if ("string" != typeof image) {
                                var factor = 1;
                                var size = 600;
                                var imageView = $.images.children[i];
                                var height = image.height;
                                var width = image.width;
                                var newImageView = Ti.UI.createImageView({
                                    image: imageView.image,
                                    width: width,
                                    height: height
                                });
                                if (height > width) {
                                    factor = width / height;
                                    newImageView.height = size;
                                    newImageView.width = size * factor;
                                } else {
                                    factor = height / width;
                                    newImageView.width = size;
                                    newImageView.height = size * factor;
                                }
                                image = newImageView.toImage();
                            }
                            images.push(image);
                        }
                    }
                    if (images.length > 0 || imagesToDelete.length > 0) {
                        var upload = Alloy.Globals.upload;
                        progress.openBar();
                        upload.start({
                            type: upload.types.deal,
                            id: response,
                            blobs: images,
                            "delete": JSON.stringify(imagesToDelete),
                            onerror: function() {
                                Alloy.Globals.core.showErrorDialog(L("error_loading_image"));
                                indicator.closeIndicator();
                                progress.closeBar();
                            },
                            onload: function() {
                                progress.setBarValue(1);
                                progress.closeBar();
                                postUpdate();
                            },
                            onsendstream: function(e) {
                                progress.setBarValue(e.progress);
                                Ti.API.info("progress - " + e.progress);
                            }
                        });
                    } else {
                        indicator.closeIndicator();
                        postUpdate();
                    }
                    indicator.closeIndicator();
                },
                error: function(model, xhr) {
                    if (xhr && xhr.maxDeals) {
                        var alertDialog = Titanium.UI.createAlertDialog({
                            title: L("upgrade_membership"),
                            message: L("limit") + " " + xhr.maxDeals + " " + L("limit_deals"),
                            buttonNames: [ L("upgrade"), L("OK") ]
                        });
                        alertDialog.addEventListener("click", function(e) {
                            if (!e.index) {
                                var view = Alloy.createController("account/upgradeSelect").getView();
                                Alloy.Globals.tabGroup.activeTab.open(view);
                            }
                        });
                        alertDialog.show();
                    } else xhr && xhr.Message && Alloy.Globals.core.showErrorDialog(xhr.Message);
                    indicator.closeIndicator();
                }
            });
        } else indicator.closeIndicator();
    }
    function postUpdate() {
        if (dealToEdit) {
            indicator.closeIndicator();
            Alloy.Globals.core.showErrorDialog(L("deal_updated_label"));
            Ti.App.fireEvent("account:updateDeals");
            callback && callback();
            $.window.close();
        } else {
            $.itemIsLoad.visible = true;
            address = false;
            subCategories = [];
            image = false;
            $.title.value = "";
            $.price.value = "";
            $.description.value = "";
            $.switch_.value = true;
            var alertDialog = Titanium.UI.createAlertDialog({
                title: L("deal_added_title"),
                message: L("deal_added_label"),
                buttonNames: [ L("ok"), L("support") ],
                cancel: 0
            });
            alertDialog.addEventListener("click", function(e) {
                if (e.cancel === e.index || true === e.cancel) {
                    Alloy.Collections.deals.fetch();
                    $.window.close();
                    return;
                }
                enterFromAccount || $.window.close();
                Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAppreciation);
            });
            indicator.closeIndicator();
            alertDialog.show();
        }
    }
    function errorHandler(err) {
        switch (err) {
          case errors.NO_TITLE:
            $.title.focus();
            break;

          case errors.NO_PRICE:
            $.price.focus();
            break;

          case errors.INVALID_PRICE:
            $.price.focus();
            break;

          case errors.MANY_RENEW:
            return;
        }
        Alloy.Globals.core.showError(err);
    }
    function categories() {
        var categoriesWindow = Alloy.createController("categories/index", {
            closeCallback: function() {
                subCategories = [];
                if (core.currentSectionCategories()["_1"] && core.currentSectionCategories()["_1"].lenght) {
                    findAdverts = true;
                    for (var subCategoryKey in core.currentSectionCategories()["_1"]) subCategories.push(core.currentSectionCategories()["_1"][subCategoryKey]);
                } else for (var categoryKey in core.currentSectionCategories()) {
                    var category = core.currentSectionCategories()[categoryKey];
                    for (var subCategoryKey in category) subCategories.push(category[subCategoryKey]);
                }
                showCategories();
            },
            sectionName: sectionName,
            win: tab,
            forDeals: true
        }).getView();
        tab && tab.open(categoriesWindow);
    }
    function showCategories() {
        $.selectedCategories.text = "";
        for (var categoryKey in core.currentSectionCategories()) if (Object.size(core.currentSectionCategories()[categoryKey]) > 0) {
            categoryKey = categoryKey.replace("_", "");
            var category = Alloy.Collections.categories.get(categoryKey);
            $.selectedCategories.text += "" == $.selectedCategories.text ? category.attributes["name"] : ", " + category.attributes["name"];
        }
    }
    function addPhoto() {
        photoDialog.show();
    }
    function openGallery() {
        Titanium.Media.openPhotoGallery({
            success: function(e) {
                if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
                    var image = e.media;
                    addImage(image);
                }
            }
        });
    }
    function addImage(image, serverId) {
        indicator.openIndicator();
        var imageView = Ti.UI.createImageView({
            image: image,
            width: "55dp",
            height: "55dp",
            right: "5dp",
            bottom: "5dp",
            serverId: serverId || false
        });
        var addImageControl = $.addPhoto;
        $.images.remove($.addPhoto);
        $.images.add(imageView);
        $.images.add(addImageControl);
        indicator.closeIndicator();
        $.howToDeleteImageLbl.visible = true;
        imageCount++;
    }
    function showCamera() {
        Titanium.Media.showCamera({
            success: function(e) {
                e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO && addImage(e.media);
            },
            cancel: function() {},
            error: function() {}
        });
    }
    function onClickImages(e) {
        if ("[object TiUIImageView]" !== e.source.toString()) return;
        e.source.serverId && imagesToDelete.push(e.source.serverId);
        $.images.remove(e.source);
        imageCount--;
        0 == imageCount && ($.howToDeleteImageLbl.visible = false);
    }
    function setAutoRenew() {
        var datePicker = Alloy.createController("picker/number", {
            callback: function(date, close) {
                $.renewDeal.value = item;
                if (close) {
                    $.pickerWrap.removeAllChildren();
                    pickerOpened = false;
                }
            },
            maxValue: maxRenew
        }).getView();
        closeKeyBoard();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(datePicker);
        pickerOpened = true;
    }
    function setStartDate() {
        var datePicker = Alloy.createController("picker/date", {
            callback: function(datePost, close) {
                date = datePost.toDateString();
                $.startDate.value = datePost.toLocaleDateString();
                if (close) {
                    $.pickerWrap.removeAllChildren();
                    pickerOpened = false;
                }
            }
        }).getView();
        closeKeyBoard();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(datePicker);
        pickerOpened = true;
    }
    function setDealType() {
        var dealTypePicker = Alloy.createController("picker/dealtype", {
            callback: function(dealtype, close, rowIndex) {
                $.dealType.value = dealtype;
                rowIndex >= 0 && (dealTypeRowIndex = rowIndex);
                if (close) {
                    $.pickerWrap.removeAllChildren();
                    pickerOpened = false;
                }
            },
            rowIndex: dealTypeRowIndex
        }).getView();
        closeKeyBoard();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(dealTypePicker);
        pickerOpened = true;
    }
    function setStartTime() {
        var startTimePicker = Alloy.createController("picker/time", {
            callback: function(e, close) {
                from = 60 * e.getUTCHours() + e.getUTCMinutes();
                $.startTime.value = e.toLocaleTimeString();
                Ti.API.info(e.getUTCHours(), e.getUTCMinutes(), from);
                if (close) {
                    $.pickerWrap.removeAllChildren();
                    pickerOpened = false;
                }
            }
        }).getView();
        closeKeyBoard();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(startTimePicker);
        pickerOpened = true;
    }
    function setEndTime() {
        var endTimePicker = Alloy.createController("picker/time", {
            callback: function(e, close) {
                to = 60 * e.getUTCHours() + e.getUTCMinutes();
                $.endTime.value = e.toLocaleTimeString();
                Ti.API.info(e.getUTCHours(), e.getUTCMinutes(), from);
                if (close) {
                    $.pickerWrap.removeAllChildren();
                    pickerOpened = false;
                }
            }
        }).getView();
        closeKeyBoard();
        $.pickerWrap.removeAllChildren();
        $.pickerWrap.add(endTimePicker);
        pickerOpened = true;
    }
    function setVouchers() {}
    function closeKeyBoard() {
        for (var i = 0; i < textFields.length; i++) textFields[i].blur();
    }
    function showHelpDurning() {
        var alertDialog = Titanium.UI.createAlertDialog({
            message: L("show_help_durning")
        });
        alertDialog.show();
    }
    function showHelpRenew() {
        var alertDialog = Titanium.UI.createAlertDialog({
            message: L("show_help_renew")
        });
        alertDialog.show();
    }
    function showHelpVouchers() {
        var alertDialog = Titanium.UI.createAlertDialog({
            message: L("show_help_vouchers")
        });
        alertDialog.show();
    }
    function deleteDeal() {
        var alertDialog = Titanium.UI.createAlertDialog({
            title: L("delete_deal_title"),
            message: L("delete_deal_message"),
            buttonNames: [ L("no"), L("yes") ],
            cancel: 0
        });
        alertDialog.addEventListener("click", function(e) {
            indicator.closeIndicator();
            if (1 != e.index) return;
            Alloy.Collections.deals.where({
                id: dealToEdit.id
            })[0].destroy({
                success: function() {
                    Ti.App.fireEvent("account:updateDeals");
                    $.window.close();
                },
                error: function() {}
            });
        });
        alertDialog.show();
    }
    function onClose() {
        callback && callback();
        indicator.closeIndicator();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "add/deal";
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
        id: "window",
        height: Ti.UI.FILL,
        titleid: "new_deal"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    onClose ? $.__views.window.addEventListener("close", onClose) : __defers["$.__views.window!close!onClose"] = true;
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    $.__views.form = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "form",
        top: "0"
    });
    $.__views.window.add($.__views.form);
    $.__views.__alloyId139 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId139"
    });
    $.__views.form.add($.__views.__alloyId139);
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
    $.__views.form.add($.__views.categoriesLbl);
    $.__views.categories = Ti.UI.createButton({
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
        id: "categories"
    });
    $.__views.form.add($.__views.categories);
    categories ? $.__views.categories.addEventListener("click", categories) : __defers["$.__views.categories!click!categories"] = true;
    $.__views.__alloyId140 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        left: "5dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        textid: "select_category",
        id: "__alloyId140"
    });
    $.__views.categories.add($.__views.__alloyId140);
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
    $.__views.__alloyId141 = Ti.UI.createLabel({
        width: "20dp",
        height: "20dp",
        right: "5dp",
        top: "5dp",
        backgroundImage: "images/icon_listItem.png",
        backgroundRepeat: false,
        id: "__alloyId141"
    });
    $.__views.categories.add($.__views.__alloyId141);
    $.__views.titleLbl = Ti.UI.createLabel({
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
        id: "titleLbl",
        textid: "title"
    });
    $.__views.form.add($.__views.titleLbl);
    $.__views.title = Ti.UI.createTextField({
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
        id: "title"
    });
    $.__views.form.add($.__views.title);
    focus ? $.__views.title.addEventListener("focus", focus) : __defers["$.__views.title!focus!focus"] = true;
    $.__views.priceLbl = Ti.UI.createLabel({
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
        id: "priceLbl",
        textid: "deal_price"
    });
    $.__views.form.add($.__views.priceLbl);
    $.__views.price = Ti.UI.createTextField({
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
        id: "price",
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD
    });
    $.__views.form.add($.__views.price);
    focus ? $.__views.price.addEventListener("focus", focus) : __defers["$.__views.price!focus!focus"] = true;
    $.__views.dealtypeLbl = Ti.UI.createLabel({
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
        id: "dealtypeLbl",
        textid: "dealtype"
    });
    $.__views.form.add($.__views.dealtypeLbl);
    $.__views.dealType = Ti.UI.createTextField({
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
        id: "dealType",
        enabled: "false"
    });
    $.__views.form.add($.__views.dealType);
    setDealType ? $.__views.dealType.addEventListener("click", setDealType) : __defers["$.__views.dealType!click!setDealType"] = true;
    $.__views.descriptionLbl = Ti.UI.createLabel({
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
        id: "descriptionLbl",
        textid: "description"
    });
    $.__views.form.add($.__views.descriptionLbl);
    $.__views.description = Ti.UI.createTextArea(function() {
        var o = {};
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
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
            id: "description",
            suppressReturn: "false",
            returnKeyType: Ti.UI.RETURNKEY_NEXT
        });
        return o;
    }());
    $.__views.form.add($.__views.description);
    focus ? $.__views.description.addEventListener("focus", focus) : __defers["$.__views.description!focus!focus"] = true;
    $.__views.startDateLbl = Ti.UI.createLabel({
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
        id: "startDateLbl",
        textid: "start_date"
    });
    $.__views.form.add($.__views.startDateLbl);
    $.__views.startDate = Ti.UI.createTextField({
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
        id: "startDate",
        enabled: "false"
    });
    $.__views.form.add($.__views.startDate);
    setStartDate ? $.__views.startDate.addEventListener("click", setStartDate) : __defers["$.__views.startDate!click!setStartDate"] = true;
    $.__views.__alloyId142 = Ti.UI.createLabel({
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
        textid: "deal_renew",
        id: "__alloyId142"
    });
    $.__views.form.add($.__views.__alloyId142);
    $.__views.renewDeal = Ti.UI.createTextField({
        width: "150dp",
        height: Alloy.Globals.Styles.inputHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "0",
        left: Alloy.Globals.Styles.textboxLeft,
        right: Alloy.Globals.Styles.textboxRight,
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
        id: "renewDeal",
        enabled: "false"
    });
    $.__views.form.add($.__views.renewDeal);
    setAutoRenew ? $.__views.renewDeal.addEventListener("click", setAutoRenew) : __defers["$.__views.renewDeal!click!setAutoRenew"] = true;
    $.__views.__alloyId143 = Ti.UI.createLabel({
        width: "30dp",
        height: "30dp",
        top: "-30dp",
        bottom: "10dp",
        right: Alloy.Globals.Styles.tooltipRight,
        left: Alloy.Globals.Styles.tooltipLeft,
        borderRadius: "15dp",
        color: "#ffffff",
        backgroundColor: "#007aff",
        textAlign: "center",
        text: "?",
        id: "__alloyId143"
    });
    $.__views.form.add($.__views.__alloyId143);
    showHelpRenew ? $.__views.__alloyId143.addEventListener("click", showHelpRenew) : __defers["$.__views.__alloyId143!click!showHelpRenew"] = true;
    $.__views.__alloyId144 = Ti.UI.createLabel({
        width: "140dp",
        height: Ti.UI.SIZE,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "deal_is_active_during",
        id: "__alloyId144"
    });
    $.__views.form.add($.__views.__alloyId144);
    $.__views.timepicker_switch = Ti.UI.createSwitch({
        height: Alloy.Globals.Styles.inputAreaHeight,
        width: "20dp",
        top: Alloy.Globals.Styles.inputUp,
        bottom: "0",
        right: Alloy.Globals.Styles.rightSwitchLong,
        left: Alloy.Globals.Styles.leftSwitchLong,
        value: false,
        id: "timepicker_switch"
    });
    $.__views.form.add($.__views.timepicker_switch);
    $.__views.__alloyId145 = Ti.UI.createLabel({
        width: "30dp",
        height: "30dp",
        top: "-60dp",
        bottom: "30dp",
        right: Alloy.Globals.Styles.tooltipRight,
        left: Alloy.Globals.Styles.tooltipLeft,
        borderRadius: "15dp",
        color: "#ffffff",
        backgroundColor: "#007aff",
        textAlign: "center",
        text: "?",
        id: "__alloyId145"
    });
    $.__views.form.add($.__views.__alloyId145);
    showHelpDurning ? $.__views.__alloyId145.addEventListener("click", showHelpDurning) : __defers["$.__views.__alloyId145!click!showHelpDurning"] = true;
    $.__views.timeInputs = Ti.UI.createView({
        id: "timeInputs",
        layout: "vertical",
        visible: "false",
        height: "0",
        top: "-20dp"
    });
    $.__views.form.add($.__views.timeInputs);
    $.__views.startTimeLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: Ti.UI.SIZE,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        id: "startTimeLbl",
        textid: "start_time"
    });
    $.__views.timeInputs.add($.__views.startTimeLbl);
    $.__views.startTime = Ti.UI.createTextField({
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
        id: "startTime",
        enabled: "false"
    });
    $.__views.timeInputs.add($.__views.startTime);
    setStartTime ? $.__views.startTime.addEventListener("click", setStartTime) : __defers["$.__views.startTime!click!setStartTime"] = true;
    $.__views.endTimeLbl = Ti.UI.createLabel({
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
        id: "endTimeLbl",
        textid: "end_time"
    });
    $.__views.timeInputs.add($.__views.endTimeLbl);
    $.__views.endTime = Ti.UI.createTextField({
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
        id: "endTime",
        enabled: "false"
    });
    $.__views.timeInputs.add($.__views.endTime);
    setEndTime ? $.__views.endTime.addEventListener("click", setEndTime) : __defers["$.__views.endTime!click!setEndTime"] = true;
    $.__views.__alloyId146 = Ti.UI.createLabel({
        width: "140dp",
        height: Ti.UI.SIZE,
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        textid: "use_vouchers",
        id: "__alloyId146"
    });
    $.__views.form.add($.__views.__alloyId146);
    $.__views.voucher_switch = Ti.UI.createSwitch({
        height: Alloy.Globals.Styles.inputAreaHeight,
        width: "20dp",
        top: Alloy.Globals.Styles.inputUp,
        bottom: "0",
        right: Alloy.Globals.Styles.rightSwitchLong,
        left: Alloy.Globals.Styles.leftSwitchLong,
        value: false,
        id: "voucher_switch"
    });
    $.__views.form.add($.__views.voucher_switch);
    $.__views.__alloyId147 = Ti.UI.createLabel({
        width: "30dp",
        height: "30dp",
        top: "-60dp",
        bottom: "30dp",
        right: Alloy.Globals.Styles.tooltipRight,
        left: Alloy.Globals.Styles.tooltipLeft,
        borderRadius: "15dp",
        color: "#ffffff",
        backgroundColor: "#007aff",
        textAlign: "center",
        text: "?",
        id: "__alloyId147"
    });
    $.__views.form.add($.__views.__alloyId147);
    showHelpVouchers ? $.__views.__alloyId147.addEventListener("click", showHelpVouchers) : __defers["$.__views.__alloyId147!click!showHelpVouchers"] = true;
    $.__views.voucherInputs = Ti.UI.createView({
        id: "voucherInputs",
        layout: "vertical",
        visible: "false",
        height: "0",
        top: "-20dp"
    });
    $.__views.form.add($.__views.voucherInputs);
    $.__views.vouchersLbl = Ti.UI.createLabel({
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
        id: "vouchersLbl",
        textid: "vouchers"
    });
    $.__views.voucherInputs.add($.__views.vouchersLbl);
    $.__views.vouchers = Ti.UI.createTextField({
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
        id: "vouchers",
        keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
    });
    $.__views.voucherInputs.add($.__views.vouchers);
    setVouchers ? $.__views.vouchers.addEventListener("click", setVouchers) : __defers["$.__views.vouchers!click!setVouchers"] = true;
    focus ? $.__views.vouchers.addEventListener("focus", focus) : __defers["$.__views.vouchers!focus!focus"] = true;
    $.__views.imageLbl = Ti.UI.createLabel({
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
        id: "imageLbl",
        textid: "images"
    });
    $.__views.form.add($.__views.imageLbl);
    $.__views.__alloyId148 = Ti.UI.createView({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        backgroundColor: "#fff",
        id: "__alloyId148"
    });
    $.__views.form.add($.__views.__alloyId148);
    $.__views.images = Ti.UI.createView({
        height: Ti.UI.SIZE,
        top: "5dp",
        left: "5dp",
        id: "images",
        layout: "horizontal"
    });
    $.__views.__alloyId148.add($.__views.images);
    onClickImages ? $.__views.images.addEventListener("click", onClickImages) : __defers["$.__views.images!click!onClickImages"] = true;
    $.__views.addPhoto = Ti.UI.createButton({
        width: "56dp",
        height: "56dp",
        right: "5dp",
        bottom: "5dp",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        backgroundImage: "images/icon_gallery.png",
        id: "addPhoto"
    });
    $.__views.images.add($.__views.addPhoto);
    addPhoto ? $.__views.addPhoto.addEventListener("click", addPhoto) : __defers["$.__views.addPhoto!click!addPhoto"] = true;
    $.__views.howToDeleteImageLbl = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "20dp",
        bottom: "10dp",
        textAlign: Alloy.Globals.Styles.imageSelectTipTextAlign,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "12dp"
        },
        color: "#555",
        id: "howToDeleteImageLbl",
        textid: "tap_to_delete_image",
        visible: "false"
    });
    $.__views.form.add($.__views.howToDeleteImageLbl);
    $.__views.switchLbl = Ti.UI.createLabel({
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
        id: "switchLbl",
        textid: "active"
    });
    $.__views.form.add($.__views.switchLbl);
    $.__views.switch_ = Ti.UI.createSwitch({
        height: Alloy.Globals.Styles.inputAreaHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        value: true,
        id: "switch_"
    });
    $.__views.form.add($.__views.switch_);
    $.__views.itemIsLoad = Ti.UI.createLabel({
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
        id: "itemIsLoad",
        textid: "itemIsLoad",
        visible: "false"
    });
    $.__views.form.add($.__views.itemIsLoad);
    $.__views.button = Ti.UI.createButton({
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
        titleid: "add_deal_button",
        id: "button"
    });
    $.__views.form.add($.__views.button);
    buttonTouchStart ? $.__views.button.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.button!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.button.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.button!touchend!buttonTouchEnd"] = true;
    $.__views.cancel_button = Ti.UI.createButton({
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
        id: "cancel_button"
    });
    $.__views.form.add($.__views.cancel_button);
    buttonTouchStart ? $.__views.cancel_button.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.cancel_button!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.cancel_button.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.cancel_button!touchend!buttonTouchEnd"] = true;
    $.__views.delete_button = Ti.UI.createButton({
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
        titleid: "delete_deal_button",
        id: "delete_button",
        visible: "false"
    });
    $.__views.form.add($.__views.delete_button);
    buttonTouchStart ? $.__views.delete_button.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.delete_button!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.delete_button.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.delete_button!touchend!buttonTouchEnd"] = true;
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
    var maxRenew = 1;
    var tab = arguments[0].tab || null;
    var callback = arguments[0].callback || false;
    var progress = Alloy.Globals.progress;
    var maxRenewArray;
    var enterFromAccount = arguments[0].enterFromAccount || false;
    var pickerOpened = false;
    Alloy.Globals.core.maxDealRenew(function(e) {
        maxRenewArray = JSON.parse(e);
        maxRenew = maxRenewArray[maxRenewArray.length - 1];
    });
    var sectionName;
    if (!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
        var alertDialog = Titanium.UI.createAlertDialog({
            title: L("should_be_company_title"),
            message: L("should_be_company_message"),
            buttonNames: [ L("no"), L("yes") ],
            cancel: 0
        });
        alertDialog.addEventListener("click", function(e) {
            if (e.cancel === e.index || true === e.cancel) {
                $.window.close();
                return;
            }
            $.window.close();
            Alloy.Globals.tabGroup.activeTab.titleid != Alloy.CFG.tabAccount.titleid && Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
        });
        alertDialog.show();
    }
    var dealToEdit = false, from = 0, to = 0, date = 0, timeInputHeight = "80dp";
    arguments[0] && arguments[0].dealId && (dealToEdit = Alloy.Collections.deals.where({
        id: arguments[0].dealId
    })[0].toJSON());
    var callback = false;
    arguments[0] && arguments[0].callback && (callback = arguments[0].callback);
    var errors = Alloy.Globals.errors, core = Alloy.Globals.core, subCategories = [], images = [], imagesToDelete = [];
    dealTypeRowIndex;
    var indicator = Alloy.Globals.indicator;
    $.timepicker_switch.addEventListener("change", function() {
        if ($.timepicker_switch.value) {
            $.timeInputs.visible = true;
            $.timeInputs.height = timeInputHeight;
        } else {
            $.timeInputs.visible = false;
            $.timeInputs.height = "0dp";
        }
    });
    $.voucher_switch.addEventListener("change", function() {
        if ($.voucher_switch.value) {
            $.voucherInputs.visible = true;
            $.voucherInputs.height = "40dp";
        } else {
            $.voucherInputs.visible = false;
            $.voucherInputs.height = "0dp";
        }
    });
    if ($.vouchers.value) {
        $.voucher_switch.value = true;
        $.voucherInputs.height = "40dp";
    }
    var optionsPhotoDialog = {
        options: [ "Make Photo", "Choose Photo", "Cancel" ],
        cancel: 2
    };
    var photoDialog = Titanium.UI.createOptionDialog(optionsPhotoDialog);
    photoDialog.addEventListener("click", function(e) {
        0 == e.index && showCamera();
        1 == e.index && openGallery();
    });
    var imageCount = 0;
    var dealTypeRowIndex;
    var textFields = [ $.price, $.title, $.description, $.vouchers ];
    __defers["$.__views.window!close!onClose"] && $.__views.window.addEventListener("close", onClose);
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!click!blur"] && $.__views.window.addEventListener("click", blur);
    __defers["$.__views.categories!click!categories"] && $.__views.categories.addEventListener("click", categories);
    __defers["$.__views.title!focus!focus"] && $.__views.title.addEventListener("focus", focus);
    __defers["$.__views.price!focus!focus"] && $.__views.price.addEventListener("focus", focus);
    __defers["$.__views.dealType!click!setDealType"] && $.__views.dealType.addEventListener("click", setDealType);
    __defers["$.__views.description!focus!focus"] && $.__views.description.addEventListener("focus", focus);
    __defers["$.__views.startDate!click!setStartDate"] && $.__views.startDate.addEventListener("click", setStartDate);
    __defers["$.__views.renewDeal!click!setAutoRenew"] && $.__views.renewDeal.addEventListener("click", setAutoRenew);
    __defers["$.__views.__alloyId143!click!showHelpRenew"] && $.__views.__alloyId143.addEventListener("click", showHelpRenew);
    __defers["$.__views.__alloyId145!click!showHelpDurning"] && $.__views.__alloyId145.addEventListener("click", showHelpDurning);
    __defers["$.__views.startTime!click!setStartTime"] && $.__views.startTime.addEventListener("click", setStartTime);
    __defers["$.__views.endTime!click!setEndTime"] && $.__views.endTime.addEventListener("click", setEndTime);
    __defers["$.__views.__alloyId147!click!showHelpVouchers"] && $.__views.__alloyId147.addEventListener("click", showHelpVouchers);
    __defers["$.__views.vouchers!click!setVouchers"] && $.__views.vouchers.addEventListener("click", setVouchers);
    __defers["$.__views.vouchers!focus!focus"] && $.__views.vouchers.addEventListener("focus", focus);
    __defers["$.__views.images!click!onClickImages"] && $.__views.images.addEventListener("click", onClickImages);
    __defers["$.__views.addPhoto!click!addPhoto"] && $.__views.addPhoto.addEventListener("click", addPhoto);
    __defers["$.__views.button!touchstart!buttonTouchStart"] && $.__views.button.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.button!touchend!buttonTouchEnd"] && $.__views.button.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.cancel_button!touchstart!buttonTouchStart"] && $.__views.cancel_button.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.cancel_button!touchend!buttonTouchEnd"] && $.__views.cancel_button.addEventListener("touchend", buttonTouchEnd);
    __defers["$.__views.delete_button!touchstart!buttonTouchStart"] && $.__views.delete_button.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.delete_button!touchend!buttonTouchEnd"] && $.__views.delete_button.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;