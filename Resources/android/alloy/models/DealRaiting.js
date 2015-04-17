var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/deals/setRaiting",
        columns: {
            Raiting: "int",
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

model = Alloy.M("dealRaiting", exports.definition, []);

collection = Alloy.C("dealRaiting", exports.definition, model);

exports.Model = model;

exports.Collection = collection;