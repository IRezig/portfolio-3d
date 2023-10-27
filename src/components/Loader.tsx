import { Html, useProgress } from '@react-three/drei';

import config from '../config/config';

export function Loader() {
  const { progress } = useProgress();
  return (
    <Html fullscreen>
      <div
        style={{
          display: 'flex',
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: config.scene.backgroundColor,
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 42,
        }}
      >
        {Number(progress).toFixed(0)}%
      </div>
    </Html>
  );
}
