exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/sign/in',
  		columns: {
			login			: 'text',
			password		: 'text',
			appInstallId	: 'text',
			appVersion		: 'text',
			platformModel	: 'text',
			platformVersion	: 'text',
			platformOSName	: 'text'
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
        		
        		var errors = Alloy.Globals.errors;
        		var core = Alloy.Globals.core;
        		
        		if(core.rxs.empty.test(this.attributes['login'])) {
        			callback(errors.NO_EMAIL);
        			return false;
        		}
        		
        		if(!core.rxs.email.test(this.attributes['login'])) {
        			callback(errors.INVALID_EMAIL);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['password'])) {
        			callback(errors.NO_PASSWORD);
        			return false;
        		}
       			return true;
        	}
        });
        return Model;
    }   
};