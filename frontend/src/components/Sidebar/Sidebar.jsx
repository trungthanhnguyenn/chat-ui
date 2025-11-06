import React from 'react';
import { FiX, FiSun, FiMoon } from 'react-icons/fi';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

function Sidebar({ onClose, theme, onToggleTheme }) {
  return (
    <div className="w-80 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen shadow-lg">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Conversations
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-110 active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-110 active:scale-95 lg:hidden"
            aria-label="Close sidebar"
          >
            <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      {/* New Chat Button */}
      <div className="p-4">
        <NewChatButton />
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-4">
        <ConversationList />
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
          Twin-T v1.0.0
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
