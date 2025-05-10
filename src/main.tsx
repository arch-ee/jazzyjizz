
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make sure root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Could not find root element");
  document.body.innerHTML = '<div id="root"></div>';
}

// Create root with modern React 18 API
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
