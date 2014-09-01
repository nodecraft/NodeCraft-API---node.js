module.exports = function(username, apiKey, version){
	var request = require('request'),
		url = 'http://api.nodecraft.com',
		version = version || 'v1',
		auth = {
			username: username,
			password: apiKey
		};


	var makeRequest = function(method, uri, data, callback){
		if(data && !callback){
			callback = data;
			data = false;
		}
		console.log('url', url + version + '/' + uri);
		var options = {
			url: url + version + '/' + uri,
			json: true,
			method: method,
			auth: auth
		};
		if(method == 'POST' && data){
			options.form = data;
		}
		request(options, function(err, req, body){
			return callback(err, body);
		});
	}

	var furl = function(route){
		return String(route).replace(/\//g, '');
	}

	return {
		limits: function(callback){
			request({
				url: url + 'limits',
				json: true,
				method: 'GET',
				auth: auth
			}, function(err, req, body){
				return callback(err, body);
			});
		},
		services: {
			list: function(callback){
				makeRequest('GET', 'services', callback);
			},
			get: function(id, callback){
				makeRequest('GET', 'service/' + furl(id), callback);
			},
			stats: function(id, callback){
				makeRequest('GET', 'service/' + furl(id) + '/stats', callback);
			},
			start: function(id, callback){
				makeRequest('POST', 'service/' + furl(id) + '/start', callback);
			},
			stop: function(id, callback){
				makeRequest('POST', 'service/' + furl(id) + '/stop', callback);
			},
			kill: function(id, callback){
				makeRequest('POST', 'service/' + furl(id) + '/kill', callback);
			},
			msg: function(id, command, callback){
				makeRequest('POST', 'service/' + furl(id) + '/msg', {
					msg: command
				}, callback);
			}
		},
		coopVault: {
			list: function(callback){
				makeRequest('GET', 'co-op-vault', callback);
			},
			listByMonth: function(month, year, callback){
				if(year && !callback){
					callback = year;
					year = false;
				}
				var data = {
					month: month
				};
				if(year){
					data.year = year;
				}
				makeRequest('POST', 'co-op-vault', data, callback);
			}
		}

	}
}
