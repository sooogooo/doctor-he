import React from 'react';
import { CogIcon, ArrowLeftIcon } from './icons';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onDrHeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onDrHeClick }) => {
  const isSubView = currentView !== 'main';
  const viewTitles: { [key in View]: string } = {
    main: '',
    chat: 'AI 问答',
    settings: '设置',
  };

  return (
    <header className="bg-surface/80 backdrop-blur-lg shadow-soft sticky top-0 z-40 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center h-16">
        <div className="flex-1 flex justify-start">
          {isSubView ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('main')}
                className="p-2 rounded-full text-text-secondary hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="返回"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-medium text-text-primary">{viewTitles[currentView]}</h2>
            </div>
          ) : (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate('main')}
              role="button"
            >
              <img src="https://docs.bccsw.cn/logo.png" alt="Aura AI Logo" className="h-8 w-auto" />
              <span className="hidden sm:block text-text-primary font-medium text-lg tracking-wide">
                | 贺秋月医生AI看脸小助手
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <button
            onClick={onDrHeClick}
            className="text-sm font-medium text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            data-tour-id="step-4-dr-he"
          >
            贺秋月医生
          </button>
          {currentView !== 'settings' && (
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 rounded-full text-text-secondary hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="设置"
              data-tour-id="step-5-settings"
            >
              <CogIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
