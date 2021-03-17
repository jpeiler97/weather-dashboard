//a0f17e1133e54602c691b418055fe0a4

var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?';
var apiKey = 'a0f17e1133e54602c691b418055fe0a4';

var city = '';
var searchForm = $('#search-bar');
var searchBtn = $('#search-button');
var cityText = $('.city-text');
var currentDate = $('#current-date');
currentDate.text(moment().format('MM/DD/YY'));

function searchClick() {}

var url = `${apiUrl}q=${city}&appid=${apiKey}`;

function getApi(url) {
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log(data.main.temp);
		});
}

searchBtn.on('click', function() {
	city = searchForm.val();
	url = apiUrl + 'q=' + city + '&appid=' + apiKey;
	console.log(url);
	getApi(url);
});
