/* ATRYÊ Sweet Studio × Weird Cute: o GLB da referência é o objeto central; iluminação macia mantém a peça legível e pronta para personalização. */
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

const MODEL_URL = "/manus-storage/atrye-shirt-baked_cdef6abd.glb";

type GLTFResult = { nodes: { T_Shirt_male: { geometry: THREE.BufferGeometry } }; materials: { lambert1: THREE.MeshStandardMaterial } };

function ShirtModel({ color, back }: { color: string; back: boolean }) {
  const { nodes, materials } = useGLTF(MODEL_URL) as unknown as GLTFResult;
  useEffect(() => {
    materials.lambert1.color.set(color);
    materials.lambert1.roughness = 0.92;
    materials.lambert1.metalness = 0;
  }, [materials, color]);
  return (
    <mesh geometry={nodes.T_Shirt_male.geometry} material={materials.lambert1} castShadow receiveShadow rotation={[0, back ? Math.PI : 0, 0]}>
      <meshStandardMaterial attach="material" color={color} roughness={0.92} metalness={0} />
    </mesh>
  );
}

export default function ShirtCanvas({ color, back, rotating = false, speed = 1 }: { color: string; back: boolean; rotating?: boolean; speed?: number }) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 2.02], fov: 25 }} gl={{ preserveDrawingBuffer: true, antialias: true }}>
      <ambientLight intensity={1.25} />
      <directionalLight position={[2, 3, 4]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 1, 2]} intensity={1.1} color="#ffd4df" />
      <Environment preset="studio" />
      <ShirtModel color={color} back={back} />
      <ContactShadows position={[0, -0.95, 0]} opacity={0.28} scale={2.4} blur={2.5} far={2.2} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={rotating} autoRotateSpeed={speed} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 1.9} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
