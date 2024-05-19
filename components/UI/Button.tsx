import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/colors";

type Props = {
  children: React.ReactNode;
  onPress: () => void;
  style?: Record<string, number | string>;
  disabled?: boolean;
};

const Button = ({ children, onPress, style, disabled = false }: Props) => {
  return (
    <View style={[styles.rootContainer, style]}>
      <Pressable
        android_ripple={disabled ? null : { color: Colors.accent200 }}
        onPress={disabled ? null : onPress}
        style={({ pressed }) => [
          styles.button,
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.pressed,
        ]}
        disabled={disabled}
      >
        <Text
          style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
        >
          {children}
        </Text>
      </Pressable>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  rootContainer: {
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    borderRadius: 4,
  },
  button: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: Colors.primary700,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    backgroundColor: Colors.grey200,
  },
  buttonTextDisabled: {
    color: Colors.font,
  },
});
