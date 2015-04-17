function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function onChange(e) {
        item = e.selectedValue[0];
        callback && callback(item, 0);
    }
    function onClose() {
        callback && callback(item, 1);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "picker/number";
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
    var __defers = {};
    $.__views.pickerContent = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "pickerContent"
    });
    $.__views.pickerContent && $.addTopLevelView($.__views.pickerContent);
    $.__views.__alloyId337 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "30dp",
        layout: "horizontal",
        id: "__alloyId337"
    });
    $.__views.pickerContent.add($.__views.__alloyId337);
    $.__views.__alloyId338 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        height: "30dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "15dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        titleid: "done",
        id: "__alloyId338"
    });
    $.__views.__alloyId337.add($.__views.__alloyId338);
    onClose ? $.__views.__alloyId338.addEventListener("click", onClose) : __defers["$.__views.__alloyId338!click!onClose"] = true;
    $.__views.picker = Ti.UI.createPicker({
        width: Ti.UI.FILL,
        id: "picker",
        selectionIndicator: "true",
        type: Ti.UI.Picker
    });
    $.__views.pickerContent.add($.__views.picker);
    onChange ? $.__views.picker.addEventListener("change", onChange) : __defers["$.__views.picker!change!onChange"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var callback = arguments[0].callback;
    var maxValue = arguments[0].maxValue;
    item = 1;
    var data = [];
    for (i = 1; maxValue >= i; i++) data[i - 1] = Ti.UI.createPickerRow({
        title: i.toString(),
        custom_item: i.toString()
    });
    $.picker.add(data);
    __defers["$.__views.__alloyId338!click!onClose"] && $.__views.__alloyId338.addEventListener("click", onClose);
    __defers["$.__views.picker!change!onChange"] && $.__views.picker.addEventListener("change", onChange);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;