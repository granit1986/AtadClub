exports.definition = {
    config: {
        URL		: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/{apiToken}/readCounts',
        columns	: {        	
        	offersCount		: 'INT',
        	messagesCount 	: 'INT'
        },
		adapter	: {
            type		:'restapi',
            collection_name	: 'counts'
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