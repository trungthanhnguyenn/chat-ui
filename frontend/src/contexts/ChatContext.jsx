import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { getHistory, getUserSessions, deleteSession as apiDeleteSession, getProviders } from '../services/api';

const ChatContext = createContext();

const initialState = {
  messages: [],
  sessions: [],
  currentSession: null,
  userId: null,
  loading: false,
  error: null,
  streaming: false,
  providers: [],  // NEW: available chatbot providers
  selectedProvider: 'openai',  // NEW: default provider
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_LAST_MESSAGE':
      const messages = [...state.messages];
      messages[messages.length - 1] = {
        ...messages[messages.length - 1],
        ...action.payload
      };
      return { ...state, messages };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_STREAMING':
      return { ...state, streaming: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'SET_PROVIDERS':  // NEW: set available providers
      return { ...state, providers: action.payload };
    case 'SET_SELECTED_PROVIDER':  // NEW: set selected provider
      return { ...state, selectedProvider: action.payload };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Initialize user ID
  useEffect(() => {
    let userId = storage.getUserId();
    if (!userId) {
      userId = `user_${uuidv4()}`;
      storage.setUserId(userId);
    }
    dispatch({ type: 'SET_USER_ID', payload: userId });
    
    // Load providers
    loadProviders();
    
    // Load sessions
    loadSessions(userId);
    
    // Load current session
    const currentSession = storage.getCurrentSession();
    if (currentSession) {
      dispatch({ type: 'SET_CURRENT_SESSION', payload: currentSession });
      loadHistory(userId, currentSession);
    }
  }, []);

  const loadProviders = async () => {
    try {
      const response = await getProviders();
      
      if (response.success) {
        dispatch({ type: 'SET_PROVIDERS', payload: response.providers });
        
        // Set default provider if specified
        if (response.default) {
          dispatch({ type: 'SET_SELECTED_PROVIDER', payload: response.default });
        }
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };

  const loadSessions = async (userId) => {
    try {
      const response = await getUserSessions(userId);
      if (response.success) {
        dispatch({ type: 'SET_SESSIONS', payload: response.conversations });
        storage.setSessions(response.conversations);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadHistory = async (userId, sessionId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await getHistory(userId, sessionId);
      if (response.success) {
        dispatch({ type: 'SET_MESSAGES', payload: response.messages });
      }
    } catch (error) {
      console.error('Error loading history:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createNewSession = () => {
    const sessionId = `session_${uuidv4()}`;
    storage.setCurrentSession(sessionId);
    storage.addSession({
      session_id: sessionId,
      title: 'New Conversation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0
    });
    dispatch({ type: 'SET_CURRENT_SESSION', payload: sessionId });
    dispatch({ type: 'CLEAR_MESSAGES' });
    loadSessions(state.userId);
  };

  const switchSession = async (sessionId) => {
    storage.setCurrentSession(sessionId);
    dispatch({ type: 'SET_CURRENT_SESSION', payload: sessionId });
    dispatch({ type: 'CLEAR_MESSAGES' });
    await loadHistory(state.userId, sessionId);
  };

  const deleteSession = async (sessionId) => {
    try {
      await apiDeleteSession(state.userId, sessionId);
      storage.removeSession(sessionId);
      
      if (state.currentSession === sessionId) {
        createNewSession();
      }
      
      await loadSessions(state.userId);
    } catch (error) {
      console.error('Error deleting session:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const value = {
    state,
    dispatch,
    loadSessions,
    loadHistory,
    createNewSession,
    switchSession,
    deleteSession,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
