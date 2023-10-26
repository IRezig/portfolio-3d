import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';

export const Ground = () => {
  return (
    <AccumulativeShadows
      alphaTest={1}
      scale={1000}
      rotation={[0, 0, 0]}
      position={[0, 0, 10]}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
};
