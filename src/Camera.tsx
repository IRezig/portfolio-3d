import { useFrame } from '@react-three/fiber';

import { useFocusCamera } from './hooks/use-focus-camera';

export const CameraAnimationHandler = () => {
  const { runAnimation, cameraLookAt } = useFocusCamera();

  useFrame(({ camera }) => {
    runAnimation();
    const [x, y, z] = cameraLookAt;
    camera.lookAt(x, y, z);
  });

  return null;
};
