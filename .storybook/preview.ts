import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F8F7F5' },
        { name: 'dark', value: '#1C1C1E' },
        { name: 'roseGold', value: '#FDF5EF' },
        { name: 'lilac', value: '#F7F5FA' },
        { name: 'mint', value: '#F2F9F8' },
      ],
    },
  },
};

export default preview;
