import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { useChat } from '../../contexts/ChatContext';

function NewChatButton() {
  const { createNewSession } = useChat();

  return (
    <button
      onClick={createNewSession}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
    >
      <FiPlus className="w-5 h-5" />
      <span>New Chat</span>
    </button>
  );
}

export default NewChatButton;
