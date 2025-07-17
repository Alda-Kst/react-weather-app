
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const apiKey = "3f50a0b7f8377a6e9c611ce988ec75e5";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      setWeather(null);
      alert("City not found");
    }
    setLoading(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="container">
      <h1>Daily Weather App</h1>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={fetchWeather}>Search</button>

      {loading && <p>Loading...</p>}

      {weather && (
        <div className="weather">
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>{weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
}

export default App;
