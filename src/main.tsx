import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  //<StrictMode> 注意。StrictModeはあとで有効にする
    <BrowserRouter>
      <App />
    </BrowserRouter>
  //</StrictMode>
);