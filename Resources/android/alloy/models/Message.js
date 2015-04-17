var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/{apiToken}/messages",
        columns: {
            from: "INTEGER",
            to: "INTEGER",
            chatid: "INTEGER",
            text: "STRING",
            fromuser: "STRING",
            touser: "STRING"
        },
        adapter: {
            type: "restapi",
            collection_name: "messages"
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

model = Alloy.M("message", exports.definition, []);

collection = Alloy.C("message", exports.definition, model);

exports.Model = model;

exports.Collection = collection;