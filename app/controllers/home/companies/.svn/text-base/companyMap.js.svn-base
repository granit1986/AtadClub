var company = arguments[0].company;
$.window.title = company.address; 

var annotation = Alloy.Globals.Map.createAnnotation({
 	latitude:company.lat,
  	longitude:company.lng,
    title:company.name,
    subtitle:company.address,
    pincolor:Alloy.Globals.Map.ANNOTATION_RED,	
});

function setRegion(evt) {
    if (OS_IOS) {
        $.mapview.region = {
            latitude:company.lat, longitude:company.lng,
            latitudeDelta:0.02, longitudeDelta:0.02
        };
    }
}

$.mapview.annotations = [annotation];
$.mapview.region = {latitude:company.lat, longitude:company.lng, latitudeDelta:0.02, longitudeDelta:0.02};