exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/{apiToken}/reports',
  		columns: {
  			
		},
		//defaults: {
		//	id				: 0
		//},	
		adapter: { 
            type		:'restapi',
			collection_name	: 'report'
        }
        ,debug : 1
    },
          
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
			
        	localValidate: function(callback) {
        		
        		var core = Alloy.Globals.core;
        		var error = Alloy.Globals.error;
        		
        		if(core.rxs.empty.test(this.attributes['from'])) {
        			callback(errors.NO_DATE_FROM);
        			return false;
        		}
        		
        		
        		if(core.rxs.empty.test(this.attributes['to'])) {
        			callback(errors.NO_DATE_TO);
        			return false;
        		}
        		
        		
        		var fromDate = this.attributes['from'];
        		var toDate = this.attributes['to'];
        		
        		if(fromDate > toDate) {
        			callback(errors.DATE_EQUALS);
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