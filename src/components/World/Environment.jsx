import React, { useMemo } from 'react';
import { Instances, Instance, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Environment() {
  // Generate random islands
  const islands = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 1000,
        Math.random() * 100 - 20,
        (Math.random() - 0.5) * 1000,
      ],
      scale: 5 + Math.random() * 20,
      rotation: [0, Math.random() * Math.PI, 0],
    }));
  }, []);

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#1a2e14" />
      </mesh>

      {/* Floating Islands */}
      <Instances range={40}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#4a3728" roughness={1} />
        {islands.map((island, i) => (
          <group key={i} position={island.position} scale={island.scale} rotation={island.rotation}>
            <Instance />
            {/* Green top */}
            <mesh position={[0, 0.26, 0]}>
               <boxGeometry args={[1.05, 0.1, 1.05]} />
               <meshStandardMaterial color="#2d5a27" />
            </mesh>
          </group>
        ))}
      </Instances>

      {/* Clouds */}
      <group>
        {Array.from({ length: 20 }).map((_, i) => (
          <Float key={i} speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[(Math.random() - 0.5) * 800, 80 + Math.random() * 50, (Math.random() - 0.5) * 800]}>
              <sphereGeometry args={[10 + Math.random() * 20, 16, 16]} />
              <meshStandardMaterial color="white" transparent opacity={0.4} />
            </mesh>
          </Float>
        ))}
      </group>

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
    </group>
  );
}
