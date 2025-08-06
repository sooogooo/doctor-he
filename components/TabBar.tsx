
import React from 'react';
import { HomeIcon, SkinIcon, VitalityIcon, FormIcon, ChatIcon } from './icons';
import type { View, MainTab } from '../types';

interface TabBarProps {
    activeMainTab: MainTab;
    currentView: View;
    hasAnalysis: boolean;
    onMainTabChange: (tab: MainTab) => void;
    onNavigate: (view: View) => void;
}

const footerTabs: { id: MainTab | 'chat'; label: string; icon: React.FC<{className?: string}>; type: 'main' | 'view'; tourId?: string }[] = [
    { id: 'home', label: '主页', icon: HomeIcon, type: 'main' },
    { id: '肤色', label: '肤色', icon: SkinIcon, type: 'main' },
    { id: '气色', label: '气色', icon: VitalityIcon, type: 'main' },
    { id: '形色', label: '形色', icon: FormIcon, type: 'main' },
    { id: 'chat', label: 'AI 问答', icon: ChatIcon, type: 'view', tourId: 'step-3-ai-chat' },
];


export const TabBar: React.FC<TabBarProps> = ({ activeMainTab, currentView, hasAnalysis, onMainTabChange, onNavigate }) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-t border-border z-40" data-tour-id="step-2-tabs">
            <div className="container mx-auto flex justify-around">
                {footerTabs.map((tab) => {
                    const isAnalysisDependent = ['肤色', '气色', '形色'].includes(tab.id);
                    const isDisabled = isAnalysisDependent && !hasAnalysis;
                    
                    const isActive = !isDisabled && ((tab.type === 'main' && currentView === 'main' && activeMainTab === tab.id) || 
                                     (tab.type === 'view' && currentView === tab.id));
                    
                    const activeClass = isActive ? 'text-primary' : 'text-text-secondary';
                    const disabledClass = isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/5';
                    
                    const handleClick = () => {
                        if (isDisabled) return;

                        if (tab.type === 'main') {
                            onNavigate('main');
                            onMainTabChange(tab.id as MainTab);
                        } else {
                            onNavigate(tab.id as View);
                        }
                    };

                    const buttonContent = (
                        <>
                            {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></div>}
                            <tab.icon className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">{tab.label}</span>
                        </>
                    );

                    if (isDisabled) {
                        return (
                           <div key={tab.id} className="relative group flex justify-center w-full">
                               <button
                                   disabled={true}
                                   data-tour-id={tab.tourId}
                                   className={`relative flex flex-col items-center justify-center pt-2 pb-1 w-full transition-colors ${activeClass} ${disabledClass}`}
                                   aria-disabled={true}
                               >
                                   {buttonContent}
                               </button>
                               <div
                                   role="tooltip"
                                   className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-gray-900/90 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap dark:bg-gray-700/90"
                               >
                                   请先做看脸分析
                                   <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900/90 dark:border-t-gray-700/90"></div>
                               </div>
                           </div>
                       );
                   }

                    return (
                        <button
                            key={tab.id}
                            data-tour-id={tab.tourId}
                            onClick={handleClick}
                            disabled={isDisabled}
                            className={`relative flex flex-col items-center justify-center pt-2 pb-1 w-full transition-colors ${activeClass} ${disabledClass}`}
                            aria-current={isActive ? 'page' : undefined}
                            aria-disabled={isDisabled}
                        >
                           {buttonContent}
                        </button>
                    );
                })}
            </div>
        </footer>
    );
};
