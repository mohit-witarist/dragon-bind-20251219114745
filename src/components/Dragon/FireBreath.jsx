import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../state/store';

export default function FireBreath() {
  const points = useRef();
  const { controls } = useStore();
  
  const count = 200;
  const positions = useMemo(() => new Float32Array(count * 3), []);
  const velocities = useMemo(() => new Float32Array(count * 3), []);
  const sizes = useMemo(() => new Float32Array(count), []);

  useFrame((state, delta) => {
    if (!controls.fire) {
      points.current.visible = false;
      return;
    }
    points.current.visible = true;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update life
      positions[i3 + 2] += velocities[i3 + 2] * delta;
      positions[i3 + 1] += velocities[i3 + 1] * delta;
      positions[i3] += velocities[i3] * delta;
      
      // Reset if too far
      if (positions[i3 + 2] > 15) {
        positions[i3] = (Math.random() - 0.5) * 0.5;
        positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
        positions[i3 + 2] = 2; // Start at mouth
        
        velocities[i3] = (Math.random() - 0.5) * 2;
        velocities[i3 + 1] = (Math.random() - 0.5) * 2;
        velocities[i3 + 2] = 10 + Math.random() * 10;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} position={[0, 0.5, 2]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        color="#ff4400"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
