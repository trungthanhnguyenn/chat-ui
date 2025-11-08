import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { copyToClipboard } from '../../utils/formatters';

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all hover:scale-110 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      title="Copy message"
      aria-label="Copy message"
    >
      {copied ? (
        <FiCheck className="w-4 h-4 text-green-500" />
      ) : (
        <FiCopy className="w-4 h-4" />
      )}
    </button>
  );
};

export default CopyButton;
