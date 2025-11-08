import React from 'react';
import './BorderBeamIndicator.css';

const BorderBeamIndicator = ({
  duration = 8,  // Faster default for better visibility
  colorFrom = '#6366F1',  // Direct color values
  colorTo = '#10B981',
  delay = 0,
  isActive = true,
}) => {
  if (!isActive) return null;

  return (
    <div
      className="border-beam-container"
      style={{
        '--beam-duration': `${duration}s`,
        '--beam-color-from': colorFrom,
        '--beam-color-to': colorTo,
        '--beam-delay': `${delay}s`,
      }}
    >
      <div className="border-beam-inner" />
    </div>
  );
};

export default BorderBeamIndicator;
