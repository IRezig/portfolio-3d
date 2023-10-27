import { useCameraAnimation } from '../animation/focus-camera-animation';

export const useCameraHandler = () => {
  const { focused, focusObject, unfocusObject, runFocusAnimation } = useCameraAnimation();
  const isFocused = () => focused.current;

  const runCameraFrame = () => {
    runFocusAnimation();
  };

  return {
    focusObject,
    unfocusObject,
    runCameraFrame,
    isFocused,
  };
};
