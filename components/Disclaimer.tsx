import React from 'react';
import { InformationCircleIcon } from './icons';

export const Disclaimer: React.FC = () => {
  return (
    <div className="mt-12 p-5 bg-surface border border-border rounded-2xl shadow-soft">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-6 w-6 text-accent" />
        </div>
        <div className="ml-4">
          <h4 className="font-medium text-lg text-text-primary">重要免责声明</h4>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            本应用程序提供的分析由人工智能模型生成，仅供参考和美学目的。它不是医疗诊断，也不应替代专业的医疗建议、诊断或治疗。如果您有任何关于医疗状况的问题，请务必咨询您的医生或其他合格的健康服务提供者。切勿因在本应用中看到或读到的任何内容而忽视专业医疗建议或延迟就医。
          </p>
        </div>
      </div>
    </div>
  );
};