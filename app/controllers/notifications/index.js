var core = Alloy.Globals.core;
var subCategories = [],
    period = 240,
    for_ = 1,
    from = 0,
    to = 0,
    distance = 500,
    forItems = [{
	title : L('new_deals'),
	data : {
		id : 1
	}
}, {
	title : L('all_deals'),
	data : {
		id : 2
	}
}],
    periodItems = [{
	title : L('_1_hour'),
	data : {
		id : 60
	}
}, {
	title : L('_2_hour'),
	data : {
		id : 120
	}
}, {
	title : L('_3_hour'),
	data : {
		id : 180
	}
}, {
	title : L('_4_hour'),
	data : {
		id : 240
	}
}, {
	title : L('_5_hour'),
	data : {
		id : 300
	}
}],
    sectionName = "notifications",
    newNotify = false,
    indicator = Alloy.Globals.indicator;

function blur(e) {
	if (e.source.id !== $.period.id && e.source.id !== $.for_.id && e.source.id !== $.start.id && e.source.id !== $.end.id)
		$.pickerWrap.removeAllChildren();
}

Ti.App.addEventListener('notify:notifyload', function() {
	notifyLoad();
});
Ti.App.addEventListener('notify:newnotify', function() {
	newNotifySave();
});
var notifyToEdit = false;

function newNotifySave() {
	newNotify = true;
	var periodCount = 0;
	for (var i = 0; i < periodItems.length; i++) {
		var periodItem = periodItems[i];
		if (periodItem.data.id == period)
			break;
		periodCount++;
	};
	periodRowIndex = periodCount;
	$.period.value = periodItems[periodRowIndex].title;

	var dateNow = new Date();
	var startDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 9, 0, 0);
	selectedStartDate = startDate;
	$.start.value = startDate.toLocaleTimeString();
	from = startDate.getUTCHours() * 60 + startDate.getUTCMinutes();

	var endDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 19, 0, 0);
	selectedEndDate = endDate;
	$.end.value = endDate.toLocaleTimeString();
	to = endDate.getUTCHours() * 60 + endDate.getUTCMinutes();

	selectDistance(distance);

	core.selectedNotificationsCategories = {};

	if (for_ > 0)
		forRowIndex = for_ - 1;
	$.for_.value = forItems[forRowIndex].title;
	save();
}

function notifyLoad() {
	notifyToEdit = Alloy.Globals.notify;
	if (notifyToEdit) {
		subCategories = JSON.parse(notifyToEdit.subCategories);
		core.currentSection = sectionName;
		core.selectedNotificationsCategories = {};

		for (var i = 0; i < subCategories.length; ++i) {
			var s = subCategories[i];
			core.subCategories.select({
				categoryId : s.CategoryId,
				id : s.Id
			}, core.selectedNotificationsCategories);
		}
		displayCategories();

		period = notifyToEdit.period;
		for_ = notifyToEdit.for_;
		from = notifyToEdit.from;
		to = notifyToEdit.to;
		distance = notifyToEdit.distance;
		if (for_ > 0)
			forRowIndex = for_ - 1;
		$.for_.value = forItems[forRowIndex].title;
		var periodCount = 0;
		for (var i = 0; i < periodItems.length; i++) {
			var periodItem = periodItems[i];
			if (periodItem.data.id == period)
				break;
			periodCount++;
		};
		periodRowIndex = periodCount;
		$.period.value = periodItems[periodRowIndex].title;

		if (from > 0) {
			var time = Alloy.Globals.core.createTime(from);
			$.start.value = time.toLocaleTimeString();
			//time.setMinutes(-time.getTimezoneOffset());
			selectedStartDate = time;
		}

		if (to > 0) {
			var time = Alloy.Globals.core.createTime(to);
			$.end.value = time.toLocaleTimeString();
			//time.setMinutes(-time.getTimezoneOffset());
			selectedEndDate = time;
		}

		selectDistance(distance);
		Ti.App.fireEvent("home:defaultsearch");
	}
}

function selectDistance(distance) {
	switch(distance) {
	case 100: {
		$.scrollView.contentOffset = {
			x : 0,
			y : 0
		};
		break;
	}
	case 250: {
		$.scrollView.contentOffset = {
			x : 65,
			y : 0
		};
		break;
	}
	case 500: {
		$.scrollView.contentOffset = {
			x : 130,
			y : 0
		};
		break;
	}
	case 750: {
		$.scrollView.contentOffset = {
			x : 195,
			y : 0
		};
		break;
	}
	case 1000: {
		$.scrollView.contentOffset = {
			x : 260,
			y : 0
		};
		break;
	}
	case 2000: {
		$.scrollView.contentOffset = {
			x : 325,
			y : 0
		};
		break;
	}
	}
}

function touchEnd(e) {
	selectDistance(distance);
}

if (Ti.Platform.model == 'Simulator')
	Alloy.CFG.deviceToken = 'fake_device_ token';

$.scrollView.addEventListener('scroll', function(e) {
	//$.tmp.text = e.x + '|';
	if (e.x >= 325)
		distance = 2000/*$.tmp.text += 2000*/;
	else if (e.x >= 260)
		distance = 1000/*$.tmp.text += 1000*/;
	else if (e.x >= 195)
		distance = 750/*$.tmp.text += 750*/;
	else if (e.x >= 130)
		distance = 500/*$.tmp.text += 500*/;
	else if (e.x >= 65)
		distance = 250/*$.tmp.text += 250*/;
	else/*45*/
		distance = 100/*$.tmp.text += 100*/;
});

function clickCategories() {
	var view = Alloy.createController('categories/index', {
		closeCallback : function() {
			subCategories = [];
			for (var categoryKey in core.selectedNotificationsCategories) {
				var category = core.selectedNotificationsCategories[categoryKey];
				for (var subCategoryKey in category)
				subCategories.push(category[subCategoryKey]);
			}
			displayCategories();
		},
		sectionName : sectionName,
		win : Alloy.CFG.tabNotifications,
		forDeals : true
	}).getView();
	Ti.API.info("view created");
	Alloy.CFG.tabNotifications.open(view);
}

function displayCategories() {
	$.selectedCategories.text = '';
	for (var categoryKey in core.currentSectionCategories()) {
		if (Object.size(core.currentSectionCategories()[categoryKey]) > 0) {
			categoryKey = categoryKey.replace('_', '');
			var category = Alloy.Collections.categories.get(categoryKey);
			if (category) {
				if ($.selectedCategories.text == '')
					$.selectedCategories.text += category.attributes['name'];
				else
					$.selectedCategories.text += ', ' + category.attributes['name'];
			}
		}
	}
}

var periodRowIndex = 3;
function clickPeriod() {
	var periodPicker = Alloy.createController('picker/genericPicker', {
		items : periodItems,
		rowIndex : periodRowIndex,
		callback : function(item, close, index) {
			if (!item.title)
				$.period.value = item;
			else
				$.period.value = item.title;
			if (item.data)
				period = item.data.id;
			if (index >= 0)
				periodRowIndex = index;
			if (close) {
				$.pickerWrap.removeAllChildren();
			}
		}
	}).getView();

	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(periodPicker);
}

var forRowIndex = 0;
function clickFor() {
	var startForPicker = Alloy.createController('picker/genericPicker', {
		items : forItems,
		rowIndex : forRowIndex,
		callback : function(item, close, index) {
			if (!item.title)
				$.for_.value = item;
			else
				$.for_.value = item.title;
			if (item.data)
				for_ = item.data.id;
			if (index >= 0)
				forRowIndex = index;
			if (close) {
				$.pickerWrap.removeAllChildren();
			}
		}
	}).getView();

	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(startForPicker);
}

var selectedStartDate = false;
var selectedEndDate = false;

function clickStart() {
	var startTimePicker = Alloy.createController('picker/time', {
		maxTime : selectedEndDate,
		callback : function(e, close) {
			selectedStartDate = e;
			from = e.getUTCHours() * 60 + e.getUTCMinutes();
			$.start.value = e.toLocaleTimeString();
			Ti.API.info(e.getUTCHours(), e.getUTCMinutes(), from);
			if (close) {
				$.pickerWrap.removeAllChildren();
			}
		}
	}).getView();

	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(startTimePicker);
}

function clickEnd() {
	var endTimePicker = Alloy.createController('picker/time', {
		minTime : selectedStartDate,
		callback : function(e, close) {
			selectedEndDate = e;
			to = e.getUTCHours() * 60 + e.getUTCMinutes();
			$.end.value = e.toLocaleTimeString();
			Ti.API.info(e.getUTCHours(), e.getUTCMinutes(), from);
			if (close) {
				$.pickerWrap.removeAllChildren();
			}
		}
	}).getView();

	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(endTimePicker);
}

function post() {
	indicator.openIndicator();
	var subcategoriesForSave = [];
	for (var i = 0; i < subCategories.length; ++i) {
		var s = subCategories[i];
		if (s.Id)
			subcategoriesForSave.push(s.Id);
		else
			subcategoriesForSave.push(s);
	}
	var deviceToken = Alloy.Globals.core.deviceToken;
	if (Ti.Platform.model == 'Simulator')
		deviceToken = 'fake_device_ token';
	var notify = Alloy.createModel('notify', {
		deviceToken : deviceToken,
		subCategories : JSON.stringify(subcategoriesForSave),
		period : period,
		for_ : for_,
		from : from,
		to : to,
		distance : distance,
		appInstallId : Alloy.Globals.core.installId, //Ti.App.installId,
		appVersion : Ti.App.version,
		platformModel : Ti.Platform.model,
		platformVersion : Ti.Platform.version,
		platformOSName : Ti.Platform.osname,
		language : Ti.Locale.currentLanguage,
		offset : new Date().getTimezoneOffset()
	});
	var geo = Alloy.Globals.geo;
	geo.checkLocation(function() {
		notify.attributes.lat = geo.location.latitude;
		notify.attributes.lng = geo.location.longitude;
		notify.save({}, {
			success : function(data) {
				indicator.closeIndicator();
				Ti.API.info(newNotify);
				if (!newNotify) {
					var dialog = Titanium.UI.createAlertDialog({
						title : L('notyfication_settings_updated')
					});
					dialog.addEventListener('click', function() {
						Ti.App.fireEvent("home:defaultsearch");
						Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabHome);
					});
					dialog.show();
				}

				notify = notify.toJSON();
				Alloy.Globals.notify = {
					id : notify.id,
					subCategories : notify.subcategories,
					period : notify.period,
					for_ : notify.for_,
					from : notify.from,
					to : notify.to,
					deviceToken : notify.devicetoken,
					lat : notify.lat,
					lng : notify.lng,
					distance : notify.distance,
				};

				Alloy.Collections.homeDeals.reset();
				newNotify = false;
				Alloy.Globals.notify = notify;
				Ti.App.Properties.setObject("notify", Alloy.Globals.notify);

			},
			error : function(model, xhr, options) {
				Ti.API.info(xhr.status);
				indicator.closeIndicator();
			}
		});
	});

}

var indicator = Alloy.Globals.indicator;
function buttonTouchStart(e) {
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e) {
	indicator.openIndicator();
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	switch(e.source.id) {
	case "update": {
		save();
		break;
	}
	case "cancel": {
		notifyLoad();
		break;
	}
	}
}

function save() {
	if (!Ti.Network.online) {
		indicator.closeIndicator();
		Alloy.Globals.core.showErrorDialog(L('network_off_line'));
		return;
	}
	indicator.closeIndicator();
	post();
}

