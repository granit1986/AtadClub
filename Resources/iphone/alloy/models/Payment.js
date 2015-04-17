var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/{apiToken}/payments",
        columns: {
            status: "STRING",
            paymentSumm: "DECIMAL"
        },
        adapter: {
            type: "restapi",
            collection_name: "payment",
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
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("payment", exports.definition, []);

collection = Alloy.C("payment", exports.definition, model);

exports.Model = model;

exports.Collection = collection;