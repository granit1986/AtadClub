exports.definition = {
    config: {
        URL: 'http://' + Titanium.App.serverDomain + '/api/'+Titanium.App.ApiVersion+'/notify',
  		columns: {
  			deviceToken		: 'text',
			subCategories	: 'text',
			period			: 'int',
			for_			: 'int',
			from			: 'int',
			to				: 'int',
			type			: 'int',
			distance		: 'int',
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
        _.extend(Model.prototype, {});
        return Model;
    }   
};