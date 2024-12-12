// TailContext.js
import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialTailState = {
  elements: [] // This array will hold objects like { position: [x, y], letter: 'A' }
};

// Reducer function
const tailReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SEGMENT':
      return {
        ...state,
        elements: [action.segment, ...state.elements] // Add new segment at the beginning
      };
    case 'UPDATE_SEGMENTS':
      return {
        ...state,
        elements: state.elements.map((el, index) => 
          index === state.elements.length - 1
            ? { ...el, position: action.newPosition }
            : el
        )
      };
    default:
      return state;
  }
};

// Create context
const TailContext = createContext();

// Provider component
export const TailProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tailReducer, initialTailState);

  return (
    <TailContext.Provider value={{ state, dispatch }}>
      {children}
    </TailContext.Provider>
  );
};

// Custom hook to use context
export const useTail = () => useContext(TailContext);
