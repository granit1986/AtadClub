var moment = require('alloy/moment');
exports.definition = {
	config: {
        URL		: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/adverts',
		columns : {
			id		: 'INTEGER',
			//distance: 'REAL',
			//currency: 'INT',
			//price	: 'REAL',
			//name	: 'TEXT'
		},
		adapter: {
			type			: 'restapi',
			collection_name	: 'publicAdvert',
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