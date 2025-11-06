import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import websocketService from '../services/websocket';
import { useChat } from './ChatContext';

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const clientIdRef = useRef(`client_${uuidv4()}`);
  const streamingContentRef = useRef('');
  const handlersRegisteredRef = useRef(false);
  const { state, dispatch } = useChat();

  // Register handlers only once
  useEffect(() => {
    if (handlersRegisteredRef.current) {
      return;
    }
    
    handlersRegisteredRef.current = true;

    // Connection events
    websocketService.on('open', () => {
      setConnected(true);
      setError(null);
    });

    websocketService.on('close', () => {
      setConnected(false);
    });

    websocketService.on('error', (data) => {
      console.error('WebSocket error:', data);
      setError(data.error || 'WebSocket error');
      dispatch({ type: 'SET_ERROR', payload: data.error || 'WebSocket error' });
    });

    // Chat events
    websocketService.on('stream_start', () => {
      streamingContentRef.current = '';
      dispatch({ type: 'SET_STREAMING', payload: true });
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
        },
      });
    });

    websocketService.on('stream_chunk', (data) => {
      streamingContentRef.current += data.chunk;
      dispatch({
        type: 'UPDATE_LAST_MESSAGE',
        payload: {
          content: streamingContentRef.current,
        },
      });
    });

    websocketService.on('stream_end', (data) => {
      dispatch({ type: 'SET_STREAMING', payload: false });
      streamingContentRef.current = '';
    });

    websocketService.on('history', (data) => {
      dispatch({ type: 'SET_MESSAGES', payload: data.messages || [] });
    });

    // Connect WebSocket
    websocketService.connect(clientIdRef.current);

    // Cleanup on unmount
    return () => {
      // Cleanup handlers when component unmounts
    };
  }, []); // Empty deps - run once

  const sendMessage = useCallback((message, model = null) => {
    if (!state.userId || !state.currentSession) {
      console.error('Cannot send message: User ID or Session ID not set');
      return false;
    }

    if (!websocketService.isConnected()) {
      console.error('WebSocket not connected');
      setError('WebSocket not connected');
      return false;
    }

    // Add user message to state immediately
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      },
    });

    // Send via WebSocket with provider_id
    const sent = websocketService.sendChatMessage(
      message,
      state.userId,
      state.currentSession,
      model,
      state.selectedProvider  // Pass selected provider
    );

    if (!sent) {
      console.error('Failed to send message');
      setError('Failed to send message');
    }

    return sent;
  }, [state.userId, state.currentSession, state.selectedProvider, dispatch]);

  const value = {
    connected,
    error,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}

export default WebSocketContext;

