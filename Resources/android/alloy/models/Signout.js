var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/sign/out",
        columns: {
            appInstallId: "text",
            userId: "int"
        },
        adapter: {
            type: "restapi"
        },
        debug: 1
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            localValidate: function() {}
        });
        return Model;
    }
};

model = Alloy.M("signout", exports.definition, []);

collection = Alloy.C("signout", exports.definition, model);

exports.Model = model;

exports.Collection = collection;