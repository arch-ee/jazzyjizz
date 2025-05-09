
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
const root = createRoot(document.getElementById("root")!);

// Wrap app render in error boundary
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error rendering app:", error);
  
  // Show fallback UI if rendering fails
  root.render(
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>Something went wrong</h1>
      <p>Please try refreshing the page.</p>
      <button onClick={() => window.location.reload()}>
        Refresh Page
      </button>
    </div>
  );
}
