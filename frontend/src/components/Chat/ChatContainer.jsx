import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import logoImage from '../../assets/logo.jpeg';

function ChatContainer({ onToggleSidebar, sidebarOpen }) {
  const { state } = useChat();
  const { connected } = useWebSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <ChatHeader 
        onToggleSidebar={onToggleSidebar}
        sidebarOpen={sidebarOpen}
        connected={connected}
        sessionId={state.currentSession}
      />
      
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {state.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="mb-6 animate-bounce">
                <img 
                  src={logoImage} 
                  alt="Twin-T Logo" 
                  className="w-32 h-32 rounded-full object-cover shadow-2xl ring-4 ring-blue-100 dark:ring-blue-900/30"
                />
              </div>
              <div className="mb-4">
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3 text-center">
                  Welcome to Twin-T
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm text-center whitespace-nowrap">
                  Twin-T is a multi-agent system designed to serve multiple tasks.
                </p>
              </div>
            </div>
          ) : (
            <>
              {state.messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
          
          {state.loading && (
            <div className="flex justify-center py-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 dark:border-t-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ChatInput disabled={!connected || state.streaming} />
    </div>
  );
}

export default ChatContainer;
