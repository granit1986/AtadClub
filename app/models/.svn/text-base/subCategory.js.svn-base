var moment = require('alloy/moment');
exports.definition = {
	config: {
        URL		: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/subcategories',
		columns : {
			id		: 'INTEGER',
			name	: 'TEXT',
			categoryid: 'INTEGER'
		},
		adapter: {
			type			: 'restapi',
			collection_name : 'subCategory',
			idAttribute		: 'id'
		},
		debug: 1
	},

	extendModel : function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },

    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};