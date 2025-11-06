import React from 'react';
import { FiMenu, FiWifi, FiWifiOff } from 'react-icons/fi';
import { ProviderSelector } from './ProviderSelector';

function ChatHeader({ onToggleSidebar, sidebarOpen, connected, sessionId }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle sidebar"
              >
                <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            
            <div>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Chat-UI
              </h1>
              {sessionId && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {sessionId.substring(0, 20)}...
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {connected ? (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <FiWifi className="w-5 h-5" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <FiWifiOff className="w-5 h-5" />
                <span className="text-sm font-medium">Disconnected</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Provider Selector */}
        <ProviderSelector />
      </div>
    </div>
  );
}

export default ChatHeader;
