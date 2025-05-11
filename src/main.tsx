
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

// Debug the current path to help with routing issues
console.log("Current path:", window.location.pathname);
console.log("Current search:", window.location.search);
console.log("Current hash:", window.location.hash);
console.log("Base URL:", import.meta.env.BASE_URL);
console.log("Full URL:", window.location.href);
console.log("App version:", "1.0.1"); // Version tracking for debugging

// Wrap app render in error boundary
try {
  console.log("Starting app render...");
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App rendered successfully");
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
      <p style={{ color: 'red', marginTop: '10px' }}>
        Error: {error instanceof Error ? error.message : String(error)}
      </p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '10px 20px',
          background: '#4dabf7',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Refresh Page
      </button>
    </div>
  );
}
