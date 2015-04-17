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
        callback && callback(item, 0, e.rowIndex);
    }
    function onClose() {
        callback && callback(item ? item : Alloy.Globals.core.dealType[0].title, 1);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "picker/dealtype";
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
    $.__views.__alloyId333 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "30dp",
        layout: "horizontal",
        id: "__alloyId333"
    });
    $.__views.pickerContent.add($.__views.__alloyId333);
    $.__views.__alloyId334 = Ti.UI.createButton({
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
        id: "__alloyId334"
    });
    $.__views.__alloyId333.add($.__views.__alloyId334);
    onClose ? $.__views.__alloyId334.addEventListener("click", onClose) : __defers["$.__views.__alloyId334!click!onClose"] = true;
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
    var callback = arguments[0].callback || null;
    var rowIndex = arguments[0].rowIndex || null;
    var data = [];
    for (i = 0; i < Alloy.Globals.core.dealType.length; i++) {
        var deal = Alloy.Globals.core.dealType[i];
        data.push(Ti.UI.createPickerRow({
            title: deal.title
        }));
    }
    $.picker.add(data);
    null != rowIndex ? $.picker.setSelectedRow(0, rowIndex, false) : $.picker.setSelectedRow(0, 0, false);
    var item;
    __defers["$.__views.__alloyId334!click!onClose"] && $.__views.__alloyId334.addEventListener("click", onClose);
    __defers["$.__views.picker!change!onChange"] && $.__views.picker.addEventListener("change", onChange);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;