function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "nl.fokkezb.infiniteScroll/" + s : s.substring(0, index) + "/nl.fokkezb.infiniteScroll/" + s.substring(index + 1);
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
    function init() {
        delete args.__parentSymbol;
        delete args.__itemTemplate;
        delete args.$model;
        setOptions(args);
        $.isText.text = options.msgTap;
        $.isCenter.remove($.isIndicator);
        return;
    }
    function state(_state, _message) {
        $.isIndicator.hide();
        $.isCenter.remove($.isIndicator);
        if (0 !== _state && false !== _state && -1 !== _state && 1 !== _state && true !== _state) throw Error("Pass a valid state");
        currentState = _state;
        _updateMessage(_message);
        $.isCenter.add($.isText);
        $.isText.show();
        setTimeout(function() {
            loading = false;
        }, 25);
        return true;
    }
    function load() {
        if (-1 === currentState) return false;
        if (loading) return false;
        loading = true;
        $.isCenter.remove($.isText);
        $.isCenter.add($.isIndicator);
        $.isIndicator.show();
        $.trigger("end", {
            show: function() {
                $.is.visible = true;
            },
            success: function(msg) {
                return state(exports.SUCCESS, msg);
            },
            error: function(msg) {
                return state(exports.ERROR, msg);
            },
            done: function(msg) {
                return state(exports.DONE, msg);
            }
        });
        return true;
    }
    function onScroll(e) {
        var triggerLoad;
        triggerLoad = position && e.contentOffset.y > position && e.contentOffset.y + e.size.height > e.contentSize.height;
        position = e.contentOffset.y;
        triggerLoad && load();
        return;
    }
    function dettach() {
        state(exports.DONE);
        __parentSymbol.removeEventListener("scroll", onScroll);
        return;
    }
    function setOptions(_options) {
        _.extend(options, _options);
        _updateMessage();
    }
    function _updateMessage(_message) {
        $.isText.text = _message ? _message : 0 === currentState || false === currentState ? options.msgError : -1 === currentState ? options.msgDone : options.msgTap;
    }
    new (require("alloy/widget"))("nl.fokkezb.infiniteScroll");
    this.__widgetId = "nl.fokkezb.infiniteScroll";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.is = Ti.UI.createView({
        top: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "is"
    });
    load ? $.__views.is.addEventListener("click", load) : __defers["$.__views.is!click!load"] = true;
    $.__views.isCenter = Ti.UI.createView({
        height: "50dp",
        bottom: "0dp",
        id: "isCenter"
    });
    $.__views.is.add($.__views.isCenter);
    $.__views.isText = Ti.UI.createLabel({
        wordWrap: false,
        color: "#777",
        font: {
            fontSize: "17dp"
        },
        id: "isText"
    });
    $.__views.isCenter.add($.__views.isText);
    $.__views.isIndicator = Ti.UI.createActivityIndicator({
        style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
        id: "isIndicator"
    });
    $.__views.isCenter.add($.__views.isIndicator);
    $.__views.is && $.addProxyProperty("footerView", $.__views.is);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var options = {
        msgTap: L("tap_to_load_more", "Tap to load more..."),
        msgDone: L("no_more_to_load", "No more to load..."),
        msgError: L("scroll_error", "Tap to try again...")
    };
    var loading = false, position = null, currentState = 1;
    init();
    exports.SUCCESS = 1;
    exports.ERROR = 0;
    exports.DONE = -1;
    exports.setOptions = setOptions;
    exports.load = load;
    exports.state = state;
    exports.dettach = dettach;
    __defers["$.__views.is!click!load"] && $.__views.is.addEventListener("click", load);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;