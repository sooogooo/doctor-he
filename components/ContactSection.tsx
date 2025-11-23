import React from 'react';

export const ContactSection: React.FC = () => {
  return (
    <div className="mt-12 p-6 bg-surface border border-border rounded-2xl shadow-soft">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-medium mb-4 text-text-primary">联系我们</h3>
          <div className="space-y-3 text-text-secondary leading-relaxed">
            <p>
              <strong>地址：</strong>重庆市渝中区临江支路28号
            </p>
            <p>
              <strong>电子邮件：</strong>
              <a href="mailto:bccsw@cqlhlg.work" className="text-primary hover:underline">
                bccsw@cqlhlg.work
              </a>
            </p>
            <p>
              <strong>联系电话：</strong>
              <a href="tel:023-68726872" className="text-primary hover:underline">
                023-68726872
              </a>
            </p>
            <p className="pt-2">我们专业的团队随时准备为您提供支持和解答。期待您的联系！</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <h4 className="font-medium text-text-primary mb-3">咨询福利官</h4>
          <a
            href="https://work.weixin.qq.com/kfid/kfcfc2a809493f31e8f"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 border border-border rounded-lg hover:shadow-lg transition-shadow"
          >
            <img
              src="https://docs.bccsw.cn/consultant.png"
              alt="福利官联系二维码"
              className="w-32 h-32 object-contain"
            />
          </a>
          <p className="text-xs mt-2 text-text-secondary">扫码添加，获取专属福利</p>
        </div>
      </div>
    </div>
  );
};
