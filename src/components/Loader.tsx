import config from '../config/config';

export const Loader = ({ progress }: { progress: number }) => {
  return (
    <div
      className="flex h-full justify-center items-center"
      style={{
        backgroundColor: config.scene.backgroundColor,
      }}
    >
      <div className="text-white bounce font-bold text-3xl">
        {Number(progress).toFixed(0)}%
      </div>
    </div>
  );
};
