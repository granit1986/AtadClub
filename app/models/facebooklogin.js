exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/sign/facebook',
  		columns: {
			firstName		: 'text',
			lastName		: 'text',
			email			: 'text',
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
        		
        		if(core.rxs.empty.test(this.attributes['firstName'])) {
        			callback(errors.NO_FIRST_NAME, null);
        			return false;
        		}
        		
/*
        		if(!core.rxs.notEmpty.test(this.attributes['lastName'])) {
        			callback(core.errors.NO_LAST_NAME, null);
        			return false;
        		}
*/
        		if(core.rxs.empty.test(this.attributes['email'])) {
        			callback(errors.NO_EMAIL, null);
        			return false;
        		}

        		if(!core.rxs.email.test(this.attributes['email'])) {
        			callback(errors.INVALID_EMAIL, null);
        			return false;
        		}
        		
        		
       			return true;
        	}
        });
        return Model;
    }   
};