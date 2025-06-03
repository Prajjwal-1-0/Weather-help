import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';

import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

// Define icons map outside component to be accessible by App.jsx
export const allIcons = {
  "01d": clear_icon,
  "01n": clear_icon,
  "02d": cloud_icon,
  "02n": cloud_icon,
  "03d": cloud_icon,
  "03n": cloud_icon,
  "04d": drizzle_icon,
  "04n": drizzle_icon,
  "09d": rain_icon,
  "09n": rain_icon,
  "10d": rain_icon,
  "10n": rain_icon,
  "13d": snow_icon,
  "13n": snow_icon,
};

const Weather = ({ onLocationUpdate, currentLocation }) => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(() => currentLocation || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if (city.trim() === '') {
      alert('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=77fb2e0df253ea07038ceac4c8d8f511`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'City not found');
        setWeatherData(null);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      const weatherInfo = {
        humidity: data.main.humidity,
        temperature: Math.floor(data.main.temp),
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        location: data.name,
        icon: icon
      };
      setWeatherData(weatherInfo);
      onLocationUpdate && onLocationUpdate(data);
    } catch (err) {
      setError('Failed to fetch weather data.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentLocation) {
      setWeatherData(currentLocation);
    } else {
      // Only search for default city if there's no current location
      search('NewYork');
    }
  }, [currentLocation]);

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='Search' />
        <img src={search_icon} alt="Search" onClick={() => search(inputRef.current.value)} />
      </div>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && !loading && !error && (
        <div>
          <h2 className='city-name'>{weatherData.name || weatherData.location}</h2>
          <img src={weatherData.icon} alt="Weather Icon" className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind Speed" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
