//a0f17e1133e54602c691b418055fe0a4

var dayBaseUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var forecastBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var apiKey = '7d741b773e77f4c369c50ab17679eb30';

var city = '';
var searchForm = $('#search-bar');
var searchBtn = $('#search-button');
var cityText = $('.city-text');
var currentDate = $('#current-date');
var forecastDay = $('.forecast-day');
var recentSearchLength = 12;
var recentCities = JSON.parse(localStorage.getItem('recentCities') || '[]');
var newCity;

var recentSearches = $('.recent-searches');
currentDate.text(moment().format('MM/DD/YY'));

function searchClick() {}

function getDayWeather(url) {
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log(data);
			cityText.text(newCity + ' ');
			$('#day-temp').text(data.main.temp);
			$('#day-humidity').text(data.main.humidity);
			$('#day-wind-speed').text(data.wind.speed + ' MPH');
		});
}

function getForecast(url) {
	fetch(url)
		.then(function(response) {
			console.log(response);
			return response.json();
		})
		.then(function(data) {
			console.log(data);
			forecastDay.each(function(i) {
				var forecastDate = moment().add(i + 1, 'days').format('MM/DD/YY');
				$('.weather-date').text(forecastDate);
				$('.temp-data').text(data.list[i + 1].weather.icon);
			});
		});
}

function init() {}
searchBtn.on('click', function() {
	if (searchForm.val() !== undefined || searchForm.val() !== '') {
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
			displayOneDay();
		});
		searchForm.val('');
		displayOneDay();
	}
});

function displayOneDay() {
	var dayUrl = dayBaseUrl + newCity + '&appid=' + apiKey;
	var forecastUrl = forecastBaseUrl + newCity + '&appid=' + apiKey;
	getDayWeather(dayUrl);
	getForecast(forecastUrl);
}

function displayCities() {
	for (i = 0; i < recentSearchLength; i++) {
		if (recentCities[i] !== undefined) {
			recentSearches.append(`<button class= "list-group-item city-button">${recentCities[i]}</button>`);
			$('.city-button').on('click', function() {
				newCity = $(this).text();
				displayOneDay();
			});
		}
	}
}

displayCities();
