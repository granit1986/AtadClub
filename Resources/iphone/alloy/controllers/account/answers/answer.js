function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function click(e) {
        "answer" !== e.source.id && $.answer.blur();
    }
    function blur() {
        Alloy.Globals.chat.openChatId = false;
    }
    function focus() {
        Alloy.Globals.chat.openChatId = chatId;
    }
    function buttonTouchStart(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
    }
    function buttonTouchEnd(e) {
        e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
        var id = e.source.id;
        switch (id) {
          case "send":
            onClickSend();
        }
    }
    function open() {
        Alloy.Globals.chat.openChatId = chatId;
        Alloy.Globals.chat.messagesWindow = $.messages;
        Alloy.Globals.chat.items = [];
        if (!newChat) {
            refreshControl = Ti.UI.createRefreshControl({
                style: Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
            });
            refreshControl.addEventListener("refreshstart", add);
            $.messages.refreshControl = refreshControl;
            indicator.openIndicator();
            fetch();
        }
        if (!Alloy.Globals.chat.connected) {
            Alloy.Globals.chat.openConnect();
            Alloy.Globals.core.showErrorDialog(L("chat_server_unavailable"));
        }
    }
    function fetch() {
        loading = true;
        collection.fetch({
            data: {
                chatId: chatId,
                offset: dataOffset,
                length: dataLength
            },
            success: function() {
                loading = false;
                addItems(collection.toJSON());
                dataOffset || messagesScrollToBottom();
            },
            error: function() {
                loading = false;
                indicator.closeIndicator();
                refreshControl.endRefreshing();
            }
        });
    }
    function addItems(data) {
        var items = Alloy.Globals.chat.addMessage(data);
        $.messages.setData(items);
        refreshControl.endRefreshing();
    }
    function add() {
        dataOffset = Alloy.Globals.chat.items.length;
        fetch();
    }
    function onClickSend() {
        Alloy.Globals.chat.openChatId = chatId;
        var message = {
            text: $.answer.value,
            toUserId: toUserId,
            ChatId: chatId,
            fromUserId: Alloy.Globals.profile.id
        };
        if (Ti.Network.online) if (Alloy.Globals.chat.connected) send(message); else {
            Alloy.Globals.chat.notSendedMessage = JSON.stringify(message);
            Alloy.Globals.chat.openConnect();
            $.answer.value = "";
            Alloy.Globals.core.showErrorDialog(L("error_send_message"));
        } else Alloy.Globals.core.showErrorDialog(L("no_connection"));
    }
    function send(message) {
        Alloy.Globals.chat.source.send(JSON.stringify(message));
        $.answer.value = "";
        $.answer.height = Ti.UI.SIZE;
        formHeight = $.form.size.height;
        $.messages.bottom = formHeight;
        messagesScrollToBottom();
        $.answer.blur();
    }
    function close() {
        Alloy.Globals.chat.openChatId = false;
        Alloy.Collections.messages = Alloy.createCollection("message");
        Alloy.Collections.chats.fetch({
            success: function() {},
            error: function() {}
        });
    }
    function messagesScrollToBottom() {
        $.messages.data[0] && $.messages.scrollToIndex($.messages.data[0].rows.length - 1);
        indicator.closeIndicator();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "account/answers/answer";
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
    $.__views.window = Ti.UI.createWindow({
        backgroundImage: Alloy.Globals.Styles.backgroundImage,
        layout: "absolute",
        height: Ti.UI.FILL,
        fullscreen: "true",
        id: "window",
        titleid: "offer"
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    close ? $.__views.window.addEventListener("close", close) : __defers["$.__views.window!close!close"] = true;
    open ? $.__views.window.addEventListener("open", open) : __defers["$.__views.window!open!open"] = true;
    blur ? $.__views.window.addEventListener("blur", blur) : __defers["$.__views.window!blur!blur"] = true;
    focus ? $.__views.window.addEventListener("focus", focus) : __defers["$.__views.window!focus!focus"] = true;
    click ? $.__views.window.addEventListener("click", click) : __defers["$.__views.window!click!click"] = true;
    $.__views.messages = Ti.UI.createTableView({
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        top: "3dp",
        bottom: "50dp",
        id: "messages",
        separatorColor: "transparent"
    });
    $.__views.window.add($.__views.messages);
    $.__views.form = Ti.UI.createView({
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        bottom: 0,
        backgroundColor: "#eee",
        id: "form"
    });
    $.__views.window.add($.__views.form);
    $.__views.answer = Ti.UI.createTextArea(function() {
        var o = {};
        Alloy.Globals.isHe && _.extend(o, {
            textAlign: "right"
        });
        _.extend(o, {
            height: Ti.UI.SIZE,
            width: "200dp",
            left: "10dp",
            top: "10dp",
            bottom: "10dp",
            textAlign: Alloy.Globals.Styles.inputTextAlign,
            font: {
                fontSize: "15dp",
                fontFamily: "Arial"
            },
            backgroundColor: "#fff",
            color: Alloy.Globals.Styles.inputColor,
            id: "answer"
        });
        return o;
    }());
    $.__views.form.add($.__views.answer);
    $.__views.send = Ti.UI.createButton({
        width: "90dp",
        height: "32dp",
        right: "10dp",
        bottom: "10dp",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        font: {
            fontFamily: "Avenir Next Condensed",
            fontSize: "18dp"
        },
        color: "#fff",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: Alloy.Globals.Styles.buttonBg,
        id: "send",
        titleid: "send"
    });
    $.__views.form.add($.__views.send);
    buttonTouchStart ? $.__views.send.addEventListener("touchstart", buttonTouchStart) : __defers["$.__views.send!touchstart!buttonTouchStart"] = true;
    buttonTouchEnd ? $.__views.send.addEventListener("touchend", buttonTouchEnd) : __defers["$.__views.send!touchend!buttonTouchEnd"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var newChat = arguments[0].newChat || false;
    var collection = Alloy.createCollection("message");
    var chatId = arguments[0].id;
    var toUserId = arguments[0].toUser;
    var name = arguments[0].UserName;
    $.window.title = name;
    var formHeight = $.form.size.height;
    var indicator = Alloy.Globals.indicator;
    var dataOffset = 0, dataLength = 10, loading = false, refreshControl = false;
    $.answer.addEventListener("focus", function() {
        formHeight = $.form.size.height;
        $.form.animate({
            bottom: 166,
            duration: 500
        });
        $.messages.animate({
            bottom: 166 + formHeight,
            duration: 500
        });
        messagesScrollToBottom();
    });
    $.answer.addEventListener("change", function() {
        if (formHeight != $.form.size.height) {
            formHeight = $.form.size.height;
            $.form.animate({
                bottom: 166,
                duration: 500
            });
            $.messages.bottom = 166 + formHeight;
            messagesScrollToBottom();
        }
    });
    $.answer.addEventListener("blur", function() {
        $.form.animate({
            bottom: 0,
            duration: 500
        });
        $.messages.animate({
            bottom: formHeight,
            duration: 500
        });
        messagesScrollToBottom();
    });
    $.answer.addEventListener("return", function() {
        $.answer.size.height > 150 && ($.answer.height = 150);
        formHeight = $.form.size.height;
        $.messages.animate({
            bottom: formHeight,
            duration: 500
        });
        messagesScrollToBottom();
    });
    __defers["$.__views.window!close!close"] && $.__views.window.addEventListener("close", close);
    __defers["$.__views.window!open!open"] && $.__views.window.addEventListener("open", open);
    __defers["$.__views.window!blur!blur"] && $.__views.window.addEventListener("blur", blur);
    __defers["$.__views.window!focus!focus"] && $.__views.window.addEventListener("focus", focus);
    __defers["$.__views.window!click!click"] && $.__views.window.addEventListener("click", click);
    __defers["$.__views.send!touchstart!buttonTouchStart"] && $.__views.send.addEventListener("touchstart", buttonTouchStart);
    __defers["$.__views.send!touchend!buttonTouchEnd"] && $.__views.send.addEventListener("touchend", buttonTouchEnd);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;