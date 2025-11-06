import React from 'react';
import { ChatProvider } from './contexts/ChatContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ChatContainer from './components/Chat/ChatContainer';
import Sidebar from './components/Sidebar/Sidebar';
import { useState, useEffect } from 'react';

function App() {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('chatbot_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('chatbot_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <ChatProvider>
      <WebSocketProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          {sidebarOpen && (
            <Sidebar
              onClose={() => setSidebarOpen(false)}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          )}
          <ChatContainer
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
        </div>
      </WebSocketProvider>
    </ChatProvider>
  );
}

export default App;
