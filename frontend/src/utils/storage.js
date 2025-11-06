/**
 * Local storage utilities for persisting user session
 */

const STORAGE_KEYS = {
  USER_ID: 'chatbot_user_id',
  CURRENT_SESSION: 'chatbot_current_session',
  SESSIONS: 'chatbot_sessions',
  THEME: 'chatbot_theme'
};

export const storage = {
  // User ID
  getUserId: () => {
    return localStorage.getItem(STORAGE_KEYS.USER_ID);
  },
  
  setUserId: (userId) => {
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  },
  
  // Current Session
  getCurrentSession: () => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  },
  
  setCurrentSession: (sessionId) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, sessionId);
  },
  
  // Sessions List
  getSessions: () => {
    const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return sessions ? JSON.parse(sessions) : [];
  },
  
  setSessions: (sessions) => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },
  
  addSession: (session) => {
    const sessions = storage.getSessions();
    const exists = sessions.find(s => s.session_id === session.session_id);
    if (!exists) {
      sessions.unshift(session);
      storage.setSessions(sessions);
    }
  },
  
  updateSession: (sessionId, updates) => {
    const sessions = storage.getSessions();
    const index = sessions.findIndex(s => s.session_id === sessionId);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      storage.setSessions(sessions);
    }
  },
  
  removeSession: (sessionId) => {
    const sessions = storage.getSessions();
    const filtered = sessions.filter(s => s.session_id !== sessionId);
    storage.setSessions(filtered);
    
    // If removed session was current, clear it
    if (storage.getCurrentSession() === sessionId) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  },
  
  // Theme
  getTheme: () => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },
  
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  
  // Clear all
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
