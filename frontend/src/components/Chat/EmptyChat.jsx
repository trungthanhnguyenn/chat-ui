import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const EmptyChat = ({ onStartChat }) => {
  const suggestedPrompts = [
    {
      icon: '💡',
      text: 'Explain quantum computing in simple terms',
      prompt: 'Explain quantum computing in simple terms'
    },
    {
      icon: '🐍',
      text: 'Write a Python function to sort a list',
      prompt: 'Write a Python function to sort a list'
    },
    {
      icon: '🎨',
      text: 'Give me ideas for a mobile app',
      prompt: 'Give me ideas for a mobile app'
    },
    {
      icon: '📚',
      text: 'Teach me about machine learning',
      prompt: 'Teach me about machine learning basics'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
      {/* Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center bounce-subtle">
          <FiMessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
        How can I help you today?
      </h2>
      
      {/* Subtitle */}
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Start a conversation by typing a message below, or choose from these suggestions
      </p>
      
      {/* Suggested Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestedPrompts.map((item, index) => (
          <button
            key={index}
            onClick={() => onStartChat && onStartChat(item.prompt)}
            className="p-4 text-left rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover-lift cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.text}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyChat;
