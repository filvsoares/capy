import './index.css';

import { createRoot } from 'react-dom/client';

import App from '@/app';

const rootDiv = document.getElementById('root-div')!;

createRoot(rootDiv).render(<App />);
