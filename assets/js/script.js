let city = "";
let foundCities = [];
let searchedEl = document.querySelector("#recent-searches");
let apiKey = ""

// Find the city
function findCity(city, newSearch) {
    let locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    
    fetch(locationUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if(data.length){
                    if (newSearch) {
                        capsFirstLetter();
                        // false: Add a button to the recent search if not already listed
                        cityList(false);
                    }
                    else {
                        $("header").attr("style", "display: none !important");
                        $("main").attr("style", "display: initial ! important");
                        // true: starting the App
                        cityList(true);
                    }
                    checkWeather(data[0].lat,data[0].lon);
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
    let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&limit=5&appid=${apiKey}`;
    
    fetch(weatherUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                weatherToday(data.current.dt, data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi, data.current.weather[0].icon);
                // Loop through 5-day forecast
                for (let i = 1; i < 6; i++){
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
    let today = new Date(date * 1000).toLocaleString("en-US",{month: "2-digit", day: "2-digit", year: "numeric"});
    let wicon = `https://openweathermap.org/img/w/${icon}.png`;
    const imgSrc = `<img src=${wicon}>`;
    let uvIndex = document.querySelector("#now-uv");
    
    $("#now-city").text(city + " (" + today + ") " );
    $("#now-city").append(imgSrc);
    $("#now-temp").text("Temp: " + temp + "\xB0F");
    $("#now-wind").text("Wind: " + wind + " MPH");
    $("#now-humid").text("Humidity: " + humidity + " %");
    // Color coding UV Index risk
    uv = parseFloat(uv);
    if (uv <= 2) {
        uvIndex.className = "uv-low";
    } else if (uv <= 5) {
        uvIndex.className = "uv-moderate";
    } else if (uv <= 7) {
        uvIndex.className = "uv-high";
    } else if (uv <= 10) {
        uvIndex.className = "uv-veryhigh";
    } else {
        uvIndex.className = "uv-extreme";
    }
    uvIndex.textContent = uv;
}

// Show weather day forecast 
function weatherForecast(day, date, temp, wind, humidity, icon){
        let forecastDay = new Date(date * 1000).toLocaleString("en-US",{month: "2-digit", day: "2-digit", year: "numeric"}); 
        let wicon = `https://openweathermap.org/img/w/${icon}.png`;

        $("#date-" + day).text(forecastDay);
        $("#icon-" + day).attr("src",wicon);
        $("#temp-" + day).text("Temp: " + temp + "\xB0F");
        $("#wind-" + day).text("Wind: " + wind + " MPH");
        $("#hum-" + day).text("Humidity: " + humidity + " %");
}

// Create button for recent search
function addButton(city) {
    let searchedBtn = document.createElement("button");

    // Make sure that there is no duplicate city
    if (foundCities.length > 0) {
        for (let i = 0; i < foundCities.length; i++) {
            if (city === foundCities[i]) {
                return;
            }
        }
    }
    document.querySelector("#searches").textContent = "Recent Cities";
    foundCities.unshift(city);
    localStorage.setItem("Found Cities", foundCities);
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
            let cities = localStorage.getItem("Found Cities").split(",");
            // Our App just started let's populate the recent searches buttons
            for (let i = 0; i < cities.length; i++){
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
    let cityArr = city.split(" ");

    for (let i =0; i < cityArr.length; i++){
        cityArr[i] = cityArr[i][0].toUpperCase() + cityArr[i].slice(1);
    }
    city = cityArr.join(" ");
 }

// New city search listener
$("#city-form").submit(function(event) {
    event.preventDefault();
    city = document.querySelector("#city").value;    
    if (city) {
        // true: new search, add button for recent cities if not already exist
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
    // false: Previous searched cities
    findCity(city, false)
});

// Starting our App
$(document).ready(function() {
    // Default city
    city = "Minneapolis";
    $("main").attr("style", "display: none ! important");
    // We will require the user to enter their API-Key
    $("#api-key").submit(function(event){
        event.preventDefault();
        apiKey = document.querySelector("#apiText").value;  
        if (apiKey) {
            // Show weather fo our default city at startup
            // false: will not create button for recently searched
            findCity(city,false);
        }
        else{
            alert("Please enter your API Key!");
            window.location.reload();
        }
    });
});

