import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/colors";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { HomeScreenProps } from "@/types";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useFavoriteLocation } from "@/store/favorite-location-context";

const Home = ({ navigation }: HomeScreenProps) => {
  let content = <Text>No city selected</Text>;

  const { favoriteLocation } = useFavoriteLocation();
  const [cityName, setCityName] = useState("");
  const { data, error, isSuccess, isError, isPending } =
    useWeatherData(cityName);

  useEffect(() => {
    if (favoriteLocation) {
      setCityName(favoriteLocation);
    }
  }, [favoriteLocation]);

  const detailsButtonPressHandler = () => {
    if (cityName.length === 0) return;
    navigation.navigate("WeatherDetails", { location: cityName });
  };
  const inputTextChangeHandler = (value: string) => {
    setCityName(value);
  };

  if (isPending) {
    content = (
      <ActivityIndicator testID="spinner" size="large" color={Colors.font} />
    );
  }
  if (isError) {
    content = <Text>{error.message}</Text>;
  }
  if (isSuccess) {
    content = (
      <>
        <Text style={styles.temperatureText}>
          {Math.round(data.main.temp)}°C
        </Text>
        <Text style={styles.descriptionText}>{data.weather[0].main}</Text>
        <Text style={styles.cityText}>{data.name}</Text>
      </>
    );
  }
  if (!cityName) {
    content = <Text>No city selected</Text>;
  }
  return (
    <View style={styles.rootContainer}>
      <View>
        <View style={[styles.textContainer, !isSuccess && styles.pending]}>
          {content}
        </View>
        <View style={styles.inputContainer}>
          <Input
            textInputConfig={{
              onChangeText: inputTextChangeHandler,
              value: cityName,
              inputMode: "text",
              placeholder: "Enter name of the city",
            }}
            style={{
              width: "100%",
              minWidth: 250,
            }}
          />
          <Button
            style={styles.button}
            onPress={detailsButtonPressHandler}
            disabled={!isSuccess}
          >
            Details
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.primary500,
    alignItems: "center",
    paddingTop: "20%",
  },
  inputContainer: {
    alignItems: "center",
  },
  button: {
    width: "100%",
    minWidth: 200,
    marginBottom: 6,
  },
  textContainer: {
    padding: 6,
    alignItems: "center",
    height: 150,
  },
  temperatureText: {
    fontSize: 46,
  },
  descriptionText: {
    fontSize: 26,
  },
  cityText: {
    fontSize: 18,
  },
  pending: {
    alignItems: "center",
    justifyContent: "center",
  },
});
