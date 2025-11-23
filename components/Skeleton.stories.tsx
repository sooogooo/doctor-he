import type { Meta, StoryObj } from '@storybook/react';
import {
  Skeleton,
  AnalysisResultSkeleton,
  ChatMessageSkeleton,
  ImageUploaderSkeleton,
} from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: '200px',
    height: '20px',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48,
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: '100%',
    height: 200,
  },
};

export const AnalysisResult: StoryObj = {
  render: () => <AnalysisResultSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading state for analysis results',
      },
    },
  },
};

export const ChatMessage: StoryObj = {
  render: () => <ChatMessageSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading state for chat messages',
      },
    },
  },
};

export const ImageUploader: StoryObj = {
  render: () => <ImageUploaderSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading state for image uploader',
      },
    },
  },
};
