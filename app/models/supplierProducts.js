exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/products',
  		columns: {
  			id				: 'INT',
			name			: 'TEXT',
			description		: 'TEXT',
			price			: 'FLOAT',
			address			: 'TEXT',
			lat				: 'FLOAT',
			lng				: 'FLOAT',
			subCategories	: 'TEXT',
			active			: 'TEXT'
		},		
		adapter: {
            type		:'restapi',
			collection_name	: 'advert',            
            idAttribute	:'id'			
        }
        ,debug : 1
    },
          
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
			
        	localValidate: function(callback) {
        		
        		var core = Alloy.Globals.core;
        		var error = Alloy.Globals.error;
        		
        		if(core.rxs.empty.test(this.attributes['name'])) {
        			callback(errors.NO_TITLE);
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