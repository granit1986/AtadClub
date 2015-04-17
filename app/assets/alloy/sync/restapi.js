/**
 * Rest API Adapter for Titanium Alloy
 * @author Mads M�ller
 * @version 1.1.2
 * Copyright Napp ApS
 * www.napp.dk
 */
   
var modal;

function S4() {
	return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
	return {};
}


Ti.Network.addEventListener('change', function(e) {
	if (!e.online) {
		if (!Alloy.Globals.core.offlineModal)
			Alloy.Globals.core.createOfflineModal();
		Alloy.Globals.core.offlineModal.show();
	} else {
		var token = Alloy.Globals.core.apiToken();
		if (token) {
			if (!Alloy.Globals.chat.connected)
				Alloy.Globals.chat.openConnect();
		}
	}
}); 


function apiCall(_options, _callback) {

	if(!Ti.Network.online) {
		if(!Alloy.Globals.core.offlineModal)
			Alloy.Globals.core.createOfflineModal();
		Alloy.Globals.core.offlineModal.show();
		_callback({
			success: false,
			status: "offline",
			responseText: null
		});
		return;	
	}
	var cacheOptions = _options.cache || false;
	var cache = false;
	if(cacheOptions) {
		if(!Alloy.Globals.caches[cacheOptions.name]) {
			Alloy.Globals.caches[cacheOptions.name] = {
				data: false,
				expires: new Date() + cacheOptions.validMinutes * 60000,
				valid: function() {
					if(!this.data)
						return false;
					if(new Date() > this.expires)	
						return false;
					return true;
				},
				save: function(_data) {
					this.data = _data;
					this.expires = new Date() + cacheOptions.validMinutes * 60000;
				} 
			};
		}
		cache = Alloy.Globals.caches[cacheOptions.name];
	}
	var xhr = Ti.Network.createHTTPClient({
		timeout: _options.timeout || 15000
	});

	var cachedData = false;
	if(cache && cache.valid()) {

		Ti.API.info('[REST API] RETURN FROM CACHE ' + cacheOptions.name);
		_callback({
			success: true,
			status: 'ok',
			code: 200,
			responseJSON: cache.data
		});
		return;	
	}

	/* AD */
	var q = '?';
	if (_options.data && _options.type == 'GET') {
		for (var key in _options.data) {
			q += key + '=' + _options.data[key] + '&';
		}
		q = q.substr(0, q.length - 1);
		_options.url += q;
	}
	
	
	xhr.open(_options.type, _options.url);
	Ti.API.info('[xhr.open(_options.type, _options.url)]');
	Ti.API.info(_options);
	var test = new Benchmark();
	
	for (var header in _options.headers)
		xhr.setRequestHeader(header, _options.headers[header]);

	if (_options.beforeSend) {
		_options.beforeSend(xhr);
	}

	

	if (_options.type == 'GET')
		xhr.send(null);
	else
		xhr.send(_options.data || null);

	xhr.onload = function () {
		var responseJSON, success = true, error;
		try {
			if(xhr.responseText)
				responseJSON = JSON.parse(xhr.responseText);
				
		} catch (e) {
			Ti.API.error('[REST API] apiCall ERROR: ' + e.message);
			success = false;
			error = e.message;
		}

		if (cache) {
			cache.save(responseJSON);
			Ti.API.info('[REST API] SAVED TO CACHE ' + cacheOptions.name);
		}

		Alloy.Globals.core.hideWait();
		Ti.API.info('Time - ' + test.test() + ' ms');
		_callback({
			success: success,
			status: success ? (xhr.status == 200 ? "ok" : xhr.status) : 'error',
			code: xhr.status,
			data: error,
			responseText: xhr.responseText || null,
			responseJSON: responseJSON || null
		});
	};

	xhr.onerror = function (e) {
		var responseJSON;
		try {
			responseJSON = JSON.parse(xhr.responseText);
		} catch (e) {}

		Alloy.Globals.core.hideWait();
		
		if(e.code == '-1001')
		{
			Alloy.Globals.core.showErrorDialog(L("internet_weak"));
		}

		_callback({
			success: false,
			status: "error",
			code: xhr.status,
			data: e.error,
			responseText: xhr.responseText,
			responseJSON: responseJSON || null
		});
		Ti.API.error('[REST API] apiCall ERROR: ' + xhr.responseText);
		Ti.API.error('[REST API] apiCall ERROR CODE: ' + xhr.status);
		Ti.API.error('XHR]: ' + xhr);
	};

}

function Sync(method, model, opts) {

	var DEBUG = model.config.debug;
	
	if(model.config.URL && model.config.URL.indexOf('{apiToken}') > 0 )
		model.config.URL = model.config.URL.replace('{apiToken}', Alloy.Globals.core.apiToken());	
	
	model.idAttribute = model.config.adapter.idAttribute || "id";
	var parentNode = model.config.parentNode;

	var methodMap = {
		'create'	: 'POST',
		'read'		: 'GET',
		'update'	: 'PUT',
		'delete'	: 'DELETE'
	};

	var type = methodMap[method];
	var params = _.extend({}, opts);
	params.type = type;

	if (model.config.type)
		params.type = model.config.type;

	params.headers = params.headers || {};

	if (model.config.hasOwnProperty("headers"))
		for (var header in model.config.headers)
			params.headers[header] = model.config.headers[header];
	if (!params.url) {
		params.url = (model.config.URL || model.url());
		if (!params.url) {
			Ti.API.error("[REST API] ERROR: NO BASE URL");
			model.config.URL = model.config.URL.replace(Alloy.Globals.core.apiToken(),'{apiToken}');
			return;
		}
	}

	if (Alloy.Backbone.emulateJSON) {
		params.contentType = 'application/x-www-form-urlencoded';
		params.processData = true;
		params.data = params.data ? {
			model: params.data
		} : {};
	}

	if (Alloy.Backbone.emulateHTTP)
		if (type === 'PUT' || type === 'DELETE') {
			if (Alloy.Backbone.emulateJSON)
				params.data._method = type;
			params.type = 'POST';
			params.beforeSend = function (xhr) {
				params.headers['X-HTTP-Method-Override'] = type;
			};
		}

	params.headers['Content-Type'] = 'application/json';

	logger(DEBUG, "REST METHOD", method);

	switch (method) {
		case 'create':
			params.data = JSON.stringify(model.toJSON());
			logger(DEBUG, "create options", params);

			apiCall(params, function (_response) {
				if (_response.success) {
					var data = parseJSON(DEBUG, _response, parentNode);

					if (data && data[model.idAttribute] === undefined) {
						data[model.idAttribute] = guid();
					}
					params.success(data, JSON.stringify(data));
					model.trigger("fetch");
				} else {
					params.error(_response.responseJSON, _response.responseText);
					Ti.API.error('[REST API] CREATE ERROR: ');
					Ti.API.error(_response);
				}
			});
			break;

		case 'read':
			if (model[model.idAttribute])
				params.url = params.url + '/' + model[model.idAttribute];

			if (params.urlparams)
				params.url = encodeData(params.urlparams, params.url);

			logger(DEBUG, "read options", params);

			apiCall(params, function (_response) {
				if (_response.success) {
					var data = parseJSON(DEBUG, _response, parentNode);
					var values = [];
					model.length = 0;
					for (var i in data) {
						var item = {};
						item = data[i];
						if (item && item[model.idAttribute] === undefined) {
							item[model.idAttribute] = guid();
						}
						values.push(item);
						model.length++;
					}

					params.success((model.length === 1) ? values[0] : values, _response.responseText);
					model.trigger("fetch");
				} else {
					params.error(_response.responseJSON, _response.responseText);
					Ti.API.error('[REST API] READ ERROR: ');
					Ti.API.error(_response);
				}
			});
			break;

		case 'update':
			if (!model.get(model.idAttribute)) {
				params.error(null, "MISSING MODEL ID");
				Ti.API.error("[REST API] ERROR: MISSING MODEL ID");
				model.config.URL = model.config.URL.replace(Alloy.Globals.core.apiToken(),'{apiToken}');
				return;
			}

			if (_.indexOf(params.url, "?") == -1) {
				params.url = params.url + '/' + model[model.idAttribute];
			} else {
				var str = params.url.split("?");
				params.url = str[0] + '/' + model[model.idAttribute] + "?" + str[1];
			}

			if (params.urlparams) {
				params.url = encodeData(params.urlparams, params.url);
			}

			params.data = JSON.stringify(model.toJSON());

			logger(DEBUG, "update options", params);

			apiCall(params, function (_response) {
				if (_response.success) {
					var data = parseJSON(DEBUG, _response, parentNode);
					params.success(data, JSON.stringify(data));
					model.trigger("fetch");
				} else {
					params.error(_response.responseJSON, _response.responseText);
					Ti.API.error('[REST API] UPDATE ERROR: ');
					Ti.API.error(_response);
				}
			});
			break;

		case 'delete':
			if (!model[model.idAttribute]) {
				params.error(null, "MISSING MODEL ID");
				Ti.API.error("[REST API] ERROR: MISSING MODEL ID");
				model.config.URL = model.config.URL.replace(Alloy.Globals.core.apiToken(),'{apiToken}');
				return;
			}
			params.url = params.url + '/' + model[model.idAttribute];

			logger(DEBUG, "delete options", params);

			apiCall(params, function (_response) {
				if (_response.success) {
					var data = parseJSON(DEBUG, _response, parentNode);
					params.success(null, _response.responseText);
					model.trigger("fetch");
				} else {
					params.error(_response.responseJSON, _response.responseText);
					Ti.API.error('[REST API] DELETE ERROR: ');
					Ti.API.error(_response);
				}
			});
			break;
	}
	
	if(Alloy.Globals.core.apiToken())
		model.config.URL = model.config.URL.replace(Alloy.Globals.core.apiToken(),'{apiToken}');
}

function logger(DEBUG, message, data) {
	if (DEBUG) {
		Ti.API.debug("[REST API] " + message);
		Ti.API.debug(typeof data === 'object' ? JSON.stringify(data, null, '\t') : data);
	}
}

function parseJSON(DEBUG, _response, parentNode) {
	var data = _response.responseJSON;
	if (!_.isUndefined(parentNode)) {
		data = _.isFunction(parentNode) ? parentNode(data) : traverseProperties(data, parentNode);
	}
	logger(DEBUG, "server response", _response);
	return data;
}

function traverseProperties(object, string) {
	var explodedString = string.split('.');
	for (i = 0, l = explodedString.length; i < l; i++) {
		object = object[explodedString[i]];
	}
	return object;
}

function encodeData(obj, url) {
	var str = [];
	for (var p in obj) {
		str.push(Ti.Network.encodeURIComponent(p) + "=" + Ti.Network.encodeURIComponent(obj[p]));
	}

	if (_.indexOf(url, "?") == -1) {
		return url + "?" + str.join("&");
	} else {
		return url + "&" + str.join("&");
	}
}

var _ = require("alloy/underscore")._;

var Alloy = require("alloy"), Backbone = Alloy.Backbone;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function (config, name) {
	config = config || {};
	InitAdapter(config);
	return config;
};

module.exports.afterModelCreate = function (Model, name) {
	Model = Model || {};
	Model.prototype.config.Model = Model;
	Model.prototype.idAttribute = Model.prototype.config.adapter.idAttribute;
	return Model;
};
