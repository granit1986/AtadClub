var UpdateEvent = function(Event) {
    var db = Ti.Database.install("/ticket1.sqlite", "DB_1");
    var rows = db.execute("SELECT * FROM organaizer WHERE Id=" + Event.Token);
    rows && rows.isValidRows() && db.execute("UPDATE events SET Name = '" + Event.name + "', Description = '" + Event.description + "', StartDate = '" + Event.startDate + "', EndDate = '" + Event.endDate + "' WHERE Id=" + Event.id);
    rows.close();
    db.close();
};

var GetEvents = function(Token, offset) {
    var db = Ti.Database.install("/ticket1.sqlite", "DB_1");
    var rows = db.execute("SELECT * FROM organaizer WHERE OrganaizerUID=" + Token + " and Id>" + offset);
    while (rows.isValidRows()) rows.next();
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
        {
            db.execute("DELETE FROM organaizer");
        }
        db.execute("INSERT INTO organaizer (Id,UID) VALUES (?,?)", 1, Token);
    } else {
        db.execute("DELETE FROM organaizer");
    }
    db.close();
    return Token;
};