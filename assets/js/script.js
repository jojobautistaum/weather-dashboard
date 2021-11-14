

// Find the city
function findCity(city) {
    var locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=b7609117c1b58fc397022fe7414e5f44`;
    fetch(locationUrl).then(function(response) {
        if (response) {
            response.json().then(function(data) {
                console.log(data[0].lat);
                console.log(data[0].lon);
                checkWeather(data[0].lat,data[0].lon)
            });
        }
        else {
            return alert("Can't find the city");
        }
    });
}

// Pull the weather info
function checkWeather (latitude, longitude) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&limit=5&appid=b7609117c1b58fc397022fe7414e5f44`;
    fetch(weatherUrl).then(function(response) {
        if (response) {
            response.json().then(function(data) {
                console.log(data.current.dt);
                console.log(data.current.temp);
                console.log(data.current.wind_speed);
                console.log(data.current.uvi);
                console.log(data);
            });
        }
        else {
            return alert("Can't find the weather info");
        }
    });

}

$("form").submit(function(event) {
    event.preventDefault();
    
    var city = document.querySelector("#city").value;
    console.log(city);
    findCity(city);
    
});