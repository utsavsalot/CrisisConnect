import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { EmergencyProvider } from '../context/EmergencyContext';
import { ChatProvider } from '../context/ChatContext';
import { NGOPortalApp } from './NGOPortalApp';
import '../index.css';
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('ngo-root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <EmergencyProvider>
          <ChatProvider>
            <BrowserRouter>
              <NGOPortalApp />
            </BrowserRouter>
          </ChatProvider>
        </EmergencyProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
