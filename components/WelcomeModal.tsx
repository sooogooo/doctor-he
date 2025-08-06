
import React from 'react';
import { InformationCircleIcon } from './icons';

interface WelcomeModalProps {
    isOpen: boolean;
    onAccept: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onAccept }) => {
    if (!isOpen) return null;

    // Hardcoded colors for high contrast and consistent branding, independent of app theme.
    const styles = {
        overlay: `fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[200] flex justify-center items-center p-4`,
        modal: `w-full max-w-lg mx-auto flex flex-col max-h-[90vh] rounded-2xl shadow-xl overflow-hidden`,
        header: `p-5 text-center border-b`,
        content: `p-6 flex-grow overflow-y-auto`,
        drHeCard: `relative flex flex-col items-center text-center p-6 -m-2 mb-6 rounded-lg`,
        disclaimerCard: `mt-4 p-4 border rounded-xl`,
        footer: `p-5 border-t`,
        acceptButton: `w-full px-6 py-3 font-semibold rounded-lg hover:opacity-90 transition-opacity`,
        // Specific colors
        modalBg: { backgroundColor: '#FDF5EF' },
        headerBorder: { borderColor: 'rgba(228, 170, 163, 0.3)' }, // primary/30
        titleText: { color: '#5A413E' }, // text-primary
        subtitleText: { color: '#9C7A76' }, // text-secondary
        drHeCardBg: { background: 'linear-gradient(to bottom right, rgba(228, 170, 163, 0.05), rgba(201, 180, 205, 0.05))' }, // from-primary/10 via-secondary/10
        disclaimerBg: { backgroundColor: '#FDF5EF' },
        disclaimerBorder: { borderColor: '#F1E4DC' }, // border
        acceptButtonBg: { backgroundColor: '#EB8383', color: 'white' }, // accent
    };

    return (
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
        >
            <div
                className={styles.modal}
                style={styles.modalBg}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header} style={styles.headerBorder}>
                    <h3 id="welcome-title" className="text-xl font-medium" style={styles.titleText}>欢迎使用 Aura AI</h3>
                    <p className="text-center text-sm mt-1" style={styles.subtitleText}>您的智能皮肤美学分析顾问</p>
                </div>
                
                <div className={styles.content}>
                    <div className={styles.drHeCard} style={styles.drHeCardBg}>
                        <div className="p-1 rounded-full bg-gradient-to-tr from-accent to-secondary shadow-lg" style={{'--tw-shadow-color': 'rgba(228, 170, 163, 0.3)'} as React.CSSProperties}>
                            <div className="p-1 rounded-full" style={{backgroundColor: '#fff'}}>
                                <img 
                                    src="https://docs.bccsw.cn/images/dr-he/dr-he.jpg" 
                                    alt="贺秋月医生" 
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            </div>
                        </div>
                        <h4 className="text-lg font-medium mt-4" style={styles.titleText}>贺秋月 医生</h4>
                        <p className="font-medium text-sm mt-1" style={{color: '#EB8383'}}>美容皮肤科执业医师</p>
                        <p className="text-xs max-w-md mx-auto leading-relaxed text-left mt-3" style={styles.subtitleText}>
                            贺医生是重庆联合丽格美容医院的执业医师，拥有丰富的临床经验，专注于皮肤健康与医学美容领域。她致力于通过科学的方法和个性化的方案，帮助每一位求美者发现和塑造自己独特的美丽。
                        </p>
                    </div>

                    <div className={styles.disclaimerCard} style={{...styles.disclaimerBg, ...styles.disclaimerBorder}}>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <InformationCircleIcon className="h-5 w-5 text-[#EB8383]" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-base" style={styles.titleText}>重要免责声明</h4>
                          <p className="mt-2 text-xs leading-relaxed" style={styles.subtitleText}>
                            本应用提供的分析由AI生成，仅供参考和美学目的，<strong style={{color: '#5A413E'}}>不是医疗诊断</strong>，也不能替代专业医疗建议。如有任何医疗问题，请务必咨询专业医生。
                          </p>
                        </div>
                      </div>
                    </div>
                </div>

                <div className={styles.footer} style={styles.headerBorder}>
                     <button
                        onClick={onAccept}
                        className={styles.acceptButton}
                        style={styles.acceptButtonBg}
                    >
                        我已阅读并同意，开始探索
                    </button>
                </div>
            </div>
        </div>
    );
};
