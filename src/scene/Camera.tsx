import { useFrame } from '@react-three/fiber';

import { useCameraHandler } from '../hooks/use-camera-handler';

export const CameraAnimationHandler = () => {
  const { runAnimation } = useCameraHandler();

  useFrame(({ camera }) => {
    const [x, y, z] = runAnimation();
    camera.lookAt(x, y, z);
  });

  return null;
};
