import React from 'react';
import { useChat } from '../../contexts/ChatContext';

/**
 * Debug component to show current state
 * Remove this in production
 */
export function DebugPanel() {
  const { state } = useChat();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: '#0f0',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Debug Info:</div>
      <div>Providers: {state.providers?.length || 0}</div>
      <div>Selected: {state.selectedProvider}</div>
      <div>UserId: {state.userId?.substring(0, 15)}...</div>
      <div>Session: {state.currentSession?.substring(0, 15)}...</div>
      <div>Messages: {state.messages?.length || 0}</div>
      <div>Streaming: {state.streaming ? 'Yes' : 'No'}</div>
      {state.providers && state.providers.length > 0 && (
        <div style={{ marginTop: '10px', borderTop: '1px solid #0f0', paddingTop: '5px' }}>
          <div>Available Providers:</div>
          {state.providers.map((p, i) => (
            <div key={i} style={{ marginLeft: '10px', fontSize: '10px' }}>
              • {p.name} ({p.provider_id})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
