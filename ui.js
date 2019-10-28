const weatherContainer = document.querySelector('.weather-details');
const currentWeather = document.querySelector('.weather-details-current');
const forecastWeatherList = document.querySelector('#forecast-list');
const error = document.querySelector('.error');

const convertUnixToTime = time => {
	let convertedTime = moment.unix(time);
	return moment(convertedTime).format('kk:ss');
};

const convertUnixToDay = time => {
	let convertedTime = moment.unix(time);
	return moment(convertedTime).format('dddd');
};

const capitalize = s => {
	if (typeof s !== 'string') return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
};

const displayError = err => {
	if (err) {
		// weatherContainer.classList.add('hide');
		error.innerHTML = 'No such city. Please try again.';
		if (error.classList.contains('hide')) {
			error.classList.remove('hide');
		}
	}
};

const updateCity = async city => {
	const weather = await getWeather(city);
	const forecast = await getForecast(city);

	return {
		weather,
		forecast
	};
};

const updateUI = data => {
	const { weather, forecast } = data;

	// Hide error message and weather details container
	if (!error.classList.contains('hide')) {
		error.classList.add('hide');
		weatherContainer.classList.add('hide');
	}

	// Update current weather
	currentWeather.innerHTML = `
		<p>${Math.floor(weather.main.temp)} &deg;C</p>
		<p>${weather.name}</p>
		<p>${capitalize(weather.weather[0].description)}</p>
		<div>
			<p>Sunrise: ${convertUnixToTime(weather.sys.sunrise)}</p>
			<p>Sunset: ${convertUnixToTime(weather.sys.sunset)}</p>
		</div>
	`;

	// Filtering out one forcast out of six, per day.
	const filteredForecast = forecast.list.filter(item => {
		return convertUnixToTime(item.dt) === '13:00';
	});

	console.log('FilteredItems', filteredForecast);

	// Reset forecast weather
	forecastWeatherList.innerHTML = '';

	// Update forecast weather
	filteredForecast.forEach(item => {
		forecastWeatherList.innerHTML += `
		<li>
			<div>${convertUnixToDay(item.dt)}</div>&nbsp;
			<div>
				<img class="icon" src="https://openweathermap.org/img/wn/${
					item.weather[0].icon
				}@2x.png" alt="Weather icon">&nbsp;
			</div>
			<div>${Math.floor(item.main.temp)} &deg;C</div>
		</li>`;
	});

	// Display weather details container
	if (weatherContainer.classList.contains('hide')) {
		weatherContainer.classList.remove('hide');
	}

	console.log(data);
};
