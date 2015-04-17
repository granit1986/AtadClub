var advert = arguments[0].advert;
$.window.title = advert.address; 

var annotation = Alloy.Globals.Map.createAnnotation({
 	latitude:advert.lat,
  	longitude:advert.lng,
    title:advert.name,
    subtitle:advert.address,
    pincolor:Alloy.Globals.Map.ANNOTATION_RED,	
});

function setRegion(evt) {
    if (OS_IOS) {
        $.mapview.region = {
            latitude:advert.lat, longitude:advert.lng,
            latitudeDelta:0.02, longitudeDelta:0.02
        };
    }
}

$.mapview.annotations = [annotation];
$.mapview.region = {latitude:advert.lat, longitude:advert.lng, latitudeDelta:0.02, longitudeDelta:0.02};