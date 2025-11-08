import React, { useState } from 'react';
import ChatContainer from '../components/Chat/ChatContainer';
import Sidebar from '../components/Sidebar/Sidebar';

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {sidebarOpen && (
        <Sidebar onClose={() => setSidebarOpen(false)} />
      )}
      <ChatContainer
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
    </div>
  );
};

export default ChatPage;
