export const zh = {
  // Common
  common: {
    loading: '加载中...',
    error: '出错了',
    retry: '重试',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    close: '关闭',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    finish: '完成',
    skip: '跳过',
  },

  // Navigation
  nav: {
    home: '首页',
    chat: 'AI助手',
    settings: '设置',
  },

  // Header
  header: {
    title: 'Aura AI',
    subtitle: '智能皮肤分析',
  },

  // Image Uploader
  uploader: {
    title: '上传照片',
    subtitle: '拍摄或选择一张清晰的面部照片',
    takePhoto: '拍照',
    choosePhoto: '选择照片',
    analyzing: '正在分析...',
    tips: '提示：请确保光线充足，面部清晰可见',
  },

  // Analysis
  analysis: {
    title: '分析结果',
    skinTone: '肤色分析',
    complexion: '气色分析',
    facialForm: '形色分析',
    findings: '发现',
    suggestions: '美学建议',
    insights: '健康观察',
    recommendations: '护理建议',
    export: '导出报告',
    newAnalysis: '新分析',
  },

  // Chat
  chat: {
    placeholder: '输入您的问题...',
    send: '发送',
    thinking: 'AI 正在思考...',
    suggestedQuestions: '推荐问题',
    clearHistory: '清除对话',
  },

  // Settings
  settings: {
    title: '设置',
    theme: '主题',
    fontSize: '字体大小',
    aiPersonality: 'AI 个性',
    userProfile: '用户资料',
    clearData: '清除数据',
    about: '关于',
    themes: {
      light: '浅色',
      dark: '深色',
      roseGold: '玫瑰金',
      lilac: '丁香',
      mint: '薄荷',
    },
    fontSizes: {
      small: '小',
      medium: '中',
      large: '大',
    },
  },

  // Disclaimer
  disclaimer: {
    title: '免责声明',
    content:
      '本应用提供的分析结果仅供参考，不构成医疗诊断。如有健康疑虑，请咨询专业医疗人士。',
  },

  // Errors
  errors: {
    network: '网络错误，请检查您的网络连接',
    apiLimit: '请求过于频繁，请稍后再试',
    imageLoad: '图片加载失败',
    analysisError: '分析失败，请重试',
  },
};

export type Translations = typeof zh;
