exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/{apiToken}/payments',
  		columns: {
  			status			: 'STRING',  			
			paymentSumm		: 'DECIMAL'
		},			
		adapter: {
            type		:'restapi',
            collection_name	: 'payment',
            idAttribute	:'id'			
        }
        ,debug : 1
    },
          
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
			
        	localValidate: function(callback) {
        		        		      		
       			return true;
        	}
        });
        return Model;
    },

    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};