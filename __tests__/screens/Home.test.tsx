import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Home from "@/screens/Home";

const mockNavigation: any = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
};

const mockRoute: any = {
  params: undefined,
};

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("@/store/favorite-location-context", () => ({
  useFavoriteLocation: jest.fn().mockReturnValue({
    favoriteLocation: "",
    setFavoriteLocation: jest.fn(),
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn().mockReturnValue({
    data: null,
    error: null,
    isSuccess: false,
    isError: false,
    isPending: false,
  }),
}));

describe("Home component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with no city selected", () => {
    const { getByText, getByPlaceholderText } = render(
      <Home navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText("No city selected")).toBeTruthy();
  });

  it("displays weather details when a city is selected and weather data is fetched successfully", async () => {
    jest.spyOn(require("@tanstack/react-query"), "useQuery").mockReturnValue({
      data: {
        main: { temp: 20 },
        weather: [{ main: "Clear" }],
        name: "London",
      },
      error: null,
      isSuccess: true,
      isError: false,
      isPending: false,
    });

    const { getByPlaceholderText, getByText } = render(
      <Home navigation={mockNavigation} route={mockRoute} />
    );
    const input = getByPlaceholderText("Enter name of the city");
    fireEvent.changeText(input, "London");
    fireEvent.press(getByText("Check weather"));

    await waitFor(() => {
      expect(getByText("20°C")).toBeTruthy();
      expect(getByText("Clear")).toBeTruthy();
      expect(getByText("London")).toBeTruthy();
    });
  });

  it("displays error message when weather data fetching fails", async () => {
    jest.spyOn(require("@tanstack/react-query"), "useQuery").mockReturnValue({
      data: null,
      error: new Error("Failed to fetch weather data"),
      isSuccess: false,
      isError: true,
      isPending: false,
    });

    const { getByPlaceholderText, getByText } = render(
      <Home navigation={mockNavigation} route={mockRoute} />
    );
    const input = getByPlaceholderText("Enter name of the city");
    fireEvent.changeText(input, "InvalidCity");
    fireEvent.press(getByText("Check weather"));

    await waitFor(() => {
      expect(getByText("Failed to fetch weather data")).toBeTruthy();
    });
  });

  it("navigates to WeatherDetails screen when Details button is pressed", async () => {
    jest.spyOn(require("@tanstack/react-query"), "useQuery").mockReturnValue({
      data: {
        main: { temp: 20 },
        weather: [{ main: "Clear" }],
        name: "London",
      },
      error: null,
      isSuccess: true,
      isError: false,
      isPending: false,
    });

    const { getByPlaceholderText, getByText } = render(
      <Home navigation={mockNavigation} route={mockRoute} />
    );
    const input = getByPlaceholderText("Enter name of the city");
    fireEvent.changeText(input, "London");
    fireEvent.press(getByText("Check weather"));

    await waitFor(() => {
      fireEvent.press(getByText("Details"));
      expect(mockNavigation.navigate).toHaveBeenCalledWith("WeatherDetails", {
        location: "London",
      });
    });
  });
  it("displays spinner when request is pending", async () => {
    jest.spyOn(require("@tanstack/react-query"), "useQuery").mockReturnValue({
      data: null,
      error: null,
      isSuccess: false,
      isError: false,
      isPending: true,
    });

    const { getByTestId, getByPlaceholderText, getByText } = render(
      <Home navigation={mockNavigation} route={mockRoute} />
    );
    const input = getByPlaceholderText("Enter name of the city");
    fireEvent.changeText(input, "London");
    fireEvent.press(getByText("Check weather"));

    await waitFor(() => {
      expect(getByTestId("spinner")).toBeTruthy();
    });
  });
});
