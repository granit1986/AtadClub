exports.definition = {
    config: {
        URL		: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/{apiToken}/chat',
        columns	: {        	
        	  	
        },
		adapter	: {
            type		:'restapi',
            collection_name	: 'chat',
            idAttribute	:'id'
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