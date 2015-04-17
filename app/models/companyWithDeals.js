exports.definition = {
	config : {
		URL : 'http://' + Titanium.App.serverDomain + '/api/' + Titanium.App.ApiVersion + '/deals',
		columns : {
			id : 'INT',
			//name			: 'TEXT',
			//phone			: 'TEXT',
			//email			: 'TEXT',
			//subCategories	: 'TEXT',
			//address			: 'TEXT',
			//lat				: 'TEXT',
			//lng				: 'TEXT',
			//about			: 'TEXT',
			//workingHours	: 'TEXT',
			//terms			: 'TEXT',
			//logo			: 'TEXT'
		},
		//defaults: {
		//	id:0
		//},
		adapter : {
			type : 'restapi',
			collection_name : 'publicCompany',
			idAttribute : 'id'
		},
		debug : 1
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
		});
		return Model;
	}
}; 