function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "nl.fokkezb.cachedImageView/" + s : s.substring(0, index) + "/nl.fokkezb.cachedImageView/" + s.substring(index + 1);
    return path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
        if (path && "string" != typeof img) return img.resolve ? img.resolve() : img.nativePath ? img.nativePath : void 0;
        return img;
    }
    function init(args) {
        if (true && args.cacheHires && hires) {
            args.image = args.cacheHires;
            args.hires = true;
        }
        if (!args.image || true && _.isString(args.image) && !Ti.Platform.canOpenURL(args.image)) {
            delete args.image;
            saveFile = false;
        } else if (!args.cacheNot) {
            if (!args.cacheName) if (_.isString(args.image)) args.cacheName = args.image; else {
                if (!args.image.nativePath) throw new Error("For non-file blobs you need to set a cacheName manually.");
                args.cacheName = args.image.nativePath;
            }
            args.cacheName = Ti.Utils.md5HexDigest(args.cacheName);
            args.hires && (args.cacheName = args.cacheName + "@2x");
            if (!args.cacheExtension) {
                var re = /(?:\.([^.]+))?$/;
                re.exec(args.image)[1];
                args.cacheExtension = "jpeg";
            }
            savedFile = Ti.Filesystem.getFile(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath, args.cacheName + "." + args.cacheExtension);
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
        if (true === saveFile) {
            delete args.image;
            $.imageView.applyProperties(args);
            var xhr = Ti.Network.createHTTPClient();
            xhr.onload = function() {
                savedFile.write(this.responseData);
                $.imageView.image = savedFile;
            };
            xhr.open("GET", url);
            xhr.send();
        } else $.imageView.applyProperties(args);
    }
    new (require("alloy/widget"))("nl.fokkezb.cachedImageView");
    this.__widgetId = "nl.fokkezb.cachedImageView";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.imageView = Ti.UI.createImageView({
        id: "imageView"
    });
    $.__views.imageView && $.addTopLevelView($.__views.imageView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var savedFile, args = arguments[0] || {}, hires = "high" === Ti.Platform.displayCaps.density;
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
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;