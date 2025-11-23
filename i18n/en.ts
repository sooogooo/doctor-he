import type { Translations } from './zh';

export const en: Translations = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    skip: 'Skip',
  },

  // Navigation
  nav: {
    home: 'Home',
    chat: 'AI Chat',
    settings: 'Settings',
  },

  // Header
  header: {
    title: 'Aura AI',
    subtitle: 'Smart Skin Analysis',
  },

  // Image Uploader
  uploader: {
    title: 'Upload Photo',
    subtitle: 'Take or select a clear facial photo',
    takePhoto: 'Take Photo',
    choosePhoto: 'Choose Photo',
    analyzing: 'Analyzing...',
    tips: 'Tip: Ensure good lighting and clear facial visibility',
  },

  // Analysis
  analysis: {
    title: 'Analysis Results',
    skinTone: 'Skin Tone Analysis',
    complexion: 'Complexion Analysis',
    facialForm: 'Facial Form Analysis',
    findings: 'Findings',
    suggestions: 'Aesthetic Suggestions',
    insights: 'Health Insights',
    recommendations: 'Care Recommendations',
    export: 'Export Report',
    newAnalysis: 'New Analysis',
  },

  // Chat
  chat: {
    placeholder: 'Enter your question...',
    send: 'Send',
    thinking: 'AI is thinking...',
    suggestedQuestions: 'Suggested Questions',
    clearHistory: 'Clear Chat',
  },

  // Settings
  settings: {
    title: 'Settings',
    theme: 'Theme',
    fontSize: 'Font Size',
    aiPersonality: 'AI Personality',
    userProfile: 'User Profile',
    clearData: 'Clear Data',
    about: 'About',
    themes: {
      light: 'Light',
      dark: 'Dark',
      roseGold: 'Rose Gold',
      lilac: 'Lilac',
      mint: 'Mint',
    },
    fontSizes: {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
    },
  },

  // Disclaimer
  disclaimer: {
    title: 'Disclaimer',
    content:
      'The analysis provided by this app is for reference only and does not constitute medical diagnosis. Please consult healthcare professionals for health concerns.',
  },

  // Errors
  errors: {
    network: 'Network error, please check your connection',
    apiLimit: 'Too many requests, please try again later',
    imageLoad: 'Failed to load image',
    analysisError: 'Analysis failed, please retry',
  },
};
