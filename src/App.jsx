import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Sky, Stars } from '@react-three/drei';
import { useStore } from './state/store';

import DragonModel from './components/Dragon/DragonModel';
import FlightController from './components/Dragon/FlightController';
import FireBreath from './components/Dragon/FireBreath';
import Environment from './components/World/Environment';
import SkySystem from './components/World/SkySystem';
import HUD from './components/UI/HUD';

export default function App() {
  const setControls = useStore((state) => state.setControls);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'w') setControls({ forward: true });
      if (e.key.toLowerCase() === 's') setControls({ backward: true });
      if (e.key.toLowerCase() === 'a') setControls({ left: true });
      if (e.key.toLowerCase() === 'd') setControls({ right: true });
      if (e.key === ' ') setControls({ flap: true });
      if (e.shiftKey) setControls({ boost: true });
      if (e.key.toLowerCase() === 'f') setControls({ fire: true });
    };

    const handleKeyUp = (e) => {
      if (e.key.toLowerCase() === 'w') setControls({ forward: false });
      if (e.key.toLowerCase() === 's') setControls({ backward: false });
      if (e.key.toLowerCase() === 'a') setControls({ left: false });
      if (e.key.toLowerCase() === 'd') setControls({ right: false });
      if (e.key === ' ') setControls({ flap: false });
      if (!e.shiftKey) setControls({ boost: false });
      if (e.key.toLowerCase() === 'f') setControls({ fire: false });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setControls]);

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 5, -15], fov: 60 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050505']} />
        
        <SkySystem />
        
        <FlightController>
          <DragonModel />
          <FireBreath />
        </FlightController>

        <Environment />
      </Canvas>
      
      <HUD />
    </div>
  );
}
