var productId = arguments[0].productId || null;
var forEdit = arguments[0].forEdit || null;
var product;

function open()
{
	if(forEdit)
	{
		product = Alloy.Collections.products.where({id: productId})[0].toJSON();
		var editButton = Ti.UI.createButton({titleid: 'edit'});
		editButton.addEventListener('click', function() {
			Alloy.CFG.tabAccount.open(Alloy.createController('account/products/product', {productId: product.id, callback: function(){$.window.close();}}).getView());
		});
		$.window.setRightNavButton(editButton);
	}
	else
	{
		product = Alloy.Collections.supplierProducts.where({id: productId})[0].toJSON();
	}
	$.window.title = product.name;
	$.title.text = product.name;
	$.price.text = product.price;
	$.description.text = product.description;
	
	if(product.images) {
		product.images = JSON.parse(product.images);
		for(var i = 0; i < product.images.length; i++) {
			
			var imageView = Ti.UI.createImageView({
				image : 'http://' + Ti.App.serverDomain + '/api/' + Titanium.App.ApiVersion + '/image/' + product.images[i] + Alloy.Globals.imageSizes.product.view(),
				imageOriginal : 'http://' + Ti.App.serverDomain + '/api/' + Titanium.App.ApiVersion + '/image/' + product.images[i] + Alloy.Globals.imageSizes.product.original(),
				wihth : '180dp',
				height : '180dp'
			});
			imageView.addEventListener('click', imageClick);
			$.images.addView(imageView);
		}
		if(product.images.length > 0)
			imageWindow.createWindow($.images.views);	
	}	
}

function imageClick(e)
{
	var currentPage = $.images.getCurrentPage();
	imageWindow.openWindow(currentPage);
}

var imageWindow = {
	window: false,
	view: false,
	openWindow: function(page){
		var self = this;
		self.window.open();
		self.view.setCurrentPage(page);
	},
	createWindow: function(views){
		var self = this;
		self.window = Ti.UI.createWindow({
			width: "100%",
			height: "100%",
			backgroundColor:'#f0f0f0',
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
		});
		
		var btn = Ti.UI.createButton({
			title: 'X',
			width: '30dp',
			height: '30dp',
			right: "5dp",
			top: '5dp',
			zIndex: 10,
			backgroundColor: Alloy.Globals.Styles.buttonBg,
			color: '#fff' 	 
		});
		btn.addEventListener('click',function(){
			self.window.close();
		});
		
		var newViews = [];
		for (var i=0; i < views.length; i++) {
		  var view = views[i];
		  var newView = Ti.UI.createImageView({
		  	image: view.imageOriginal		  	
		  });
		  newViews.push(newView);
		};
		
		self.view = Ti.UI.createScrollableView({
			showPagingControl: true,
			views: newViews			
		});
		self.window.add(self.view);
		self.window.add(btn);
	} 
};