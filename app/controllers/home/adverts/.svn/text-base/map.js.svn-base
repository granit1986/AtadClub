function setRegion() {
    if (OS_IOS) {
		$.mapView.region = Alloy.Globals.mapRegion;
    }
}
function onClick(e) {
    if (e.clicksource == 'rightButton' || e.clicksource == 'rightPane' || e.clicksource == 'rightView') {
		var advertWindow = Alloy.createController('home/adverts/advert', {id : e.annotation.advertId}).getView();
		Alloy.CFG.tabHome.open(advertWindow);
    }
};
