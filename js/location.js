function getLocation(){
	var location,forecast, temp;
	$.getJSON('http://ipinfo.io', function(location){
		if(location.city == '' || location.city == undefined || location.city == null){
			console.log("Location Manager not available");
			return;
		}
		// Get Weather Data
		var weather = "http://api.openweathermap.org/data/2.5/weather?q=" + location.city + "&appid=815a801f6c245cc890405e836e9b4df5";
		$.getJSON(weather, function(data){
			forecast = data;
			temp = {
				ip: location.ip,
				hostname: location.hostname,
				city: location.city,
				province: location.region,
				country: location.country == "CA" ? "Canada" : location.country,
				weather: forecast.weather[0].description,
				temperature: forecast.main.temp.toFixed(1),
				url: "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png"
			};
			createNewChannel(temp.city);
			createNewChannel(temp.province);
			createNewChannel(temp.country);
			createNewChannel(temp.weather);
			location = temp;
		});
	});
}
