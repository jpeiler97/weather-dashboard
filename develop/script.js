//a0f17e1133e54602c691b418055fe0a4

//Base URLs for API call and weather icons
var dayBaseUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var forecastBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var iconBaseUrl = 'http://openweathermap.org/img/w/';
var apiKey = '7d741b773e77f4c369c50ab17679eb30';

var city = '';

//Global query selectors
var searchForm = $('#search-bar');
var searchBtn = $('#search-button');
var cityText = $('.city-text');
var currentDate = $('#current-date');
var fiveDay = $('.five-day');
var recentSearches = $('.recent-searches');

//Global variable to limit recent searches listed to 12
var recentSearchLength = 12;

//Getting recent cities from local storage or setting to array if local storage is empty
var recentCities = JSON.parse(localStorage.getItem('recentCities') || '[]');

//Sets newCity to most recent city in recentCities, to display whenever page reloads
var newCity = recentCities[0];

//Sets current date for current day's weather display
currentDate.text(moment().format('MM/DD/YY'));

//API Call for getting current day weather data and displaying on screen
function getDayWeather(url) {
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			//Displays requested city's name on the page
			cityText.text(newCity + ' ');

			//Gets weather symbol from data
			var weather = data.weather;
			var iconUrl = iconBaseUrl + weather[0].icon + '.png';
			var weatherEmoji = $('.weather-emoji');

			//sets source and size of weatherEmoji
			weatherEmoji.attr('src', iconUrl);
			weatherEmoji.attr('style', 'width: 75px;');

			//sets text values in current weather area to their corresponding data
			$('#day-temp').text(data.main.temp + '°F');
			$('#day-humidity').text(data.main.humidity);
			$('#day-wind-speed').text(data.wind.speed + ' MPH');
		});
}

//API Call for getting forecast weather data and displaying on screen
function getForecast(url) {
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			//Removes 5-day forecast cards that are currently displaying when getForecast() is called
			fiveDay.children().remove();

			//Goes through data list from forecast API call and only gets the forecast days that are at 3PM,
			//returning forecast data for 5 days only
			for (var i = 0; i < data.list.length; i++) {
				var timeCheck = data.list[i].dt_txt.search('15:00:00');
				if (timeCheck > -1) {
					//Creates bootstrap card to be filled with forecast data
					var forecastDay = $('<div class="card col text-white bg-primary mx-1 forecast-day">');
					var forecast = data.list[i];
					var temp = forecast.main.temp;
					var humidity = forecast.main.humidity;
					var wind = forecast.wind;

					//Gets weather symbol from forecast data
					var weather = forecast.weather;
					var iconUrl = iconBaseUrl + weather[0].icon + '.png';

					//Defines divs as bootstrap card titles to be appended to forecastDay
					var day = moment(forecast.dt_txt).format('dddd, MMMM Do');
					var dayText = $('<div class= "row-3 my-3 card-title day-text">');
					var tempText = $('<div class= "row-3 my-3 card-title temp-text">');
					var humidityText = $('<div class= "row-3 my-3 card-title humidity-text">');
					var weatherIcon = $('<img class= "icon-name" />');
					var windText = $('<div class= "row-3 my-3 card-title wind-text">');

					//sets text values and weather icons in forecast area to their corresponding data
					dayText.text(day);
					weatherIcon.attr('src', iconUrl);
					weatherIcon.attr('style', 'width: 75px;');
					tempText.text('Temperature: ' + temp + '°F');
					humidityText.text('Humidity: ' + humidity + '%');
					windText.text('Wind Speed: ' + wind.speed + ' MPH');

					//appends divs with text values to forecastDay
					forecastDay.append(dayText);
					forecastDay.append(weatherIcon);
					forecastDay.append(tempText);
					forecastDay.append(humidityText);
					forecastDay.append(windText);
				}
				//appends forecastDay to forecast area
				fiveDay.append(forecastDay);
			}
		});
}

//Adds functionality to search button
searchBtn.on('click', function() {
	//checks if search form is undefined before defining city and newCity
	if (searchForm.val() !== undefined || searchForm.val() !== ' ') {
		city = searchForm.val();
		newCity = city;
	}

	//Adds submitted city to recentCities unless it is already in the array
	if (recentCities.includes(city) === false) {
		if (recentCities.length === recentSearchLength) {
			//removes last submitted city if list has reached its max length (recentSearchLength)
			recentCities.pop();
			recentSearches.children().last().remove();
		}

		//adds submitted city to recentCities array and stores in localStorage
		recentCities.unshift(city);
		localStorage.setItem('recentCities', JSON.stringify(recentCities));

		//adds newly submitted city as a button in the recent searches list (I am using prepend so
		// that it appears as the first in the list
		recentSearches.prepend(`<button class= "list-group-item city-button">${recentCities[0]}</button>`);
		$('.city-button').on('click', function() {
			newCity = $(this).text();
			displayWeather();
		});

		//resets search form
		searchForm.val('');

		//calls displayWeather() to get APIs and display data on page
		displayWeather();
	}
});

//Gets base API urls, adds value from search submission and API key as queries, displays data from APIs
function displayWeather() {
	var dayUrl = dayBaseUrl + newCity + '&units=imperial&appid=' + apiKey;
	var forecastUrl = forecastBaseUrl + newCity + '&units=imperial&appid=' + apiKey;
	getDayWeather(dayUrl);
	getForecast(forecastUrl);
}

//Displays recentCities on page reload as buttons, unless there are no cities in recentCities array
function displayCities() {
	for (i = 0; i < recentSearchLength; i++) {
		if (recentCities[i] !== undefined) {
			recentSearches.append(`<button class= "list-group-item city-button">${recentCities[i]}</button>`);
			$('.city-button').eq(i).on('click', function() {
				newCity = $(this).text();
				displayWeather();
			});
		}
	}
}

displayCities();

//Displays weather of most recent city in local storage, unless local storage is empty
if (newCity !== undefined) {
	displayWeather();
}
