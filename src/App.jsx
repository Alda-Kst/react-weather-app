import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./index.css";
import WeatherSkeleton from "./components/WeatherSkeleton";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState("");

  const fetchWeatherData = useCallback(async (cityName) => {
    if (!cityName) return;
    
    setLoading(true);
    setError("");
    try {
      const key = process.env.REACT_APP_WEATHER_API_KEY;
      
      // 1. Resolve city name to coordinates
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${key}`
      );

      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error("City not found");
      }

      const { lat, lon } = geoResponse.data[0];

      // 2. Fetch weather and forecast using lat/lon
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
      );
      
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
      );

      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data);
      
      // Save city in localStorage
      localStorage.setItem("lastCity", cityName);
    } catch (err) {
      setWeather(null);
      setForecast(null);
      setError("City not found. Please try again!");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      fetchWeatherData(savedCity);
    }
  }, [fetchWeatherData]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    fetchWeatherData(city);
    setCity(""); 
  };

  // Toggle Dark/Light mode
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Update body class for theme
  useEffect(() => {
    document.body.className = `${theme} animate-gradient`;
  }, [theme]);

  return (
    <div className={`backdrop-blur-md p-6 sm:p-10 rounded-[2rem] w-full max-w-[420px] text-center box-border border shadow-[0_10px_40px_rgba(0,96,100,0.1)] transition-all duration-300 ${
      theme === "light" 
        ? "bg-white/55 border-white/40 text-[#006064]" 
        : "bg-[#001219]/85 border-[#94d2bd]/10 text-[#94d2bd]"
    }`}>
      <h1 className="mt-0 mb-6 font-bold tracking-[-0.5px] text-[1.4rem] md:text-2xl">Daily Weather App</h1>
      
      <button 
        className={`mb-8 px-[22px] py-[10px] rounded-[25px] cursor-pointer font-montserrat font-semibold text-[0.85rem] transition-all duration-300 ${
          theme === "light" 
            ? "bg-[#006064]/[0.05] border border-black/[0.05] text-[#006064]" 
            : "bg-[#94d2bd]/10 border border-transparent text-[#94d2bd]"
        }`}
        onClick={toggleTheme}
      >
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g. Athens)"
          className={`p-[0.9rem] w-full font-montserrat text-sm sm:text-base rounded-[14px] outline-none box-border mb-[15px] transition-all duration-300 ${
            theme === "light"
              ? "border border-[#006064]/10 bg-white/50 text-[#006064] placeholder:text-[#006064]/50"
              : "bg-white/[0.05] text-white border border-[#94d2bd]/20 placeholder:text-white/40"
          }`}
        />
        <button 
          type="submit"
          className={`p-[0.9rem_1.5rem] rounded-[14px] border-none font-montserrat font-bold cursor-pointer w-full transition-all duration-300 mb-[10px] transform hover:-translate-y-0.5 ${
            theme === "light"
              ? "bg-[#00838f] text-white shadow-[0_4px_15px_rgba(0,131,143,0.3)] hover:bg-[#006064]"
              : "bg-[#00afb9] text-[#001219] shadow-[0_4px_15px_rgba(0,175,185,0.4)] hover:bg-[#94d2bd]"
          }`}
        >
          Search
        </button>
      </form>
      
      {error && <p className="text-red-500 mt-2 font-medium">{error}</p>}
      {loading && <WeatherSkeleton />}

      {weather && (
        <div className="mt-8 p-6 bg-white/[0.05] rounded-[20px]">
          <h2 className="text-xl font-bold mb-2">{weather.name}, {weather.sys.country}</h2>
          
          <img 
            className="weather-icon mx-auto my-0"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt={weather.weather[0].description} 
          />
          
          <p className="description capitalize opacity-90 mb-4">{weather.weather[0].description}</p>
          
          {/* Temperature Container */}
          <div className="temp-container flex justify-center items-center gap-[15px] text-[2.2rem] font-bold">
            <div className="temp-item flex items-center">
              <span className="temp-value">{Math.round(weather.main.temp)}</span>
              <span className={`temp-unit text-[1.2rem] ml-1 ${theme === "light" ? "text-[#00838f]" : "text-[#00afb9]"}`}>°C</span>
            </div>
            <div className="temp-separator font-light opacity-40">|</div>
            <div className="temp-item flex items-center">
              <span className="temp-value">{Math.round((weather.main.temp * 9) / 5 + 32)}</span>
              <span className={`temp-unit text-[1.2rem] ml-1 ${theme === "light" ? "text-[#00838f]" : "text-[#00afb9]"}`}>°F</span>
            </div>
          </div>

          {/* Extra Info Section - Humidity & Wind */}
          <div className={`extra-info mt-[15px] pt-[15px] flex justify-between items-center gap-6 px-6 border-t ${
            theme === "light" ? "border-[#006064]/10" : "border-[#94d2bd]/10"
          }`}>
            <div className="info-item text-[0.65rem] font-semibold uppercase tracking-[0.5px] opacity-80 whitespace-nowrap">
              Humidity: {weather.main.humidity}%
            </div>
            <div className="info-item text-[0.65rem] font-semibold uppercase tracking-[0.5px] opacity-80 whitespace-nowrap">
              Wind: {weather.wind.speed} m/s
            </div>
          </div>
        </div>
      )}

      {/* 5-Day Forecast Section */}
      {forecast && (
        <div className="mt-6 p-4 bg-white/[0.05] rounded-[20px]">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-80">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-2">
            {forecast.list
              .filter((reading) => reading.dt_txt.includes("12:00:00"))
              .map((day, index) => {
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                
                return (
                  <div key={index} className="flex flex-col items-center justify-center p-2 bg-white/[0.03] rounded-xl">
                    <span className="text-xs font-semibold opacity-70">{dayName}</span>
                    <img 
                      className="w-10 h-10 my-1"
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                      alt={day.weather[0].description} 
                    />
                    <span className="text-xs font-bold">{Math.round(day.main.temp)}°</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;