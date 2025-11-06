import React from 'react';
import { FiMessageSquare, FiTrash2 } from 'react-icons/fi';
import { useChat } from '../../contexts/ChatContext';
import { formatTimestamp, truncateText } from '../../utils/formatters';

function ConversationList() {
  const { state, switchSession, deleteSession } = useChat();

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      await deleteSession(sessionId);
    }
  };

  if (state.sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FiMessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No conversations yet
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Start a new chat to begin
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-4">
      {state.sessions.map((session) => (
        <div
          key={session.session_id}
          onClick={() => switchSession(session.session_id)}
          className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
            state.currentSession === session.session_id
              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent'
          } border`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {truncateText(session.title || 'New Conversation', 30)}
              </h3>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(session.updated_at)}
                </span>
                
                {session.message_count > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • {session.message_count} messages
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={(e) => handleDelete(e, session.session_id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-opacity"
              aria-label="Delete conversation"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConversationList;
