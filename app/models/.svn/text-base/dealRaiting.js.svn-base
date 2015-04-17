exports.definition = {
	config: {
		URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/deals/setRaiting',
		columns: {
		    "Raiting": "int",
		    "DealId": "int"
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
        		
        		var errors = Alloy.Globals.errors;
        		var core = Alloy.Globals.core;
        		
        		
       			return true;
        	}
        });
        return Model;
    }   
};