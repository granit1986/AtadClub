exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/sign/reset',
  		columns: {			
			email			: 'text',			
		},	
		adapter: {
            type		:'restapi'            
       },
		debug : 1		
    },      
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
			
        	localValidate: function(callback) {
        		
        		var errors = Alloy.Globals.errors;
        		var core = Alloy.Globals.core;        		
        		
        		if(core.rxs.empty.test(this.attributes['email'])) {
        			callback(errors.NO_EMAIL, null);
        			return false;
        		}
        		
        		
       			return true;
        	}
        });
        return Model;
    }   
};