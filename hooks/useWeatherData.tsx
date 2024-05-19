import { useQuery } from "@tanstack/react-query";
import { getOpenWeatherMapWeatherData } from "@/services/open-weather-maps";

export const useWeatherData = (city: string) =>
  useQuery({
    queryKey: ["weatherData", city],
    queryFn: () => getOpenWeatherMapWeatherData(city),
    enabled: !!city,
    staleTime: 60000,
  });
