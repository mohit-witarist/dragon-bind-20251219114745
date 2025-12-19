import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useStore } from './state/store';

import DragonModel from './components/Dragon/DragonModel';
import FlightController from './components/Dragon/FlightController';
import FireBreath from './components/Dragon/FireBreath';
import NPCDragons from './components/Dragon/NPCDragons';
import Environment from './components/World/Environment';
import SkySystem from './components/World/SkySystem';
import HUD from './components/UI/HUD';

export default function App() {
  const setControls = useStore((state) => state.setControls);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w') setControls({ forward: true });
      if (key === 's') setControls({ backward: true });
      if (key === 'a') setControls({ left: true });
      if (key === 'd') setControls({ right: true });
      if (key === ' ') setControls({ flap: true });
      if (e.shiftKey) setControls({ boost: true });
      if (key === 'f') setControls({ fire: true });
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w') setControls({ forward: false });
      if (key === 's') setControls({ backward: false });
      if (key === 'a') setControls({ left: false });
      if (key === 'd') setControls({ right: false });
      if (key === ' ') setControls({ flap: false });
      if (!e.shiftKey) setControls({ boost: false });
      if (key === 'f') setControls({ fire: false });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setControls]);

  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows camera={{ fov: 60 }}>
        <SkySystem />
        
        <FlightController>
          <DragonModel />
          <FireBreath />
        </FlightController>

        <NPCDragons />
        <Environment />
      </Canvas>
      
      <HUD />
    </div>
  );
}
