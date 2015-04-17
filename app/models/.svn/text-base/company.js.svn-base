var moment = require('alloy/moment');

exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/{apiToken}/supplier',
  		columns: {
  			id				: 'INT',
			name			: 'TEXT',
			phone			: 'TEXT',
			email			: 'TEXT',
			address			: 'TEXT',
			lat				: 'TEXT',
			lng				: 'TEXT',
			about			: 'TEXT',
			workingHours	: 'TEXT',
			terms			: 'TEXT',
			subCategories	: 'TEXT',
			companyNumber	: 'TEXT'
		},	
		//defaults: {
		//	id:0
		//},		
		adapter: {
            type			: 'restapi',
            collection_name	: 'company',
            idAttribute		: 'email'
		},
        debug : 1
    },      
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
        	localValidate: function(callback) {
        		
        		var errors = Alloy.Globals.errors;
        		var core = Alloy.Globals.core;
        		
        		if(core.rxs.empty.test(this.attributes['name'])) {
        			callback(errors.NO_COMPANY_NAME, null);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['number'])) {
        			callback(errors.NO_NUMBER, null);
        			return false;
        		}
        		
        		this.attributes['number'] = this.attributes['number'].replace(/^\s+/,''); // trim start
				this.attributes['number'] = this.attributes['number'].replace(/\s+$/,''); // trim end
        		if(!core.rxs.number.test(this.attributes['number'])) {
        			callback(errors.INVALID_NUMBER, null);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['phone'])) {
        			callback(errors.NO_PHONE, null);
        			return false;
        		}
        		        		

				this.attributes['phone'] = this.attributes['phone'].replace(/^\s+/,''); // trim start
				this.attributes['phone'] = this.attributes['phone'].replace(/\s+$/,''); // trim end
        		if(!core.rxs.phone.test(this.attributes['phone'])) {
        			callback(errors.INVALID_PHONE, null);
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

        		if(core.rxs.empty.test(this.attributes['address'])) {
        			callback(errors.NO_ADDRESS);
        			return false;
        		}
        		
        		if(!this.attributes["haveImage"])
        		{
        			callback(errors.NO_IMAGE);        			
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['about'])) {
        			callback(errors.NO_ABOUT);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['workingHours'])) {
        			callback(errors.NO_WORKING_HOURS);
        			return false;
        		}
        		
        		if(core.rxs.empty.test(this.attributes['terms'])) {
        			callback(errors.NO_TERMS);
        			return false;
        		}
        		
        		return true;
        	}
        });
        return Model;
    }  
};