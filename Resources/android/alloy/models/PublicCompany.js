var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/companies",
        columns: {
            id: "INT"
        },
        adapter: {
            type: "restapi",
            collection_name: "publicCompany",
            idAttribute: "id"
        },
        debug: 1
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    }
};

model = Alloy.M("publicCompany", exports.definition, []);

collection = Alloy.C("publicCompany", exports.definition, model);

exports.Model = model;

exports.Collection = collection;