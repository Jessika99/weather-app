let currentTime = new Date();

function formatTime(time) {
  let date = new Date(time);
  let hour = date.getHours();
  if (hour <10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];
  let formattedTime = `${day} ${hour}:${minute}`;

  return formattedTime;
}

function formatDay(time) {
  let date = new Date(time *1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    
  ];

  return days(day);
}

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  days.forEach(function (day) {
    forecastHTML =  forecastHTML + `
  <div class="col-2">
      <div class="forecast-date">${day}</div>
     <img src="https://duckduckgo.com/assets/weather/icons/clear-night.svg" alt=""> 
     <div class="forecast-temperature">
     <span class="forecast-temp-max">
         18
      </span>
      <span class="forecast-temp-min">
      12
  </span>
      </div>
  </div>
`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  
}

function getForecast(coordinates) {

  let apiKey = "42182c51698ff768edc6fa80ece8d4d3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function showPosition() {
  let headerCity = document.querySelector("#header-city");
  let searchInput = document.querySelector("#search-input");
  headerCity.innerHTML = searchInput.value;
}

function showSearchTemperature(response) {
  let headerTemperature = document.querySelector("#header-temperature");
  let cityElement = document.querySelector("#header-city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind-speed");
  let dateElement = document.querySelector("#current-time");
  let iconElement = document.querySelector("#weather-icon");


  celsiusTemperature = response.data.main.temp;

  

  headerTemperature.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  windElement.innerHTML = response.data.wind.speed;
  dateElement.innerHTML = formatTime(response.data.dt * 1000);

  getForecast(response.data.coord);
  
}

function search(city) {
  let apiKey = "42182c51698ff768edc6fa80ece8d4d3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  axios.get(apiUrl).then(showSearchTemperature);
}

function handleForm(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  search(searchInput.value);
}

function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#header-temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  }

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#header-temperature");
  
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showYourTemperature(response) {
  let headerTemperature = document.querySelector("#header-temperature");
  let temperature = Math.round(response.data.main.temp);
  let currentCity = document.querySelector("#header-city");
  currentCity.innerHTML = response.data.name;

  headerTemperature.innerHTML = `${temperature}`;
}

function handleYourPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "42182c51698ff768edc6fa80ece8d4d3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showYourTemperature);
}

function displayTemperature(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleYourPosition);
}

let celsiusTemperature = null;

let time = document.querySelector("#current-time");
time.innerHTML = formatTime(currentTime);

let form = document.querySelector("form");
form.addEventListener("submit", handleForm);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let yourLocationButton = document.querySelector("#current-location-button");
yourLocationButton.addEventListener("click", displayTemperature);

search("New York");