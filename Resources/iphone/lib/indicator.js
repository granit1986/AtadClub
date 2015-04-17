function createIndicatorWindow(args) {
    function openIndicator() {
        win.open();
        activityIndicator.show();
    }
    function closeIndicator() {
        activityIndicator.hide();
        win.close();
    }
    Ti.UI.FILL, Ti.UI.FILL;
    var args = args || {};
    var top = args.top || 0;
    var text = args.text || "Loading ...";
    var win = Titanium.UI.createWindow({
        fullscreen: true,
        top: top,
        backgroundColor: "#000",
        opacity: .6,
        zIndex: 10
    });
    var view = Ti.UI.createView({
        width: Ti.UI.SIZE,
        height: Ti.UI.FILL,
        layout: "horizontal"
    });
    var style;
    style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
    var activityIndicator = Ti.UI.createActivityIndicator({
        style: style,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        textAlign: "center",
        zIndex: 12
    });
    var label = Titanium.UI.createLabel({
        textAlign: "center",
        left: 10,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        text: text,
        color: "#fff",
        zIndex: 11,
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 16,
            fontWeight: "bold"
        }
    });
    view.add(activityIndicator);
    view.add(label);
    win.add(view);
    win.openIndicator = openIndicator;
    win.closeIndicator = closeIndicator;
    return win;
}

exports.createIndicatorWindow = createIndicatorWindow;