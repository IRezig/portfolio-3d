import { Plane } from '@react-three/drei';
import { Euler } from 'three';

export const Ground = () => {
  const groundRotation = new Euler(30, 0, 0);

  return (
    <Plane args={[80, 60]} rotation={groundRotation} position={[0, -20, 0]}>
      <meshBasicMaterial color={[0.3, 0.3, 0.3]} />
    </Plane>
  );
};
