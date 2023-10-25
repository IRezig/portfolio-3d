import React, { useEffect } from 'react';

const Interactions = ({ dispatcher }) => {
  const [content, setContent] = React.useState(null);

  useEffect(() => {
    dispatcher.addEventListener('selectedObject', (e) => {
      setContent(e.message !== null ? 'Google.fr best website ever' : '');
    });
  }, [dispatcher]);

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        close();
      }
      if (e.key === 'P' || e.key === 'p') {
        pause();
      }
    });
  }, []);

  const pause = () => {
    dispatcher.dispatchEvent({ type: 'togglePause' });
  };

  const close = () => {
    dispatcher.dispatchEvent({ type: 'closeContent' });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {content && (
        <div style={{ fontSize: 32, background: 'yellow' }}>
          {content}
          <button onClick={close}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Interactions;
