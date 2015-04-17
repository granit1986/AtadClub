function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function onClick(e) {
        Alloy.CFG.tabAccount.open(Alloy.createController("account/answers/answer", {
            newChat: false,
            id: e.row.rowId,
            toUser: $.toUserId.text,
            UserName: $.toUser.text
        }).getView());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/answers/row";
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
    var __defers = {};
    $.__views.row = Ti.UI.createTableViewRow({
        selectedBackgroundColor: Alloy.Globals.Styles.TableRowOnTapBg,
        selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY,
        rowId: "undefined" != typeof $model.__transform["ChatId"] ? $model.__transform["ChatId"] : $model.get("ChatId"),
        hasChild: "true",
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    onClick ? $.__views.row.addEventListener("click", onClick) : __defers["$.__views.row!click!onClick"] = true;
    $.__views.toUser = Ti.UI.createLabel({
        width: "180dp",
        height: "20dp",
        top: "5dp",
        bottom: "15dp",
        left: Alloy.Globals.Styles.row_statusWrapLeft,
        right: Alloy.Globals.Styles.row_statusWrapRight,
        textAlign: Alloy.Globals.Styles.titleLbl_textAlign,
        font: {
            fontSize: "20dp",
            fontFamily: "Avenir Next Condensed"
        },
        color: "#007aff",
        id: "toUser",
        text: "undefined" != typeof $model.__transform["ToUser"] ? $model.__transform["ToUser"] : $model.get("ToUser")
    });
    $.__views.row.add($.__views.toUser);
    $.__views.toUserId = Ti.UI.createLabel({
        id: "toUserId",
        text: "undefined" != typeof $model.__transform["To"] ? $model.__transform["To"] : $model.get("To"),
        visible: "false"
    });
    $.__views.row.add($.__views.toUserId);
    $.__views.newMessages = Ti.UI.createLabel({
        left: Alloy.Globals.Styles.message_right,
        right: Alloy.Globals.Styles.message_left,
        top: 10,
        color: "#FFFFFF",
        textAlign: "center",
        font: {
            fontSize: 14
        },
        backgroundColor: "#e83038",
        borderRadius: 10,
        height: 20,
        width: 20,
        id: "newMessages",
        text: "undefined" != typeof $model.__transform["NewMessages"] ? $model.__transform["NewMessages"] : $model.get("NewMessages")
    });
    $.__views.row.add($.__views.newMessages);
    exports.destroy = function() {};
    _.extend($, $.__views);
    0 === $.newMessages.text ? $.newMessages.visible = false : $.newMessages.text >= 10 && ($.newMessages.width = "auto");
    __defers["$.__views.row!click!onClick"] && $.__views.row.addEventListener("click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;