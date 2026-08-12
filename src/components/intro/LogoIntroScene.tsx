"use client";

import { Component, type ReactNode, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, useTexture, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";

const UNBOUNDED_FONT =
  "https://cdn.jsdelivr.net/npm/@fontsource/unbounded@5.0.18/files/unbounded-latin-800-normal.woff";

function FloatingOrb({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2.5} floatIntensity={1.2}>
      <mesh position={position}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} transparent opacity={0.85} />
      </mesh>
    </Float>
  );
}

function LogoPlane() {
  const ref = useRef<THREE.Mesh>(null!);
  const texture = useTexture("/brand/fitbeat-logo.png");

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.8}>
      <mesh ref={ref} scale={[3.2, 3.2, 1]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshStandardMaterial
          map={texture}
          transparent
          toneMapped={false}
          emissive="#ffffff"
          emissiveIntensity={0.08}
        />
      </mesh>
    </Float>
  );
}

function LogoTextFallback() {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.12;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.8}>
      <group ref={ref}>
        <Text position={[-0.72, 0, 0]} fontSize={0.42} font={UNBOUNDED_FONT} color="#4FA3FF" anchorX="center">
          FIT
        </Text>
        <Text position={[0.72, 0, 0]} fontSize={0.42} font={UNBOUNDED_FONT} color="#F5821F" anchorX="center">
          BEAT
        </Text>
      </group>
    </Float>
  );
}

class LogoTextureBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <LogoTextFallback /> : this.props.children;
  }
}

function SpinRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.getElapsedTime() * 0.35;
    ref.current.rotation.z = clock.getElapsedTime() * 0.2;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.8]} scale={1.1}>
      <torusGeometry args={[1.4, 0.04, 16, 80]} />
      <meshStandardMaterial color="#1E6FD9" emissive="#4FA3FF" emissiveIntensity={0.5} transparent opacity={0.35} />
    </mesh>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 4]} intensity={1.4} color="#4FA3FF" />
      <pointLight position={[-3, -1, 3]} intensity={1} color="#F5821F" />
      <FloatingOrb position={[-1.8, 1.1, 0.2]} color="#F5821F" />
      <FloatingOrb position={[1.9, -0.9, 0.3]} color="#38BDF8" />
      <FloatingOrb position={[0.2, 1.6, -0.4]} color="#FFA94D" />
      <SpinRing />
      <LogoTextureBoundary>
        <LogoPlane />
      </LogoTextureBoundary>
    </>
  );
}

export function LogoIntroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <SceneContent />
    </Canvas>
  );
}
