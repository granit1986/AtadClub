var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        URL: "http://" + Titanium.App.serverDomain + "/api/" + Titanium.App.ApiVersion + "/notify",
        columns: {
            deviceToken: "text",
            subCategories: "text",
            period: "int",
            for_: "int",
            from: "int",
            to: "int",
            type: "int",
            distance: "int",
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
        _.extend(Model.prototype, {});
        return Model;
    }
};

model = Alloy.M("notify", exports.definition, []);

collection = Alloy.C("notify", exports.definition, model);

exports.Model = model;

exports.Collection = collection;