
import React, { useState } from 'react';
import { Modal } from './Modal';
import { TrashIcon, InformationCircleIcon, SunIcon } from './icons';
import type { SettingsData, Theme, FontSize, AIResponseStyle, AIPersonality, AIStyle, UserProfile, BloodType } from '../types';
import { mbtiTypes, bloodTypes } from '../types';

interface SettingsProps {
    settings: SettingsData;
    onSettingsChange: (newSettings: SettingsData) => void;
    onClearData: () => void;
    onShowGuide: () => void;
}

const SectionCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-soft">
        <h3 className="text-lg font-medium border-b border-border pb-3 mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="pt-4">
    <h4 className="text-sm font-semibold text-text-secondary mb-3">{title}</h4>
    <div className="space-y-4 pl-2 border-l-2 border-border/70">{children}</div>
  </div>
);

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="relative group flex items-center">
        <InformationCircleIcon className="w-4 h-4 text-text-secondary cursor-pointer" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2.5 text-xs text-background bg-text-primary/90 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {text}
        </div>
    </div>
);

const SettingRow: React.FC<{ label: string, children: React.ReactNode, tooltip?: string }> = ({ label, children, tooltip }) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-text-primary font-medium">{label}</span>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        {children}
    </div>
);

const SegmentedControl: React.FC<{ options: readonly string[], selected: string, onChange: (value: any) => void }> = ({ options, selected, onChange }) => (
    <div className="flex items-center gap-1 p-1 rounded-full bg-background border border-border">
        {options.map(option => (
            <button
                key={option}
                onClick={() => onChange(option)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${selected === option ? 'bg-text-primary text-background shadow-md' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
                {option}
            </button>
        ))}
    </div>
);

const themeOptions: { id: Theme, name: string, color: string }[] = [
    { id: 'light', name: '标准浅色', color: 'bg-[#F8F7F5] border-border' },
    { id: 'dark', name: '标准深色', color: 'bg-[#1C1C1E] border-border' },
    { id: 'roseGold', name: '玫瑰金', color: 'bg-[#FDF5EF] border-[#F1E4DC]' },
    { id: 'lilac', name: '丁香紫', color: 'bg-[#F7F5FA] border-[#EBE7F0]' },
    { id: 'mint', name: '薄荷绿', color: 'bg-[#F2F9F8] border-[#E0EEEB]' },
];

export const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, onClearData, onShowGuide }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSettingChange = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

     const handleProfileChange = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
        onSettingsChange({
            ...settings,
            userProfile: {
                ...settings.userProfile,
                [key]: value,
            },
        });
    };

    const handleClearDataConfirm = () => {
        onClearData();
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <SectionCard title="我的资料">
                <SubSection title="基本信息">
                  <SettingRow label="头像 URL">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                          <input
                              type="text"
                              placeholder="https://example.com/avatar.png"
                              value={settings.userProfile.avatar}
                              onChange={(e) => handleProfileChange('avatar', e.target.value)}
                              className="bg-background border border-border rounded-lg px-3 py-1.5 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none w-full flex-grow"
                          />
                           {settings.userProfile.avatar && (
                              <img src={settings.userProfile.avatar} alt="Avatar Preview" className="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
                           )}
                      </div>
                  </SettingRow>
                  <SettingRow label="昵称">
                       <input
                          type="text"
                          value={settings.userProfile.nickname}
                          onChange={(e) => handleProfileChange('nickname', e.target.value)}
                          className="bg-background border border-border rounded-lg px-3 py-1.5 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-48"
                      />
                  </SettingRow>
                </SubSection>

                <SubSection title="健康档案">
                  <SettingRow label="血型">
                       <select
                          value={settings.userProfile.bloodType}
                          onChange={(e) => handleProfileChange('bloodType', e.target.value as BloodType)}
                          className="bg-background border border-border rounded-lg px-3 py-1.5 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-48"
                      >
                          {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                  </SettingRow>
                  <SettingRow label="MBTI">
                       <select
                          value={settings.userProfile.mbti}
                          onChange={(e) => handleProfileChange('mbti', e.target.value as AIPersonality)}
                          className="bg-background border border-border rounded-lg px-3 py-1.5 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-48"
                      >
                          {mbtiTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                  </SettingRow>
                </SubSection>

                <SubSection title="美学偏好">
                   <div className='flex flex-col gap-2'>
                       <label className="text-text-primary font-medium flex items-center gap-2">
                          我的医美需求
                          <InfoTooltip text="提供这些信息有助于AI为您提供更个性化的分析和建议。" />
                       </label>
                      <textarea
                          value={settings.userProfile.aestheticNeeds}
                          onChange={(e) => handleProfileChange('aestheticNeeds', e.target.value)}
                          placeholder='例如：我想改善眼袋和法令纹，希望皮肤更紧致。'
                          className="bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none w-full h-24 resize-y"
                      />
                  </div>
                   <div className='flex flex-col gap-2'>
                      <label className="text-text-primary font-medium flex items-center gap-2">
                          我的美丽期望
                          <InfoTooltip text="告诉AI您的期望，可以让它的回答更贴合您的目标。" />
                      </label>
                      <textarea
                          value={settings.userProfile.beautyExpectations}
                          onChange={(e) => handleProfileChange('beautyExpectations', e.target.value)}
                          placeholder='例如：我希望看起来更年轻有活力，肤色更均匀透亮。'
                          className="bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none w-full h-24 resize-y"
                      />
                  </div>
                </SubSection>
            </SectionCard>
            
            <SectionCard title="外观">
                <SettingRow label="主题">
                    <div className="flex items-center gap-2 flex-wrap">
                        {themeOptions.map(theme => (
                            <button
                                key={theme.id}
                                onClick={() => handleSettingChange('theme', theme.id)}
                                className={`w-8 h-8 rounded-full border-2 ${theme.color} ${settings.theme === theme.id ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' : ''}`}
                                aria-label={theme.name}
                            />
                        ))}
                    </div>
                </SettingRow>
                 <SettingRow label="字号">
                    <SegmentedControl
                        options={['小', '中', '大']}
                        selected={settings.fontSize === 'small' ? '小' : settings.fontSize === 'medium' ? '中' : '大'}
                        onChange={(val) => handleSettingChange('fontSize', val === '小' ? 'small' : val === '中' ? 'medium' : 'large')}
                    />
                </SettingRow>
            </SectionCard>

            <SectionCard title="AI 设置">
                <SettingRow label="AI 回答方式">
                    <SegmentedControl
                        options={['精炼', '标准', '话痨']}
                        selected={settings.aiResponseStyle}
                        onChange={(val) => handleSettingChange('aiResponseStyle', val as AIResponseStyle)}
                    />
                </SettingRow>
                <SettingRow label="AI 的性格特征">
                    <select
                        value={settings.aiPersonality}
                        onChange={(e) => handleSettingChange('aiPersonality', e.target.value as AIPersonality)}
                        className="bg-background border border-border rounded-lg px-3 py-1.5 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        {mbtiTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </SettingRow>
                 <SettingRow label="AI 的风格">
                    <SegmentedControl
                        options={['日常幽默', '专业严谨', '新脱口秀']}
                        selected={settings.aiStyle}
                        onChange={(val) => handleSettingChange('aiStyle', val as AIStyle)}
                    />
                </SettingRow>
            </SectionCard>

            <SectionCard title="帮助">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-text-primary">重看用法指南</p>
                        <p className="text-sm text-text-secondary">重新了解应用的主要功能。</p>
                    </div>
                    <button
                        onClick={onShowGuide}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium"
                    >
                        查看指南
                    </button>
                 </div>
            </SectionCard>


            <SectionCard title="数据管理">
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-text-primary">清除所有数据</p>
                        <p className="text-sm text-text-secondary">将永久删除您的照片、分析报告和聊天记录。</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-warning hover:opacity-90 text-white rounded-lg transition-colors font-medium"
                        aria-label="清除所有数据"
                    >
                        <TrashIcon className="w-5 h-5"/>
                        清除
                    </button>
                 </div>
            </SectionCard>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="确认清除数据"
            >
                <p className="text-text-secondary mb-6">
                    您确定要永久删除所有数据吗？此操作无法撤销。应用将会恢复到首次打开的状态。
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-text-primary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleClearDataConfirm}
                        className="px-4 py-2 bg-warning hover:opacity-90 text-white rounded-lg transition-colors font-medium"
                    >
                        确认清除
                    </button>
                </div>
            </Modal>
        </div>
    );
};
