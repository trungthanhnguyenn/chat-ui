import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { useChat } from '../../contexts/ChatContext';

function NewChatButton() {
  const { createNewSession } = useChat();

  return (
    <button
      onClick={createNewSession}
      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <FiPlus className="w-5 h-5" />
      <span>New Chat</span>
    </button>
  );
}

export default NewChatButton;
