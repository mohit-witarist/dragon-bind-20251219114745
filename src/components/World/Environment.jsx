import React, { useMemo } from 'react';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const VALLEY_WIDTH = 1200;
const VALLEY_LENGTH = 3000;

const Mountain = ({ position, scale, rotation }) => (
  <mesh position={position} scale={scale} rotation={rotation} receiveShadow>
    <coneGeometry args={[1, 2, 6]} />
    <meshStandardMaterial color="#2d2a26" roughness={1} flatShading />
  </mesh>
);

export default function Environment() {
  const landscape = useMemo(() => {
    const items = [];
    // Perimeter Mountains
    for (let z = -VALLEY_LENGTH/2; z < VALLEY_LENGTH/2; z += 300) {
      items.push({ pos: [-VALLEY_WIDTH/2, 100, z], scale: [200, 400 + Math.random()*200, 300], rot: [0, Math.random(), 0] });
      items.push({ pos: [VALLEY_WIDTH/2, 100, z], scale: [200, 400 + Math.random()*200, 300], rot: [0, Math.random(), 0] });
    }
    // Far Ends
    for (let x = -VALLEY_WIDTH/2; x < VALLEY_WIDTH/2; x += 300) {
      items.push({ pos: [x, 100, -VALLEY_LENGTH/2], scale: [300, 500, 200], rot: [0, Math.random(), 0] });
      items.push({ pos: [x, 100, VALLEY_LENGTH/2], scale: [300, 500, 200], rot: [0, Math.random(), 0] });
    }
    return items;
  }, []);

  const islands = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * (VALLEY_WIDTH - 200),
        Math.random() * 200,
        (Math.random() - 0.5) * (VALLEY_LENGTH - 200),
      ],
      scale: 10 + Math.random() * 30
    }));
  }, []);

  return (
    <group>
      {/* Terrain Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
        <planeGeometry args={[VALLEY_WIDTH + 500, VALLEY_LENGTH + 500]} />
        <meshStandardMaterial color="#1a1c15" />
      </mesh>

      {/* Mountain Walls */}
      {landscape.map((m, i) => (
        <Mountain key={i} position={m.pos} scale={m.scale} rotation={m.rot} />
      ))}

      {/* Floating Islands */}
      {islands.map((island, i) => (
        <group key={i} position={island.position} scale={island.scale}>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#3d352d" roughness={1} flatShading />
          </mesh>
          <mesh position={[0, 0.5, 0]} scale={[1.1, 0.2, 1.1]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#1e3d14" flatShading />
          </mesh>
        </group>
      ))}

      {/* Atmospheric Mist */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -40, 0]}>
        <planeGeometry args={[5000, 5000]} />
        <meshStandardMaterial color="#222" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
