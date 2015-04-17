$.map.addEventListener('click', function(e) {
	if (e.annotation && (e.clicksource === 'leftButton' || e.clicksource == 'leftPane')) {
		$.map.removeAnnotation(e.annotation);
	}
});
$.search.setHintText(L("enter_address"));
exports.addAnnotation = function(geodata) {
	if (!geodata.error){
		var annotation = Alloy.createController('map/annotation', {
				title: geodata.title,
				latitude: parseFloat(geodata.response.results[0].geometry.location.lat),
				longitude: parseFloat(geodata.response.results[0].geometry.location.lng)
		});
		$.map.addAnnotation(annotation.getView());
		$.map.setLocation({
			latitude: parseFloat(geodata.response.results[0].geometry.location.lat),
			longitude: parseFloat(geodata.response.results[0].geometry.location.lng),
			latitudeDelta: 1,
			longitudeDelta: 1
		});
	}
};
