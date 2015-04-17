function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function changeMode() {
        isEditable ? $.dashboard.stopEditing() : $.dashboard.startEditing();
    }
    function handleEdit() {
        $.button.title = "Done";
        $.button.style = Ti.UI.iPhone.SystemButtonStyle.DONE;
        isEditable = true;
    }
    function handleCommit() {
        $.button.title = "Edit";
        $.button.style = Ti.UI.iPhone.SystemButtonStyle.PLAIN;
        isEditable = false;
    }
    function resetBadge(e) {
        e.item.badge = 0;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "images/index";
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
    $.__views.win = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "vertical",
        id: "win",
        backgroundColor: "#13386c"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    var __alloyId257 = [];
    $.__views.button = Ti.UI.createButton({
        title: "Edit",
        id: "button"
    });
    __alloyId257.push($.__views.button);
    changeMode ? $.__views.button.addEventListener("click", changeMode) : __defers["$.__views.button!click!changeMode"] = true;
    $.__views.toolbar = Ti.UI.iOS.createToolbar({
        items: __alloyId257,
        id: "toolbar",
        top: "0"
    });
    $.__views.win.add($.__views.toolbar);
    $.__views.label = Ti.UI.createLabel({
        text: "Click an item to reset badge\nPress and hold an item to enable edit mode",
        id: "label",
        color: "white",
        top: "55",
        height: "40",
        width: "300"
    });
    $.__views.win.add($.__views.label);
    var __alloyId258 = [];
    $.__views.__alloyId259 = Ti.UI.createDashboardItem({
        image: "account_off.png",
        selectedImage: "account_on.png",
        badge: "10",
        label: "account",
        id: "__alloyId259"
    });
    __alloyId258.push($.__views.__alloyId259);
    $.__views.__alloyId260 = Ti.UI.createDashboardItem({
        image: "calls_off.png",
        selectedImage: "calls_on.png",
        badge: "110",
        label: "calls",
        id: "__alloyId260"
    });
    __alloyId258.push($.__views.__alloyId260);
    $.__views.__alloyId261 = Ti.UI.createDashboardItem({
        image: "cases_off.png",
        selectedImage: "cases_on.png",
        label: "cases",
        id: "__alloyId261"
    });
    __alloyId258.push($.__views.__alloyId261);
    $.__views.__alloyId262 = Ti.UI.createDashboardItem({
        image: "contacts_off.png",
        selectedImage: "contacts_on.png",
        badge: "23",
        label: "contacts",
        id: "__alloyId262"
    });
    __alloyId258.push($.__views.__alloyId262);
    $.__views.__alloyId263 = Ti.UI.createDashboardItem({
        image: "emps_off.png",
        selectedImage: "emps_on.png",
        label: "employees",
        id: "__alloyId263"
    });
    __alloyId258.push($.__views.__alloyId263);
    $.__views.__alloyId264 = Ti.UI.createDashboardItem({
        image: "leads_off.png",
        selectedImage: "leads_on.png",
        badge: "1",
        label: "leads",
        id: "__alloyId264"
    });
    __alloyId258.push($.__views.__alloyId264);
    $.__views.__alloyId265 = Ti.UI.createDashboardItem({
        image: "meetings_off.png",
        selectedImage: "meetings_on.png",
        badge: "5",
        label: "meetings",
        id: "__alloyId265"
    });
    __alloyId258.push($.__views.__alloyId265);
    $.__views.__alloyId266 = Ti.UI.createDashboardItem({
        image: "opps_off.png",
        selectedImage: "opps_on.png",
        label: "opps",
        id: "__alloyId266"
    });
    __alloyId258.push($.__views.__alloyId266);
    $.__views.__alloyId267 = Ti.UI.createDashboardItem({
        image: "tasks_off.png",
        selectedImage: "tasks_on.png",
        label: "tasks",
        id: "__alloyId267"
    });
    __alloyId258.push($.__views.__alloyId267);
    $.__views.dashboard = Ti.UI.createDashboardView({
        data: __alloyId258,
        id: "dashboard",
        top: "100",
        wobble: "true"
    });
    $.__views.win.add($.__views.dashboard);
    resetBadge ? $.__views.dashboard.addEventListener("click", resetBadge) : __defers["$.__views.dashboard!click!resetBadge"] = true;
    handleEdit ? $.__views.dashboard.addEventListener("edit", handleEdit) : __defers["$.__views.dashboard!edit!handleEdit"] = true;
    handleCommit ? $.__views.dashboard.addEventListener("commit", handleCommit) : __defers["$.__views.dashboard!commit!handleCommit"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var isEditable = false;
    __defers["$.__views.button!click!changeMode"] && $.__views.button.addEventListener("click", changeMode);
    __defers["$.__views.dashboard!click!resetBadge"] && $.__views.dashboard.addEventListener("click", resetBadge);
    __defers["$.__views.dashboard!edit!handleEdit"] && $.__views.dashboard.addEventListener("edit", handleEdit);
    __defers["$.__views.dashboard!commit!handleCommit"] && $.__views.dashboard.addEventListener("commit", handleCommit);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;