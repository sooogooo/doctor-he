import React, { useState, useEffect } from 'react';

export const Footer: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // This runs only on the client, ensuring we get the user's local date
    // and avoid any server-client mismatch in server-rendered scenarios.
    setCurrentDate(new Date().toLocaleDateString('zh-CN'));
  }, []);

  return (
    <footer className="bg-background border-t border-border mt-12">
      <div className="container mx-auto px-4 sm:px-6 py-6 text-center text-text-secondary text-xs">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} 重庆联合丽格科技有限公司. All Rights Reserved.
        </p>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors block mb-4"
        >
          渝 ICP 备 2024023473 号
        </a>

        {currentDate && <p>版本 0.6.6 | {currentDate}</p>}

        <div className="h-8"></div>
      </div>
    </footer>
  );
};
