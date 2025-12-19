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
    score: 0,
  },

  // Environment
  environment: {
    time: 12, // 0-24
    weather: 'clear',
  },

  // NPCs
  npcs: Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 600, 50 + Math.random() * 100, (Math.random() - 0.5) * 1500],
    alive: true,
    speed: 10 + Math.random() * 20,
    offset: Math.random() * Math.PI * 2
  })),

  setControls: (newControls) => 
    set((state) => ({ controls: { ...state.controls, ...newControls } })),
    
  updateFlightData: (data) => 
    set((state) => ({ flightData: { ...state.flightData, ...data } })),

  setEnvironment: (data) =>
    set((state) => ({ environment: { ...state.environment, ...data } })),

  killNPC: (id) => set((state) => ({
    npcs: state.npcs.map(n => n.id === id ? { ...n, alive: false } : n),
    flightData: { ...state.flightData, score: state.flightData.score + 100 }
  })),

  respawnNPCs: () => set((state) => ({
    npcs: state.npcs.map(n => ({ ...n, alive: true }))
  }))
}));
