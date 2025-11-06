import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import './ProviderSelector.css';

export function ProviderSelector() {
  const { state, dispatch } = useChat();
  const { providers, selectedProvider } = state;

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    dispatch({ type: 'SET_SELECTED_PROVIDER', payload: newProvider });
  };

  // Don't render if no providers available
  if (!providers || !Array.isArray(providers) || providers.length === 0) {
    return null;
  }

  return (
    <div className="provider-selector">
      <label htmlFor="provider-select" className="provider-label">
        <svg 
          className="provider-icon" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        Chatbot:
      </label>
      <select
        id="provider-select"
        className="provider-select"
        value={selectedProvider}
        onChange={handleProviderChange}
        disabled={state.streaming}
      >
        {providers.map((provider) => (
          <option key={provider.provider_id} value={provider.provider_id}>
            {provider.name}
          </option>
        ))}
      </select>
      {providers.find(p => p.provider_id === selectedProvider)?.description && (
        <span className="provider-description">
          {providers.find(p => p.provider_id === selectedProvider).description}
        </span>
      )}
    </div>
  );
}
