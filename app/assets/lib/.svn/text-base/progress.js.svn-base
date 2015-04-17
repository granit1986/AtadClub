function createProgressBar(args) {
    var width = Ti.UI.FILL,
        height = Ti.UI.FILL;

    var args = args || {};
    var top = args.top || 0;    

    var win = Titanium.UI.createWindow({
        fullscreen:		  true,
        top:              top,        
        backgroundColor:  '#fff',
        opacity:          0.8
    });

    var view = Ti.UI.createView({
        width:   Ti.UI.SIZE,
        height:  Ti.UI.FILL,        
        layout:  'horizontal'
    });

    var style;
    if (Ti.Platform.name === 'iPhone OS') {
        style = Ti.UI.iPhone.ProgressBarStyle.PLAIN;
    } else {
        
    }

    var progress = Ti.UI.createProgressBar({
        style : style,      
        height :  Ti.UI.FILL,
        width : Ti.UI.FILL,
        min: 0,
        max: 1,        
        message: L("save_item"),
        color:'#555',
		font: {fontSize: '15dp', fontFamily: 'Avenir Next Condensed'}
    });
    
    view.add(progress);    
    win.add(view);

    function openBar() {
        win.open();
        progress.value = 0;
        progress.show();
    }

    win.openBar = openBar;

    function closeBar() {
        progress.hide();
        win.close();
    }
    
    win.setBarValue = function(e){
    	progress.value = e;
    };

    win.closeBar = closeBar;

    return win;
}

// Public interface
exports.createProgressBar = createProgressBar;
