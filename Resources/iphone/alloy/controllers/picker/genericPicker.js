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
        item = e.row ? e.row : $.picker.getSelectedRow(0);
        callback && callback(item, 0, e.rowIndex);
    }
    function onClose() {
        callback && callback(item, 1);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "picker/genericPicker";
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
    $.__views.__alloyId335 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "30dp",
        layout: "horizontal",
        id: "__alloyId335"
    });
    $.__views.pickerContent.add($.__views.__alloyId335);
    $.__views.__alloyId336 = Ti.UI.createButton({
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
        id: "__alloyId336"
    });
    $.__views.__alloyId335.add($.__views.__alloyId336);
    onClose ? $.__views.__alloyId336.addEventListener("click", onClose) : __defers["$.__views.__alloyId336!click!onClose"] = true;
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
    var items = arguments[0].items;
    var callback = arguments[0].callback || null;
    var rowIndex = arguments[0].rowIndex || null;
    var data = [];
    for (i = 0; i < items.length; i++) {
        var item = items[i];
        data.push(Ti.UI.createPickerRow({
            title: item.title,
            data: item.data
        }));
    }
    $.picker.add(data);
    $.picker.setSelectedRow(0, 0, false);
    rowIndex && $.picker.setSelectedRow(0, rowIndex, false);
    var item;
    __defers["$.__views.__alloyId336!click!onClose"] && $.__views.__alloyId336.addEventListener("click", onClose);
    __defers["$.__views.picker!change!onChange"] && $.__views.picker.addEventListener("change", onChange);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;