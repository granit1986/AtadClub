exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/contactus',
  		columns: {
			subject			: 'text',
			message			: 'text'
		},	
		adapter: {
            type		:'restapi'
        }
    },      
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
			
        	localValidate: function(callback) {
        		
        		var errors = Alloy.Globals.errors;
        		var core = Alloy.Globals.core;
        		      		
        		
        		if(core.rxs.empty.test(this.attributes['name'])) {
        			callback(errors.NO_NAME);
        			return false;
        		}
        		if(core.rxs.empty.test(this.attributes['email'])) {
        			callback(errors.NO_EMAIL);
        			return false;
        		}
        		
        		if(!core.rxs.email.test(this.attributes['email'])) {
        			callback(errors.INVALID_EMAIL);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['phone'])) {
        			callback(errors.NO_PHONE);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['message'])) {
        			callback(errors.NO_MESSAGE);
        			return false;
        		}
        		
       			return true;
        	}
        });
        return Model;
    }   
};