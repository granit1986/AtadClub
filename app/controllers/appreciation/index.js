var args = arguments[0] || {};
Alloy.Globals.chat.openChatId = false;

var store = Alloy.Globals.store;
store.create();

function appreciationSmall(e)
{
	purchaseRequest("biz.slavin.mobile.atadclub.appreciation1");
}

function appreciationMedium(e)
{
	purchaseRequest("biz.slavin.mobile.atadclub.appreciation5");
}

function appreciationLarge(e)
{
	purchaseRequest("biz.slavin.mobile.atadclub.appreciation10");
}

function purchaseRequest(productName)
{
	store.purchaseCompleteCallback = purchaseCompleted;
	store.requestProduct(productName, function(product)
	{
		store.selectedProduct.buy = false;
		store.selectedProduct.name = product.identifier;
		store.selectedProduct.error = false;
		store.Storekit.purchase({
			product: product
		});
	});
}

function purchaseCompleted()
{
	
	Alloy.Globals.core.showErrorDialog(L("thanks"));
}

