"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.getElapsedTime() * 0.3;
    ref.current.rotation.y = clock.getElapsedTime() * 0.5 + pointer.x * 0.3;
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref}>
        <torusGeometry args={[2.2, 0.35, 32, 100]} />
        <MeshDistortMaterial color="#1E6FD9" emissive="#4FA3FF" emissiveIntensity={0.4} distort={0.25} speed={2} />
      </mesh>
    </Float>
  );
}

function FloatingOrb({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={3} floatIntensity={1.5}>
      <mesh position={position}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 opacity-80">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#4FA3FF" />
        <pointLight position={[-5, -3, 3]} intensity={0.8} color="#F5821F" />
        <FloatingRing />
        <FloatingOrb position={[-2.5, 1.5, 0]} color="#F5821F" />
        <FloatingOrb position={[2.8, -1.2, 0.5]} color="#38BDF8" />
        <FloatingOrb position={[0, 2.5, -1]} color="#FFA94D" />
      </Canvas>
    </div>
  );
}
