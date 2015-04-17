var callback = arguments[0].callback;
var address = arguments[0].title;
$.search.value = address;
//$.addAddress.on('addAnnotation', function(e) {
//	$.map.addAnnotation(e.geodata);
//});

$.window.open();

//var geo = require('lib/geoMap');
var geo = Alloy.Globals.geo;
$.send.addEventListener('click', function(e) {
	if (callback)
		callback($.search.value);
	$.window.close();
});

$.findMe.addEventListener('click', function(e) {

	var geo = Alloy.Globals.geo;
	geo.checkLocation(function() {
		if (geo.location.status != geo.errors.NONE) {
			Alloy.Globals.core.showErrorDialog(L(geo.location.status.message));
			return;
		}
		geo.reverseGeocoding(geo.location.latitude, geo.location.longitude, function(e) {
			if (e.error) {
				if (e.message)
					Alloy.Globals.core.showErrorDialog(L(e.message));
				else
					Alloy.Globals.core.showErrorDialog(L(e.error));
			} else {
				$.search.value = e.response.results[0].formatted_address;
				var geodata = {
					title : $.search.value,
					response : {
						results : [{
							geometry : {
								location : {
									lat : e.response.results[0].geometry.location.lat,
									lng : e.response.results[0].geometry.location.lng
								}
							}
						}]
					}
					// coords:{
					// latitude: e.response.results[0].geometry.location.lat,
					// longitude: e.response.results[0].geometry.location.lng
					// }
				};
				$.map.addAnnotation(geodata);
				//lat = e.response.results[0].geometry.location.lat;
				//lng = e.response.results[0].geometry.location.lng;
			}
		});
	});
});

var search = function() {
	$.search.blur();
	geo.geocoding($.search.value, function(geodata) {
		if (geodata.error) {
			Alloy.Globals.core.showErrorDialog(L(geodata.message));
			return;
		}
		$.map.addAnnotation(geodata);
		$.trigger('addAnnotation', {
			geodata : geodata
		});
	});
};

search();
$.search.addEventListener('return', function(e) {
	search();
});

//$.map.addEventListener('click', function(e) {
//	if (e.annotation && (e.clicksource === 'leftButton' || e.clicksource == 'leftPane')) {
//		$.map.removeAnnotation(e.annotation);
//	}
//});

