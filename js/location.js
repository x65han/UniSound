var locationManagerVirgin = true;
function googleLocation() {
    $.ajax({
		// url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBM75kiKj9tkuhWe97m1Ckqlq80bc_VduA",
        url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB8ZN6rdeuVJKg1Sjt3hJmNYciom9VeEK0",
        type: "POST",
        success: function (data) {
			var temp = {};
			temp.lat = data.location.lat;
			temp.long = data.location.lng
			getWeather(temp);
        },
        error: function () {
			if(locationManagerVirgin == true || locationManagerVirgin == false)googleLocation();
			if(locationManagerVirgin == true)locationManagerVirgin = false;
            if(locationManagerVirgin == false)locationManagerVirgin = null;
        }
    });
}
function getWeather(coor) {
    "use strict";
    var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?",
        lat = "lat=" + coor.lat + "&",
        lon = "lon=" + coor.long + "&",
		appId = "&appid=815a801f6c245cc890405e836e9b4df5",
        url = weatherUrl + lat + lon + appId,
        temp;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "jsonp",
        success: function (response) {
			temp = {
				country: response.sys.country == "CA" ? "Canada" : response.city.country,
				weather: response.weather[0].main,
                city: response.name,
				temperature: (response.main.temp - 273.15).toFixed(1),
				url: "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
			};
			$.getJSON('http://ipinfo.io', function(loc){
				temp.province = loc.region;
				temp.hostname = loc.hostname;
				temp.ip = loc.ip;
                locationManager = temp;
				createNewChannel(temp.city);
                createNewChannel(temp.province);
				createNewChannel(temp.country);
				createNewChannel(temp.weather);
                gettyManager(channels);
			});
        }
    });
}
