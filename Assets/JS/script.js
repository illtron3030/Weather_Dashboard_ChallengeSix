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
    }
}