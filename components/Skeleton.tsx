import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Pre-configured skeleton components for common use cases
export const AnalysisResultSkeleton: React.FC = () => (
  <div className="space-y-6 p-4">
    {/* Header */}
    <div className="flex items-center space-x-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={20} width="60%" />
        <Skeleton variant="text" height={14} width="40%" />
      </div>
    </div>

    {/* Section 1 */}
    <div className="space-y-3">
      <Skeleton variant="text" height={24} width="30%" />
      <Skeleton variant="rectangular" height={100} />
      <div className="space-y-2">
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} width="90%" />
        <Skeleton variant="text" height={16} width="75%" />
      </div>
    </div>

    {/* Section 2 */}
    <div className="space-y-3">
      <Skeleton variant="text" height={24} width="35%" />
      <Skeleton variant="rectangular" height={80} />
      <div className="space-y-2">
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} width="85%" />
      </div>
    </div>

    {/* Section 3 */}
    <div className="space-y-3">
      <Skeleton variant="text" height={24} width="25%" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={60} />
      </div>
    </div>
  </div>
);

export const ChatMessageSkeleton: React.FC = () => (
  <div className="flex space-x-3 p-4">
    <Skeleton variant="circular" width={32} height={32} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" height={16} width="80%" />
      <Skeleton variant="text" height={16} width="60%" />
      <Skeleton variant="text" height={16} width="70%" />
    </div>
  </div>
);

export const ImageUploaderSkeleton: React.FC = () => (
  <div className="p-4 space-y-4">
    <Skeleton variant="rectangular" height={200} className="w-full" />
    <div className="flex justify-center space-x-4">
      <Skeleton variant="rectangular" width={120} height={40} />
      <Skeleton variant="rectangular" width={120} height={40} />
    </div>
  </div>
);
