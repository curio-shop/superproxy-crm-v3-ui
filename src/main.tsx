import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Temporarily disabled StrictMode to debug hooks issue
createRoot(document.getElementById('root')!).render(
  <App />
);
