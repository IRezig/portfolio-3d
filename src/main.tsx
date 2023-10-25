import './index.css';

import { createRoot } from 'react-dom/client';

import App from './App';

const root = document.getElementById('root') as unknown as DocumentFragment;
createRoot(root).render(<App />);
