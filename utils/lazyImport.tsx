import React, { Suspense, ComponentType } from 'react';

/**
 * Creates a lazy-loaded component with a default loading fallback
 */
export function lazyWithPreload<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = React.lazy(importFn);

  // Add preload method for prefetching
  const PreloadableComponent = LazyComponent as typeof LazyComponent & {
    preload: () => Promise<{ default: T }>;
  };

  PreloadableComponent.preload = importFn;

  return PreloadableComponent;
}

/**
 * Default loading fallback component
 */
export const LoadingFallback: React.FC<{ message?: string }> = ({
  message = '加载中...',
}) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-text-secondary">{message}</span>
    </div>
  </div>
);

/**
 * HOC to wrap lazy components with Suspense
 */
export function withSuspense<P extends object>(
  LazyComponent: React.LazyExoticComponent<ComponentType<P>>,
  fallback?: React.ReactNode
) {
  return function SuspenseWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <LoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Lazy load wrapper component
 */
export const LazyLoad: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <Suspense fallback={fallback || <LoadingFallback />}>{children}</Suspense>
);
