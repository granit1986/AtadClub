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
        if (forEdit) {
            product = Alloy.Collections.products.where({
                id: productId
            })[0].toJSON();
            var editButton = Ti.UI.createButton({
                titleid: "edit"
            });
            editButton.addEventListener("click", function() {
                Alloy.CFG.tabAccount.open(Alloy.createController("account/products/product", {
                    productId: product.id,
                    callback: function() {
                        $.window.close();
                    }
                }).getView());
            });
            $.window.setRightNavButton(editButton);
        } else product = Alloy.Collections.supplierProducts.where({
            id: productId
        })[0].toJSON();
        $.window.title = product.name;
        $.title.text = product.name;
        $.price.text = product.price;
        $.description.text = product.description;
        if (product.images) {
            product.images = JSON.parse(product.images);
            for (var i = 0; i < product.images.length; i++) {
                var imageView = Ti.UI.createImageView({
                    image: "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + product.images[i] + Alloy.Globals.imageSizes.product.view(),
                    imageOriginal: "http://" + Ti.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/image/" + product.images[i] + Alloy.Globals.imageSizes.product.original(),
                    wihth: "180dp",
                    height: "180dp"
                });
                imageView.addEventListener("click", imageClick);
                $.images.addView(imageView);
            }
            product.images.length > 0 && imageWindow.createWindow($.images.views);
        }
    }
    function imageClick() {
        var currentPage = $.images.getCurrentPage();
        imageWindow.openWindow(currentPage);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/products/display";
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
        fullscreen: "true"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    $.__views.__alloyId71 = Ti.UI.createScrollView({
        layout: "vertical",
        left: "20dp",
        right: "20dp",
        id: "__alloyId71"
    });
    $.__views.window.add($.__views.__alloyId71);
    $.__views.__alloyId72 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId72"
    });
    $.__views.__alloyId71.add($.__views.__alloyId72);
    var __alloyId73 = [];
    $.__views.images = Ti.UI.createScrollableView({
        width: "280dp",
        height: "180dp",
        left: "0dp",
        bottom: "10dp",
        contenWidth: "180dp",
        borderColor: "#ccc",
        borderWidth: "1dp",
        backgroundColor: "#fff",
        views: __alloyId73,
        id: "images",
        showPagingControl: "true"
    });
    $.__views.__alloyId71.add($.__views.images);
    $.__views.__alloyId74 = Ti.UI.createView({
        height: "20dp",
        width: Ti.UI.FILL,
        id: "__alloyId74"
    });
    $.__views.__alloyId71.add($.__views.__alloyId74);
    $.__views.titleLbl = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.labelWidth,
        height: "20dp",
        color: Alloy.Globals.Styles.labelColor,
        left: Alloy.Globals.Styles.labelLeft,
        right: Alloy.Globals.Styles.labelRight,
        textAlign: Alloy.Globals.Styles.labelTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        bottom: "0dp",
        id: "titleLbl",
        textid: "title"
    });
    $.__views.__alloyId71.add($.__views.titleLbl);
    $.__views.title = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "title"
    });
    $.__views.__alloyId71.add($.__views.title);
    $.__views.__alloyId75 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId75"
    });
    $.__views.__alloyId71.add($.__views.__alloyId75);
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
        bottom: "0dp",
        id: "priceLbl",
        textid: "price"
    });
    $.__views.__alloyId71.add($.__views.priceLbl);
    $.__views.price = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "price"
    });
    $.__views.__alloyId71.add($.__views.price);
    $.__views.__alloyId76 = Ti.UI.createView({
        height: "1dp",
        backgroundColor: "#d9d9d9",
        id: "__alloyId76"
    });
    $.__views.__alloyId71.add($.__views.__alloyId76);
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
        bottom: "0dp",
        id: "descriptionLbl",
        textid: "description"
    });
    $.__views.__alloyId71.add($.__views.descriptionLbl);
    $.__views.description = Ti.UI.createLabel({
        width: Alloy.Globals.Styles.inputWidth,
        height: Ti.UI.SIZE,
        top: "-28dp",
        bottom: "0dp",
        left: Alloy.Globals.Styles.inputLeft,
        right: Alloy.Globals.Styles.inputRight,
        textAlign: Alloy.Globals.Styles.inputTextAlign,
        font: {
            fontSize: "17dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#555",
        id: "description"
    });
    $.__views.__alloyId71.add($.__views.description);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var productId = arguments[0].productId || null;
    var forEdit = arguments[0].forEdit || null;
    var product;
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
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;