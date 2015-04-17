var Map				= require('ti.map'),
	geo				= Alloy.Globals.geo,
	dataOffset		= 0,
	dataLength		= 10,
	distance		= arguments[0].distance,
	subCategories	= arguments[0].subCategories,
	loading			= false,
	shownList		= true,
	inProgress		= false,
	switchButton	= Ti.UI.createButton({titleid: 'map'}),
	mapView			= Alloy.createController('home/adverts/map').getView(),
	geo				= Alloy.Globals.geo, 
	lat = arguments[0].lat,
	lng = arguments[0].lng, 
	minLat,	maxLat,	minLng, maxLng, 
	annotations		= [],
	agreeToOther	= false,
	lastQuery		= {},
	allAdverts 		= false;
	
$.window.setTitle(L('adverts'));
if (OS_IOS)
	$.sorts.labels =[L('distance'), L('price')];

var sortType = 0;
function Sort(e) {

	if (loading) 
		return false;
	
	if(sortType == e.index) 
		return false;
	
	loading = true;	
	dataOffset = 0;
	sortType = e.index;
	
	$.is.state(1);
	
	lastQuery.sort = sortType;
	lastQuery.offset = dataOffset;  
	fetch(lastQuery);
	
}

switchButton.addEventListener('click', function() {
	if(inProgress) return false;
	inProgress = true;
	if(shownList) {
		mapView.annotations = annotations;
		Alloy.Globals.mapRegion = {
			latitude		: (minLat + maxLat)/2,
			longitude		: (minLng + maxLng)/2,
			latitudeDelta	: (maxLat - minLat) * 2,
			longitudeDelta	: (maxLng - minLng) * 2
		};
		mapView.region = Alloy.Globals.mapRegion;
		$.wrapper.animate(
			{view:mapView, transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT},
			function() {
				$.window.setTitle(L('map'));
				switchButton.setTitle(L('list'));
				shownList = false;
				inProgress = false;
			}
		);
	}
	else {
		$.wrapper.animate(
			{view:$.adverts, transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT},
			function() {
				$.window.setTitle(L('adverts'));
				switchButton.setTitle(L('map'));
				shownList = true;
				inProgress = false;
			}
		);
	}
});

function fetch(data) {
	Alloy.Collections.publicAdverts.fetch({
		data: data,
		success: function (response, data) {
			if(Object.size(data) > 0)
			{
				var dataArray = new Array();
				dataArray.push(data);
				data = dataArray;
			}
			if(data && data.length > 0) {
				dataOffset = Alloy.Collections.publicAdverts.length;
				$.window.setRightNavButton(switchButton);
				setAnnotations();
				loading = false;
				Alloy.Globals.core.createRows(Alloy.Collections.publicAdverts, transform, $.adverts, "home/adverts/row");
				//if(infinyScroll) infinyScroll.show();
				if (OS_IOS) {
					$.sortsLbl.visible ="true";			
					$.sorts.visible ="true";			
				}
				$.adverts.visible ="true";			
			}
		},
		error: function (model,xhr,options) {
			loading = false;
			if(xhr) {
				var messageId;
				var notFoundReason;
				switch(xhr.Message) {
					case '-1': // no adverts in subcategories
						notFoundReason = -1;
						messageId = 'no_adverts_in_subcategories';
						break;
					case '-2': // no adverts in location/istance
						notFoundReason = -2;
						messageId = 'no_adverts_in_you_location';
						break;
				}

				var alertDialog = Titanium.UI.createAlertDialog({
					title:L('no_adverts_found'),
					message:L(messageId),
					buttonNames:[L('no'),L('yes')],
					cancel:0
				});
				alertDialog.addEventListener('click', function(e){
		
					if(e.cancel === e.index || e.cancel === true) {
						$.window.close();						
						return;
					}
					else {
						
						switch(notFoundReason) {
							case -1:
								lastQuery = {
									length: dataLength, offset: 0,
									subCategories:'[]',
									distance:distance, lat:lat, lng:lng
								};
								allAdverts = true;
								fetch(lastQuery);						
								break;
							case -2:
								lastQuery = {
									length: dataLength, offset: 0,
									subCategories:'[]',
									distance:-1, lat:lat, lng:lng
								}; 
								fetch(lastQuery);
								allAdverts = true;						
								break;
						}
					}
				});
				alertDialog.show();				
			}
		}
	});
	
}

function update(e) {

	Alloy.Collections.publicAdverts.fetch({
		data: { lng: lng, lat: lat, length: dataLength, offset: 0, distance:distance, subCategories:JSON.stringify(subCategories), sort:sortType },
		success: function (response, data) {
			dataOffset = data.length;
			Alloy.Globals.core.createRows(Alloy.Collections.publicAdverts, transform, $.adverts, "home/adverts/row");
			e.hide();
			loading = false;
			setAnnotations();
	
		},
		error: function () {
			e.hide();
			loading = false;	
		}
	});
}

function close(){
	Alloy.Collections.publicAdverts.reset();
}


function add(e) {
	if (loading) {
		e.success();
		return false;
	}
	loading = true;
	if(!allAdverts)
		lastQuery = {lng: lng, lat: lat, length: dataLength, offset: dataOffset, distance:distance, subCategories:JSON.stringify(subCategories), sort:sortType };
	else
		lastQuery.offset = dataOffset;
	Alloy.Collections.publicAdverts.fetch({
		silent: true,
		data: lastQuery,
		add: true,
		success: function (response, data) {
			loading = false;
			if(!data.length) {
				e.done();
				return;
			}
			Alloy.Globals.core.createRows(Alloy.Collections.publicAdverts, transform, $.adverts, "home/adverts/row");
			dataOffset += data.length;
			data.length < dataLength ? e.done() : e.success();
			setAnnotations();

		},
		error: function () {
			e.done();
			loading = false;
		}
	});
}

function setAnnotations() {
	
	annotations	= [];
	var models = Alloy.Collections.publicAdverts.models;
	minLat = 999, maxLat = -999, minLng = 999, maxLng = -999; 
	for(var index in models) {
		
		var model	= models[index];
		
		var lat		= parseFloat(model.attributes.lat);
		var lng		= parseFloat(model.attributes.lng);
		
		if(lat > maxLat) maxLat = lat; 
		if(lat < minLat) minLat = lat; 
		if(lng > maxLng) maxLng = lng; 
		if(lng < minLng) minLng = lng;
		
		annotations.push(
			Map.createAnnotation({
			 	latitude	: lat,
			  	longitude	: lng,
			    title		: model.attributes.name,
			    subtitle	: model.attributes.address,
			    pincolor	: Alloy.Globals.Map.ANNOTATION_RED,
			    rightButton : Ti.UI.iPhone.SystemButton.DISCLOSURE,
			    advertId	: model.attributes.id
			})
		);
	};	
}

function transform(model) {
	var transform = model.toJSON();
	if(transform.distance == -1)
		transform.distance = "--";
	else	
		transform.distance = transform.distance.toFixed(2) + ' km';

	if(transform.images && transform.images.length > 0)
		transform.images = JSON.parse(transform.images);
	else
		transform.images = [];

	if(transform.images.length > 0)
	{
		if(transform.images[0] != -1)
			transform.image = 'http://' + Ti.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/image/' + transform.images[0] + Alloy.Globals.imageSizes.advert.row();
		else 
			transform.image = "appicon-72.png";
	}
	
	transform.price = transform.currency + ' ' + transform.price;
	
	return transform; 
}

lastQuery = { length: dataLength, offset: 0, distance:distance, lat:lat, lng:lng, subCategories:JSON.stringify(subCategories), sort:sortType}; 
fetch(lastQuery);



