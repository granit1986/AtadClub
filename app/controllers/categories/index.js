var args = arguments[0] || {};
var win = args.win;
var forDeals = args.forDeals || false;
var forAdverts = args.forAdverts || false;
var closeCallback = args.closeCallback || false;
var sectionName = args.sectionName || false;
var withblock = args.withblock || false;

Alloy.Globals.core.currentSection = sectionName;
var core = Alloy.Globals.core;
function onClose() {
	Ti.App.removeEventListener('categoryWindow:showSubCategories', showSubCategories);
	Ti.App.removeEventListener("blockCategories", blockCategories);
	if (closeCallback)
		closeCallback();
}

var backButton = Ti.UI.createButton({
	title : L("ok")
});
backButton.addEventListener("click", function() {
	$.window.close();	
});

$.window.setLeftNavButton(backButton);

var indicator = Alloy.Globals.indicator;
Ti.API.info("category opened");
function open() {
	indicator.openIndicator();	
	Ti.App.addEventListener("blockCategories", blockCategories);

	Alloy.Collections.categories.fetch({
		cache : {
			name : 'categories',
			validMinutes : 60
		},
		success : function() {
			Ti.API.info("loaded");
		}
	});
	Ti.App.addEventListener('categoryWindow:showSubCategories', showSubCategories);
	if (Alloy.Collections.categories.length > 0) {
		var rows = $.categories.data[0].rows;
		if (withblock && rows.length > 0)
			blockCategories();
	}
	indicator.closeIndicator();
}

function showSubCategories(e) {
	indicator.openIndicator();
	var subCategoriesWindow = Alloy.createController('subCategories/index', {
		closeCallback : function(cid) {

			for (item in core.currentSectionCategories()) {
				if (Object.size(core.currentSectionCategories()[item]) == 0)
					delete core.currentSectionCategories()[item];
			}
			if (cid) {

				for (var i = 0; i < $.categories.data[0].rows.length; i++) {
					var row = $.categories.data[0].rows[i];
					if (row.children[0].categoryId == cid) {
						var subcategories = Alloy.Collections.subCategories.where({
							categoryId : cid
						});
						var selectedSubcategories = Alloy.Globals.core.currentSectionCategories()["_" + cid];
						row.item.setIsChecked(selectedSubcategories, subcategories);
						break;
					}
				};
				if (withblock) {
					blockCategories();
				}
			}
		},
		categoryId : e.categoryId,
		categoryName : e.categoryName,
		sectionName : sectionName,
		win : win
	}).getView();
	indicator.closeIndicator();
	win.open(subCategoriesWindow);
}

function blockCategories() {
	if (!withblock)
		return;
	var start = 0;
	var hasChild = false;
	if (Alloy.Globals.core.currentSectionCategories()["_1"]) {
		if (Object.size(Alloy.Globals.core.currentSectionCategories()["_1"]) > 0) {
			start = 1;
			hasChild = false;
		}
	}
	if ((!core.currentSectionCategories()["_1"] && Object.size(core.currentSectionCategories()["_1"]) == 0 && Object.size(core.currentSectionCategories()) > 0)) {
		start = 1;
		var row = $.categories.data[0].rows[0];
		row.hasChild = false;
		row.children[0].color = '#c7c7c7';
		hasChild = true;
	} else if (Object.size(core.currentSectionCategories()) == 0) {
		start = 0;
		hasChild = true;
	}

	for (var i = start; i < $.categories.data[0].rows.length; i++) {
		var row = $.categories.data[0].rows[i];
		row.hasChild = hasChild;

		if (!hasChild)
			row.children[0].color = '#c7c7c7';
		else
			row.children[0].color = '#007aff';
	};
}

function dataFilter(collection) {
	if (forDeals) {
		return collection.where({
			forDeals : true
		});
	} else if (forAdverts) {
		return collection.where({
			forDeals : false
		});
	} else {
		return collection.models;
	}
}