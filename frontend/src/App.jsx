import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ChatPage from './pages/ChatPage';
import AboutUs from './components/About/AboutUs';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route 
          path="/" 
          element={
            <ChatProvider>
              <WebSocketProvider>
                <ChatPage />
              </WebSocketProvider>
            </ChatProvider>
          } 
        />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
