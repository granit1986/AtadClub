var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

var moment = require("alloy/moment");

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/automaticRenew",
        adapter: {
            type: "restapi",
            collection_name: "maxDealRenews"
        },
        debug: 0
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("maxDealRenews", exports.definition, []);

collection = Alloy.C("maxDealRenews", exports.definition, model);

exports.Model = model;

exports.Collection = collection;