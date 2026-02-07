/**
 * useWeather Hook v8.0
 * Fetches weather data for personalized greetings
 * Uses OpenWeatherMap API or mock data
 */

import { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'clear';
  icon: string;
  city: string;
  humidity: number;
  feelsLike: number;
}

// Weather emoji map
const weatherIcons: Record<string, string> = {
  sunny: '☀️',
  clear: '🌙',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '❄️',
};

// Mock weather based on time (simulates real API)
const getMockWeather = (city: string): WeatherData => {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;
  const temp = Math.floor(20 + Math.random() * 15); // 20-35°C
  
  // Simulate seasonal conditions
  const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'sunny', 'sunny', 'cloudy'];
  const condition = isNight ? 'clear' : conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    temp,
    condition,
    icon: weatherIcons[condition],
    city,
    humidity: Math.floor(40 + Math.random() * 40),
    feelsLike: temp + Math.floor(Math.random() * 4) - 2,
  };
};

export function useWeather(city: string = 'Vadodara') {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // Check for cached weather (valid for 30 mins)
        const cached = localStorage.getItem('lis_weather');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            setWeather(data);
            setLoading(false);
            return;
          }
        }

        // Try OpenWeatherMap API if key exists
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        
        if (apiKey) {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${apiKey}`
          );
          
          if (response.ok) {
            const data = await response.json();
            const weatherData: WeatherData = {
              temp: Math.round(data.main.temp),
              condition: mapWeatherCondition(data.weather[0].main),
              icon: weatherIcons[mapWeatherCondition(data.weather[0].main)],
              city: data.name,
              humidity: data.main.humidity,
              feelsLike: Math.round(data.main.feels_like),
            };
            
            localStorage.setItem('lis_weather', JSON.stringify({
              data: weatherData,
              timestamp: Date.now(),
            }));
            
            setWeather(weatherData);
            setLoading(false);
            return;
          }
        }

        // Fallback to mock data
        const mockData = getMockWeather(city);
        setWeather(mockData);
        
      } catch (err) {
        console.warn('Weather fetch failed, using mock:', err);
        setWeather(getMockWeather(city));
        setError('Using simulated weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  return { weather, loading, error };
}

// Map OpenWeatherMap conditions to our types
function mapWeatherCondition(owmCondition: string): WeatherData['condition'] {
  const map: Record<string, WeatherData['condition']> = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'stormy',
    'Snow': 'snowy',
    'Mist': 'cloudy',
    'Fog': 'cloudy',
    'Haze': 'cloudy',
  };
  return map[owmCondition] || 'sunny';
}

export default useWeather;
