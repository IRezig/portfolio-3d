import { Line, Sphere } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { forwardRef, useMemo } from 'react';
import { EllipseCurve, Group } from 'three';

import { Electron } from './Electron';

export const Atom = forwardRef<Group>(({ ...props }: GroupProps, ref) => {
  const points = useMemo(
    () => new EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100),
    [],
  );

  return (
    <group ref={ref} {...props}>
      <Line castShadow worldUnits points={points} color="turquoise" lineWidth={0.3} />
      <Line
        castShadow
        worldUnits
        points={points}
        color="turquoise"
        lineWidth={0.3}
        rotation={[0, 0, 1]}
      />
      <Line
        castShadow
        worldUnits
        points={points}
        color="turquoise"
        lineWidth={0.3}
        rotation={[0, 0, -1]}
      />
      <Electron position={[0, 0, 0.5]} speed={6} />
      <Electron position={[0, 0, 0.5]} rotation={[0, 0, Math.PI / 3]} speed={6.5} />
      <Electron position={[0, 0, 0.5]} rotation={[0, 0, -Math.PI / 3]} speed={7} />
      <Sphere args={[0.55, 64, 64]}>
        <meshBasicMaterial color={[6, 0.5, 2]} />
      </Sphere>
    </group>
  );
});
Atom.displayName = 'Atom';
