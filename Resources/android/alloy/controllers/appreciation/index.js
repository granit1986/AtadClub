function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function appreciationSmall() {
        purchaseRequest("biz.slavin.mobile.atadclub.appreciation1");
    }
    function appreciationMedium() {
        purchaseRequest("biz.slavin.mobile.atadclub.appreciation5");
    }
    function appreciationLarge() {
        purchaseRequest("biz.slavin.mobile.atadclub.appreciation10");
    }
    function purchaseRequest(productName) {
        store.purchaseCompleteCallback = purchaseCompleted;
        store.requestProduct(productName, function(product) {
            store.selectedProduct.buy = false;
            store.selectedProduct.name = product.identifier;
            store.selectedProduct.error = false;
            store.Storekit.purchase({
                product: product
            });
        });
    }
    function purchaseCompleted() {
        Alloy.Globals.core.showErrorDialog(L("thanks"));
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "appreciation/index";
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
        titleid: "win_appreciation",
        id: "window"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.__alloyId151 = Ti.UI.createScrollView({
        layout: "vertical",
        id: "__alloyId151"
    });
    $.__views.window.add($.__views.__alloyId151);
    $.__views.__alloyId152 = Ti.UI.createLabel({
        top: "10dp",
        left: "10dp",
        right: "10dp",
        color: "#555",
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "15dp",
            fontFamily: "Avenir Next Condensed"
        },
        height: Ti.UI.SIZE,
        textid: "text_appreciation",
        id: "__alloyId152"
    });
    $.__views.__alloyId151.add($.__views.__alloyId152);
    $.__views.__alloyId153 = Ti.UI.createView({
        layout: "absolute",
        top: "20dp",
        height: Ti.UI.SIZE,
        id: "__alloyId153"
    });
    $.__views.__alloyId151.add($.__views.__alloyId153);
    $.__views.donateS = Ti.UI.createView({
        layout: "vertical",
        top: 0,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        height: Ti.UI.SIZE,
        width: "60dp",
        left: "10dp",
        id: "donateS"
    });
    $.__views.__alloyId153.add($.__views.donateS);
    appreciationSmall ? $.__views.donateS.addEventListener("click", appreciationSmall) : __defers["$.__views.donateS!click!appreciationSmall"] = true;
    $.__views.__alloyId154 = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        heigth: "20dp",
        top: "0dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "19dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#000",
        text: "0.99$",
        id: "__alloyId154"
    });
    $.__views.donateS.add($.__views.__alloyId154);
    $.__views.__alloyId155 = Ti.UI.createImageView({
        left: "10dp",
        image: "images/heart_S.png",
        id: "__alloyId155"
    });
    $.__views.donateS.add($.__views.__alloyId155);
    $.__views.donateM = Ti.UI.createView({
        layout: "vertical",
        top: 0,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        height: Ti.UI.SIZE,
        width: "60dp",
        left: "110dp",
        id: "donateM"
    });
    $.__views.__alloyId153.add($.__views.donateM);
    appreciationMedium ? $.__views.donateM.addEventListener("click", appreciationMedium) : __defers["$.__views.donateM!click!appreciationMedium"] = true;
    $.__views.__alloyId156 = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        heigth: "20dp",
        top: "0dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "19dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#000",
        text: "1.99$",
        id: "__alloyId156"
    });
    $.__views.donateM.add($.__views.__alloyId156);
    $.__views.__alloyId157 = Ti.UI.createImageView({
        image: "images/heart_M.png",
        id: "__alloyId157"
    });
    $.__views.donateM.add($.__views.__alloyId157);
    $.__views.donateL = Ti.UI.createView({
        layout: "vertical",
        top: 0,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        height: Ti.UI.SIZE,
        width: "80dp",
        left: "220dp",
        id: "donateL"
    });
    $.__views.__alloyId153.add($.__views.donateL);
    appreciationLarge ? $.__views.donateL.addEventListener("click", appreciationLarge) : __defers["$.__views.donateL!click!appreciationLarge"] = true;
    $.__views.__alloyId158 = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        heigth: "20dp",
        top: "0dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "19dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#000",
        text: "4.99$",
        id: "__alloyId158"
    });
    $.__views.donateL.add($.__views.__alloyId158);
    $.__views.__alloyId159 = Ti.UI.createImageView({
        image: "images/heart_L.png",
        id: "__alloyId159"
    });
    $.__views.donateL.add($.__views.__alloyId159);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    Alloy.Globals.chat.openChatId = false;
    var store = Alloy.Globals.store;
    store.create();
    __defers["$.__views.donateS!click!appreciationSmall"] && $.__views.donateS.addEventListener("click", appreciationSmall);
    __defers["$.__views.donateM!click!appreciationMedium"] && $.__views.donateM.addEventListener("click", appreciationMedium);
    __defers["$.__views.donateL!click!appreciationLarge"] && $.__views.donateL.addEventListener("click", appreciationLarge);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;