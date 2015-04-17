var upload = {
    types: {
        advert: 1,
        deal: 2,
        logo: 3,
        product: 4,
        barter: 6
    },
    start: function(args) {
        var xhr = Ti.Network.createHTTPClient({
            timeout: 36e5
        });
        require("alloy/moment");
        xhr.ondatastream = function() {
            args.ondatastream && args.ondatastream();
        }, xhr.onerror = function(e) {
            args.onerror && args.onerror(e);
        }, xhr.onload = function() {
            args.onload && args.onload();
        }, xhr.onreadystatechange = function() {
            args.onreadystatechange && args.onreadystatechange();
        }, xhr.onsendstream = function(e) {
            args.onsendstream && args.onsendstream(e);
        }, xhr.open("POST", "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/" + Alloy.Globals.core.apiToken() + "/images");
        var toSend = {
            id: args.id,
            type: args.type,
            "delete": args.delete
        };
        for (var i = 0; i < args.blobs.length; i++) toSend["file_" + i] = args.blobs[i];
        xhr.send(toSend);
    }
};