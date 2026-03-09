import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  // Fetch weather data from API
  const fetchWeather = async (e) => {
    if (e) e.preventDefault();
    if (!city) return;
    
    setLoading(true);
    try {
      const key = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      setWeather(null);
      alert("City not found. Please try again!");
    }
    setLoading(false);
  };

  // Toggle Dark/Light mode
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Update body class for theme
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="container">
      <h1>Daily Weather App</h1>
      
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>

      {/* Search form */}
      <form onSubmit={fetchWeather}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (e.g. Athens)"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="loading-text">Loading...</p>}

      {weather && (
        <div className="weather">
          <h2>{weather.name}</h2>
          
          <img 
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt={weather.weather[0].description} 
          />
          
          <p className="description">{weather.weather[0].description}</p>
          
          {/* Temperature Container */}
          <div className="temp-container">
            <div className="temp-item">
              <span className="temp-value">{Math.round(weather.main.temp)}</span>
              <span className="temp-unit">°C</span>
            </div>
            <div className="temp-separator">|</div>
            <div className="temp-item">
              <span className="temp-value">{Math.round((weather.main.temp * 9) / 5 + 32)}</span>
              <span className="temp-unit">°F</span>
            </div>
          </div>

          {/* Extra Info Section - Humidity & Wind */}
          <div className="extra-info">
            <div className="info-item">Humidity: {weather.main.humidity}%</div>
            <div className="info-item">Wind: {weather.wind.speed} m/s</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;