import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../state/store';

export default function FireBreath() {
  const points = useRef();
  const { controls } = useStore();
  
  const count = 500;
  const positions = useMemo(() => new Float32Array(count * 3), []);
  const velocities = useMemo(() => new Float32Array(count * 3), []);
  const lives = useMemo(() => new Float32Array(count), []);

  // Initialize
  useMemo(() => {
    for (let i = 0; i < count; i++) {
      lives[i] = 0;
    }
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      if (lives[i] > 0) {
        // Update existing particles
        positions[i3] += velocities[i3] * delta;
        positions[i3 + 1] += velocities[i3 + 1] * delta;
        positions[i3 + 2] += velocities[i3 + 2] * delta;
        
        // Apply slight expansion/spread
        velocities[i3] *= 1.02;
        velocities[i3 + 1] *= 1.02;

        lives[i] -= delta * 1.5;
        
        // Fade size/color based on life could be done in shader, 
        // here we just hide them when they die
        if (lives[i] <= 0) {
          positions[i3] = positions[i3 + 1] = positions[i3 + 2] = 0;
        }
      } else if (controls.fire) {
        // Spawn new particle at "mouth"
        // This is relative to the fire group which we will place at the head
        lives[i] = 1.0;
        positions[i3] = (Math.random() - 0.5) * 0.2;
        positions[i3 + 1] = (Math.random() - 0.5) * 0.2;
        positions[i3 + 2] = 0.5; // Start offset from head
        
        // Velocity: forward with some spread
        velocities[i3] = (Math.random() - 0.5) * 5;
        velocities[i3 + 1] = (Math.random() - 0.5) * 5;
        velocities[i3 + 2] = 25 + Math.random() * 15;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    // We position this inside the head group in FlightController or App
    <group position={[0, 1.2, 2.2]}> 
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          color="#ff6600"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>
      {/* Glow light when breathing fire */}
      {controls.fire && <pointLight color="orange" intensity={10} distance={15} />}
    </group>
  );
}
