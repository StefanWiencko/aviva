import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { WeatherDetailsScreenProps } from "@/types";
import IconButton from "@/components/UI/IconButton";
import { useFavoriteLocation } from "@/store/favorite-location-context";
import { Colors } from "@/constants/colors";
import { useWeatherData } from "@/hooks/useWeatherData";

const WeatherDetails = ({ navigation, route }: WeatherDetailsScreenProps) => {
  const favoriteLocationCtx = useFavoriteLocation();
  const locationName = route.params.location;
  const { data } = useWeatherData(locationName);

  if (!data) return null;

  const favoriteLocation = favoriteLocationCtx.favoriteLocation === data.name;

  const headerButtonPressHandler = () => {
    if (favoriteLocationCtx.favoriteLocation) {
      favoriteLocationCtx.setFavoriteLocation("");
    } else {
      favoriteLocationCtx.setFavoriteLocation(data.name);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: data.name,
      headerRight: () => {
        return (
          <IconButton
            icon={!!favoriteLocation ? "star" : "star-outline"}
            color="white"
            onPress={headerButtonPressHandler}
          />
        );
      },
    });
  }, [navigation, headerButtonPressHandler, favoriteLocation, data]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather for {data.name}</Text>
      <View>
        <Text style={styles.text}>
          Temperature: {Math.round(data.main.temp)}°C
        </Text>
        <Text style={styles.text}>
          Perceived temperature: {Math.round(data.main.feels_like)}°C
        </Text>
        <Text style={styles.text}>Pressure: {data.main.pressure}hPa</Text>
        <Text style={styles.text}>Humidity: {data.main.humidity}%</Text>
      </View>
    </View>
  );
};

export default WeatherDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
  },
  title: {
    color: Colors.font,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 16,
  },
  text: {
    color: Colors.font,
  },
  pending: {
    justifyContent: "center",
    alignItems: "center",
  },
});
