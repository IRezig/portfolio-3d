/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, MeshProps } from '@react-three/fiber';

export const SceneBG = () => (
  <Canvas camera={{ position: [2, 2, 10], fov: 20 }}>
    <group position={[0.25, -1, 0]}>
      <Bun />
    </group>
    <Environment preset="forest" background blur={0.7} />
    <OrbitControls makeDefault />
  </Canvas>
);

function Bun(props: MeshProps) {
  const { nodes } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bunny/model.gltf',
  ) as any;
  console.log('SceneBG');

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.bunny.geometry}
      {...props}
      dispose={null}
    >
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
