import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../state/store';

export default function FlightController({ children }) {
  const dragon = useRef();
  const { controls, updateFlightData } = useStore();
  const { camera } = useThree();

  const vel = useRef(new THREE.Vector3());
  const rotation = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  
  // Physics constants
  const ACCEL = 30;
  const DRAG = 0.98;
  const GRAVITY = 0.15;
  const LIFT = 0.4;
  const TURN_SPEED = 1.5;

  useFrame((state, delta) => {
    if (!dragon.current) return;

    // 1. Handle Rotation
    if (controls.left) rotation.current.y += TURN_SPEED * delta;
    if (controls.right) rotation.current.y -= TURN_SPEED * delta;
    
    // Pitch (up/down) based on speed and manual input if we wanted, 
    // but here we base it on forward/backward
    if (controls.forward) rotation.current.x = THREE.MathUtils.lerp(rotation.current.x, -0.2, 0.05);
    else if (controls.backward) rotation.current.x = THREE.MathUtils.lerp(rotation.current.x, 0.4, 0.05);
    else rotation.current.x = THREE.MathUtils.lerp(rotation.current.x, 0, 0.05);

    dragon.current.rotation.copy(rotation.current);

    // 2. Handle Acceleration
    const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(dragon.current.quaternion);
    
    if (controls.forward) {
      vel.current.addScaledVector(forwardDir, ACCEL * delta);
    }
    
    // Space for Flapping / Lift
    if (controls.flap) {
      vel.current.y += LIFT;
      vel.current.addScaledVector(forwardDir, 5 * delta);
    }

    // Boost
    if (controls.boost) {
       vel.current.addScaledVector(forwardDir, ACCEL * 2 * delta);
    }

    // 3. Physics / Environment
    vel.current.y -= GRAVITY; // Gravity
    vel.current.multiplyScalar(DRAG); // Air resistance

    // Update position
    dragon.current.position.addScaledVector(vel.current, delta);

    // Ground collision (simple)
    if (dragon.current.position.y < 2) {
      dragon.current.position.y = 2;
      vel.current.y = 0;
    }

    // 4. Update Global State
    updateFlightData({
      speed: Math.round(vel.current.length() * 10),
      altitude: Math.round(dragon.current.position.y),
    });

    // 5. Camera Follow logic
    const idealOffset = new THREE.Vector3(0, 5, -15).applyQuaternion(dragon.current.quaternion);
    const idealLookAt = new THREE.Vector3(0, 2, 10).applyQuaternion(dragon.current.quaternion);
    
    const targetCamPos = dragon.current.position.clone().add(idealOffset);
    const targetLookAtPos = dragon.current.position.clone().add(idealLookAt);

    camera.position.lerp(targetCamPos, 0.1);
    camera.lookAt(targetLookAtPos);
  });

  return (
    <group ref={dragon}>
      {children}
    </group>
  );
}
