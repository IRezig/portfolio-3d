import { Menu } from './components/Menu';
import { Scene } from './scene/Scene';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Menu>
        <Scene />
      </Menu>
    </div>
  );
}
