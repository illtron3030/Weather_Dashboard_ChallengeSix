let APIKey = "6d28ee9d4a6dba4952c75a12c9046c96";
let locations = [];

function getWeatherData(lat, lon, city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=,minutely,hourly,alerts&appid=" +
    APIKey;

  $.ajax({ //AJAX to OpenWeatherMap API
    url: queryURL,
    method: "GET",
  })
  .then(function (response) { //Store received info into object "response"
    showWeatherData(response, city);
  });
}
//call API based on zipcode and call function showWeatherData to display values
function loadWeatherZip(zipCode, isClicked) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?zip=" +
    zipCode +
    ",us&appid=" +
    APIKey;
  var weatherContainer = $("#weatherContainer");

  $.ajax({ //AJAX to call API
    url: queryURL,
    method: "GET",
  })
    //Store all data received in object called "response"
    .then(function (response) {

      if (!isClicked) {
        saveLocations(response);

        renderLocations();
      }

      getWeatherData( //Load weather
        response.city.coord.lat,
        response.city.coord.lon,
        response.city.name
      );
    })
    .catch(function (response) {  //Tell user their input is not valid
      alert("Not a vaild Zip Code");
    });
}

function loadWeatherCity(city, isClicked) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    ",us&appid=" +
    APIKey;
  var weatherContainer = $("#weatherContainer");

  $.ajax({
    url: queryURL,
    method: "GET",
  })

    .then(function (response) {
      if (!isClicked) {
        saveLocations(response);
        renderLocations();
      }

      getWeatherData(
        response.city.coord.lat,
        response.city.coord.lon,
        response.city.name
      );
    })
    .catch(function (response) {
      alert("Not a valid City");
    });
}

function showWeatherData(weatherData, city) {
  var iconURL =  //Load current city
    "http://openweathermap.org/img/w/" +
    weatherData.current.weather[0].icon +
    ".png";
  $("#cityDate").html(
    city +
      " (" +
      new Date().toLocaleDateString() +
      ') <img id="icon" src="' +
      iconURL +
      '" alt="Weather icon"/>'
  );

  var temp = parseInt(weatherData.current.temp);
  temp = Math.round((temp - 273.15) * 1.8 + 32);
  $("#currentTemp").html(" " + temp + "  &degF");
  $("#currentHumidity").html(weatherData.current.humidity + "%");
  $("#currentWindSpeed").html(weatherData.current.wind_speed + " MPH");

  var uvIndex = weatherData.current.uvi;

  var bgColor = "";
  var textColor = "";

  if (uvIndex < 3) {
    bgColor = "bg-success";
    textColor = "text-light";
  } else if (uvIndex > 2 && uvIndex < 6) {
    bgColor = "bg-warning";
    textColor = "text-dark";
  } else {
    bgColor = "bg-danger";
    textColor = "text-light";
  }

  $("#currentUVIndex")
    .html(uvIndex)
    .addClass(bgColor + " p-1 " + textColor);

  var ul5 = $("#fiveDay");  //Load five day
  ul5.empty();

  for (i = 1; i < 6; i++) {  //Specify that we want only next five days
    var div = $("<div>").addClass("bg-primary");

    var dateTime = parseInt(weatherData.daily[i].dt);
    var dateHeading = $("<h6>").text(
      new Date(dateTime * 1000).toLocaleDateString()
    ); //convert unix time to javascript date
    var iconDayURL =
      "http://openweathermap.org/img/w/" +
      weatherData.daily[i].weather[0].icon +
      ".png"; //get weather icon
    var icon = $("<img>").attr("src", iconDayURL);

    temp = parseInt(weatherData.daily[i].temp.day);
    temp = Math.round((temp - 273.15) * 1.8 + 32);
    var temp5 = $("<p>").html("Temp: " + temp + "  &degF");

    var humidity5 = $("<p>").html(
      "Humidity: " + weatherData.daily[i].humidity + "%"
    );

    div.append(dateHeading);
    div.append(icon);
    div.append(temp5);
    div.append(humidity5);
    ul5.append(div);
  }

  $("#weatherData").show();
}
//Load loactions from local storage to locations array
function loadLocations() {
  var locationsArray = localStorage.getItem("locations");
  if (locationsArray) {
    locations = JSON.parse(locationsArray);//check if location object is in local storage
    renderLocations();
  } else {
    localStorage.setItem("locations", JSON.stringify(locations));//if there is not one make one and save to local storage
  }
}

function renderLocations() { //clear cities list before rendering from local storage
  var divLocations = $("#locationHistory");

  $.each(locations, function (index, item) {
    var a = $("<a>")
      .addClass("list-group-item list0group-item-action-city")
      .attr("data-city", locations[index])
      .text(locations[index]);
    divLocations.append(a);
  });

  $("#locationHistory > a").off();

  $("#locationHistory > a").click(function (event) {
    var element = event.target;
    var city = $(element).attr("data-city");

    loadWeatherCity(city, true);
  });
  locations = [];
}

function saveLocations(data) { //Save locations to local storage array
  var city = data.city.name; //Get city name

  locations.unshift(city);
  localStorage.setItem("locations", JSON.stringify(locations));
}

$(document).ready(function () {
  $("#weatherData").hide();//Hide div that shows weather data and display when populated

  loadLocations();//Get locations from local storage and load them into array

  $("#searchBtn").click(function (event) {//Handler for city search input
    var element = event.target;//Set element to div that was clicked
    var searchCriteria = $("#zipCode").val();

    if (searchCriteria !== "") { //check if it is empty search
      var zip = parseInt(searchCriteria);

      if (!isNaN(zip)) {
        loadWeatherZip(zip, false);//Tell user their input is not valid
      } else {
        loadWeatherCity(searchCriteria, false);
      }
    }
  });
});
