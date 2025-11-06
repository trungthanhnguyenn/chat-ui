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
    </div>
  );
}
