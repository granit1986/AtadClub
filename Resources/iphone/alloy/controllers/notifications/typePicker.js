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
        res.text = e.row.text;
        res.value = e.row.value;
        callback && callback(res);
    }
    function onClose() {
        callback && callback(res, 1);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "notifications/typePicker";
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
    $.__views.__alloyId324 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "30dp",
        layout: "horizontal",
        id: "__alloyId324"
    });
    $.__views.pickerContent.add($.__views.__alloyId324);
    $.__views.__alloyId325 = Ti.UI.createButton({
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
        id: "__alloyId325"
    });
    $.__views.__alloyId324.add($.__views.__alloyId325);
    onClose ? $.__views.__alloyId325.addEventListener("click", onClose) : __defers["$.__views.__alloyId325!click!onClose"] = true;
    $.__views.picker = Ti.UI.createPicker({
        width: Ti.UI.FILL,
        id: "picker",
        selectionIndicator: "true"
    });
    $.__views.pickerContent.add($.__views.picker);
    var __alloyId326 = [];
    $.__views.__alloyId327 = Ti.UI.createPickerRow({
        value: "1",
        text: L("strip"),
        id: "__alloyId327"
    });
    __alloyId326.push($.__views.__alloyId327);
    $.__views.__alloyId328 = Ti.UI.createLabel({
        textid: "strip",
        id: "__alloyId328"
    });
    $.__views.__alloyId327.add($.__views.__alloyId328);
    $.__views.__alloyId329 = Ti.UI.createPickerRow({
        value: "2",
        text: L("pop_up"),
        id: "__alloyId329"
    });
    __alloyId326.push($.__views.__alloyId329);
    $.__views.__alloyId330 = Ti.UI.createLabel({
        textid: "pop_up",
        id: "__alloyId330"
    });
    $.__views.__alloyId329.add($.__views.__alloyId330);
    $.__views.picker.add(__alloyId326);
    onChange ? $.__views.picker.addEventListener("change", onChange) : __defers["$.__views.picker!change!onChange"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var callback = arguments[0].callback;
    var res = {
        text: L("strip"),
        value: 0
    };
    __defers["$.__views.__alloyId325!click!onClose"] && $.__views.__alloyId325.addEventListener("click", onClose);
    __defers["$.__views.picker!change!onChange"] && $.__views.picker.addEventListener("change", onChange);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;