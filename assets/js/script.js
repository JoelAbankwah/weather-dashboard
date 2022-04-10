var userFormEl = document.querySelector('#user-form');
var cityEl = document.querySelector('#city');
var forecastEl = document.querySelector("#five-day-forcast");

var getCityCoordinates = function(event){
    event.preventDefault();
    if (cityEl.value){
        var coordinatesApiURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityEl.value.toLowerCase() + "&appid=0c03238cfd49d5089791230ebb0a1f08"
        fetch(coordinatesApiURL).then(function(response){
            if (response.ok) {
                response.json().then(function(data) {
                    var lattitude = data[0].lat
                    var longitude = data[0].lon
                    getCityWeather(lattitude, longitude)
                })
            }
        })
    }
    else {
        console.log('nah')
    }
}

var getCityWeather = function(lat, lon) {
    apiUrl = 'http://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=0c03238cfd49d5089791230ebb0a1f08'
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data)
                getCurrentWeather(data)
            })
        }
    })
}

var getCurrentWeather = function(weather) {
   var cityNameEl = document.querySelector("#city-name");
   cityNameEl.textContent = cityEl.value + " " + moment().format('(M/D/YYYY)');

   var iconImg = document.getElementById('weather-icon');
   iconImg.setAttribute('src', 'http://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '@2x.png');
   iconImg.setAttribute('class', 'mark p-0 icon');

   cityEl.value = '';

    var tempEl = document.querySelector("#temp");
    tempEl.textContent = "Temp: " +  weather.current.temp + '°F';

    var windEl = document.querySelector("#wind");
    windEl.textContent = "Wind: " +  weather.current.wind_speed + ' MPH';

    var humidityEl = document.querySelector("#humidity");
    humidityEl.textContent = "Humidity: " + weather.current.humidity + ' %';

    var UVEl = document.querySelector("#uv-index");
    UVEl.textContent = weather.current.uvi;

    if (weather.current.uvi <= 2) {
        UVEl.classList.add('bg-success');
    }
    else if (weather.current.uvi > 2 || weather.current.uvi < 8) {
        UVEl.classList.add('bg-warning');
    }
    else {
        UVEl.classList.add('bg-danger');
    };
    getFiveDayForecast(weather);
};

var getFiveDayForecast = function(weather){
    removeAllChildNodes(forecastEl);
    for (var i=0; i < 5; i++){
        var cardEl = document.createElement('div');
        cardEl.setAttribute('class', 'bg-dark text-light card w-100 mr-4 p-2')

        var dateEl = document.createElement('h3');
        dateEl.setAttribute('class', 'mb-0 font-weight-bold')
        dateEl.textContent = moment().add(i + 1, 'd').format('M/D/YYYY')

        cardEl.appendChild(dateEl);

        var iconEl = document.createElement('img');
        iconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + weather.daily[i].weather[0].icon + '@2x.png');
        iconEl.setAttribute('class', 'mark p-0 icons mb-2');

        cardEl.appendChild(iconEl);

        tempEl = document.createElement('p');
        tempEl.textContent = 'Temp: ' + weather.daily[i].temp.day + '°F';

        cardEl.appendChild(tempEl)


        windEl = document.createElement('p')
        windEl.textContent = 'Wind: ' + weather.daily[i].wind_speed + ' MPH'

        cardEl.appendChild(windEl)

        humidityEl = document.createElement('p')
        humidityEl.textContent = "Humidity " + weather.daily[i].humidity + ' %'

        cardEl.appendChild(humidityEl)

        forecastEl.appendChild(cardEl)
 
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
userFormEl.addEventListener("submit", getCityCoordinates);
