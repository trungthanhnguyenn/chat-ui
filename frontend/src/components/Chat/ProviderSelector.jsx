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

  // Debug: log providers
  React.useEffect(() => {
    console.log('ProviderSelector - Providers:', providers);
    console.log('ProviderSelector - Selected:', selectedProvider);
  }, [providers, selectedProvider]);

  // Don't render if no providers available
  if (!providers || !Array.isArray(providers) || providers.length === 0) {
    return (
      <div className="provider-selector">
        <select
          id="provider-select"
          className="provider-select"
          disabled
        >
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  return (
    <div className="provider-selector">
      <select
        id="provider-select"
        className="provider-select"
        value={selectedProvider || providers[0]?.provider_id}
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
