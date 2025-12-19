import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../state/store';

export default function FlightController({ children }) {
  const dragon = useRef();
  const { controls, updateFlightData } = useStore();
  const { camera } = useThree();

  const vel = useRef(new THREE.Vector3(0, 0, 10));
  const rotation = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  
  // Valley Bounds
  const BOUNDS = {
    x: 180, // Half width of valley
    yMin: -80,
    yMax: 200,
    z: 950  // Half length
  };

  const ACCEL = 50;
  const DRAG = 0.99;
  const GRAVITY = 0.12;
  const TURN_SPEED = 1.6;

  useFrame((state, delta) => {
    if (!dragon.current) return;

    // 1. Handle Rotation
    if (controls.left) rotation.current.y += TURN_SPEED * delta;
    if (controls.right) rotation.current.y -= TURN_SPEED * delta;
    
    const targetPitch = controls.forward ? -0.5 : (controls.backward ? 0.7 : 0);
    rotation.current.x = THREE.MathUtils.lerp(rotation.current.x, targetPitch, 0.08);

    dragon.current.rotation.copy(rotation.current);

    // 2. Physics & Movement
    const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(dragon.current.quaternion);
    
    const enginePower = controls.boost ? ACCEL * 2.5 : ACCEL;
    if (controls.forward || controls.boost) {
      vel.current.addScaledVector(forwardDir, enginePower * delta);
    } else {
      vel.current.addScaledVector(forwardDir, 8 * delta);
    }
    
    if (controls.flap) {
      vel.current.y += 0.8;
      vel.current.addScaledVector(forwardDir, 12 * delta);
    }

    vel.current.y -= GRAVITY;
    vel.current.multiplyScalar(DRAG);

    // Apply movement
    const nextPos = dragon.current.position.clone().addScaledVector(vel.current, delta);

    // 3. BOUNDARY CONSTRAINTS (Stay in Valley)
    // X Boundary (Walls)
    if (Math.abs(nextPos.x) > BOUNDS.x) {
      vel.current.x *= -0.5; // Bounce off wall
      nextPos.x = Math.sign(nextPos.x) * BOUNDS.x;
    }
    // Z Boundary (Length)
    if (Math.abs(nextPos.z) > BOUNDS.z) {
      vel.current.z *= -0.5;
      nextPos.z = Math.sign(nextPos.z) * BOUNDS.z;
    }
    // Y Boundary (Height/Floor)
    if (nextPos.y < BOUNDS.yMin) {
      nextPos.y = BOUNDS.yMin;
      vel.current.y = 0;
    }
    if (nextPos.y > BOUNDS.yMax) {
      nextPos.y = BOUNDS.yMax;
      vel.current.y *= -0.5;
    }

    dragon.current.position.copy(nextPos);

    // 4. Update HUD
    updateFlightData({
      speed: Math.round(vel.current.length() * 10),
      altitude: Math.round(dragon.current.position.y + 100),
    });

    // 5. Camera follow
    const camTarget = new THREE.Vector3(0, 8, -25).applyQuaternion(dragon.current.quaternion);
    const lookAtPos = new THREE.Vector3(0, 2, 20).applyQuaternion(dragon.current.quaternion);
    
    camera.position.lerp(dragon.current.position.clone().add(camTarget), 0.1);
    camera.lookAt(dragon.current.position.clone().add(lookAtPos));
  });

  return <group ref={dragon}>{children}</group>;
}
