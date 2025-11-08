import React from 'react';

const MessageSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="flex gap-3 mb-6 justify-start">
          {/* Avatar Skeleton */}
          <div className="flex-shrink-0">
            <div className="skeleton skeleton-avatar"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="flex-1 max-w-[75%]">
            <div className="skeleton skeleton-line w-3/4"></div>
            <div className="skeleton skeleton-line w-full"></div>
            <div className="skeleton skeleton-line w-5/6"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MessageSkeleton;
