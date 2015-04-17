function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function purchaseComplete() {
        var payment = Alloy.createModel("payment", {
            status: store.statusCode,
            paymentSumm: store.priceText
        });
        payment.save({}, {
            success: function() {
                Alloy.Globals.chat.connected && Alloy.Globals.chat.source.close();
                Alloy.Globals.core.showErrorDialog(texts[store.statusCode - 1]);
                Ti.App.fireEvent("account:updateProfile");
                $.window.close();
            }
        });
    }
    function purchaseProduct(product, price, code) {
        product.downloadable && Ti.API.info("Purchasing a product that is downloadable");
        indicator.openIndicator();
        store.statusCode = code;
        store.priceText = price;
        store.selectedProduct.buy = false;
        store.selectedProduct.name = product.identifier;
        store.selectedProduct.error = false;
        store.Storekit.purchase({
            product: product,
            quantity: 1
        });
    }
    function createBuySingleItem(product, price, code) {
        var buyItemRow = Ti.UI.createButton({
            height: "56dp",
            layout: "vertical",
            top: "20dp",
            width: "80%",
            borderWidth: "2dp",
            borderColor: "#00a99d",
            backgroundColor: "#fff"
        });
        var buyItemRowTitle = Ti.UI.createLabel({
            text: product.title,
            color: "#00a99d",
            top: "5dp",
            font: {
                fontSize: "16dp",
                fontFamily: "Avenir Next Condensed"
            }
        });
        var buyItemRowPrice = Ti.UI.createLabel({
            text: product.formattedPrice,
            color: "#a80062",
            bottom: "10dp",
            top: "5dp",
            font: {
                fontSize: "17dp",
                fontFamily: "Avenir Next Condensed"
            }
        });
        var bottomBorder = Ti.UI.createView({
            width: Ti.UI.FILL,
            height: "1dp",
            top: 0,
            left: 0,
            backgroundColor: "#ccc"
        });
        buyItemRow.add(buyItemRowTitle);
        buyItemRow.add(buyItemRowPrice);
        0 != i && buyItemRow.add(bottomBorder);
        buyItemRow.price = price;
        buyItemRow.code = code;
        buyItemRow.addEventListener("click", function(e) {
            e.source.parent.price && e.source.parent.code && purchaseProduct(product, e.source.parent.price, e.source.parent.code);
            e.source.price && e.source.code && purchaseProduct(product, e.source.price, e.source.code);
        });
        buyItemRow.addEventListener("touchstart", start);
        buyItemRow.addEventListener("touchend", end);
        $.scroll.add(buyItemRow);
        i++;
    }
    function createDescription(productDescription) {
        var buyItemDescription = Ti.UI.createLabel({
            text: productDescription,
            textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
            top: "0",
            width: "80%"
        });
        $.scrollDescription.add(buyItemDescription);
    }
    function start(e) {
        e.source.backgroundColor = "rgba(150,150,150, 1)";
    }
    function end(e) {
        e.source.backgroundColor = "#fff";
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/upgrade";
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
    $.__views.window = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "vertical",
        id: "window",
        titleid: "upgrade_account"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.scroll = Ti.UI.createView({
        left: "20dp",
        right: "20dp",
        height: "180dp",
        id: "scroll",
        layout: "vertical"
    });
    $.__views.window.add($.__views.scroll);
    $.__views.scrollDescription = Ti.UI.createView({
        left: "20dp",
        right: "20dp",
        id: "scrollDescription"
    });
    $.__views.window.add($.__views.scrollDescription);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var store = Alloy.Globals.store;
    store.create();
    var indicator = Alloy.Globals.indicator;
    var buySilverDeals = arguments[0].buySilverDeals || false;
    var buyGoldDeals = arguments[0].buyGoldDeals || false;
    var buyAdverts = arguments[0].buyAdverts || false;
    var texts = [ L("buing_silver_month"), L("buing_silver_year"), L("buing_gold_private_month"), L("buing_gold_private_year"), L("buing_gold_business_month"), L("buing_gold_business_year") ];
    store.purchaseCompleteCallback = purchaseComplete;
    var i = 0;
    if (store.Storekit.canMakePayments) {
        if (buyAdverts) {
            store.requestProduct("atadclub.goldprivatemonth", function(product) {
                store.statusCode = 3;
                store.priceText = product.formattedPrice;
                createBuySingleItem(product, store.priceText, store.statusCode);
            });
            store.requestProduct("atadclub.goldforprivateyear", function(product) {
                store.statusCode = 4;
                store.priceText = product.formattedPrice;
                createBuySingleItem(product, store.priceText, store.statusCode);
            });
            createDescription(L("description_goldPrivate"));
        }
        if (buyGoldDeals) {
            store.requestProduct("atadclub.goldbusiness", function(product) {
                store.statusCode = 5;
                store.priceText = product.formattedPrice;
                createBuySingleItem(product, store.priceText, store.statusCode);
            });
            store.requestProduct("atadclub.goldbusinessyear", function(product) {
                store.statusCode = 6;
                store.priceText = product.formattedPrice;
                createBuySingleItem(product, store.priceText, store.statusCode);
            });
            createDescription(L("description_goldBusiness"));
        }
        if (buySilverDeals) {
            store.requestProduct("atadclub.silverbusinessmonth", function(product) {
                store.statusCode = 1;
                store.priceText = product.formattedPrice;
                createBuySingleItem(product, store.priceText, store.statusCode);
            });
            store.requestProduct("atadclub.silverbusinessyear", function(product) {
                store.statusCode = 2;
                store.priceText = product.formattedPrice;
                createBuySingleItem(product, store.priceText, store.statusCode);
            });
            createDescription(L("description_silver"));
        }
    } else Alloy.Globals.core.showErrorDialog("This device cannot make purchases!");
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;