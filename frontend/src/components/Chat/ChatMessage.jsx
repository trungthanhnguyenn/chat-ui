import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck, FiUser } from 'react-icons/fi';
import { copyToClipboard, formatTimestamp } from '../../utils/formatters';
import logoImage from '../../assets/logo.jpeg';

function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isDark = document.documentElement.classList.contains('dark');

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/30 bg-white dark:bg-gray-800 flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="Twin-T AI" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      <div className={`flex flex-col max-w-[75%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-5 py-3.5 shadow-lg transition-all hover:shadow-xl ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200/50 dark:shadow-blue-900/30'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700/50'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="markdown-body prose dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={isDark ? vscDarkPlus : vs}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-2 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            {formatTimestamp(message.timestamp)}
          </span>
          
          {!isUser && message.content && (
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all hover:scale-110 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Copy message"
            >
              {copied ? (
                <FiCheck className="w-4 h-4 text-green-500" />
              ) : (
                <FiCopy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg ring-2 ring-gray-100 dark:ring-gray-800">
            <FiUser className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
