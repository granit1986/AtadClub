var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

var moment = require("alloy/moment");

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/adverts",
        columns: {
            id: "INTEGER"
        },
        adapter: {
            type: "restapi",
            collection_name: "publicAdvert",
            idAttribute: "id"
        },
        debug: 0
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("publicAdvert", exports.definition, []);

collection = Alloy.C("publicAdvert", exports.definition, model);

exports.Model = model;

exports.Collection = collection;