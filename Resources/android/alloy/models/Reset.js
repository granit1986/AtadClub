var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/sign/reset",
        columns: {
            email: "text"
        },
        adapter: {
            type: "restapi"
        },
        debug: 1
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            localValidate: function(callback) {
                var errors = Alloy.Globals.errors;
                var core = Alloy.Globals.core;
                if (core.rxs.empty.test(this.attributes["email"])) {
                    callback(errors.NO_EMAIL, null);
                    return false;
                }
                return true;
            }
        });
        return Model;
    }
};

model = Alloy.M("reset", exports.definition, []);

collection = Alloy.C("reset", exports.definition, model);

exports.Model = model;

exports.Collection = collection;