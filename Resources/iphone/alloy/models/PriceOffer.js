var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/{apiToken}/offers",
        columns: {
            id: "INT",
            advertId: "INT",
            description: "TEXT",
            price: "FLOAT"
        },
        adapter: {
            type: "restapi"
        },
        debug: 1
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            localValidate: function(callback) {
                var core = Alloy.Globals.core;
                Alloy.Globals.error;
                if (core.rxs.empty.test(this.attributes["description"])) {
                    callback(errors.NO_DESCRIPTION);
                    return false;
                }
                if (core.rxs.empty.test(this.attributes["price"])) {
                    callback(errors.NO_PRICE);
                    return false;
                }
                this.attributes["price"] = parseFloat(this.attributes["price"]);
                if (isNaN(this.attributes["price"])) {
                    callback(errors.INVALID_PRICE);
                    return false;
                }
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

model = Alloy.M("priceOffer", exports.definition, []);

collection = Alloy.C("priceOffer", exports.definition, model);

exports.Model = model;

exports.Collection = collection;