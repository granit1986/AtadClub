var image			= false,
	imageUpdated	= false;
var optionsPhotoDialog = {
	options:['Make Photo', 'Choose Photo', 'Cancel'],
	cancel:2
};
var advert = Alloy.Collections.publicAdverts.where({id: arguments[0].advertId})[0].toJSON();

function blur(e)
{
	if(e.source.id !== $.description.id)
		$.description.blur();
}

function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(e.source.id == "changeImage")
		addPhoto();	
	else if(e.source.id == "sendOffer")
		 {
		 	send();
		 }
	else if(e.source.id == "deleteImage")
		 {
		 	deleteImage();
		 }
}


var progress = Alloy.Globals.progress;
var indicator = Alloy.Globals.indicator;
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
				addImage(e);
			}
		}
	});
}

function showCamera() {
	Titanium.Media.showCamera({
		success: function(e) {
			if (e.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO) {				
				addImage(e);
			}				
		},
		cancel: function(e) {
			
		},
		error: function(e) {
			
		}
	});
}

function addImage(e)
{
	if($.images.children.length > 1)
	{
		$.images.remove($.images.children[0]);
	}
	image = e.media;
	$.imageView.image 		= image;				
	$.imageView.height		= Ti.UI.SIZE;
	$.imageView.bottom		= "10dp";
	$.imageView.visible 	= true;
	var imageView = Ti.UI.createImageView({
	    image: image,
	    width:'55dp',
	    height:'55dp',
	   	right:'5dp',
	    bottom:'5dp',				    
	});
	var addImageControl = $.addPhoto;					
	$.images.remove($.addPhoto);
	$.images.add(imageView);
	$.images.add(addImageControl);
	imageUpdated = true;
	$.howToDeleteImageLbl.visible = true;	
}

function onClickImage(e) {
	if(e.source.toString() !== "[object TiUIImageView]")
		return; 
	$.imageView.image = null;
	$.images.remove(e.source);
	$.imageView.height = 0;
	$.imageView.bottom = 0;
	$.howToDeleteImageLbl.visible = false;
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
function send() {	
	var offer = Alloy.createModel('offer', {
		advertId: advert.id,
		description: $.description.value
	});
	
	if(Alloy.Globals.core.rxs.empty.test(offer.attributes['description'])) {
    	errorHandler(errors.NO_DESCRIPTION);    	   	
        return;
    }
    if(!image)
    {
    	errorHandler(errors.NO_IMAGE);    	
    	return;
    }
    
    offer.save({},{
				        success: function(model, response, options) {
							
							if (image && imageUpdated) {
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
								upload.start({
									type: upload.types.barter,	
									id: response,
									blobs: images,
									onerror: function(e){ Alloy.Globals.core.showErrorDialog(L("error_loading_image")); progress.closeBar();},
									onload: function(e) {
										progress.setBarValue(1);
										progress.closeBar();										
										postUpdate();
									},
									onsendstream: function(e) {
										progress.setBarValue(e.progress);
										Ti.API.info("progress - " + e.progress);
									}
								});
							}
							else{								
								postUpdate();	
							}
							indicator.closeIndicator();
				        },
				        error: function(model, xhr, options) { 
				        	indicator.closeIndicator();
				        	if(xhr && xhr.Message)
				        	{
				        		var alertDialog = Titanium.UI.createAlertDialog({
									title:L('upgrade_membership'),
									message:L(xhr.Message),
									buttonNames:[L('upgrade'),L('OK')],										
								});
								alertDialog.addEventListener('click', function(e){				
									if(!e.index)
									{
										var view = Alloy.createController("account/upgradeSelect").getView();																				
										Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
										Alloy.Globals.tabGroup.activeTab.open(view);
									}
								});
								alertDialog.show();
				        	}
				        }					
    	
    });
}

function postUpdate()
{
	Alloy.Globals.core.showErrorDialog(L('offer_sent'));
	$.window.close();
}

function errorHandler(err) {		
	switch(err) {
		case errors.NO_DESCRIPTION:
			$.description.focus();
			break;		
		case errors.NO_IMAGE:			
			break;
	}
	var alert = Ti.UI.createAlertDialog({
		title: L(err.error)
	});
	alert.addEventListener('click', function(){
		$.scrollView.setContentOffset({x: 0, y: 0});
	});
	alert.show();
	$.scrollView.setContentOffset({x: 0, y: 0});
	
}
