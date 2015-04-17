var store = {
    selectedProduct: {
        name: "",
        buy: false,
        error: false
    },
    statusCode: 0,
    priceText: 0,
    purchaseCompleteCallback: false,
    indicator: Alloy.Globals.indicator,
    Storekit: false,
    verifyingReceipts: false,
    requestProduct: function(identifier, success) {
        store.indicator.openIndicator();
        store.Storekit.requestProducts([ identifier ], function(evt) {
            store.indicator.closeIndicator();
            evt.success ? evt.invalid ? Alloy.Globals.core.showErrorDialog("ERROR: We requested an invalid product!") : success(evt.products[0]) : Alloy.Globals.core.showErrorDialog("ERROR: We failed to talk to Apple!");
        });
    },
    create: function() {
        function isIOS7Plus() {
            var version = Titanium.Platform.version.split(".");
            var major = parseInt(version[0], 10);
            if (major >= 7) return true;
            return false;
        }
        function markProductAsPurchased(identifier) {
            Ti.API.info("Marking as purchased: " + identifier);
            Alloy.Globals.core.purchased[identifier] = true;
        }
        var self = this;
        self.purchaseCompleteCallback = false;
        self.Storekit = require("ti.storekit");
        var IOS7 = isIOS7Plus();
        self.Storekit.addEventListener("transactionState", function(evt) {
            self.indicator.closeIndicator();
            switch (evt.state) {
              case self.Storekit.TRANSACTION_STATE_FAILED:
                if (!self.selectedProduct.error) {
                    self.selectedProduct.error = true;
                    Alloy.Globals.core.showErrorDialog(evt.cancelled ? "Purchase cancelled" : "ERROR: Buying failed! " + evt.message);
                    evt.transaction && evt.transaction.finish();
                }
                break;

              case self.Storekit.TRANSACTION_STATE_PURCHASED:
                if (self.verifyingReceipts) if (IOS7) {
                    var msg = self.Storekit.validateReceipt() ? "Receipt is Valid!" : "Receipt is Invalid.";
                    Alloy.Globals.core.showErrorDialog(msg);
                } else self.Storekit.verifyReceipt(evt, function(e) {
                    if (e.success) if (e.valid) {
                        Alloy.Globals.core.showErrorDialog("Thanks! Receipt Verified");
                        markProductAsPurchased(evt.productIdentifier);
                    } else Alloy.Globals.core.showErrorDialog("Sorry. Receipt is invalid"); else Alloy.Globals.core.showErrorDialog(e.message);
                }); else if (self.selectedProduct.name = evt.productIdentifier && false == self.selectedProduct.buy) {
                    self.selectedProduct.buy = true;
                    markProductAsPurchased(evt.productIdentifier);
                    self.purchaseCompleteCallback && self.purchaseCompleteCallback();
                    evt.transaction && evt.transaction.finish();
                } else evt.transaction && evt.transaction.finish();
                evt.downloads ? self.Storekit.startDownloads({
                    downloads: evt.downloads
                }) : evt.transaction && evt.transaction.finish();
                break;

              case self.Storekit.TRANSACTION_STATE_PURCHASING:
                Ti.API.info("Purchasing " + evt.productIdentifier);
                break;

              case self.Storekit.TRANSACTION_STATE_RESTORED:
                Ti.API.info("Restored " + evt.productIdentifier);
                evt.downloads && Ti.API.info("Downloads available for restored product");
                evt.transaction && evt.transaction.finish();
            }
        });
        self.Storekit.addTransactionObserver();
    }
};