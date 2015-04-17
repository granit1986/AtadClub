var args = arguments[0] || {},
    hires = (Ti.Platform.displayCaps.density === 'high'),
    savedFile;
  
function setImage(image) {
	Ti.API.info("Setting new image");
    init({
        image: image 
    });
    
    return;
}

function getImage(path) {
	Ti.API.info("image path " + path);
    var img = savedFile ? savedFile : $.imageView.image;
    
    if (path && typeof img !== 'string') {
        
        if (img.resolve) {
            return img.resolve();
        } else if (img.nativePath) {
            return img.nativePath;
        } else {
            return undefined;
        }
    }
    
    return img;
}

function init(args) {
	
	if (OS_IOS && args.cacheHires && hires) {
		args.image = args.cacheHires;
		args.hires = true;
	}

	if (!args.image || (OS_IOS && _.isString(args.image) && !Ti.Platform.canOpenURL(args.image))) {
		delete args.image;
		saveFile = false;

	} else if (!args.cacheNot) {
	
		if (!args.cacheName) {
			
			if (_.isString(args.image)) {
				args.cacheName = args.image;
			
			} else if (args.image.nativePath) {
				args.cacheName = args.image.nativePath;
			
			} else {
				throw new Error('For non-file blobs you need to set a cacheName manually.');
			}
		}
		
		args.cacheName = Ti.Utils.md5HexDigest(args.cacheName);
		
		if (args.hires) {
			args.cacheName = args.cacheName + '@2x';
		}

		if (!args.cacheExtension) {
			
			// from http://stackoverflow.com/a/680982/292947
			var re = /(?:\.([^.]+))?$/;
			var ext = re.exec(args.image)[1];
			
			args.cacheExtension = "jpeg";//ext ? ext : '';
		}

		savedFile = Ti.Filesystem.getFile(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath, args.cacheName + '.' + args.cacheExtension);
		
		var saveFile = true;
		
		if (savedFile.exists()) {
			args.image = savedFile;
			saveFile = false;
		}
	}
	var url = args.image;
	
	delete args.id;
	delete args.cacheName;
	delete args.cacheExtension;
	delete args.cacheHires;
	delete args.$model;
	delete args.__parentSymbol;

	
	
	if (saveFile === true) {
		delete args.image;
		$.imageView.applyProperties(args);
		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = function(){
			savedFile.write(this.responseData);
			$.imageView.image = savedFile;
		};
		
		xhr.open("GET", url);
		xhr.send();
		// function saveImage(e) {
			// $.imageView.removeEventListener('load', saveImage);
            // savedFile.write($.imageView.toImage().media);
		// }
// 		
		// $.imageView.addEventListener('load', saveImage);
	}
	else{
		$.imageView.applyProperties(args);
	}
}

init(args);

Object.defineProperty($, "image", {
	get: getImage,
	set: setImage
});

exports.setImage = setImage;
exports.getImage = getImage;

exports.init = init;
exports.applyProperties = init;

exports.on = exports.addEventListener = function(name, callback) {
	return $.imageView.addEventListener(name, callback);
};

exports.off = exports.removeEventListener = function(name, callback) {
	return $.imageView.removeEventListener(name, callback);
};

exports.trigger = exports.fireEvent = function(name, e) {
	return $.imageView.fireEvent(name, e);
};
