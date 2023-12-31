import { Float, OrbitControls } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Euler, Group, Vector3 } from 'three';

import { useSceneContext } from '../../context/scene-context';
import { angleToRad } from '../../services/vector-helpers';
import { Atom } from '../objects/Atom';
import { TargetSpotlight } from '../objects/TargetSpotlight';
import { Text } from '../objects/Text';

const PictureFrame = (props: GroupProps) => {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[6, 6, 1]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
      <mesh position={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[4, 4, 1]} />
        <meshStandardMaterial color={'black'} />
      </mesh>
      <mesh position={[0, 0, 0.6]} castShadow>
        <boxGeometry args={[2, 2, 1]} />
        <meshStandardMaterial color={'red'} />
      </mesh>
    </group>
  );
};

const Wall = (props: GroupProps) => {
  return (
    <mesh castShadow {...props}>
      <boxGeometry args={[1, 16, 30]} />
      <meshStandardMaterial color={'green'} />
    </mesh>
  );
};

const Room = (props: GroupProps) => {
  return (
    <group {...props}>
      <PictureFrame position={[0, 5, -14]} />
      <Wall position={[0, 0, -15]} rotation={new Euler(0, Math.PI / 2, 0)} />
      <Wall position={[-15, 2.5, 0]} />
      <Wall position={[15, 2.5, 0]} />
    </group>
  );
};

export const TheBesmaPlace = (props: GroupProps) => {
  const { position = new Vector3() } = props;
  const ref = useRef<Group>(null);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    exposeObject('besma', ref);
  }, []);

  const textPos = new Vector3(-16, 1.1, 8);
  const textRotation = new Euler(-Math.PI / 2, 0, 0);
  return (
    <>
      <group ref={ref} {...props}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Room />
        <Wall position={[100, 0, -60]} />
        <Float speed={20} rotationIntensity={0.04} floatIntensity={2}>
          <Atom position={new Vector3(100, 10, 0)} />
        </Float>
        <group position={new Vector3(100, 2, 0)} rotation={[angleToRad(20), 0, 0]}>
          <Text value={'Besma'} position={textPos} rotation={textRotation} />
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[38, 4, 24]} />
            <meshStandardMaterial color={'grey'} />
          </mesh>
        </group>
      </group>
      <TargetSpotlight
        distance={210}
        intensity={1200}
        targetPosition={new Vector3(position.x, 39, position.z - 10)}
      />
    </>
  );
};
