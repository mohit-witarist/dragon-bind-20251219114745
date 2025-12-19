import React from 'react';
import { Sky, Stars, Cloud } from '@react-three/drei';
import { useStore } from '../../state/store';

export default function SkySystem() {
  const { environment } = useStore();
  
  return (
    <>
      <Sky 
        distance={450000} 
        sunPosition={[0, Math.sin(environment.time * (Math.PI / 12)), Math.cos(environment.time * (Math.PI / 12))]} 
        inclination={0} 
        azimuth={0.25} 
      />
      {environment.time > 18 || environment.time < 6 ? <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> : null}
      
      {environment.weather === 'fog' && <fog attach="fog" args={['#7d7d7d', 1, 150]} />}
      {environment.weather === 'storm' && <fog attach="fog" args={['#1a1a1a', 1, 100]} />}
    </>
  );
}
