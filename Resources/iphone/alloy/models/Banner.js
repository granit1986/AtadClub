var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/banners",
        columns: {
            url: "STRING"
        },
        adapter: {
            type: "restapi",
            collection_name: "banner"
        }
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

model = Alloy.M("banner", exports.definition, []);

collection = Alloy.C("banner", exports.definition, model);

exports.Model = model;

exports.Collection = collection;