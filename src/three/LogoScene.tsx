import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function usePinShape() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 2.05);
    shape.bezierCurveTo(1.55, 2.05, 2.05, 0.75, 2.05, -0.1);
    shape.bezierCurveTo(2.05, -1.25, 0.95, -2.15, 0, -3.0);
    shape.bezierCurveTo(-0.95, -2.15, -2.05, -1.25, -2.05, -0.1);
    shape.bezierCurveTo(-2.05, 0.75, -1.55, 2.05, 0, 2.05);
    return shape;
  }, []);
}

function useSwoosh() {
  return useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.55, -1.15, 0.42),
      new THREE.Vector3(-0.75, -1.55, 0.5),
      new THREE.Vector3(0.35, -1.4, 0.52),
      new THREE.Vector3(1.15, -0.6, 0.45),
      new THREE.Vector3(1.45, 0.35, 0.3),
      new THREE.Vector3(1.05, 1.05, 0.12),
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.16, 16, false);
  }, []);
}

function Mark() {
  const pin = usePinShape();
  const swoosh = useSwoosh();
  const group = useRef<THREE.Group>(null);
  const started = useRef<number | null>(null);

  useFrame((state, delta) => {
    const root = group.current;
    if (!root) return;
    if (started.current === null) started.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - started.current;

    // settle rotation + gentle breathing
    const settle = Math.min(1, t / 1.7);
    const eased = 1 - Math.pow(1 - settle, 3);
    const baseY = THREE.MathUtils.lerp(-2.1, 0.28, eased);
    root.rotation.y = THREE.MathUtils.lerp(baseY, 0, 0) * (1 - eased) + baseY * 0;
    root.rotation.y = baseY + Math.sin(t * 0.55) * 0.08;
    root.rotation.x = THREE.MathUtils.lerp(0.35, 0.06, eased) + Math.sin(t * 0.4) * 0.03;
    root.position.y = Math.sin(t * 0.9) * 0.09 - (1 - eased) * 1.4;

    // mouse parallax
    const px = state.pointer.x;
    const py = state.pointer.y;
    root.rotation.y += px * 0.16;
    root.rotation.x += py * 0.08;
    root.position.x += (px * 0.22 - root.position.x) * Math.min(1, delta * 2.4);
  });

  return (
    <group ref={group} position={[0, 0, 0]} rotation={[0.3, -2.1, 0]}>
      {/* green pin shell */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <extrudeGeometry
          args={[
            pin,
            {
              depth: 0.62,
              bevelEnabled: true,
              bevelSize: 0.09,
              bevelThickness: 0.09,
              bevelSegments: 3,
              curveSegments: 28,
            },
          ]}
        />
        <meshStandardMaterial color="#0f5e58" roughness={0.42} metalness={0.18} />
      </mesh>

      {/* cream inner disc */}
      <mesh position={[0, 0.62, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.24, 1.24, 0.5, 48]} />
        <meshStandardMaterial color="#fdfaf3" roughness={0.75} />
      </mesh>

      {/* gold house */}
      <group position={[0, 0.62, 0.68]}>
        <RoundedBox args={[0.92, 0.7, 0.34]} radius={0.06} smoothness={3} position={[0, -0.22, 0]}>
          <meshStandardMaterial color="#ca9c5e" roughness={0.35} metalness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.82, 0.82, 0.34, 3]} />
          <meshStandardMaterial color="#ca9c5e" roughness={0.32} metalness={0.32} />
        </mesh>
        <mesh position={[0.34, 0.34, 0]}>
          <boxGeometry args={[0.16, 0.42, 0.34]} />
          <meshStandardMaterial color="#ca9c5e" roughness={0.32} metalness={0.32} />
        </mesh>
        <mesh position={[-0.22, -0.2, 0.2]}>
          <boxGeometry args={[0.26, 0.3, 0.06]} />
          <meshStandardMaterial color="#0f5e58" roughness={0.6} />
        </mesh>
      </group>

      {/* gold travel path */}
      <mesh geometry={swoosh} position={[0, 0.1, 0.08]}>
        <meshStandardMaterial color="#ca9c5e" roughness={0.28} metalness={0.55} />
      </mesh>
    </group>
  );
}

export default function LogoScene({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.85} color="#fff6e6" />
        <directionalLight
          position={[4, 6, 5]}
          intensity={2.1}
          color="#ffe8c4"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4, 1, 2]} intensity={0.7} color="#9fd0c8" />
        <pointLight position={[0, -2.4, 3]} intensity={1.6} color="#ca9c5e" distance={9} />
        <Mark />
        <ContactShadows
          position={[0, -3.05, 0]}
          opacity={0.28}
          scale={9}
          blur={2.6}
          far={4}
          color="#5b4320"
        />
      </Canvas>
    </div>
  );
}
