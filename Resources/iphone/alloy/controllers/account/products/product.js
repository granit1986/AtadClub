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
        hideKeyboard(e);
    }
    function hideKeyboard(e) {
        e.source.id !== $.title.id && $.title.blur();
        e.source.id !== $.description.id && $.description.blur();
        e.source.id !== $.price.id && $.price.blur();
    }
    function focus(e) {
        hideKeyboard(e);
    }
    function open() {
        if (productToEdit) {
            $.window.title = productToEdit.name;
            indicator.openIndicator();
            subCategories = JSON.parse(productToEdit.subCategories);
            $.title.value = productToEdit.name;
            $.price.value = productToEdit.price;
            $.description.value = productToEdit.description;
            $.switch_.value = productToEdit.active;
            $.button.title = L("update");
            $.delete_button.visible = true;
            if (productToEdit.images) {
                productToEdit.images = JSON.parse(productToEdit.images);
                for (var i = 0; i < productToEdit.images.length; i++) addImage("http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + productToEdit.images[i] + Alloy.Globals.imageSizes.product.row(), productToEdit.images[i]);
            }
            sectionName = "";
            Alloy.Globals.core.currentSection = sectionName;
            core.selectedCategoriesInEdit = {};
            for (var i = 0; i < subCategories.length; ++i) {
                var s = subCategories[i];
                core.subCategories.select({
                    categoryId: s.CategoryId,
                    id: s.Id
                }, core.selectedCategoriesInEdit);
            }
            displayCategories();
            indicator.closeIndicator();
        } else core.selectedProducts = {};
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
                indicator.closeIndicator();
                if (e.cancel === e.index || true === e.cancel) return;
                Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
            });
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
        var product = {
            name: $.title.value,
            price: $.price.value,
            description: $.description.value,
            subCategories: JSON.stringify(subcategoriesForSave),
            active: $.switch_.value
        };
        productToEdit && (product.id = productToEdit.id);
        product = Alloy.createModel("product", product);
        indicator.closeIndicator();
        if (product.localValidate(errorHandler)) {
            if (1 === $.images.children.length) {
                Alloy.Globals.core.showErrorDialog(L("image_require"));
                return;
            }
            indicator.openIndicator();
            product.save({}, {
                success: function(model, response) {
                    indicator.closeIndicator();
                    for (var i = 0; i < $.images.children.length; i++) {
                        var image = $.images.children[i].image;
                        if (image && !image.serverId) {
                            if ("string" != typeof image) {
                                var factor = 1;
                                var size = 400;
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
                            type: upload.types.product,
                            id: response,
                            blobs: images,
                            "delete": JSON.stringify(imagesToDelete),
                            onerror: function() {
                                indicator.closeIndicator();
                                progress.closeBar();
                                Alloy.Globals.core.showErrorDialog(L("error_loading_image"));
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
                },
                error: function(model, xhr) {
                    if (xhr && xhr.maxProducts) {
                        var alertDialog = Titanium.UI.createAlertDialog({
                            title: L("upgrade_membership"),
                            message: L("limit") + " " + xhr.maxProducts + " " + L("limit_products"),
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
        }
    }
    function postUpdate() {
        if (productToEdit) {
            indicator.closeIndicator();
            imagesToDelete = [];
            Alloy.Globals.core.showErrorDialog(L("product_updated_label"));
            Ti.App.fireEvent("account:updateProducts");
            callback && callback();
            $.window.close();
        } else {
            address = false;
            subCategories = [];
            images = [];
            imagesToDelete = [];
            $.title.value = "";
            $.price.value = "";
            $.description.value = "";
            $.images.removeAllChildren();
            $.switch_.value = false;
            var dialog = Titanium.UI.createAlertDialog({
                title: L("product_added_label")
            });
            dialog.addEventListener("click", function() {
                Ti.App.fireEvent("account:updateProducts");
                $.window.close();
            });
            dialog.show();
            indicator.closeIndicator();
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

          case errors.NO_ADDRESS:
            $.address.focus();
            break;

          case errors.NO_DESCRIPTION:
            $.description.focus();
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
                displayCategories();
            },
            win: Alloy.CFG.tabAccount,
            forDeals: true,
            sectionName: sectionName
        }).getView();
        Alloy.CFG.tabAccount.open(categoriesWindow);
    }
    function displayCategories() {
        $.selectedCategories.text = "";
        for (var categoryKey in core.currentSectionCategories()) if (Object.size(core.currentSectionCategories()[categoryKey]) > 0) {
            categoryKey = categoryKey.replace("_", "");
            var category = Alloy.Collections.categories.get(categoryKey);
            category && ($.selectedCategories.text += "" == $.selectedCategories.text ? category.attributes["name"] : ", " + category.attributes["name"]);
        }
    }
    function addPhoto() {
        photoDialog.show();
    }
    function openGallery() {
        Titanium.Media.openPhotoGallery({
            success: function(e) {
                e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO && addImage(e.media);
            }
        });
    }
    function openGallery() {
        Titanium.Media.openPhotoGallery({
            success: function(e) {
                e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO && addImage(e.media);
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
    function deleteProduct() {
        var alertDialog = Titanium.UI.createAlertDialog({
            title: L("delete_product_title"),
            message: L("delete_product_message"),
            buttonNames: [ L("no"), L("yes") ],
            cancel: 0
        });
        alertDialog.addEventListener("click", function(e) {
            if (1 != e.index) return;
            Alloy.Collections.products.where({
                id: productToEdit.id
            })[0].destroy({
                success: function() {
                    Ti.App.fireEvent("account:updateProducts");
                    callback && callback();
                    $.window.close();
                },
                error: function() {}
            });
        });
        alertDialog.show();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/products/product";
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
        id: "window",
        fullscreen: "true",
        titleid: "win_new_product"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    blur ? $.__views.window.addEventListener("click", blur) : __defers["$.__views.window!click!blur"] = true;
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    $.__views.__alloyId89 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "__alloyId89"
    });
    $.__views.window.add($.__views.__alloyId89);
    $.__views.__alloyId90 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId90"
    });
    $.__views.__alloyId89.add($.__views.__alloyId90);
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
    $.__views.__alloyId89.add($.__views.categoriesLbl);
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
    $.__views.__alloyId89.add($.__views.categories);
    categories ? $.__views.categories.addEventListener("click", categories) : __defers["$.__views.categories!click!categories"] = true;
    $.__views.__alloyId91 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        left: "5dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: "15dp",
            fontFamily: "Arial"
        },
        textid: "select_category",
        id: "__alloyId91"
    });
    $.__views.categories.add($.__views.__alloyId91);
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
    $.__views.__alloyId92 = Ti.UI.createLabel({
        width: "20dp",
        height: "20dp",
        right: "5dp",
        top: "5dp",
        backgroundImage: "images/icon_listItem.png",
        backgroundRepeat: false,
        id: "__alloyId92"
    });
    $.__views.categories.add($.__views.__alloyId92);
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
    $.__views.__alloyId89.add($.__views.titleLbl);
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
    $.__views.__alloyId89.add($.__views.title);
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
        textid: "price"
    });
    $.__views.__alloyId89.add($.__views.priceLbl);
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
    $.__views.__alloyId89.add($.__views.price);
    focus ? $.__views.price.addEventListener("focus", focus) : __defers["$.__views.price!focus!focus"] = true;
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
    $.__views.__alloyId89.add($.__views.descriptionLbl);
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
    $.__views.__alloyId89.add($.__views.description);
    focus ? $.__views.description.addEventListener("focus", focus) : __defers["$.__views.description!focus!focus"] = true;
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
    $.__views.__alloyId89.add($.__views.imageLbl);
    $.__views.__alloyId93 = Ti.UI.createView({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: Alloy.Globals.Styles.inputUp,
        left: Alloy.Globals.Styles.inputLeft,
        borderColor: "#ccc",
        borderStyle: 1,
        borderWidth: "1dp",
        backgroundColor: "#fff",
        id: "__alloyId93"
    });
    $.__views.__alloyId89.add($.__views.__alloyId93);
    $.__views.images = Ti.UI.createView({
        height: Ti.UI.SIZE,
        top: "5dp",
        left: "5dp",
        id: "images",
        layout: "horizontal"
    });
    $.__views.__alloyId93.add($.__views.images);
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
    $.__views.__alloyId89.add($.__views.howToDeleteImageLbl);
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
    $.__views.__alloyId89.add($.__views.switchLbl);
    $.__views.switch_ = Ti.UI.createSwitch({
        height: Alloy.Globals.Styles.inputAreaHeight,
        top: Alloy.Globals.Styles.inputUp,
        bottom: "10dp",
        left: Alloy.Globals.Styles.inputLeft,
        value: true,
        id: "switch_"
    });
    $.__views.__alloyId89.add($.__views.switch_);
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
        titleid: "add_product_button",
        id: "button"
    });
    $.__views.__alloyId89.add($.__views.button);
    onClick ? $.__views.button.addEventListener("click", onClick) : __defers["$.__views.button!click!onClick"] = true;
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
        titleid: "delete_product_button",
        id: "delete_button",
        visible: "false"
    });
    $.__views.__alloyId89.add($.__views.delete_button);
    deleteProduct ? $.__views.delete_button.addEventListener("click", deleteProduct) : __defers["$.__views.delete_button!click!deleteProduct"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var productToEdit = false;
    arguments[0] && arguments[0].productId && (productToEdit = Alloy.Collections.products.where({
        id: arguments[0].productId
    })[0].toJSON());
    var indicator = Alloy.Globals.indicator;
    var callback = false;
    var progress = Alloy.Globals.progress;
    arguments[0] && arguments[0].callback && (callback = arguments[0].callback);
    var sectionName = "products";
    var errors = Alloy.Globals.errors, core = Alloy.Globals.core;
    subCategories = [], images = [], imagesToDelete = [];
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
    __defers["$.__views.window!click!blur"] && $.__views.window.addEventListener("click", blur);
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.categories!click!categories"] && $.__views.categories.addEventListener("click", categories);
    __defers["$.__views.title!focus!focus"] && $.__views.title.addEventListener("focus", focus);
    __defers["$.__views.price!focus!focus"] && $.__views.price.addEventListener("focus", focus);
    __defers["$.__views.description!focus!focus"] && $.__views.description.addEventListener("focus", focus);
    __defers["$.__views.images!click!onClickImages"] && $.__views.images.addEventListener("click", onClickImages);
    __defers["$.__views.addPhoto!click!addPhoto"] && $.__views.addPhoto.addEventListener("click", addPhoto);
    __defers["$.__views.button!click!onClick"] && $.__views.button.addEventListener("click", onClick);
    __defers["$.__views.delete_button!click!deleteProduct"] && $.__views.delete_button.addEventListener("click", deleteProduct);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;