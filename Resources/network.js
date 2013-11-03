(function() {
	yahoo.network = {};
	
	yahoo.network.getData = function(url, callback) {
		Titanium.App.fireEvent('app:show_indicator');
		var xhr = Ti.Network.createHTTPClient({
			timeout : 10000
		});
		xhr.onload = function() {
			Titanium.App.fireEvent('app:hide_indicator');
			if (this.status == 200) {
				var parsedData = JSON.parse(this.responseText);
				callback(parsedData);
			} else {
				callback("error");
			}
		};
		xhr.onerror = function(e) {
			Titanium.App.fireEvent('app:hide_indicator');
			callback("error");
		}
		xhr.open('GET', url);
		xhr.send();
	}
	
	yahoo.network.getData_no_indicator = function(url, callback) {
		var xhr = Ti.Network.createHTTPClient({
			timeout : 10000
		});
		xhr.onload = function() {
			if (this.status == 200) {
				var parsedData = JSON.parse(this.responseText);
				callback(parsedData);
			} else {
				callback("error");
			}
		};
		xhr.onerror = function(e) {
			callback("error");
		}
		xhr.open('GET', url);
		xhr.send();
	}
	
	yahoo.network.getRdata = function(url, callback) {
		var client = Ti.Network.createHTTPClient({
			timeout:15000
		});
		
		client.onload = function(){
			Ti.App.fireEvent('app:hide_indicator');
			callback(this.responseText);
		};
		
		client.onerror = function(){
			Ti.App.fireEvent('app:hide_indicator');
			callback('error');
		};
		
		client.open('GET', url);
		client.send();
	};

})(); 