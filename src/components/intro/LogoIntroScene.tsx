"use client";

import { Component, type ReactNode, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, useTexture, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";

const UNBOUNDED_FONT =
  "https://cdn.jsdelivr.net/npm/@fontsource/unbounded@5.0.18/files/unbounded-latin-800-normal.woff";

function Spark({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.15;
    ref.current.rotation.z = clock.getElapsedTime() * 1.5;
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.06, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={0.9} />
    </mesh>
  );
}

function FloatingOrb({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2.5} floatIntensity={1.4}>
      <mesh position={position}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} transparent opacity={0.9} />
      </mesh>
    </Float>
  );
}

function LogoPlane() {
  const ref = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture("/brand/fitbeat-logo.png");
  const startTime = useRef(Date.now());

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const intro = Math.min(1, (Date.now() - startTime.current) / 800);
    const ease = 1 - Math.pow(1 - intro, 3);

    if (ref.current) {
      ref.current.rotation.y = Math.sin(elapsed * 0.7) * 0.22;
      ref.current.scale.setScalar(3.2 * ease);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(3.6 * (1 + Math.sin(elapsed * 2) * 0.06) * ease);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.25} floatIntensity={1}>
      <group>
        <mesh ref={glowRef} position={[0, 0, -0.05]} scale={[0, 0, 1]}>
          <planeGeometry args={[1.8, 1.8]} />
          <meshBasicMaterial color="#4FA3FF" transparent opacity={0.18} />
        </mesh>
        <mesh ref={ref} scale={[0, 0, 1]}>
          <planeGeometry args={[1.6, 1.6]} />
          <meshStandardMaterial
            map={texture}
            transparent
            toneMapped={false}
            emissive="#ffffff"
            emissiveIntensity={0.22}
            emissiveMap={texture}
          />
        </mesh>
      </group>
    </Float>
  );
}

function LogoTextFallback() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.15;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
      <group ref={ref}>
        <Text position={[-0.72, 0, 0]} fontSize={0.48} font={UNBOUNDED_FONT} color="#4FA3FF" anchorX="center">
          FIT
        </Text>
        <Text position={[0.72, 0, 0]} fontSize={0.48} font={UNBOUNDED_FONT} color="#F5821F" anchorX="center">
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

function SpinRing({ radius, thickness, speed, color, emissive, opacity }: {
  radius: number; thickness: number; speed: number; color: string; emissive: string; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.getElapsedTime() * speed;
    ref.current.rotation.z = clock.getElapsedTime() * speed * 0.6;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.8]}>
      <torusGeometry args={[radius, thickness, 16, 80]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.6} transparent opacity={opacity} />
    </mesh>
  );
}

function PulseRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.8) * 0.08;
    ref.current.scale.setScalar(pulse);
    ref.current.rotation.z = clock.getElapsedTime() * 0.15;
  });
  return (
    <mesh ref={ref} position={[0, 0, -1]}>
      <ringGeometry args={[1.55, 1.62, 64]} />
      <meshBasicMaterial color="#F5821F" transparent opacity={0.25} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 2, 4]} intensity={2} color="#4FA3FF" />
      <pointLight position={[-3, -1, 3]} intensity={1.5} color="#F5821F" />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#ffffff" />
      <FloatingOrb position={[-1.8, 1.1, 0.2]} color="#F5821F" />
      <FloatingOrb position={[1.9, -0.9, 0.3]} color="#38BDF8" />
      <FloatingOrb position={[0.2, 1.6, -0.4]} color="#FFA94D" />
      <Spark position={[-1.2, 0.8, 0.5]} color="#4FA3FF" />
      <Spark position={[1.1, -0.6, 0.4]} color="#F5821F" />
      <Spark position={[0.5, 1.2, 0.6]} color="#38BDF8" />
      <PulseRing />
      <SpinRing radius={1.4} thickness={0.04} speed={0.35} color="#1E6FD9" emissive="#4FA3FF" opacity={0.4} />
      <SpinRing radius={1.65} thickness={0.025} speed={-0.25} color="#F5821F" emissive="#F5821F" opacity={0.25} />
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
