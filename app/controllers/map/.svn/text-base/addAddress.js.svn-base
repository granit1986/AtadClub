var geo = require('lib/geoMap');
var callback = arguments[0].callback;
$.button.addEventListener('click', function(e) {
	if(callback) callback($.search.value);
	$.close();
});

$.search.setHintText(L("enter_address"));
$.search.addEventListener('return', function(e)
{
	$.search.blur();
	geo.forwardGeocode($.search.value, function(geodata) {
		//$.trigger('removeAllAnnotation');
		$.trigger('addAnnotation', {geodata: geodata});
	});
});
