function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home/adverts/bar";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.bar = Ti.UI.createTableViewRow({
        selectedBackgroundColor: Alloy.Globals.Styles.TableRowOnTapBg,
        id: "bar"
    });
    $.__views.bar && $.addTopLevelView($.__views.bar);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.sorts.labels = [ L("distance"), L("price") ];
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;