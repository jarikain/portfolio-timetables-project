import { WeatherResponse } from '../types/apiResponceTypes.js';
import { weatherOut } from '../types/dataTypes.js';
import { WEATHER_API_KEY } from '../utils/config.js';
import logger from '../utils/logger.js';

export async function getWeather(city: string): Promise<weatherOut | null> {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},FI&appid=${WEATHER_API_KEY}&units=metric`;
  const response = await fetch(url);
  try {
    const data = (await response.json()) as WeatherResponse;
    return {
      temperature: data.main.temp,
      icon: data.weather[0].icon
    };
  } catch {
    logger.info("Weather API response failed. Returning '' with cloud icon.");
    return null;
  }
}
