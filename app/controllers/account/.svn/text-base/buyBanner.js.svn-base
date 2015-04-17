var image 		= false,
	progress 	= Alloy.Globals.progress,
	indicator	= Alloy.Globals.indicator;
function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(e.source.id == "changeImage")
		addPhoto();	
	else if(e.source.id == "sendBtn")
		 {
		 	send();
		 }
	else if(e.source.id == "deleteImage")
		 {
		 	deleteImage();
		 }
}

function blur(e)
{
	hideKeyboard(e);
}

function hideKeyboard(e)
{
	if(e.source.id !== $.country.id)
		$.country.blur();
	if(e.source.id !== $.city.id)
		$.city.blur();
	if(e.source.id !== $.street.id)
		$.street.blur();
	if(e.source.id !== $.house.id)
		$.house.blur();
}

function focus(e)
{
	hideKeyboard(e);
}

function send()
{	
	if($.country.value.trim() === "")
	{
		Alloy.Globals.core.showErrorDialog(L("country_require"));
		return;
	}
	else
	if($.city.value.trim() === "")
	{
		Alloy.Globals.core.showErrorDialog(L("city_require"));
		return;
	}
	else
	if(!image)
	{
		Alloy.Globals.core.showErrorDialog(L("image_require"));
		return;
	}
	
	var message = "Country: " + $.country.value + "\n" + "City: " + $.city.value + "\n";
	if($.street.value.trim() !== "")
	{
		message = message + "Street: " + $.street.value + "\n";
	}
	if($.house.value.trim() !== "")
	{
		message = message + "House: " + $.house.value + "\n";
	}
	if (image && imageUpdated) 
	{
		var upload = Alloy.Globals.upload;
		var images = []; 
		      		
		var factor = 1;
	    var size = 400;
	    var height = image.height;
	    var width = image.width;
		// Create an ImageView.
		var newImageView = Ti.UI.createImageView({
			image : image,
			width : width,
			height : height							
		});
		if(width < height)
		{
			factor = width / height;
			newImageView.height = size;
			newImageView.width = size * factor;
		}
		else
		{
			factor = height / width;
			newImageView.width = size;
			newImageView.height = size * factor;
		}								
		image = newImageView.toImage();
		images.push(image);
		progress.openBar();
		var xhr =  Ti.Network.createHTTPClient({timeout:3600000});
		xhr.onsendstream = function(e)
		{
			progress.setBarValue(e.progress);
			Ti.API.info("progress - " + e.progress);
		};
		xhr.onerror = function(e) {
			 progress.closeBar();
		};
		xhr.onload = function(e) {
			progress.setBarValue(1);
			progress.closeBar();						
			postUpdate();
		};
		xhr.open('POST','http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/' + Alloy.Globals.core.apiToken() + '/banners');
		var model = {message: message, file_0: image};
		xhr.send(model);				
	}
}

function postUpdate()
{
	Alloy.Globals.core.showErrorDialog(L("request_send"));
	$.window.close();
}

// IMAGE FORM
var optionsPhotoDialog = {
	options:['Make Photo', 'Choose Photo', 'Cancel'],
	cancel:2
};
var photoDialog = Titanium.UI.createOptionDialog(optionsPhotoDialog);
photoDialog.addEventListener('click',function(e)
	{
		if (e.index == 0) {showCamera();}
		if(e.index == 1){openGallery();}
	});
function addPhoto(){
	photoDialog.show();
}
function openGallery() {
	Titanium.Media.openPhotoGallery({
		success: function(e) {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
				image = e.media;
				$.imageView.image = image;
				$.deleteImage.visible = true; 
				$.imageView.height		= Ti.UI.SIZE;
				$.imageView.bottom		= "10dp";
				$.imageView.visible 	= true;
				imageUpdated = true;
			}
		}
	});
}

function showCamera() {
	Titanium.Media.showCamera({
		success: function(e) {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {
				image = e.media;
				$.imageView.image = image;
				$.deleteImage.visible = true;  
				$.imageView.visible		= true;
				$.imageView.height		= Ti.UI.SIZE;
				$.imageView.bottom		= "10dp";
				imageUpdated = true;

			}				
		},
		cancel: function(e) {
			
		},
		error: function(e) {
			
		}
	});
}

function deleteImage() {
	image = false;
	imageUpdated = false;
	$.imageView.image = null;
	$.imageView.visible		= false;
	$.imageView.height		= "0";
	$.imageView.bottom		= "0";
	$.deleteImage.visible = false;
}