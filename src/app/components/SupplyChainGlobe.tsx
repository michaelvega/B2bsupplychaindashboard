import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Line,
  Text,
  Sphere,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';

/* ── Supply Chain Hubs ── */
interface Hub {
  id: string;
  name: string;
  lat: number;
  lng: number;
  volume: number; // shipments/day
  risk: 'low' | 'medium' | 'high';
}

const HUBS: Hub[] = [
  { id: 'sha', name: 'Shanghai', lat: 31.23, lng: 121.47, volume: 3400, risk: 'medium' },
  { id: 'shen', name: 'Shenzhen', lat: 22.54, lng: 114.06, volume: 2800, risk: 'low' },
  { id: 'sg', name: 'Singapore', lat: 1.35, lng: 103.82, volume: 4200, risk: 'low' },
  { id: 'dxb', name: 'Dubai', lat: 25.20, lng: 55.27, volume: 1900, risk: 'medium' },
  { id: 'rtm', name: 'Rotterdam', lat: 51.92, lng: 4.48, volume: 3100, risk: 'low' },
  { id: 'lax', name: 'Los Angeles', lat: 33.94, lng: -118.41, volume: 2600, risk: 'high' },
  { id: 'ham', name: 'Hamburg', lat: 53.55, lng: 9.99, volume: 2200, risk: 'low' },
  { id: 'tyo', name: 'Tokyo', lat: 35.68, lng: 139.76, volume: 2900, risk: 'medium' },
];

/* ── Active Trade Routes ── */
const ROUTES: [string, string][] = [
  ['sha', 'lax'],
  ['sha', 'rtm'],
  ['shen', 'sg'],
  ['shen', 'dxb'],
  ['sg', 'dxb'],
  ['sg', 'rtm'],
  ['dxb', 'rtm'],
  ['dxb', 'ham'],
  ['rtm', 'ham'],
  ['rtm', 'lax'],
  ['tyo', 'lax'],
  ['tyo', 'sha'],
  ['ham', 'lax'],
  ['shen', 'rtm'],
];

function latLngToPosition(lat: number, lng: number, radius: number = 5): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

/* ── Animated Arc ── */
function ArcCurve({
  start,
  end,
  color,
  speed,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 + 1.5,
    (start[2] + end[2]) / 2,
  ];

  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...midpoint),
      new THREE.Vector3(...end),
    );
  }, [start, end, midpoint]);

  const points = useMemo(() => curve.getPoints(80), [curve]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions: number[] = [];
    const alphas: number[] = [];
    for (let i = 0; i < points.length; i++) {
      positions.push(points[i].x, points[i].y, points[i].z);
      alphas.push(i / points.length);
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1));
    return g;
  }, [points]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = clock.getElapsedTime() * speed;
    }
  });

  const shaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader: /* glsl */ `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = alpha;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float dash = fract(vAlpha - uTime);
          float alpha = smoothstep(0.0, 0.08, dash) * smoothstep(0.35, 0.25, dash);
          alpha *= 0.6;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [color]);

  return (
    <line ref={meshRef} geometry={geometry} material={shaderMat} />
  );
}

/* ── Traveling Particle ── */
function TravelingParticle({
  start,
  end,
  color,
  speed,
  delay,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed: number;
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 + 1.5,
    (start[2] + end[2]) / 2,
  ];

  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...midpoint),
      new THREE.Vector3(...end),
    );
  }, [start, end, midpoint]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = ((clock.getElapsedTime() * speed + delay) % 1);
      const pt = curve.getPoint(t);
      meshRef.current.position.copy(pt);
      const size = 0.04 + 0.06 * Math.sin(t * Math.PI);
      meshRef.current.scale.setScalar(size);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} depthWrite={false} />
    </mesh>
  );
}

/* ── Hub Node ── */
function HubNode({
  position,
  color,
  name,
  volume,
  risk,
}: {
  position: [number, number, number];
  color: string;
  name: string;
  volume: number;
  risk: string;
}) {
  const ringRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + 0.15 * Math.sin(t * 2));
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + 0.15 * Math.sin(t * 2);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.6 + 0.2 * Math.sin(t * 1.5 + 1));
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + 0.04 * Math.sin(t * 1.5 + 1);
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.015, 16, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} depthWrite={false} />
      </mesh>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Label */}
      <Html distanceFactor={8} position={[0, 0.22, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-semibold tracking-wider text-white/90 whitespace-nowrap leading-tight"
                style={{ textShadow: '0 0 8px rgba(0,0,0,0.8)' }}>
            {name}
          </span>
          <span className="text-[7px] font-medium text-white/50 tracking-tight"
                style={{ textShadow: '0 0 6px rgba(0,0,0,0.8)' }}>
            {volume.toLocaleString()} TEU
          </span>
        </div>
      </Html>
    </group>
  );
}

/* ── Grid Floor ── */
function GridFloor() {
  return (
    <group>
      <gridHelper args={[14, 28, '#1a1a2e', '#0d0d1a']} position={[0, -3.5, 0]} />
      {/* Subtle radial gradient plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.52, 0]}>
        <planeGeometry args={[14, 14]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{
            uTime: { value: 0 },
          }}
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              vUv = uv;
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              float d = length(vUv - 0.5) * 2.0;
              float alpha = smoothstep(1.0, 0.0, d) * 0.06;
              gl_FragColor = vec4(0.4, 0.5, 1.0, alpha);
            }
          `}
        />
      </mesh>
    </group>
  );
}

/* ── Ambient Particles ── */
function AmbientParticles({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#8899cc"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Main Scene ── */
function Scene() {
  const groupRef = useRef<THREE.Group>(null!);
  const hubPositions = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    HUBS.forEach((h) => {
      map.set(h.id, latLngToPosition(h.lat, h.lng, 5));
    });
    return map;
  }, []);

  const riskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <GridFloor />
      <AmbientParticles />

      {/* Hub nodes */}
      {HUBS.map((hub) => {
        const pos = hubPositions.get(hub.id)!;
        return (
          <HubNode
            key={hub.id}
            position={pos}
            color={riskColor(hub.risk)}
            name={hub.name}
            volume={hub.volume}
            risk={hub.risk}
          />
        );
      })}

      {/* Trade route arcs */}
      {ROUTES.map(([from, to], i) => {
        const start = hubPositions.get(from)!;
        const end = hubPositions.get(to)!;
        const routeColor = ['#334155', '#1e293b', '#475569'][i % 3];
        return (
          <group key={`${from}-${to}`}>
            <ArcCurve start={start} end={end} color={routeColor} speed={0.12 + (i % 5) * 0.03} />
            <TravelingParticle
              start={start}
              end={end}
              color="#ffffff"
              speed={0.1 + (i % 7) * 0.02}
              delay={i * 0.07}
            />
            <TravelingParticle
              start={start}
              end={end}
              color="#60a5fa"
              speed={0.08 + (i % 5) * 0.03}
              delay={i * 0.07 + 0.33}
            />
          </group>
        );
      })}

      {/* Subtle sphere wireframe for the globe feel */}
      <mesh>
        <sphereGeometry args={[5.05, 48, 24]} />
        <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Exported Component ── */
export function SupplyChainGlobe({ className }: { className?: string }) {
  return (
    <div className={className} style={{ background: 'radial-gradient(ellipse at center, #0f0f1a 0%, #06060d 60%, #020208 100%)' }}>
      <Canvas
        camera={{ position: [0, 3.5, 9], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 8, 5]} intensity={2} color="#334466" />
        <pointLight position={[-5, 2, -3]} intensity={1} color="#223355" />
        <Scene />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={4}
          maxDistance={14}
          maxPolarAngle={Math.PI * 0.65}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.15}
        />
        <fog attach="fog" args={['#06060d', 8, 22]} />
      </Canvas>
    </div>
  );
}
