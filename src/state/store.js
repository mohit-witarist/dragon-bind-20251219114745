import { create } from 'zustand';

export const useStore = create((set) => ({
  // Controls
  controls: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    flap: false,
    boost: false,
    fire: false,
  },
  
  // Dragon State
  flightData: {
    speed: 0,
    altitude: 0,
    isGliding: true,
  },

  // Environment
  environment: {
    time: 12, // 0-24
    weather: 'clear', // clear, fog, storm
    cameraDist: 15,
  },

  setControls: (newControls) => 
    set((state) => ({ controls: { ...state.controls, ...newControls } })),
    
  updateFlightData: (data) => 
    set((state) => ({ flightData: { ...state.flightData, ...data } })),

  setEnvironment: (data) =>
    set((state) => ({ environment: { ...state.environment, ...data } })),
}));
