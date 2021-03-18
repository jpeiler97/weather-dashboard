//a0f17e1133e54602c691b418055fe0a4

var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?';
var apiKey = 'a0f17e1133e54602c691b418055fe0a4';

var city = '';
var searchForm = $('#search-bar');
var searchBtn = $('#search-button');
var cityText = $('.city-text');
var currentDate = $('#current-date');
var recentSearchLength = 12;
var recentCities = JSON.parse(localStorage.getItem('recentCities') || '[]');
var newCity;

var recentSearches = $('.recent-searches');
currentDate.text(moment().format('MM/DD/YY'));

function searchClick() {}

function getApi(url) {
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
			$(this).attr('style', 'background-color: red');
		});
		searchForm.val('');
		displayOneDay();
	}

	// url = apiUrl + 'q=' + city + '&appid=' + apiKey;
	// console.log(url);
	// getApi(url);
});

function displayOneDay() {
	var url = apiUrl + 'q=' + newCity + '&appid=' + apiKey;
	getApi(url);
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
