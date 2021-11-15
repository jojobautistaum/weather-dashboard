var city = "";
var searchedCities = [];

// Find the city
function findCity(city) {
    var locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=b7609117c1b58fc397022fe7414e5f44`;
    fetch(locationUrl).then(function(response) {
        if (response) {
            response.json().then(function(data) {
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
                weatherToday(data.current.dt, data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi, data.current.weather[0].icon);
                // Loop through 5-day forecast
                for (var i = 1; i < 6; i++){
                    weatherForecast(i,data.daily[i].dt, data.daily[i].temp.day, data.daily[i].wind_speed, data.daily[i].humidity);
                }
                console.log(data);
                searchedCities.push(city);
            });
        }
        else {
            return alert("Can't find the weather info");
        }
    });

}

// Show weather info today
function weatherToday(date, temp, wind, humidity, uv, icon){
    var today = new Date(date * 1000).toLocaleString("en-US",{month: "2-digit", day: "2-digit", year: "numeric"});
    var wicon = "https://openweathermap.org/img/wn/${icon}@2x.png";
    const markup = `
    <span>
        <img src=${wicon}>
    </span>`;

    $("now-city").innerHTML = markup;

    $("#now-city").text(city + " (" + today + ") " );
    $("#now-temp").text("Temp: " + temp + "\xB0F");
    $("#now-wind").text("Wind: " + wind + " MPH");
    $("#now-humid").text("Humidity: " + humidity + " %");
    $("#now-uv").text("UV Index: " + uv);
}

// Show weather day forecast 
function weatherForecast(day, date, temp, wind, humidity, icon){
        var forecastDay = new Date(date * 1000).toLocaleString("en-US",{month: "2-digit", day: "2-digit", year: "numeric"}); 
        var wicon = `https://openweathermap.org/img/w/${icon}.png`;

        $("#date-" + day).text(forecastDay);
        $("#icon-" + day).text(wicon);
        $("#temp-" + day).text("Temp: " + temp + "\xB0F");
        $("#wind-" + day).text("Wind: " + wind + " MPH");
        $("#hum-" + day).text("Humidity: " + humidity + " %");
}

$("form").submit(function(event) {
    event.preventDefault();
    city = document.querySelector("#city").value;    
    console.log(city);
    findCity(city);
    
});