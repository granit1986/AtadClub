var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/{apiToken}/deals",
        columns: {
            id: "INT",
            name: "TEXT",
            description: "TEXT",
            price: "FLOAT",
            startTime: "int",
            endTime: "int",
            lat: "FLOAT",
            lng: "FLOAT",
            subCategories: "TEXT",
            active: "TEXT",
            dealtype: "int",
            complainscount: "int"
        },
        adapter: {
            type: "restapi",
            collection_name: "advert",
            idAttribute: "id"
        },
        debug: 1
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            localValidate: function(callback) {
                var core = Alloy.Globals.core;
                Alloy.Globals.error;
                if (core.rxs.empty.test(this.attributes["name"])) {
                    callback(errors.NO_TITLE);
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
                if (core.rxs.empty.test(this.attributes["address"])) {
                    callback(errors.NO_ADDRESS);
                    return false;
                }
                if (core.rxs.isUndefined(this.attributes["dealtype"])) {
                    callback(errors.NO_DEALTYPES);
                    return false;
                }
                if (core.rxs.isUndefined(this.attributes["startDate"])) {
                    callback(errors.NO_STARTDATE);
                    return false;
                }
                if (core.rxs.empty.test(this.attributes["renewDays"])) {
                    callback(errors.NO_RENEWDAYS);
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

model = Alloy.M("deal", exports.definition, []);

collection = Alloy.C("deal", exports.definition, model);

exports.Model = model;

exports.Collection = collection;