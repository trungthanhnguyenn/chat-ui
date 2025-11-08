import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import EmptyChat from './EmptyChat';
import logoImage from '../../assets/logo.jpeg';

function ChatContainer({ onToggleSidebar, sidebarOpen }) {
  const { state } = useChat();
  const { connected, sendMessage } = useWebSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.streaming]);

  const handleStartChat = (prompt) => {
    if (prompt && connected) {
      sendMessage(prompt);
    }
  };

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
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Welcome to Chat-UI
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Start a conversation by typing a message below. Your chat history will be saved automatically.
              </p>
            </div>
          ) : (
            <>
              {state.messages.map((message) => {
                const isLastMessage = message === state.messages[state.messages.length - 1];
                const isStreamingMessage = isLastMessage && state.streaming && message.role === 'assistant';
                
                return (
                  <ChatMessage 
                    key={message.id || message.timestamp} // Use unique ID or timestamp as fallback
                    message={message}
                    isStreaming={isStreamingMessage}
                  />
                );
              })}
              
              {/* Typing Indicator - chỉ hiện khi chưa có assistant message */}
              {state.streaming && (state.messages.length === 0 || state.messages[state.messages.length - 1]?.role === 'user') && (
                <TypingIndicator 
                  variant="both" 
                  message="Thinking"
                  isStreaming={false}
                />
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
          
          {state.loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
      
      <ChatInput disabled={!connected || state.streaming} />
    </div>
  );
}

export default ChatContainer;
