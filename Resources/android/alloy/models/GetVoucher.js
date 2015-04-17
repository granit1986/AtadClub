var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/{apiToken}/vouchers/get",
        columns: {
            DealId: "int"
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
                if (core.rxs.empty.test(this.attributes["login"])) {
                    callback(errors.NO_EMAIL);
                    return false;
                }
                if (!core.rxs.email.test(this.attributes["login"])) {
                    callback(errors.INVALID_EMAIL);
                    return false;
                }
                if (core.rxs.empty.test(this.attributes["password"])) {
                    callback(errors.NO_PASSWORD);
                    return false;
                }
                return true;
            }
        });
        return Model;
    }
};

model = Alloy.M("getVoucher", exports.definition, []);

collection = Alloy.C("getVoucher", exports.definition, model);

exports.Model = model;

exports.Collection = collection;