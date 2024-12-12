import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Adjusted `Food` component without the unused `width` import
export default function Food({ position, size, currentFood }) {
  // Calculate responsive sizes based on the given size
  const containerSize = size * 2.5;
  const borderRadius = size * 2.5;
  const fontSize = size * 1.8;

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: borderRadius,
          left: position[0] * size,
          top: position[1] * size,
          
        },
      ]}
    >
      {/* Adding decorative overlay */}
      <View style={styles.petalOverlay} />
      <Text style={[styles.alphabet, { fontSize: fontSize }]}>
        {currentFood}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6E0B5", // Pastel yellow background
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#D4AF37", // Gold shadow color for subtle depth
    shadowOffset: { width: 4, height: 4 }, // Offset for the shadow
    shadowOpacity: 0.3, // Slightly softer shadow opacity
    shadowRadius: 6, // Shadow blur radius
    elevation: 6, // Elevation for Android
    borderWidth: 2, // Border to add definition
    borderColor: "#E5B56D", // Warm yellow border to match pastel theme
  },
  petalOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 9999, // Ensure this is a number for full circle
    borderColor: "#E5B56D",
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent overlay
  },
  alphabet: {
    fontWeight: "800", // Bolder font weight for contrast
    color: "#3C3C3B", // Darker text color for contrast
    textAlign: "center",
    textTransform: "uppercase",
    textShadowColor: "#F6E0B5", // Subtle yellow shadow for text
    textShadowOffset: { width: 1, height: 1 }, // Offset for text shadow
    textShadowRadius: 2, // Text shadow blur radius
  },
});
