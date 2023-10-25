import { useEffect } from 'react';

import { useCameraHandler } from './use-camera-handler';

let toggleCamerView = false;

export const useInteractions = () => {
  const { focusPosition } = useCameraHandler();

  const onKeyPress = (key: string) => {
    if (key === 'p') {
      toggleCamerView = !toggleCamerView;
      if (!toggleCamerView) {
        focusPosition(0.4, [0, 0, 0]);
      } else {
        focusPosition(1.2, [0, 3, 10]);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', (event) => onKeyPress(event.key));
  }, []);
};
