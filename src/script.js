let currentTime = new Date();
let isInCelsius = true;

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
  let date = new Date(time * 1000);
  let day = date.getDay();
  let days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  return days[day];
}



function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = response.data.daily;
  isInCelsius = true;
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {

    forecastHTML =  forecastHTML + `
  <div class="col-2">
      <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
     <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="" width=42> 
     <div class="forecast-temperature">
     <span class="forecast-temp-max">
      ${Math.round(forecastDay.temp.max)}°
      </span>
      <span class="forecast-temp-min">
      ${Math.round(forecastDay.temp.min)}°
  </span>
      </div>
  </div>
`;}
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

  let temperatureMaxElements = document.getElementsByClassName("forecast-temp-max");
  let temperatureMinElements = document.getElementsByClassName("forecast-temp-min");

  for (const maxTemp of temperatureMaxElements) {
    if (!isInCelsius) {
      maxTemp.innerHTML = convertFahrenheitToCelsius(parseInt(maxTemp.innerHTML), 10) + "°";
    }
  }

  for (const minTemp of temperatureMinElements) {
    if (!isInCelsius) {
      minTemp.innerHTML = convertFahrenheitToCelsius(parseInt(minTemp.innerHTML), 10) + "°";
    }
  }

  isInCelsius = true;
}

function convertCelsiusToFahrenheit(temp) {
  return Math.round((temp * 9) / 5 + 32);
}

function convertFahrenheitToCelsius(temp) {
  
  return Math.round((temp - 32) * 5 / 9);
}


function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#header-temperature");
  
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = convertCelsiusToFahrenheit(celsiusTemperature);
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  let temperatureMaxElements = document.getElementsByClassName("forecast-temp-max");
  let temperatureMinElements = document.getElementsByClassName("forecast-temp-min");

  for (const maxTemp of temperatureMaxElements) {
    if (isInCelsius) {
      maxTemp.innerHTML = convertCelsiusToFahrenheit(parseInt(maxTemp.innerHTML), 10) + "°";
    }
  }

  for (const minTemp of temperatureMinElements) {
    if (isInCelsius) {
      minTemp.innerHTML = convertCelsiusToFahrenheit(parseInt(minTemp.innerHTML), 10) + "°";
    }
  }

  isInCelsius = false;
}

function showYourTemperature(response) {
  let headerTemperature = document.querySelector("#header-temperature");
  let temperature = Math.round(response.data.main.temp);
  let currentCity = document.querySelector("#header-city");
  currentCity.innerHTML = response.data.name;

  headerTemperature.innerHTML = `${temperature}`;
  getForecast(response.data.coord);
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