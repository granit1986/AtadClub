var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/complains",
        columns: {
            Text: "TEXT",
            DealId: "int"
        },
        adapter: {
            type: "restapi",
            idAttribute: "id"
        },
        debug: 1
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            localValidate: function() {
                Alloy.Globals.errors;
                Alloy.Globals.core;
                return true;
            }
        });
        return Model;
    }
};

model = Alloy.M("complain", exports.definition, []);

collection = Alloy.C("complain", exports.definition, model);

exports.Model = model;

exports.Collection = collection;