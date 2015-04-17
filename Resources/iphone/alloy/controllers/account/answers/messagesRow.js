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
    this.__controllerPath = "account/answers/messagesRow";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        var $model = __processArg(arguments[0], "$model");
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.row = Ti.UI.createTableViewRow({
        selectedBackgroundColor: Alloy.Globals.Styles.TableRowOnTapBg,
        layout: "absolute",
        height: Ti.UI.SIZE,
        bottom: "5dp",
        selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    $.__views.arrow = Ti.UI.createImageView({
        width: "10dp",
        heigth: "10dp",
        bottom: "2dp",
        font: {
            fontSize: "1dp"
        },
        id: "arrow"
    });
    $.__views.row.add($.__views.arrow);
    $.__views.bubbleWrap = Ti.UI.createView({
        width: "200dp",
        height: Ti.UI.SIZE,
        layout: "vertical",
        id: "bubbleWrap"
    });
    $.__views.row.add($.__views.bubbleWrap);
    $.__views.bubble = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        borderRadius: "10dp",
        borderWidth: "1dp",
        layout: "vertical",
        text: "",
        id: "bubble"
    });
    $.__views.bubbleWrap.add($.__views.bubble);
    $.__views.messageWrap = Ti.UI.createLabel({
        right: "7dp",
        text: "",
        id: "messageWrap"
    });
    $.__views.bubble.add($.__views.messageWrap);
    $.__views.message = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        left: "7dp",
        top: "5dp",
        bottom: "5dp",
        font: {
            fontSize: "14dp"
        },
        id: "message",
        text: "undefined" != typeof $model.__transform["Text"] ? $model.__transform["Text"] : $model.get("Text")
    });
    $.__views.messageWrap.add($.__views.message);
    $.__views.__alloyId43 = Ti.UI.createLabel({
        top: "5dp",
        left: "20dp",
        color: "#FFFFFF",
        textAlign: "center",
        font: {
            fontSize: 14
        },
        backgroundColor: "#e83038",
        borderRadius: "10dp",
        height: "20dp",
        width: "20dp",
        visible: "true",
        text: "1",
        id: "__alloyId43"
    });
    $.__views.row.add($.__views.__alloyId43);
    $.__views.dir = Ti.UI.createLabel({
        id: "dir",
        text: "undefined" != typeof $model.__transform["dir"] ? $model.__transform["dir"] : $model.get("dir"),
        visible: "false"
    });
    $.__views.row.add($.__views.dir);
    exports.destroy = function() {};
    _.extend($, $.__views);
    if ("in" == $.dir.text) {
        $.bubbleWrap.left = "12dp";
        $.bubble.backgroundColor = "#ff5555";
        $.bubble.borderColor = "#ff5555";
        $.bubble.left = "0dp";
        $.message.color = "#1b1b1b";
        $.arrow.image = "images/messageIn.png";
        $.arrow.left = "12dp";
    } else {
        $.bubbleWrap.right = "12dp";
        $.bubble.backgroundColor = "#007aff";
        $.bubble.borderColor = "#007aff";
        $.bubble.right = "0dp";
        $.message.color = "#fff";
        $.arrow.image = "images/messageOut.png";
        $.arrow.right = "12dp";
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;