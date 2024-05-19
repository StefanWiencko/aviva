import { OpenWeatherMapsApiResponse, OpenWeatherMapsError } from "@/types";
import { capitalize } from "lodash";

export const getOpenWeatherMapWeatherData = async (
  city: string
): Promise<OpenWeatherMapsApiResponse> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_MAP_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const err: OpenWeatherMapsError = await response.json();
    throw { code: err.code, message: capitalize(err.message) };
  }
  return response.json();
};
