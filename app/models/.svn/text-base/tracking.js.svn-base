exports.definition = {
    config: {
        URL		: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/tracking',
        columns	: {        	
        	id		: 'int',
        	token	: 'GUID',
        	lat		: 'FLOAT',
        	lng		: 'FLOAT'
        },
		adapter	: {
            type		:'restapi',
            collection_name	: 'banner'
        }
    },
          
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
        });
        return Model;
    },

    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};
