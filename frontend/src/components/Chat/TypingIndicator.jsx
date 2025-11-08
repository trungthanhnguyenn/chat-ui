import React from 'react';
import logoImage from '../../assets/logo.jpeg';
import BorderBeamIndicator from '../Common/BorderBeamIndicator';

const TypingIndicator = ({ 
  message = 'Thinking', 
  variant = 'both',
  isStreaming = false  // NEW: để phân biệt thinking vs generating
}) => {
  const displayMessage = isStreaming ? 'Generating' : message;
  
  return (
    <div className="flex gap-3 mb-6 justify-start message-enter">
      {/* Bot Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/30 bg-white dark:bg-gray-800 flex items-center justify-center">
          <img 
            src={logoImage} 
            alt="Twin-T AI" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Typing Bubble with Border Beam */}
      <div className="flex flex-col max-w-[75%] sm:max-w-[70%] items-start">
        <div 
          className="relative rounded-2xl px-5 py-3.5 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700/50"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Border Beam - chỉ hiện khi streaming */}
          <BorderBeamIndicator 
            isActive={isStreaming}
            duration={8}
            colorFrom="#6366F1"
            colorTo="#10B981"
          />
          
          <div className="flex items-center gap-2 relative z-10">
            {variant !== 'text' && (
              <div className="flex items-center gap-1">
                <span className="typing-dot bg-gray-400 dark:bg-gray-500"></span>
                <span className="typing-dot bg-gray-400 dark:bg-gray-500"></span>
                <span className="typing-dot bg-gray-400 dark:bg-gray-500"></span>
              </div>
            )}
            {variant !== 'dots' && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                {displayMessage}...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
