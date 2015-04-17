var store ={
	selectedProduct: {name:"", buy: false, error: false},
	statusCode: 0,
	priceText: 0,
	purchaseCompleteCallback: false,
	indicator: Alloy.Globals.indicator,
	Storekit: false,
	verifyingReceipts: false,
	requestProduct: /**
		 * Requests a product. Use this to get the information you have set up in iTunesConnect, like the localized name and
		 * price for the current user.
		 * @param identifier The identifier of the product, as specified in iTunesConnect.
		 * @param success A callback function.
		 * @return A Ti.Storekit.Product.
		 */
		function requestProduct(identifier, success)
		{
			store.indicator.openIndicator();
			store.Storekit.requestProducts([identifier], function (evt) {
				store.indicator.closeIndicator();
				if (!evt.success) {
					Alloy.Globals.core.showErrorDialog('ERROR: We failed to talk to Apple!');
				}
				else if (evt.invalid) {
					Alloy.Globals.core.showErrorDialog('ERROR: We requested an invalid product!');
				}
				else {
					success(evt.products[0]);
				}
			});
		},
	create: function(){	
		if(Ti.Platform.name === "android")
			return;	
		var self = this;
		self.purchaseCompleteCallback = false;
		self.Storekit = require("ti.storekit");
		function isIOS7Plus()
		{
			if (Titanium.Platform.name == 'iPhone OS')
			{
				var version = Titanium.Platform.version.split(".");
				var major = parseInt(version[0],10);
		
				// can only test this support on a 3.2+ device
				if (major >= 7)
				{
					return true;
				}
			}
			return false;
		
		}
		var IOS7 = isIOS7Plus();
		
		
		/**
		 * Keeps track (internally) of purchased products.
		 * @param identifier The identifier of the Ti.Storekit.Product that was purchased.
		 */
		function markProductAsPurchased(identifier)
		{
			Ti.API.info('Marking as purchased: ' + identifier);
			// Store it in an object for immediate retrieval.
			Alloy.Globals.core.purchased[identifier] = true;	
		}
		
		/**
		 * Checks if a product has been purchased in the past, based on our internal memory.
		 * @param identifier The identifier of the Ti.Storekit.Product that was purchased.
		 */
		function checkIfProductPurchased(identifier)
		{
			Ti.API.info('Checking if purchased: ' + identifier);
			if (Alloy.Globals.core.purchased[identifier] === undefined)
				Alloy.Globals.core.purchased[identifier] = false;
			return Alloy.Globals.core.purchased[identifier];
		} 
		/**
		 * Purchases a product.
		 * @param product A Ti.Storekit.Product (hint: use Storekit.requestProducts to get one of these!).
		 */
		self.Storekit.addEventListener('transactionState', function (evt) {
			self.indicator.closeIndicator();
			switch (evt.state) {
				case self.Storekit.TRANSACTION_STATE_FAILED:
					if(!self.selectedProduct.error)
					{
						self.selectedProduct.error = true;
						if (evt.cancelled) {
							Alloy.Globals.core.showErrorDialog('Purchase cancelled');
						} else {
							Alloy.Globals.core.showErrorDialog('ERROR: Buying failed! ' + evt.message);
						}
						evt.transaction && evt.transaction.finish();
					}
					break;
				case self.Storekit.TRANSACTION_STATE_PURCHASED:
					if (self.verifyingReceipts) {
						if (IOS7) {
							// iOS 7 Plus receipt validation is just as secure as pre iOS 7 receipt verification, but is done entirely on the device.
							var msg = self.Storekit.validateReceipt() ? 'Receipt is Valid!' : 'Receipt is Invalid.'; 
							Alloy.Globals.core.showErrorDialog(msg);
						} else {
							// Pre iOS 7 receipt verification
							self.Storekit.verifyReceipt(evt, function (e) {
								if (e.success) {
									if (e.valid) {
										Alloy.Globals.core.showErrorDialog('Thanks! Receipt Verified');
										markProductAsPurchased(evt.productIdentifier);
									} else {
										Alloy.Globals.core.showErrorDialog('Sorry. Receipt is invalid');
									}
								} else {
									Alloy.Globals.core.showErrorDialog(e.message);
								}
							});
						}
					} else {
						if(self.selectedProduct.name = evt.productIdentifier && self.selectedProduct.buy == false)
						{
							self.selectedProduct.buy = true;
							markProductAsPurchased(evt.productIdentifier);
							if(self.purchaseCompleteCallback)
								self.purchaseCompleteCallback();
							evt.transaction && evt.transaction.finish();
						}
						else
							evt.transaction && evt.transaction.finish();
					}
		
					// If the transaction has hosted content, the downloads property will exist
					// Downloads that exist in a PURCHASED state should be downloaded immediately, because they were just purchased.
					if (evt.downloads) {
						self.Storekit.startDownloads({
							downloads: evt.downloads
						});
					} else {
						// Do not finish the transaction here if you wish to start the download associated with it.
						// The transaction should be finished when the download is complete.
						// Finishing a transaction before the download is finished will cancel the download.
						evt.transaction && evt.transaction.finish();
					}
		
					break;
				case self.Storekit.TRANSACTION_STATE_PURCHASING:
					Ti.API.info('Purchasing ' + evt.productIdentifier);
					break;
				case self.Storekit.TRANSACTION_STATE_RESTORED:
					// The complete list of restored products is sent with the `restoredCompletedTransactions` event
					Ti.API.info('Restored ' + evt.productIdentifier);
					// Downloads that exist in a RESTORED state should not necessarily be downloaded immediately. Leave it up to the user.
					if (evt.downloads) {
						Ti.API.info('Downloads available for restored product');
					}
		
					evt.transaction && evt.transaction.finish();
					break;
			}
		});
				
		/**
		 * Restores any purchases that the current user has made in the past, but we have lost memory of.
		 */
		function restorePurchases()
		{
			self.indicator.openIndicator();
			self.Storekit.restoreCompletedTransactions();
		}
		
		/**
		 * WARNING
		 * addTransactionObserver must be called after adding the Storekit event listeners.
		 * Failure to call addTransactionObserver will result in no Storekit events getting fired.
		 * Calling addTransactionObserver before event listeners are added can result in lost events.
		 */
		self.Storekit.addTransactionObserver();
		
	}
};

