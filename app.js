const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");


searchButton.addEventListener("click", (e) => {
	e.preventDefault();
	Weather(searchInput.value);
	searchInput.value = "";
});


// SEARCH CITY
const Weather = async (city) => {
	try {
		// FETCH WEATHER DATA
		const response = await fetch(
			`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
		);

		// CONVERT WEATHER DATA TO JSON
		const data = await response.json();

		// SET WEATHER DATA AND DISPLAY IT
		weather.temperature.value = Math.floor(data.main.temp - KELVIN);
		weather.description = data.weather[0].description;
		weather.iconId = data.weather[0].icon;
		weather.city = data.name;
		weather.country = data.sys.country;
		displayWeather();
	} catch (error) {
		alert("City not found !");
	}
};


// APP DATA
const weather = {};

weather.temperature = {
	unit: "celsius",
};

const KELVIN = 273;
// API KEY
const key = "568500e27fd0292bc96787459908b3aa";


// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
	notificationElement.style.display = "block";
	notificationElement.innerHTML =
		"<p>Browser doesn't Support Geolocation. Enter location manually</p>";
}


// SET USER'S POSITION
function setPosition(position) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;

	getWeather(latitude, longitude);
}


// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
	notificationElement.style.display = "block";
	notificationElement.innerHTML = `<p> ${error.message} </p>`;
}


// GET WEATHER FROM API
function getWeather(latitude, longitude) {
	let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

	fetch(api)
	.then(function (response) {
		let data = response.json();
		return data;
	})
	.then(function (data) {
		weather.temperature.value = Math.floor(data.main.temp - KELVIN);
		weather.description = data.weather[0].description;
		weather.iconId = data.weather[0].icon;
		weather.city = data.name;
		weather.country = data.sys.country;

		const today = new Date();
        const date = document.querySelector(".date");
        date.innerText = dateFunction(today);
	})
	.then(function () {
		displayWeather();
	});
}


// DISPLAY WEATHER
function displayWeather() {
	iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
	tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
	descElement.innerHTML = weather.description;
	locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}


// C to F conversion
function celsiusToFahrenheit(temperature) {
	return (temperature * 9) / 5 + 32;
}


// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function () {
	if (weather.temperature.value === undefined) return;

	if (weather.temperature.unit == "celsius") {
		let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
		fahrenheit = Math.floor(fahrenheit);

		tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
		weather.temperature.unit = "fahrenheit";
	} else {
		tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
		weather.temperature.unit = "celsius";
	}
});


// DAY AND DATE
function dateFunction (d) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
}