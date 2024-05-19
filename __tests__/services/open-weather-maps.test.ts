import { getOpenWeatherMapWeatherData } from "@/services/open-weather-maps";
import { OpenWeatherMapsApiResponse, OpenWeatherMapsError } from "@/types";
import fetchMock from "jest-fetch-mock";
import { capitalize } from "lodash";

fetchMock.enableMocks();

const mockResponse: OpenWeatherMapsApiResponse = {
  coord: { lon: -0.1257, lat: 51.5085 },
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
  base: "stations",
  main: {
    temp: 15.0,
    feels_like: 14.0,
    temp_min: 13.0,
    temp_max: 17.0,
    pressure: 1012,
    humidity: 77,
  },
  visibility: 10000,
  wind: { speed: 3.6, deg: 350 },
  clouds: { all: 0 },
  dt: 1627182000,
  sys: {
    type: 2,
    id: 268730,
    country: "GB",
    sunrise: 1627175286,
    sunset: 1627230578,
  },
  timezone: 3600,
  id: 2643743,
  name: "London",
  cod: 200,
};

const mockErrorResponse: OpenWeatherMapsError = {
  code: 404,
  message: "city not found",
};

describe("getOpenWeatherMapWeatherData", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("fetches weather data successfully", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const city = "London";
    const data = await getOpenWeatherMapWeatherData(city);

    expect(data).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_MAP_API_KEY}`
    );
  });

  it("throws an error if the response is not ok", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), {
      status: 404,
    });

    const city = "UnknownCity";

    await expect(getOpenWeatherMapWeatherData(city)).rejects.toEqual({
      code: mockErrorResponse.code,
      message: capitalize(mockErrorResponse.message),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_MAP_API_KEY}`
    );
  });
});
