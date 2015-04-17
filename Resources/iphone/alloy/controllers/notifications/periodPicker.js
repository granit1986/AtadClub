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
    this.__controllerPath = "notifications/periodPicker";
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
    $.__views.__alloyId305 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "30dp",
        layout: "horizontal",
        id: "__alloyId305"
    });
    $.__views.pickerContent.add($.__views.__alloyId305);
    $.__views.__alloyId306 = Ti.UI.createButton({
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
        id: "__alloyId306"
    });
    $.__views.__alloyId305.add($.__views.__alloyId306);
    onClose ? $.__views.__alloyId306.addEventListener("click", onClose) : __defers["$.__views.__alloyId306!click!onClose"] = true;
    $.__views.picker = Ti.UI.createPicker({
        width: Ti.UI.FILL,
        id: "picker",
        selectionIndicator: "true"
    });
    $.__views.pickerContent.add($.__views.picker);
    var __alloyId307 = [];
    $.__views.__alloyId308 = Ti.UI.createPickerRow({
        value: "15",
        text: L("_15_min"),
        id: "__alloyId308"
    });
    __alloyId307.push($.__views.__alloyId308);
    $.__views.__alloyId309 = Ti.UI.createLabel({
        textid: "_15_min",
        id: "__alloyId309"
    });
    $.__views.__alloyId308.add($.__views.__alloyId309);
    $.__views.__alloyId310 = Ti.UI.createPickerRow({
        value: "30",
        text: L("_30_min"),
        id: "__alloyId310"
    });
    __alloyId307.push($.__views.__alloyId310);
    $.__views.__alloyId311 = Ti.UI.createLabel({
        textid: "_30_min",
        id: "__alloyId311"
    });
    $.__views.__alloyId310.add($.__views.__alloyId311);
    $.__views.__alloyId312 = Ti.UI.createPickerRow({
        value: "45",
        text: L("_45_min"),
        id: "__alloyId312"
    });
    __alloyId307.push($.__views.__alloyId312);
    $.__views.__alloyId313 = Ti.UI.createLabel({
        textid: "_45_min",
        id: "__alloyId313"
    });
    $.__views.__alloyId312.add($.__views.__alloyId313);
    $.__views.__alloyId314 = Ti.UI.createPickerRow({
        value: "60",
        text: L("_1_hour"),
        id: "__alloyId314"
    });
    __alloyId307.push($.__views.__alloyId314);
    $.__views.__alloyId315 = Ti.UI.createLabel({
        textid: "_1_hour",
        id: "__alloyId315"
    });
    $.__views.__alloyId314.add($.__views.__alloyId315);
    $.__views.__alloyId316 = Ti.UI.createPickerRow({
        value: "120",
        text: L("_2_hour"),
        id: "__alloyId316"
    });
    __alloyId307.push($.__views.__alloyId316);
    $.__views.__alloyId317 = Ti.UI.createLabel({
        textid: "_2_hour",
        id: "__alloyId317"
    });
    $.__views.__alloyId316.add($.__views.__alloyId317);
    $.__views.__alloyId318 = Ti.UI.createPickerRow({
        value: "180",
        text: L("_3_hour"),
        id: "__alloyId318"
    });
    __alloyId307.push($.__views.__alloyId318);
    $.__views.__alloyId319 = Ti.UI.createLabel({
        textid: "_3_hour",
        id: "__alloyId319"
    });
    $.__views.__alloyId318.add($.__views.__alloyId319);
    $.__views.__alloyId320 = Ti.UI.createPickerRow({
        value: "240",
        text: L("_4_hour"),
        id: "__alloyId320"
    });
    __alloyId307.push($.__views.__alloyId320);
    $.__views.__alloyId321 = Ti.UI.createLabel({
        textid: "_4_hour",
        id: "__alloyId321"
    });
    $.__views.__alloyId320.add($.__views.__alloyId321);
    $.__views.__alloyId322 = Ti.UI.createPickerRow({
        value: "300",
        text: L("_5_hour"),
        id: "__alloyId322"
    });
    __alloyId307.push($.__views.__alloyId322);
    $.__views.__alloyId323 = Ti.UI.createLabel({
        textid: "_5_hour",
        id: "__alloyId323"
    });
    $.__views.__alloyId322.add($.__views.__alloyId323);
    $.__views.picker.add(__alloyId307);
    onChange ? $.__views.picker.addEventListener("change", onChange) : __defers["$.__views.picker!change!onChange"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var callback = arguments[0].callback;
    var res = {
        text: L("_60_min"),
        value: 60
    };
    __defers["$.__views.__alloyId306!click!onClose"] && $.__views.__alloyId306.addEventListener("click", onClose);
    __defers["$.__views.picker!change!onChange"] && $.__views.picker.addEventListener("change", onChange);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;