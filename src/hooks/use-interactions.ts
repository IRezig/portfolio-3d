import { useCameraHandler } from './use-camera-handler';
import { useKeyDown } from './use-key-press';

let toggleCamerView = false;

export const useInteractions = () => {
  const { focusPosition } = useCameraHandler();

  useKeyDown(({ key }) => {
    if (key === 'p') {
      toggleCamerView = !toggleCamerView;
      if (!toggleCamerView) {
        focusPosition(0.4, [0, 0, 0]);
      } else {
        focusPosition(1.2, [0, 3, 10]);
      }
    }
  });
};
