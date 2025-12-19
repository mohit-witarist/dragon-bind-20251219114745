import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../state/store';

export default function DragonModel() {
  const group = useRef();
  const leftWing = useRef();
  const rightWing = useRef();
  const leftWingOuter = useRef();
  const rightWingOuter = useRef();
  const neck = useRef();
  const head = useRef();
  const tail = useRef();
  const tailEnd = useRef();
  
  const { controls, flightData } = useStore();

  const dragonColor = '#2d4a22';
  const scaleColor = '#1a2e14';
  const wingColor = '#3d5a32';
  const hornColor = '#d2b48c';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth banking based on turning
    const targetRoll = controls.left ? 0.6 : (controls.right ? -0.6 : 0);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRoll, 0.1);
    
    // Wing Flapping logic - More majestic multi-jointed flap
    const flapSpeed = controls.flap ? 12 : (flightData.speed > 5 ? 4 : 1.5);
    const flapAmp = controls.flap ? 0.7 : 0.25;
    
    const flapCycle = Math.sin(t * flapSpeed);
    
    // Inner wings
    leftWing.current.rotation.z = flapCycle * flapAmp;
    rightWing.current.rotation.z = -flapCycle * flapAmp;
    
    // Outer wings (delayed for organic feel)
    const outerFlapCycle = Math.sin(t * flapSpeed - 0.5);
    leftWingOuter.current.rotation.z = outerFlapCycle * flapAmp * 0.8;
    rightWingOuter.current.rotation.z = -outerFlapCycle * flapAmp * 0.8;

    // Head/Neck swaying
    neck.current.rotation.y = Math.sin(t * 1.5) * 0.1;
    head.current.rotation.x = Math.sin(t * 2) * 0.05 + (controls.forward ? -0.1 : 0);

    // Tail waving
    tail.current.rotation.y = Math.sin(t * 2) * 0.2;
    tailEnd.current.rotation.y = Math.sin(t * 2 - 0.5) * 0.3;
  });

  return (
    <group ref={group}>
      {/* --- Main Torso --- */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color={dragonColor} roughness={0.6} />
      </mesh>
      
      {/* Spines on back */}
      {[0, 0.5, -0.5].map((z, i) => (
        <mesh key={i} position={[0, 0.8, z]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.2, 0.6, 4]} />
          <meshStandardMaterial color={scaleColor} />
        </mesh>
      ))}

      {/* --- Neck & Head --- */}
      <group ref={neck} position={[0, 0.4, 0.8]}>
        <mesh castShadow position={[0, 0.3, 0.5]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.6, 1.2, 8]} />
          <meshStandardMaterial color={dragonColor} />
        </mesh>
        
        <group ref={head} position={[0, 0.8, 1.2]}>
          {/* Skull */}
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.6, 1]} />
            <meshStandardMaterial color={dragonColor} />
          </mesh>
          {/* Snout */}
          <mesh position={[0, -0.1, 0.8]}>
            <boxGeometry args={[0.5, 0.4, 0.8]} />
            <meshStandardMaterial color={dragonColor} />
          </mesh>
          {/* Horns */}
          <mesh position={[0.25, 0.4, -0.2]} rotation={[-0.5, 0, 0.2]}>
            <coneGeometry args={[0.1, 0.8, 4]} />
            <meshStandardMaterial color={hornColor} />
          </mesh>
          <mesh position={[-0.25, 0.4, -0.2]} rotation={[-0.5, 0, -0.2]}>
            <coneGeometry args={[0.1, 0.8, 4]} />
            <meshStandardMaterial color={hornColor} />
          </mesh>
          {/* Eyes */}
          <mesh position={[0.25, 0.15, 0.4]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={2} />
          </mesh>
          <mesh position={[-0.25, 0.15, 0.4]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={2} />
          </mesh>
        </group>
      </group>

      {/* --- Wings (Articulated) --- */}
      {/* Left Wing */}
      <group position={[0.6, 0.3, 0]} ref={leftWing}>
        <mesh castShadow position={[1.5, 0, 0]}>
          <boxGeometry args={[3, 0.05, 2.5]} />
          <meshStandardMaterial color={wingColor} side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
        <group position={[3, 0, 0]} ref={leftWingOuter}>
          <mesh castShadow position={[1.2, 0, -0.2]}>
            <boxGeometry args={[2.5, 0.04, 2]} />
            <meshStandardMaterial color={wingColor} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
      </group>

      {/* Right Wing */}
      <group position={[-0.6, 0.3, 0]} ref={rightWing}>
        <mesh castShadow position={[-1.5, 0, 0]}>
          <boxGeometry args={[3, 0.05, 2.5]} />
          <meshStandardMaterial color={wingColor} side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
        <group position={[-3, 0, 0]} ref={rightWingOuter}>
          <mesh castShadow position={[-1.2, 0, -0.2]}>
            <boxGeometry args={[2.5, 0.04, 2]} />
            <meshStandardMaterial color={wingColor} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
      </group>

      {/* --- Tail --- */}
      <group ref={tail} position={[0, -0.2, -0.8]}>
        <mesh castShadow position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 2, 8]} />
          <meshStandardMaterial color={dragonColor} />
        </mesh>
        <group ref={tailEnd} position={[0, 0, -2]}>
          <mesh castShadow position={[0, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.1, 3, 8]} />
            <meshStandardMaterial color={dragonColor} />
          </mesh>
          {/* Tail Spikes */}
          <mesh position={[0, 0, -2.8]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.6, 0.1, 0.6]} />
            <meshStandardMaterial color={scaleColor} />
          </mesh>
        </group>
      </group>

      {/* Legs (Simplified) */}
      {[0.4, -0.4].map((x, i) => (
        <group key={i} position={[x, -0.6, 0.3]}>
           <mesh castShadow>
             <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
             <meshStandardMaterial color={dragonColor} />
           </mesh>
        </group>
      ))}
    </group>
  );
}
