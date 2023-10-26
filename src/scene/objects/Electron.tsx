import { Sphere, Trail } from '@react-three/drei';
import { GroupProps, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, Mesh } from 'three';

export const Electron = ({
  radius = 2.75,
  speed = 6,
  ...props
}: GroupProps & {
  speed?: number;
  radius?: number;
}) => {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current?.position.set(
      Math.sin(t) * radius,
      (Math.cos(t) * radius * Math.atan(t)) / Math.PI / 1.25,
      0,
    );
  });

  return (
    <group {...props}>
      <Trail width={5} length={6} color={new Color(2, 1, 10)} attenuation={(t) => t * t}>
        <mesh ref={ref}>
          <Sphere args={[0.25]} />
          <meshBasicMaterial color={[10, 1, 10]} />
        </mesh>
      </Trail>
    </group>
  );
};
