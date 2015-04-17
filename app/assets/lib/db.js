var UpdateEvent = function(Event) {
	var db = Ti.Database.install("/ticket1.sqlite", "DB_1");
	var rows = db.execute("SELECT * FROM organaizer WHERE Id=" + Event.Token);

	if (rows && rows.isValidRows()) {
		db.execute("UPDATE events SET Name = '" + Event.name + "', Description = '" + Event.description + "', StartDate = '" + Event.startDate + "', EndDate = '" + Event.endDate + "' WHERE Id=" + Event.id);
	} else {

	}

	rows.close();
	db.close();
};

var GetEvents = function(Token, offset) {
	var db = Ti.Database.install("/ticket1.sqlite", "DB_1");
	var rows = db.execute("SELECT * FROM organaizer WHERE OrganaizerUID=" + Token + " and Id>" + offset);
	var data = [];
	while (rows.isValidRows()) {
		rows.next();
	}
	rows.close();
	db.close();
};

var GetApiToken = function() {
	var db = Ti.Database.install("/ticket1.sqlite", "DB_1");
	var rows = db.execute("SELECT * FROM organaizer");
	if (rows.isValidRow() && rows.getRowCount() > 0) {
		var uid = rows.fieldByName("UID");
		rows.close();
		db.close();
		return uid;
	}
	db.close();
	rows.close();
	return 0;
};

var SetToken = function(Token) {
	var db = Ti.Database.install("/ticket1.sqlite", "DB_1");
	if (Token) {
		var rows = db.execute("DELETE FROM organaizer");
		db.execute('INSERT INTO organaizer (Id,UID) VALUES (?,?)', 1, Token);
	} else {
		var rows = db.execute("DELETE FROM organaizer");
	}
	db.close();
	return Token;
};

var CacheInDb = function(name, items) {
	var db = Ti.Database.install("/ticket1.sqlite", "DB_1");
	switch(name) {
	case 'categories': {
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			db.execute("DELETE FROM categories");
			db.execute("INSERT INTO categories (Id, Name, ForDeals, Updated) VALUES (?, ?, ?, ?)", item.id, item.name, item.forDeals ? "1" : 0, new Date(item.updated).getTime());
		};
		break;
	}

	case 'subcategories': {

		break;
	}
	}
	db.close();
};

var GetCacheFromDb = function(name) {
	var db = Ti.Database.install("/ticket1.sqlite", "DB_1");
	switch(name) {
	case 'categories': {
		var rows = db.execute("SELECT * FROM categories");
		var items = [];
		while (rows.isValidRow()) {
			var item = {};
			item.id = rows.fieldByName('Id');
			item.name = rows.fieldByName('Name');
			item.forDeals = rows.fieldByName('ForDeals');
			items.push(item);
			rows.next();
		}
		return items;
		break;
	}

	case 'subcategories': {

		break;
	}
	}
	db.close();
};

var GetLastUpdate = function(name) {
	var db = Ti.Database.install("/ticket1.sqlite", "DB_1");
	switch(name) {
	case 'categories': {
		var rows = db.execute("SELECT Date FROM UpdatesTime Where Id=1");
		if(rows.isValidRow() && rows.getRowCount() > 0){
			var dateInt = rows.fieldByName('Date');
			var date = new Date(dateInt);
			rows.close();
			db.close();
			return date;
		}
		return items;
		break;
	}

	case 'subcategories': {

		break;
	}
	}
	db.close();
};
