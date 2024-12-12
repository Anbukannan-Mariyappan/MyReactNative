import React from 'react';
import { View } from 'react-native';
import Constants from '../../Constants';

const Snake = ({ snakeBody }) => {
  const size = Constants.CELL_SIZE; // Assuming you have CELL_SIZE defined in Constants.js

  return (
    <>
      {snakeBody.map((segment, index) => (
        <View
          key={index}
          style={{
            width: size * 1.9,
            height: size * 2,
            backgroundColor: "#08A045",
            position: "absolute",
            left: segment.position[0] * size,
            top: segment.position[1] * size,
            borderRadius: 12, // Adjust border radius as needed
          }}
        />
      ))}
    </>
  );
};

export default Snake;
