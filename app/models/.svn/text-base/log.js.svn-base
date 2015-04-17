exports.definition = {
	config: {
		URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/logging',
		columns: {
		    
		},
		adapter: {
            type		:'restapi',
            idAttribute	:'id'
            //,idAttribute	:'appInstallId'			
        },
        debug : 1
    },      
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
			
        	localValidate: function(callback) {        		
       			return true;
        	}
        });
        return Model;
    }   
};