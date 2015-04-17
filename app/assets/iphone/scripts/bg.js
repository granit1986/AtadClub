// Ti.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
// Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
// Titanium.Geolocation.distanceFilter = 10;

Ti.App.currentService.addEventListener('stop', function(){
	Ti.Geolocation.removeEventListener("location", location);
	
});
Ti.Geolocation.addEventListener("location", location);


function location(e)
{	
	var messages = Ti.App.Properties.getObject("messages");
	messages.push("Method - location; time - " + new Date().toString());
	if(!Ti.Network.online)
	{
		messages.push("Network offline; time - " + new Date().toString());
		Ti.App.Properties.setObject("messages", messages);
		return;
	}
	
	if(e && e.coords && e.coords.latitude && e.coords.longitude)
	{
		Ti.API.info(JSON.stringify(e));
		var count = Ti.App.Properties.getInt("count");		
		Ti.API.info("location");
		var lat = e.coords.latitude;
		var lng = e.coords.longitude;				
		count++;
		messages.push("Lat - "+lat+"; Lng - "+lng+"; Count - "+count+"; time - " + new Date().toString());
		if(count >= 2)
		{
			if (Ti.Platform.name === "iPhone OS") {
				if (parseInt(Ti.Platform.version.split(".")[0]) >= 8)
					send(lat, lng, false, messages);
				else
					send(lat, lng, false, messages);
				Ti.App.Properties.setInt("count", 0);
			}
		}		
		Ti.App.Properties.setInt("count", count);
		Ti.App.Properties.setObject("messages", messages);
		reloadLocationManager();
	}
	else{
		messages.push("No coords; time - " + new Date().toString());
		Ti.App.Properties.setObject("messages", messages);
		Ti.API.info("unsubscribe");
		reloadLocationManager();		
	}
}

function  reloadLocationManager()
{
	//Ti.Geolocation.removeEventListener("location", location);
	//Ti.Geolocation.addEventListener("location", location);
}

function send(lat, lng, async, messages) {		
	var xhr = Ti.Network.createHTTPClient({timeout: 1*60*1000});
	var token = Ti.App.Properties.getString("token");
	Ti.API.info(token);
	var url = "http://"+Ti.App.serverDomain+"/api/0/tracking/Get?token="+token+"&lat="+lat+"&lng="+lng+"&offset="+new Date().getTimezoneOffset();
	messages.push("url - "+url+"; time - " + new Date().toString());
	xhr.onload = function(e) {
		messages.push("Location saved; time - " + new Date().toString());
		if(e.success)
		{			
			Ti.App.Properties.setInt("count", 0);			
			Ti.API.info("Coords saved!!!");			
		}
		Ti.App.Properties.setObject("messages", messages);
	};
	xhr.onerror = function(e){
		messages.push("Save error;Text - "+JSON.stringify(e)+" time - " + new Date().toString());
		Ti.App.Properties.setObject("messages", messages);
		Ti.API.error(e);
		Ti.API.error(e.source);
		Ti.App.Properties.setInt("count", 0);		
	};
	Ti.API.info(url);
	xhr.open("GET", url, async);
	xhr.send();
	messages.push("Sended location to server; async - "+async+"; time - " + new Date().toString());
	Ti.App.Properties.setObject("messages", messages);
	Ti.API.info("send");	
}
