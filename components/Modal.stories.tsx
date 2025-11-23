import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    variant: {
      control: { type: 'select' },
      options: ['default', 'drHe'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: '示例弹窗',
    onClose: () => console.log('Close clicked'),
    children: (
      <div className="p-4">
        <p className="text-text-primary">这是一个示例弹窗内容。</p>
        <p className="text-text-secondary mt-2">
          您可以在这里放置任何内容，如表单、信息或操作按钮。
        </p>
      </div>
    ),
  },
};

export const DrHeVariant: Story = {
  args: {
    isOpen: true,
    title: 'Dr. He 风格',
    variant: 'drHe',
    onClose: () => console.log('Close clicked'),
    children: (
      <div className="p-4">
        <p>使用 Dr. He 主题风格的弹窗。</p>
      </div>
    ),
  },
};

export const WithForm: Story = {
  args: {
    isOpen: true,
    title: '用户反馈',
    onClose: () => console.log('Close clicked'),
    children: (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">您的名字</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface"
            placeholder="请输入..."
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">反馈内容</label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface"
            rows={3}
            placeholder="请输入您的反馈..."
          />
        </div>
        <button className="w-full py-2 bg-primary text-white rounded-lg">提交</button>
      </div>
    ),
  },
};
