//a0f17e1133e54602c691b418055fe0a4

var dayBaseUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var forecastBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var iconBaseUrl = 'http://openweathermap.org/img/w/';
var apiKey = '7d741b773e77f4c369c50ab17679eb30';

var city = '';
var searchForm = $('#search-bar');
var searchBtn = $('#search-button');
var cityText = $('.city-text');
var currentDate = $('#current-date');
var fiveDay = $('.five-day');

var recentSearchLength = 12;
var recentCities = JSON.parse(localStorage.getItem('recentCities') || '[]');

var newCity = recentCities[0];

var recentSearches = $('.recent-searches');
currentDate.text(moment().format('MM/DD/YY'));

function searchClick() {}

function getDayWeather(url) {
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			cityText.text(newCity + ' ');
			var weather = data.weather;
			var iconUrl = iconBaseUrl + weather[0].icon + '.png';
			var weatherEmoji = $('.weather-emoji');
			weatherEmoji.attr('src', iconUrl);
			weatherEmoji.attr('style', 'width: 75px;');
			$('#day-temp').text(data.main.temp);
			$('#day-humidity').text(data.main.humidity);
			$('#day-wind-speed').text(data.wind.speed + ' MPH');
		});
}

function getForecast(url) {
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log('getting data');
			fiveDay.children().remove();
			for (var i = 0; i < data.list.length; i++) {
				var timeCheck = data.list[i].dt_txt.search('15:00:00');
				if (timeCheck > -1) {
					var forecastDay = $('<div class="card col text-white bg-primary mx-1 forecast-day">');
					var forecast = data.list[i];
					var temp = forecast.main.temp;
					var humidity = forecast.main.humidity;
					var wind = forecast.wind;
					var weather = forecast.weather;
					var iconUrl = iconBaseUrl + weather[0].icon + '.png';
					var day = moment(forecast.dt_txt).format('dddd, MMMM Do');
					var dayText = $('<div class= "row-3 my-3 card-title day-text">');
					var tempText = $('<div class= "row-3 my-3 card-title temp-text">');
					var humidityText = $('<div class= "row-3 my-3 card-title humidity-text">');
					var weatherIcon = $('<img class= "icon-name" />');
					var windText = $('<div class= "row-3 my-3 card-title wind-text">');

					dayText.text(day);
					weatherIcon.attr('src', iconUrl);
					weatherIcon.attr('style', 'width: 75px;');
					tempText.text('Temperature: ' + temp);
					humidityText.text('Humidity: ' + humidity + '%');
					windText.text('Wind Speed: ' + wind.speed + 'MPH');
					forecastDay.append(dayText);
					forecastDay.append(weatherIcon);
					forecastDay.append(tempText);
					forecastDay.append(humidityText);

					forecastDay.append(windText);
				}

				fiveDay.append(forecastDay);
			}
		});
}

function init() {}
searchBtn.on('click', function() {
	if (searchForm.val() !== undefined || searchForm.val() !== ' ') {
		city = searchForm.val();
		newCity = city;
	}

	if (recentCities.includes(city) === false) {
		if (recentCities.length === recentSearchLength) {
			recentCities.pop();
			recentSearches.children().last().remove();
		}
		recentCities.unshift(city);
		localStorage.setItem('recentCities', JSON.stringify(recentCities));
		recentSearches.prepend(`<button class= "list-group-item city-button">${recentCities[0]}</button>`);
		$('.city-button').on('click', function() {
			newCity = $(this).text();
			displayWeather();
		});
		searchForm.val('');
		displayWeather();
	}
});

function displayWeather() {
	var dayUrl = dayBaseUrl + newCity + '&appid=' + apiKey;
	var forecastUrl = forecastBaseUrl + newCity + '&appid=' + apiKey;
	getDayWeather(dayUrl);
	getForecast(forecastUrl);
}

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
if (newCity !== undefined) {
	displayWeather();
}
