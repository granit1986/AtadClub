var moment = require('alloy/moment');
exports.definition = {
	config: {
        URL		: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/categories',
		columns : {
			id		: 'INTEGER',
			name	: 'TEXT'
		},
		adapter: {
			type			: 'restapi',
			collection_name : 'category',
			idAttribute		: 'id'
		},
		debug: 0
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