import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../state/store';

export default function DragonModel() {
  const group = useRef();
  const leftWing = useRef();
  const rightWing = useRef();
  const head = useRef();
  
  const { controls, flightData } = useStore();

  // Create materials
  const bodyMat = new THREE.MeshStandardMaterial({ color: '#2d4a22', roughness: 0.7 });
  const scaleMat = new THREE.MeshStandardMaterial({ color: '#1a2e14', roughness: 0.5 });
  const wingMat = new THREE.MeshStandardMaterial({ color: '#4a6b3d', side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 'yellow', emissive: 'orange' });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth banking based on turning
    const targetRoll = controls.left ? 0.6 : (controls.right ? -0.6 : 0);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRoll, 0.1);
    
    // Wing Flapping logic
    const flapSpeed = controls.flap ? 15 : (flightData.speed > 5 ? 5 : 2);
    const flapAmp = controls.flap ? 0.8 : 0.3;
    
    leftWing.current.rotation.z = Math.sin(t * flapSpeed) * flapAmp;
    rightWing.current.rotation.z = -Math.sin(t * flapSpeed) * flapAmp;

    // Head bobbing
    head.current.rotation.x = Math.sin(t * 2) * 0.1;
  });

  return (
    <group ref={group}>
      {/* Main Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.8, 2, 8, 16]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 0.5, 2]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.8, 1.2]} />
          <primitive object={bodyMat} attach="material" />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.3, 0.2, 0.5]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <primitive object={eyeMat} attach="material" />
        </mesh>
        <mesh position={[-0.3, 0.2, 0.5]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <primitive object={eyeMat} attach="material" />
        </mesh>
      </group>

      {/* Wings */}
      <group position={[0.5, 0.2, 0]} ref={leftWing}>
        <mesh castShadow position={[1.5, 0, 0]}>
          <boxGeometry args={[3, 0.1, 2]} />
          <primitive object={wingMat} attach="material" />
        </mesh>
      </group>
      <group position={[-0.5, 0.2, 0]} ref={rightWing}>
        <mesh castShadow position={[-1.5, 0, 0]}>
          <boxGeometry args={[3, 0.1, 2]} />
          <primitive object={wingMat} attach="material" />
        </mesh>
      </group>

      {/* Tail */}
      <mesh position={[0, -0.2, -2.5]} rotation={[Math.PI / 2.2, 0, 0]}>
        <coneGeometry args={[0.4, 3, 8]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>
    </group>
  );
}
