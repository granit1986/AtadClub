exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/{apiToken}/offers',
  		columns: {
  			id				: 'INT',
  			//advertId		: 'INT',
			description		: 'TEXT',
			price			: 'FLOAT'
		},
		//defaults: { id : 0 },	
		adapter: {
            type		:'restapi',
            collection_name	: 'offer',
            idAttribute	:'id'			
        }
        ,debug : 1
    },
          
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
			
        	localValidate: function(callback) {
        		
        		var core = Alloy.Globals.core;
        		var error = Alloy.Globals.error;
        		
        		if(core.rxs.empty.test(this.attributes['description'])) {
        			callback(errors.NO_DESCRIPTION);
        			return false;
        		}
        		if(core.rxs.empty.test(this.attributes['price'])) {
        			callback(errors.NO_PRICE);
        			return false;
        		}

        		this.attributes['price'] = parseFloat(this.attributes['price']);
        		if(isNaN(this.attributes['price'])) {
        			callback(errors.INVALID_PRICE);
        			return false;
        		}        		
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