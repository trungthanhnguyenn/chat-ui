import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { ProviderSelector } from './ProviderSelector';

function ChatInput({ disabled }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const { sendMessage } = useWebSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    sendMessage(message.trim());
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-5">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end gap-3">
            <div className="flex-1 relative rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:border-gray-300 dark:hover:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 focus-within:border-blue-500 dark:focus-within:border-blue-400">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? "Connecting..." : "Type your message... (Shift+Enter for new line)"}
                disabled={disabled}
                rows={1}
                className="w-full resize-none bg-transparent px-5 pt-3.5 pb-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed max-h-32 overflow-y-auto"
                style={{ minHeight: '52px' }}
              />
              {/* Control bar inside textarea container */}
              <div className="flex items-center justify-between px-5 pb-2">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  Press Enter to send, Shift+Enter for new line
                </p>
                <div className="flex items-center">
                  <ProviderSelector />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className="flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white p-3.5 transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:transform-none"
              aria-label="Send message"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInput;
