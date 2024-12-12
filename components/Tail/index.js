import React from "react";
import { View, Dimensions } from "react-native";

// Function to convert RGB values to an rgba string
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

// Get screen dimensions
const { width } = Dimensions.get("window");

const Tail = ({ elements, size }) => {
  // Calculate responsive size
  const segmentSize = size || width * 0.05; // Default size or percentage of screen width
  
  return (
    <>
      {elements.map((segment, index) => {
        // Calculate color intensity for gradient effect
        const colorIntensity = 230 - index * 10;

        // Calculate background color with rgba for transparency
        const backgroundColor = rgba(
          colorIntensity,
          colorIntensity,
          colorIntensity,
          Math.max(0.3, 1 - index * 0.1)
        );

        return (
          <View
            key={index}
            style={{
              position: "absolute",
              width: segmentSize*1.5,
              height: segmentSize*1.4,
              left: segment[0] * segmentSize,
              top: segment[1] * segmentSize,
              backgroundColor: "#FF8C00", // Orange color for the tail to match the snake color
              borderRadius: segmentSize * 0.2, // Slightly rounded corners for a softer look
              borderWidth: 2,
              borderColor: "#7a5037", // Dark brown color for border
              shadowColor: "#000", // Shadow color for depth
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          />
        );
      })}
    </>
  );
};

export default Tail;
