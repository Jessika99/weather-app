

let currentTime = new Date();

function formatTime(time) {
  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  let day = days[time.getDay()];
  let hour = time.getHours();
  let minute = time.getMinutes();
  let formattedTime = `${day}, ${hour}:${minute}`;

  return formattedTime;
}

function showPosition() {
  let headerCity = document.querySelector("#header-city");
  let searchInput = document.querySelector("#search-input");
  headerCity.innerHTML = searchInput.value;
}

function showSearchTemperature(response) {
  let headerTemperature = document.querySelector("#header-temperature");
  let temperature = Math.round(response.data.main.temp);
  let iconElement = document.querySelector("#weather-icon");

  iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  icon.Element.setAttribute("alt", `${response.data.weather[0].description}`);
  headerTemperature.innerHTML = `${temperature}°`;
  
}

function handleForm(event) {
  event.preventDefault();
  showPosition();
  let searchInput = document.querySelector("#search-input");
  let city = searchInput.value;
  let apiKey = "42182c51698ff768edc6fa80ece8d4d3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showSearchTemperature);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElements = document.getElementsByClassName("card-text");
  for (const t of temperatureElements) {
    t.innerHTML = "19°";
  }
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElements = document.getElementsByClassName("card-text");
  for (const t of temperatureElements) {
    t.innerHTML = "66°";
  }
}

function showYourTemperature(response) {
  let headerTemperature = document.querySelector("#header-temperature");
  let temperature = Math.round(response.data.main.temp);
  let currentCity = document.querySelector("#header-city");
  currentCity.innerHTML = response.data.name;

  headerTemperature.innerHTML = `${temperature}°`;
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


