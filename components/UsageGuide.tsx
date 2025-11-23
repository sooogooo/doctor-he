import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import type { TourStep } from '../types';

interface UsageGuideProps {
  show: boolean;
  onFinish: () => void;
}

const tourSteps: TourStep[] = [
  {
    selector: '[data-tour-id="step-1-uploader"]',
    title: '第一步：开始分析',
    content: '从这里开始！点击拍照或上传一张清晰、光线充足的正面照片，AI 将为您进行分析。',
    position: 'bottom',
  },
  {
    selector: '[data-tour-id="step-2-tabs"]',
    title: '第二步：查看报告',
    content: '分析完成后，您可以在这里切换查看“肤色”、“气色”和“形色”等详细报告。',
    position: 'top',
  },
  {
    selector: '[data-tour-id="step-3-ai-chat"]',
    title: '第三步：AI 问答',
    content: '对分析结果有疑问？随时在这里向 AI 助手提问，获得更深入的解答。',
    position: 'top',
  },
  {
    selector: '[data-tour-id="step-4-dr-he"]',
    title: '关于贺医生',
    content: '点击这里可以了解更多关于贺秋月医生的专业信息。',
    position: 'bottom',
  },
  {
    selector: '[data-tour-id="step-5-settings"]',
    title: '个性化设置',
    content:
      '在这里您可以调整应用主题、字号，并设置您的个人偏好，让 AI 更懂你。您也可以在这里重看本指南。',
    position: 'bottom',
  },
];

export const UsageGuide: React.FC<UsageGuideProps> = ({ show, onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({ display: 'none' });
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ display: 'none' });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = tourSteps[stepIndex];

  const updatePosition = () => {
    if (!currentStep) return;
    try {
      const element = document.querySelector(currentStep.selector);
      if (!element) {
        handleNext();
        return;
      }

      const rect = element.getBoundingClientRect();
      const buffer = 5;

      setHighlightStyle({
        width: `${rect.width + buffer * 2}px`,
        height: `${rect.height + buffer * 2}px`,
        top: `${rect.top - buffer}px`,
        left: `${rect.left - buffer}px`,
        position: 'fixed',
        display: 'block',
      });

      if (tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const margin = 10;
        let top = 0;
        let left = 0;

        const positions = {
          top: () => {
            top = rect.top - tooltipRect.height - margin;
            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          },
          bottom: () => {
            top = rect.bottom + margin;
            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          },
          left: () => {
            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
            left = rect.left - tooltipRect.width - margin;
          },
          right: () => {
            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
            left = rect.right + margin;
          },
        };

        positions[currentStep.position || 'bottom']();

        // Viewport collision detection
        if (top < margin) {
          top = rect.bottom + margin; // switch to bottom
        }
        if (top + tooltipRect.height > window.innerHeight - margin) {
          top = rect.top - tooltipRect.height - margin; // switch to top
        }
        if (left < margin) {
          left = margin;
        }
        if (left + tooltipRect.width > window.innerWidth - margin) {
          left = window.innerWidth - tooltipRect.width - margin;
        }

        setTooltipStyle({
          top: `${top}px`,
          left: `${left}px`,
          position: 'fixed',
          visibility: 'visible',
        });
      }
    } catch (e) {
      console.error('Tour guide error:', e);
      onFinish();
    }
  };

  useLayoutEffect(() => {
    if (show && currentStep) {
      setTooltipStyle((prev) => ({ ...prev, visibility: 'hidden' }));
      const timer = setTimeout(updatePosition, 50);

      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    } else {
      setHighlightStyle({ display: 'none' });
      setTooltipStyle({ display: 'none' });
    }
  }, [stepIndex, show, currentStep]);

  const handleNext = () => {
    if (stepIndex < tourSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  if (!show || !currentStep) return null;

  return (
    <div className="fixed inset-0 z-[150]">
      <div className="fixed inset-0 bg-black/75" onClick={onFinish}></div>

      <div
        className="fixed bg-white/30 mix-blend-screen rounded-lg transition-all duration-300 ease-in-out pointer-events-none"
        style={highlightStyle}
      ></div>

      <div
        ref={tooltipRef}
        className="p-4 rounded-lg shadow-2xl w-72 transition-opacity duration-300 ease-in-out"
        style={{
          ...tooltipStyle,
          backgroundColor: 'white',
          color: '#334155', // slate-700
        }}
      >
        <h4 className="font-bold text-lg mb-2" style={{ color: '#EB8383' }}>
          {currentStep.title}
        </h4>
        <p className="text-sm">{currentStep.content}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs" style={{ color: '#64748b' }}>
            {stepIndex + 1} / {tourSteps.length}
          </span>
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="text-sm px-3 py-1 rounded transition-colors"
                style={{ color: '#475569', backgroundColor: '#f1f5f9' }}
              >
                上一步
              </button>
            )}
            <button
              onClick={handleNext}
              className="text-sm text-white font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#EB8383' }}
            >
              {stepIndex === tourSteps.length - 1 ? '完成' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
