import React, { useState, useRef, useEffect } from 'react';
import type { AnalysisReport, AnnotatedFinding } from '../types';

interface AnnotatedImageProps {
  image: string;
  result: AnalysisReport;
}

export const AnnotatedImage: React.FC<AnnotatedImageProps> = ({ image, result }) => {
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [hoveredFinding, setHoveredFinding] = useState<AnnotatedFinding | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (imgRef.current && containerRef.current) {
        const imgRect = imgRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setImgDimensions({
          width: imgRect.width,
          height: imgRect.height,
          top: imgRect.top - containerRect.top,
          left: imgRect.left - containerRect.left,
        });
      }
    };

    const imgElement = imgRef.current;
    if (imgElement) {
      imgElement.addEventListener('load', updateDimensions);
      // If image is already loaded from cache
      if (imgElement.complete) {
        updateDimensions();
      }
    }

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (imgElement) {
        imgElement.removeEventListener('load', updateDimensions);
      }
      resizeObserver.disconnect();
    };
  }, [image]);

  const allFindings = [...(result.肤色?.findings || []), ...(result.气色?.findings || [])];
  const annotatedFindings = allFindings.filter(
    (f) =>
      f.coordinates && typeof f.coordinates.x === 'number' && typeof f.coordinates.y === 'number'
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full rounded-xl shadow-soft bg-background"
    >
      <style>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.8;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0.2;
                    }
                }
                .marker-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>

      <img
        ref={imgRef}
        src={image}
        alt="User analysis"
        className="rounded-xl max-w-full h-auto object-contain block"
      />

      {imgDimensions.width > 0 &&
        annotatedFindings.map((finding, index) => {
          const isHovered = hoveredFinding === finding;
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${imgDimensions.left + finding.coordinates!.x * imgDimensions.width}px`,
                top: `${imgDimensions.top + finding.coordinates!.y * imgDimensions.height}px`,
              }}
              onMouseEnter={() => setHoveredFinding(finding)}
              onMouseLeave={() => setHoveredFinding(null)}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <div
                  className={`absolute w-3 h-3 rounded-full bg-accent transition-all duration-300 ${isHovered ? 'scale-125' : ''}`}
                ></div>
                <div
                  className={`absolute w-3 h-3 rounded-full bg-accent marker-pulse ${isHovered ? 'animate-none opacity-0' : ''}`}
                ></div>
              </div>

              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2.5 bg-surface text-text-primary text-sm rounded-lg shadow-soft-dark transition-opacity duration-300 z-10">
                  {finding.description}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-surface"></div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
