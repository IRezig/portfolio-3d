import { Plane } from '@react-three/drei';
import { Euler } from 'three';

export const Ground = () => {
  const groundRotation = new Euler(-Math.PI / 2, 0, 0);

  return (
    <Plane args={[1000, 1000]} rotation={groundRotation} position={[0, 0, 0]}>
      <meshBasicMaterial color={[0.3, 0.3, 0.3]} />
    </Plane>
  );
};
