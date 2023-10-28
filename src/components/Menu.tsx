import { useState } from 'react';

import { MenuContext } from '../context/menu-context';

export const Menu = ({ children }: { children: React.ReactNode }) => {
  const [shown, showMenu] = useState(false);

  return (
    <MenuContext.Provider value={{ shown, showMenu }}>
      {children}
      {shown ? (
        <div className="fixed flex left-0 right-0 bottom-[5%] justify-center items-center">
          <div className="px-12 py-6 bounce bg-opacity-10 bg-white bottom-[10%] rounded-lg z-10 text-white">
            <div className="text-sm font-bold uppercase">Press `SPACE` to view more</div>
          </div>
        </div>
      ) : null}
      ;
    </MenuContext.Provider>
  );
};
