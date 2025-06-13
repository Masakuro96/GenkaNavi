
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { UserDataProvider } from './contexts/UserDataContext'; // Import UserDataProvider

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <UserDataProvider> {/* Wrap App with UserDataProvider */}
        <App />
      </UserDataProvider>
    </HashRouter>
  </React.StrictMode>
);
