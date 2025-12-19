import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../state/store';

const MiniDragon = ({ npc }) => {
  const mesh = useRef();
  const wingL = useRef();
  const wingR = useRef();
  const killNPC = useStore(state => state.killNPC);
  const { controls, flightData } = useStore();

  useFrame((state) => {
    if (!npc.alive || !mesh.current) return;
    
    const t = state.clock.getElapsedTime() + npc.offset;
    
    // Flying Logic
    mesh.current.position.x = npc.position[0] + Math.sin(t * 0.5) * 200;
    mesh.current.position.z = npc.position[2] + Math.cos(t * 0.5) * 200;
    mesh.current.position.y = npc.position[1] + Math.sin(t * 2) * 20;
    mesh.current.lookAt(
      npc.position[0] + Math.sin((t + 0.1) * 0.5) * 200,
      npc.position[1] + Math.sin((t + 0.1) * 2) * 20,
      npc.position[2] + Math.cos((t + 0.1) * 0.5) * 200
    );

    // Wing flapping
    const flap = Math.sin(t * 10) * 0.5;
    wingL.current.rotation.z = flap;
    wingR.current.rotation.z = -flap;

    // Hit detection (Simple distance check if fire is active)
    if (controls.fire) {
      // Get player position roughly (since NPCs don't have access to player ref directly, we'd ideally pass it, but we can check relative to camera for now or simplify)
      const dist = state.camera.position.distanceTo(mesh.current.position);
      if (dist < 40) {
        // Only if player is looking at them (rough check)
        const toNPC = mesh.current.position.clone().sub(state.camera.position).normalize();
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(state.camera.quaternion);
        if (toNPC.dot(forward) > 0.95) {
          killNPC(npc.id);
        }
      }
    }
  });

  if (!npc.alive) return null;

  return (
    <group ref={mesh}>
      <mesh castShadow>
        <capsuleGeometry args={[2, 6, 4, 8]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>
      <group position={[3, 0, 0]} ref={wingL}>
        <mesh><boxGeometry args={[6, 0.2, 4]} /><meshStandardMaterial color="#500" /></mesh>
      </group>
      <group position={[-3, 0, 0]} ref={wingR}>
        <mesh><boxGeometry args={[6, 0.2, 4]} /><meshStandardMaterial color="#500" /></mesh>
      </group>
      {/* Glowing Eyes */}
      <mesh position={[1, 1, 3]}>
        <sphereGeometry args={[0.3]} /><meshBasicMaterial color="orange" />
      </mesh>
      <mesh position={[-1, 1, 3]}>
        <sphereGeometry args={[0.3]} /><meshBasicMaterial color="orange" />
      </mesh>
    </group>
  );
};

export default function NPCDragons() {
  const npcs = useStore(state => state.npcs);
  return (
    <group>
      {npcs.map(npc => (
        <MiniDragon key={npc.id} npc={npc} />
      ))}
    </group>
  );
}
