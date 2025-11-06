import React from 'react';
import { FiMenu, FiWifi, FiWifiOff, FiZap } from 'react-icons/fi';
import logoImage from '../../assets/logo.jpeg';

function ChatHeader({ onToggleSidebar, sidebarOpen, connected, sessionId }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 backdrop-blur-sm shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-5">
        {/* Header with Twin-T and Slogan */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button
                onClick={onToggleSidebar}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-110 active:scale-95"
                aria-label="Toggle sidebar"
              >
                <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            
            <div className="flex items-center gap-3">
              {/* Twin-T with Logo */}
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/30 bg-white dark:bg-gray-800 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Twin-T Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Twin-T
                </h1>
                {/* Slogan Badge below Twin-T */}
                <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm shadow-md mt-1 w-fit">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse blur-sm"></div>
                  <FiZap className="w-3 h-3 text-blue-600 dark:text-blue-400 relative z-10 animate-pulse" />
                  <span className="text-xs font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent relative z-10">
                    To Win Together !
                  </span>
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {connected ? (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <FiWifi className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <FiWifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-semibold text-red-700 dark:text-red-400">Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
