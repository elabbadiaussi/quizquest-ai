import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importe vos styles Tailwind
import App from './App';

// 1. Trouve le <div> "root" dans le index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Rend votre composant <App /> à l'intérieur
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);