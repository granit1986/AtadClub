exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/sign/out',
  		columns: {			
			appInstallId	: 'text',
			userId			: 'int'
		},	
		adapter: {
            type		:'restapi'
            //,idAttribute	:'appInstallId'			
        },
        debug : 1
    },      
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
			
        	localValidate: function(callback) {
        		        		
        	}
        });
        return Model;
    }   
};
