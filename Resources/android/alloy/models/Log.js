var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/logging",
        columns: {},
        adapter: {
            type: "restapi",
            idAttribute: "id"
        },
        debug: 1
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            localValidate: function() {
                return true;
            }
        });
        return Model;
    }
};

model = Alloy.M("log", exports.definition, []);

collection = Alloy.C("log", exports.definition, model);

exports.Model = model;

exports.Collection = collection;