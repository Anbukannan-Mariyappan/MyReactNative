import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

// Get screen dimensions
const { width } = Dimensions.get("window");

const Head = ({ position, size, letter }) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size*1.9,
          height: size *2,
          left: position[0] * size,
          top: position[1] * size,
        },
      ]}
    >
      {/* Eyes */}
      <View style={[styles.eye, { left: size * 0.25 }]} />
      <View style={[styles.eye, { right: size * 0.25 }]} />

      <Text style={[styles.letter, { fontSize: size * 0.5 }]}>
        {letter}
      </Text>
    </View>
  );
};

// Use responsive values for sizing
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#FF8C00", // Orange color for the head
    borderRadius: 10,          // More rounded corners for a softer look
    justifyContent: "center",  // Center the letter vertically
    alignItems: "center",      // Center the letter horizontally
    borderWidth: 2,
    borderColor: "#7a5037",    // Dark brown border to match the theme
    shadowColor: "#000",       // Shadow to add depth
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: "hidden",        // Ensure the gradient does not overflow
  },
  eye: {
    position: "absolute",
    width: "20%",
    height: "20%",
    backgroundColor: "#FFF", // White color for the eyes
    borderRadius: 10,        // Rounded eyes
  },
  letter: {
    color: "#FFF",           // White text to stand out against the orange
    fontWeight: "bold",      // Bold for clarity and emphasis
    textShadowColor: "#7a5037", // Shadow to mimic the intensity of the theme
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Head;
