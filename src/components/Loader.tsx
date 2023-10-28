import { Html, useProgress } from '@react-three/drei';

import config from '../config/config';

export function Loader() {
  const { progress } = useProgress();
  return (
    <Html fullscreen>
      <div
        className="flex height-[100%] flex-1 justify-center items-center"
        style={{
          backgroundColor: config.scene.backgroundColor,
        }}
      >
        <div className="text-white font-bold font-size-lg">
          {Number(progress).toFixed(0)}%
        </div>
      </div>
    </Html>
  );
}
