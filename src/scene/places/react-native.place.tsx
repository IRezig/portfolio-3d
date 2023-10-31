import { useBox } from '@react-three/cannon';
import { Float } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Euler, Group, Vector3 } from 'three';

import { useSceneContext } from '../../context/scene-context';
import { angleToRad } from '../../services/vector-helpers';
import { Atom } from '../objects/Atom';
import { TargetSpotlight } from '../objects/TargetSpotlight';
import { Text } from '../objects/Text';

const Stairs = (props: GroupProps) => {
  const stepCount = 5; // Number of steps
  const stepHeight = 1; // Height of each step
  const initialWidth = 30; // Width of the first step
  const widthIncrement = 2; // Amount by which each step's width increases

  return (
    <group {...props}>
      {Array.from({ length: stepCount }).map((_, index) => {
        const yPosition = stepHeight * index;
        const width = initialWidth - widthIncrement * index;
        const depth = 10; // Depth remains constant for simplicity

        return (
          <mesh key={index} position={[0, yPosition, 0]} castShadow>
            <boxGeometry args={[width, stepHeight, depth]} />
            <meshStandardMaterial color={'gray'} />
          </mesh>
        );
      })}
    </group>
  );
};

const Cloud = (props: GroupProps) => {
  return (
    <group {...props}>
      {/* Main Circle */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial color={'white'} />
      </mesh>

      {/* Top-Left Circle */}
      <mesh position={[-3, 3, 0]} castShadow>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color={'white'} />
      </mesh>

      {/* Top-Right Circle */}
      <mesh position={[3, 3, 0]} castShadow>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color={'white'} />
      </mesh>

      {/* Bottom-Left Circle */}
      <mesh position={[-4, -1, 0]} castShadow>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial color={'white'} />
      </mesh>

      {/* Bottom-Right Circle */}
      <mesh position={[4, -1, 0]} castShadow>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
    </group>
  );
};

const Trophy = (props: GroupProps) => {
  return (
    <group {...props}>
      {/* Base */}
      <mesh position={[0, -5, 0]} castShadow>
        <cylinderGeometry args={[3, 3, 1, 32]} />
        <meshStandardMaterial color={'brown'} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[2, 2, 10, 32]} />
        <meshStandardMaterial color={'gold'} />
      </mesh>

      {/* Top */}
      <mesh position={[0, 6, 0]} castShadow>
        <coneGeometry args={[0, 3, 2, 32]} />
        <meshStandardMaterial color={'gold'} />
      </mesh>
    </group>
  );
};

const Wall = (props: GroupProps) => {
  const [ref] = useBox(
    () => ({
      mass: 0,
      ...props,
    }),
    useRef,
  );
  return (
    <mesh castShadow {...props} ref={ref}>
      <boxGeometry args={[70, 20, 2]} />
      <meshStandardMaterial color={'grey'} />
    </mesh>
  );
};

export const ReactNativePlace = (props: GroupProps) => {
  const { position = new Vector3() } = props;
  const ref = useRef<Group>(null);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    exposeObject('ball', ref);
  }, []);
  const textPos = new Vector3(-16, 1.1, 8);
  const textRotation = new Euler(-Math.PI / 2, 0, 0);
  return (
    <>
      <group ref={ref} {...props}>
        <Stairs position={new Vector3(0, 0, 35)} />
        <Cloud position={new Vector3(0, 20, 0)} />
        <Trophy position={new Vector3(-24, 2, 4)} />
        <Trophy position={new Vector3(24, 2, 0)} />
        <Wall
          rotation={new Euler(0, -Math.PI / 2, 0)}
          position={new Vector3(-50, 6, 0)}
        />
        <Wall rotation={new Euler(0, -Math.PI / 2, 0)} position={new Vector3(34, 6, 0)} />
        <Wall rotation={new Euler(0, 0, 0)} position={new Vector3(0, 6, -34)} />
        <Float speed={20} rotationIntensity={0.04} floatIntensity={2}>
          <Atom position={new Vector3(0, 10, 0)} />
        </Float>
        <group position={new Vector3(0, 2, 0)} rotation={[angleToRad(20), 0, 0]}>
          <Text value={'Ju'} position={textPos} rotation={textRotation} />
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
