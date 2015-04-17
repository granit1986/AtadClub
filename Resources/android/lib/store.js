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
        return;
    }
};