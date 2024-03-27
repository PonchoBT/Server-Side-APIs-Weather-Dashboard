// Get references to HTML elements
var currentWeatherTitle = document.querySelector(".current-weather h2");
var temperatureDisplay = document.getElementById("temperature");
var windDisplay = document.getElementById("wind");
var humidityDisplay = document.getElementById("humidity");
var forecastDateDisplay = document.getElementById("date");
var forecastWeatherIconDisplay = document.getElementById("weather-icon");
var forecastTemperatureDisplay = document.getElementById("temperature-forecast");
var forecastWindDisplay = document.getElementById("wind-forecast");
var forecastHumidityDisplay = document.getElementById("humidity-forecast");
var searchButton = document.getElementById("search-button");
var citySearchInput = document.getElementById("city-search");
var citiesList = document.getElementById("cities-list");

// Obtain the user's location automatically and then obtain the weather
function getGeolocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      // Get weather based on location coordinates
      getCityWeatherByCoordinates(latitude, longitude);
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Function to obtain the weather based on location coordinates
function getCityWeatherByCoordinates(latitude, longitude) {
  var apiKey = "7e61a7fccba2a2c3c75138ba3b23d2a1";
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    apiKey;

  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch data");
      }
    })
    .then((data) => {
      // Get the name of the city based on API data
      var cityName = data.name;
      // Get the current weather and weather forecast for the current location.
      getCityWeather(cityName);
      getWeatherForecast(cityName);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to get the weather of a city and update the user interface
function getCityWeather(cityName) {
  var apiKey = "7e61a7fccba2a2c3c75138ba3b23d2a1";
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" +
    encodeURIComponent(cityName) +
    "&appid=" +
    apiKey;

  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch data");
      }
    })
    .then((data) => {
      // Update the user interface with the current weather data
      var currentDate = new Date().toLocaleDateString();
      var currentWeatherIcon = getWeatherIcon(data.weather[0].icon);
      currentWeatherTitle.textContent =
        cityName + " (" + currentDate + ") " + currentWeatherIcon;
      temperatureDisplay.textContent = "Temp: " + data.main.temp + " °C";
      windDisplay.textContent = "Wind: " + data.wind.speed + " m/s";
      humidityDisplay.textContent = "Humidity: " + data.main.humidity + " %";
    })
    .catch((error) => {
      // Error handling
      console.error("Error fetching data:", error);
      currentWeatherTitle.textContent = "Error: Failed to fetch data";
      temperatureDisplay.textContent = "Temp: N/A";
      windDisplay.textContent = "Wind: N/A";
      humidityDisplay.textContent = "Humidity: N/A";
    });
}

// Function to obtain the cities stored in the localStorage
function getStoredCities() {
  var storedCities = localStorage.getItem("cities");
  return storedCities ? JSON.parse(storedCities) : [];
}

// Function to display the cities stored in the list
function displayStoredCities() {
  var storedCities = getStoredCities();
  storedCities.forEach(function (cityName) {
    var cityItem = document.createElement("li");
    cityItem.textContent = cityName;
    citiesList.appendChild(cityItem);
    // Call the function to obtain the weather of the selected city
    cityItem.addEventListener("click", function () {
      getCityWeather(cityName);
    });
  });
}

displayStoredCities();

citiesList.addEventListener("click", function (event) {
  // Check if the click occurred on a list element
  if (event.target.tagName === "LI") {
    var cityName = event.target.textContent;

    // Get the weather forecast for the selected city
    getWeatherForecast(cityName);
  }
});

function showAlert(message) {
  var alertBox = document.getElementById("alert");
  var alertMessage = alertBox.querySelector("strong");
  alertMessage.textContent = message;
  // Show the alert
  alertBox.style.display = "block";
  setTimeout(function () {
    //Hide the alert after 2 seconds
    alertBox.style.display = "none";
    // 2000 milliseconds = 2 seconds
  }, 2000);
}

// Add click event to search button
searchButton.addEventListener("click", function () {
  var cityName = citySearchInput.value.trim(); 
  // Trim to remove leading/trailing spaces
  if (cityName === "") {
    showAlert("Please enter a valid city");
    return; // Exit the function early if the city name is empty
  }
  // Clear the search input after clicking the search button
  citySearchInput.value = "";
  // Call the function to obtain the city weather.
  getCityWeather(cityName);

  // Add the city to the list of cities and store it in localStorage
  var cityItem = document.createElement("li");
  cityItem.textContent = cityName;
  citiesList.appendChild(cityItem);
  cityItem.addEventListener("click", function () {
    // Call the function to obtain the weather of the selected city
    getCityWeather(cityName);
  });

  var storedCities = getStoredCities();
  storedCities.push(cityName);
  localStorage.setItem("cities", JSON.stringify(storedCities));

  // Get the weather forecast for the selected city after obtaining the current weather
  getWeatherForecast(cityName);
});


// Function to obtain the 5-day weather forecast
function getWeatherForecast(cityName) {
  var apiKey2 = "7e61a7fccba2a2c3c75138ba3b23d2a1";
  var apiUrl2 =
    "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=" +
    encodeURIComponent(cityName) +
    "&appid=" +
    apiKey2;

  fetch(apiUrl2)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch data");
      }
    })
    .then((data) => {
      // Show weather forecast for the next 5 days
      displayWeatherForecast(data);
    })
    .catch((error) => {
      // Handling errors
      console.error("Error fetching data:", error);
      currentWeatherTitle.textContent = "Error: Failed to fetch data";
      temperatureDisplay.textContent = "Temp: N/A";
      windDisplay.textContent = "Wind: N/A";
      humidityDisplay.textContent = "Humidity: N/A";
    });
}

// Function for displaying the weather forecast in the user interface
function displayWeatherForecast(data) {
  var forecastGrid = document.querySelector(".forecast-grid");
  // Clear previous content
  forecastGrid.innerHTML = "";

  // Iterate over the forecast data for the next 5 days
  for (let i = 0; i < 5; i++) {
    // Select the forecast for each day
    const forecast = data.list[i * 8];

    // Create an element for the prognostic card
    var forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");
    
    var dateElement = document.createElement("div");
    dateElement.id = "date" + (i + 1);
    forecastCard.appendChild(dateElement);

    var weatherIconElement = document.createElement("div");
    weatherIconElement.id = "weather-icon" + (i + 1);
    forecastCard.appendChild(weatherIconElement);

    var temperatureElement = document.createElement("div");
    temperatureElement.id = "temperature" + (i + 1);
    forecastCard.appendChild(temperatureElement);

    var windElement = document.createElement("div");
    windElement.id = "wind" + (i + 1);
    forecastCard.appendChild(windElement);

    var humidityElement = document.createElement("div");
    humidityElement.id = "humidity" + (i + 1);
    forecastCard.appendChild(humidityElement);

    forecastGrid.appendChild(forecastCard);
  }

  // Update the content of the elements with the forecast data
  for (let i = 0; i < 5; i++) {
    // Select the forecast for each day
    const forecast = data.list[i * 8];

    // Get references to the HTML elements corresponding to each day
    var dateDisplay = document.getElementById("date" + (i + 1));
    var weatherIconDisplay = document.getElementById("weather-icon" + (i + 1));
    var temperatureDisplay = document.getElementById("temperature" + (i + 1));
    var windDisplay = document.getElementById("wind" + (i + 1));
    var humidityDisplay = document.getElementById("humidity" + (i + 1));

    // Update the content of the elements with the forecast data
    dateDisplay.textContent = new Date(forecast.dt * 1000).toLocaleDateString();
    weatherIconDisplay.textContent = getWeatherIcon(forecast.weather[0].icon);
    temperatureDisplay.textContent = "Temp: " + forecast.main.temp + " °C";
    windDisplay.textContent = "Wind: " + forecast.wind.speed + " m/s";
    humidityDisplay.textContent = "Humidity: " + forecast.main.humidity + " %";
  }
}
// Function to obtain the weather icon
function getWeatherIcon(iconCode) {
  const icons = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "⛅",
    "03d": "🌥️",
    "03n": "🌥️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌦️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "🌨️",
    "13n": "🌨️",
    "50d": "🌫️",
    "50n": "🌫️",
  };
  // Return the corresponding icon or '❓' for unknown
  return icons[iconCode] || "❓";
}

// Call the function to get the user's location and then the weather.
getGeolocationAndWeather();
