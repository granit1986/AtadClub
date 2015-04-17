exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/sign/up',
  		columns: {
			firstName		: 'text',
			currency		: 'text',
			lastName		: 'text',
			email			: 'text',
			password		: 'text',
			confirm			: 'text',
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
        		

        		if(core.rxs.empty.test(this.attributes['lastName'])) {
        			callback(errors.NO_LAST_NAME, null);
        			return false;
        		}

        		if(core.rxs.empty.test(this.attributes['currency'])) {
        			callback(errors.NO_CURRENCY, null);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['email'])) {
        			callback(errors.NO_EMAIL, null);
        			return false;
        		}

        		if(!core.rxs.email.test(this.attributes['email'])) {
        			callback(errors.INVALID_EMAIL, null);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['phone'])) {
        			callback(errors.NO_PHONE, null);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['address'])) {
        			callback(errors.NO_ADDRESSPROFILE, null);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['password'])) {
        			callback(errors.NO_PASSWORD, null);
        			return false;
        		}
				
        		if(!core.rxs.password.test(this.attributes['password'])) {
        			callback(errors.PASSWORD_IS_TOO_SIMPLE, null);
        			return false;
        		}

        		if(core.rxs.empty.test(this.attributes['confirm'])) {
        			callback(errors.NO_CONFIRM, null);
        			return false;
        		}

        		if(this.attributes['confirm'] !== this.attributes['password']) {
        			callback(errors.PASSWORDS_NOT_MATCH, null);
        			return false;
        		}
       			return true;
        	}
        });
        return Model;
    }   
};