function createIndicatorWindow(args) {
    var width = Ti.UI.FILL,
        height = Ti.UI.FILL;

    var args = args || {};
    var top = args.top || 0;
    var text = args.text || 'Loading ...';

    var win = Titanium.UI.createWindow({
        fullscreen			: true,
        top					: top,        
        backgroundColor		: '#000',
        opacity				: 0.6,
        zIndex				: 10
    });

    var view = Ti.UI.createView({
        width:   Ti.UI.SIZE,
        height:  Ti.UI.FILL,        
        layout:  'horizontal'
    });

    var style;
    if (Ti.Platform.name === 'iPhone OS') {
        style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
    } else {
        style = Ti.UI.ActivityIndicatorStyle.DARK;
    }

    var activityIndicator = Ti.UI.createActivityIndicator({
        style : style,      
        height : Ti.UI.FILL,
        width : Ti.UI.FILL,
        textAlign: 'center',
        zIndex : 12
    });

    var label = Titanium.UI.createLabel({
    	textAlign: 'center',
        left:    10,
        width:   Ti.UI.FILL,
        height:  Ti.UI.FILL,
        text:    text,
        color:   '#fff',
        zIndex:  11,
        font:    { fontFamily: 'Helvetica Neue', fontSize: 16, fontWeight: 'bold' }
    });

    view.add(activityIndicator);
    view.add(label);
    win.add(view);

    function openIndicator() {
        win.open();
        activityIndicator.show();
    }

    win.openIndicator = openIndicator;

    function closeIndicator() {
        activityIndicator.hide();
        win.close();
    }

    win.closeIndicator = closeIndicator;

    return win;
}

// Public interface
exports.createIndicatorWindow = createIndicatorWindow;
