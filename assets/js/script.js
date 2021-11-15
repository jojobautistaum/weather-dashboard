var city = "";
var foundCities = [];
var searchedEl = document.querySelector("#recent-searches");

// Find the city
function findCity(city, newSearch) {
    var locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=b7609117c1b58fc397022fe7414e5f44`;
    fetch(locationUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if(data.length){
                    checkWeather(data[0].lat,data[0].lon);
                    if (newSearch) {
                        city = capsFirstLetter();
                        // Add a button for the recent search
                        cityList(false);
                    }
                } else {
                    alert("The city location is unknown: " + city);
                }
            });
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to connect to Open Weather. - " + error);
    });
}

// Pull the weather info
function checkWeather (latitude, longitude) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&limit=5&appid=b7609117c1b58fc397022fe7414e5f44`;
    fetch(weatherUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                weatherToday(data.current.dt, data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi, data.current.weather[0].icon);
                // Loop through 5-day forecast
                for (var i = 1; i < 6; i++){
                    weatherForecast(i,data.daily[i].dt, data.daily[i].temp.day, data.daily[i].wind_speed, data.daily[i].humidity, data.daily[i].weather[0].icon);
                }
            });
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to connect to Open Weather. - " + error);
    });
}

// Show weather info today
function weatherToday(date, temp, wind, humidity, uv, icon){
    var today = new Date(date * 1000).toLocaleString("en-US",{month: "2-digit", day: "2-digit", year: "numeric"});
    var wicon = `https://openweathermap.org/img/w/${icon}.png`;
    const imgSrc = `<img src=${wicon}>`;

    $("#now-city").text(city + " (" + today + ") " );
    $("#now-city").append(imgSrc);
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
        $("#icon-" + day).attr("src",wicon);
        $("#temp-" + day).text("Temp: " + temp + "\xB0F");
        $("#wind-" + day).text("Wind: " + wind + " MPH");
        $("#hum-" + day).text("Humidity: " + humidity + " %");
}

// Create button for recent search
function addButton(city) {
    // Make sure that there is no duplicate city
    if (foundCities.length > 0) {
        for (var i = 0; i < foundCities.length; i++) {
            if (city === foundCities[i]) {
                return;
            }
        }
    }
    document.querySelector("#searches").textContent = "Recent Searches";
    foundCities.unshift(city);
    localStorage.setItem("Found Cities", foundCities);
    var searchedBtn = document.createElement("button");
    searchedBtn.classList.add("btns");
    searchedBtn.type = "button";
    searchedBtn.textContent = city;
    searchedEl.prepend(searchedBtn);
}

// Add recent search buttons
function cityList (appStarting){
    // We have a new city for recently searched
    if (!appStarting){
        addButton(city);
    }
    else {
        // Update foundCities array from localStorage if not empty
        if (localStorage.getItem("Found Cities") !== null){
            // Use cities as temp array so we can add the buttons as if it's new
            var cities = localStorage.getItem("Found Cities").split(",");
            // Our App just started let's populate the recent searches buttons
            for (var i = 0; i < cities.length; i++){
                addButton(cities[i]);
            }
            // After adding the buttons, populate our foundCities array.
            foundCities = cities;
        }
    }
}

// We will capitalized first letter of each word
function capsFirstLetter(){
    city = city.toLowerCase();
    var cityArr = city.split(" ");
    for (var i =0; i < cityArr.length; i++){
        cityArr[i] = cityArr[i][0].toUpperCase() + cityArr[i].slice(1);
    }
    city = cityArr.join(" ");
    
    return city;
}

// New city search listener
$("form").submit(function(event) {
    event.preventDefault();
    city = document.querySelector("#city").value;    
    if (city) {
        findCity(city,true);
    }
    else{
        alert("Please enter a city name!");
    }
});

// Recent search listener
$("#recent-searches").click(function(event) {
    event.preventDefault();
    city = $(event.target).text();
    // Not a new search
    findCity(city,false)
});

// Starting our App
$(document).ready(function() {
    // Look for existing recent searches from localStorage then add all the buttons
    cityList(true);
})

