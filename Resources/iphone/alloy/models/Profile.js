var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/{apiToken}/profile",
        columns: {
            firstName: "TEXT",
            lastName: "TEXT",
            email: "TEXT",
            phone: "TEXT",
            supplier: "INTEGER",
            address: "STRING",
            newPassword: "STRING",
            confirm: "STRING"
        },
        adapter: {
            type: "restapi",
            collection_name: "profile",
            idAttribute: "email"
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
                this.attributes["phone"] = this.attributes["phone"].replace(/^\s+/, "");
                this.attributes["phone"] = this.attributes["phone"].replace(/\s+$/, "");
                if (!core.rxs.empty.test(this.attributes["phone"]) && !core.rxs.phone.test(this.attributes["phone"])) {
                    callback(errors.INVALID_PHONE, null);
                    return false;
                }
                if (this.attributes["newPassword"] !== this.attributes["confirm"]) {
                    callback(errors.PASSWORDS_NOT_MATCH, null);
                    return false;
                }
                if (!core.rxs.empty.test(this.attributes["newPassword"]) && !core.rxs.password.test(this.attributes["newPassword"])) {
                    callback(errors.PASSWORD_IS_TOO_SIMPLE, null);
                    return false;
                }
                return true;
            }
        });
        return Model;
    }
};

model = Alloy.M("profile", exports.definition, []);

collection = Alloy.C("profile", exports.definition, model);

exports.Model = model;

exports.Collection = collection;