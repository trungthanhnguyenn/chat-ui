import React from 'react';

const ConversationSkeleton = ({ count = 5 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div 
          key={i} 
          className="flex items-center gap-3 p-3 rounded-lg mb-2"
        >
          {/* Avatar Skeleton */}
          <div className="skeleton skeleton-avatar-small flex-shrink-0"></div>
          
          {/* Text Block Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="skeleton skeleton-line w-2/3 h-3 mb-2"></div>
            <div className="skeleton skeleton-line w-1/2 h-2"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ConversationSkeleton;
