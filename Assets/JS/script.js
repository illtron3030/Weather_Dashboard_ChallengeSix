let APIKey = "6d28ee9d4a6dba4952c75a12c9046c96";
let loactions = [];




function getWeatherData(lat, lon, city){

    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=,minutely,hourly,alerts&appid=" + APIKey;


    $.ajax({
        url: queryURL,
        method: "GET"
    })

        .then(function(response){



            showWeatherData(reponse, city)
        
        });
};



function loadWeatherZip(zipCode, isClicked) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&appid=" + APIKey;
    var weatherContainer = $("#weatherContainer");


    $.ajax({
        url: queryURL,
        method: "GET"
    })

    .then(function(response)){



        if(!isClicked)
        {
            saveLocations(response);
            renderLocations();
        }
    
    
    
        getWeatherData(response.city.coord.lat, response.city.coord.lon, response.city.name);
    
    }).catch(function (response){
        alert("Not a vaild Zip Code")
    });
}

function loadWeatherCity(city, isClicked) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&appid=" + APIKey;
    var weatherContainer = $("#weatherContainer");


    $.ajax({
        url: queryURL,
        method: "GET"
    })

    .then(function (response) {



        if (!isClicked)
        {
            saveLocations(response);
            renderLocations();
        }


        getWeatherData(response.city.coord.lat, response.city.coord.lon, response.city.name);

    }).catch(function(response){
        alert("Not a valid City");
    });
}

function showWeatherData(weatherData, city)
{

    var iconURL = "http://openweathermap.org/img/w/" + weatherData.current.weather[0].icon + ".png";
    $("#cityDate").html(city + " (" + new Date().toLocaleDateString() + ") <img id=\"icon\" src=\"" + iconURL  + "\" alt=\"Weather icon\"/>");

    var temp = parseInt(weatherData.current.temp);
    temp = Math.round(((temp-273.15)*1.8) + 32);
    $("#currentTemp").html(" " + temp +  "  &degF");
    $("#currentHumidity").html(weatherData.current.humidity + "%");
    $("#currentWindSpeed").html(weatherData.current.wind_speed + " MPH");


    var uvIndex = weatherData.current.uvi;
}