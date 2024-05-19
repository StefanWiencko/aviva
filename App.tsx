import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@/screens/Home";
import WeatherDetails from "@/screens/WeatherDetails";
import { Colors } from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RootStackParamList } from "@/types";
import FavoriteLocationProvider from "@/store/favorite-location-context";

const Stack = createNativeStackNavigator<RootStackParamList>();

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <QueryClientProvider client={queryClient}>
        <FavoriteLocationProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: Colors.primary700 },
                headerTintColor: "#fff",
                contentStyle: { backgroundColor: Colors.primary500 },
                presentation: "card",
              }}
            >
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="WeatherDetails" component={WeatherDetails} />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoriteLocationProvider>
      </QueryClientProvider>
    </>
  );
}
