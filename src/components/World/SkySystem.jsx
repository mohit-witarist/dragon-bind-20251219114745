import React from 'react';
import { Sky, Stars, Float } from '@react-three/drei';
import { useStore } from '../../state/store';
import * as THREE from 'three';

export default function SkySystem() {
  const { environment } = useStore();
  
  const angle = (environment.time / 24) * Math.PI * 2;
  const sunPos = [
    Math.cos(angle) * 1000,
    Math.sin(angle) * 1000,
    Math.sin(angle) * 200
  ];

  const moonAngle = angle + Math.PI;
  const moonPos = [
    Math.cos(moonAngle) * 1000,
    Math.sin(moonAngle) * 1000,
    Math.sin(moonAngle) * 200
  ];

  const isNight = environment.time > 19 || environment.time < 5;
  const isSunset = (environment.time > 17 && environment.time <= 19) || (environment.time >= 5 && environment.time < 7);

  let lightColor = "#fff";
  let intensity = 1.5;

  if (isNight) {
    lightColor = "#5555ff";
    intensity = 0.2;
  } else if (isSunset) {
    lightColor = "#ffaa00";
    intensity = 1.0;
  }

  return (
    <>
      <Sky 
        distance={450000} 
        sunPosition={sunPos} 
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={isNight ? 10 : 2}
        turbidity={isSunset ? 20 : 5}
      />

      {/* Sun Mesh */}
      {!isNight && (
        <mesh position={sunPos}>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial color="#fffbe6" />
          <pointLight intensity={100} distance={5000} color="#fffbe6" />
        </mesh>
      )}

      {/* Moon Mesh */}
      {isNight && (
        <group position={moonPos}>
          <mesh>
            <sphereGeometry args={[40, 32, 32]} />
            <meshBasicMaterial color="#e6f2ff" />
          </mesh>
          <pointLight intensity={50} distance={3000} color="#99ccff" />
        </group>
      )}

      <directionalLight 
        position={isNight ? moonPos : sunPos} 
        intensity={intensity} 
        castShadow 
        color={lightColor}
        shadow-mapSize={[1024, 1024]}
      />

      <ambientLight intensity={isNight ? 0.05 : 0.2} />
      <hemisphereLight intensity={0.5} color={lightColor} groundColor="#000" />

      {isNight && <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />}
      
      <fog attach="fog" args={[isNight ? '#050510' : (isSunset ? '#4a2a1a' : '#87ceeb'), 10, 2000]} />
    </>
  );
}
