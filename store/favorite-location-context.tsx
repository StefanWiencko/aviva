import { createContext, useMemo, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Context = {
  favoriteLocation: string | null;
  setFavoriteLocation: (a: string) => void;
};

type Props = {
  children: React.ReactNode;
};

const FavoriteLocationsContext = createContext<Context | null>(null);

export const useFavoriteLocation = () => {
  const context = useContext(FavoriteLocationsContext);
  if (context === undefined) {
    throw new Error(
      "useFavoriteLocation must be used within a FavoriteLocationProvider"
    );
  }
  if (context === null) {
    throw new Error("FavoriteLocationsContext is not initialized");
  }
  return context;
};

const FavoriteLocationProvider = ({ children }: Props) => {
  const [favoriteLocationState, setFavoriteLocationState] = useState<
    string | null
  >(null);

  const loadFavoriteLocation = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem("favoriteLocation");
      if (storedLocation !== null) {
        setFavoriteLocationState(storedLocation);
      }
    } catch (error) {
      console.error(
        "Error loading favorite location from AsyncStorage:",
        error
      );
    }
  };
  useEffect(() => {
    loadFavoriteLocation();
  }, []);

  const setFavoriteLocation = async (location: string) => {
    try {
      await AsyncStorage.setItem("favoriteLocation", location);
      setFavoriteLocationState(location);
    } catch (error) {
      console.error("Error saving favorite location to AsyncStorage:", error);
    }
  };

  const valueObject = useMemo(() => {
    return {
      favoriteLocation: favoriteLocationState,
      setFavoriteLocation: setFavoriteLocation,
    };
  }, [favoriteLocationState, setFavoriteLocation]);
  return (
    <FavoriteLocationsContext.Provider value={valueObject}>
      {children}
    </FavoriteLocationsContext.Provider>
  );
};
export default FavoriteLocationProvider;
