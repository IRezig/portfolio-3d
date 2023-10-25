import { useState } from 'react';

import { MenuContext } from '../context/menu-context';

export const Menu = ({ children }: { children: React.ReactNode }) => {
  const [shown, showMenu] = useState(false);

  return (
    <MenuContext.Provider value={{ shown, showMenu }}>
      {children}
      {shown ? (
        <div
          style={{
            position: 'fixed',
            height: 120,
            background: 'rgba(255, 255, 255, 0.1)',
            left: '20%',
            right: '20%',
            bottom: '10%',
            borderRadius: 10,
            zIndex: 10,
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 22, textAlign: 'center' }}>
            Press `SPACE` to view more
          </div>
        </div>
      ) : null}
      ;
    </MenuContext.Provider>
  );
};
