var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/sign/facebook",
        columns: {
            firstName: "text",
            lastName: "text",
            email: "text",
            appInstallId: "text",
            appVersion: "text",
            platformModel: "text",
            platformVersion: "text",
            platformOSName: "text"
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
                if (core.rxs.empty.test(this.attributes["firstName"])) {
                    callback(errors.NO_FIRST_NAME, null);
                    return false;
                }
                if (core.rxs.empty.test(this.attributes["email"])) {
                    callback(errors.NO_EMAIL, null);
                    return false;
                }
                if (!core.rxs.email.test(this.attributes["email"])) {
                    callback(errors.INVALID_EMAIL, null);
                    return false;
                }
                return true;
            }
        });
        return Model;
    }
};

model = Alloy.M("facebooklogin", exports.definition, []);

collection = Alloy.C("facebooklogin", exports.definition, model);

exports.Model = model;

exports.Collection = collection;