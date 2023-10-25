import { createContext, useContext } from 'react';

export interface MenuContextType {
  shown: boolean;
  showMenu: (shown: boolean) => void;
}

export const MenuContext = createContext<MenuContextType | null>(null);
export const useMenuContext = () => useContext(MenuContext) as MenuContextType;
