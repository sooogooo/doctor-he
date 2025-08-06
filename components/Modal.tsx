
import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    variant?: 'default' | 'drHe';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, variant = 'default' }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const isDrHeVariant = variant === 'drHe';
    const modalWrapperClasses = isDrHeVariant ? 'theme-roseGold' : '';
    const headerTitleClasses = isDrHeVariant ? 'text-primary' : 'text-text-primary';
    const headerBorderClasses = isDrHeVariant ? 'border-primary/30' : 'border-border';
    const closeBtnClasses = isDrHeVariant ? 'text-primary hover:bg-primary/10' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/10';

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className={`bg-surface rounded-2xl shadow-soft w-full max-w-md mx-auto transform transition-all ${modalWrapperClasses}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex justify-between items-center p-5 border-b ${headerBorderClasses}`}>
                    <h3 id="modal-title" className={`text-lg font-medium ${headerTitleClasses}`}>{title}</h3>
                    <button
                        onClick={onClose}
                        className={`p-1.5 rounded-full ${closeBtnClasses}`}
                        aria-label="关闭弹窗"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className={`p-0 ${isDrHeVariant ? '' : 'sm:p-6'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};
