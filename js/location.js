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
    var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/weather?",
        lat = "lat=" + coor.lat + "&",
        lon = "lon=" + coor.long + "&",
		temp,
        // appId = "APPID=54b4f28c77ecfb3acd3e3bf77ed99b61",
		appId = "&appid=815a801f6c245cc890405e836e9b4df5",
        url = weatherUrl + lat + lon + appId;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "jsonp",
        success: function (response) {
			temp = {
				country: response.city.country == "CA" ? "Canada" : response.city.country,
				weather: response.list[0].weather[0].main,
				temperature: (response.list[0].main.temp - 273.15).toFixed(1),
				url: "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png"
			};
			$.getJSON('http://ipinfo.io', function(loc){
				temp.city = loc.city;
				temp.province = loc.region;
				temp.hostname = loc.hostname;
				temp.ip = loc.ip;
                locationManager = temp;
				createNewChannel(temp.city);
				createNewChannel(temp.province);
				createNewChannel(temp.country);
				createNewChannel(temp.weather);
			});
        }
    });


}
